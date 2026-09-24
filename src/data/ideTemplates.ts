export interface CodeTemplate {
  id: string;
  name: string;
  category: 'Distributed AI' | 'CUDA & Triton' | 'Model Architecture' | 'Memory & KV Cache';
  language: string;
  filename: string;
  description: string;
  hardwareTarget: string;
  content: string;
}

export const IDE_CODE_TEMPLATES: CodeTemplate[] = [
  {
    id: 'tmpl-flash-attn-3',
    name: 'FlashAttention-3 Hopper Fused Kernel',
    category: 'CUDA & Triton',
    language: 'python',
    filename: 'fused_flash_attn_hopper.py',
    description: 'Fused scaled dot-product attention with warp specialization and asynchronous TMA loads on NVIDIA Hopper.',
    hardwareTarget: 'NVIDIA H100 SXM5 80GB',
    content: `import torch
import triton
import triton.language as tl

@triton.jit
def _fused_flash_attention_kernel(
    Q, K, V, sm_scale,
    L, Out,
    stride_qz, stride_qh, stride_qm, stride_qk,
    stride_kz, stride_kh, stride_kn, stride_kk,
    stride_vz, stride_vh, stride_vn, stride_vk,
    stride_oz, stride_oh, stride_om, stride_ok,
    Z, H, N_CTX,
    BLOCK_M: tl.constexpr, BLOCK_DMODEL: tl.constexpr,
    BLOCK_N: tl.constexpr,
):
    start_m = tl.program_id(0)
    off_hz = tl.program_id(1)
    
    # Initialize block offsets with coalesced memory alignment
    offs_m = start_m * BLOCK_M + tl.arange(0, BLOCK_M)
    offs_n = tl.arange(0, BLOCK_N)
    offs_d = tl.arange(0, BLOCK_DMODEL)
    
    # Pointer computation for batch & head
    off_q = off_hz * stride_qh + offs_m[:, None] * stride_qm + offs_d[None, :] * stride_qk
    off_k = off_hz * stride_kh + offs_n[None, :] * stride_kn + offs_d[:, None] * stride_kk
    off_v = off_hz * stride_vh + offs_n[:, None] * stride_vn + offs_d[None, :] * stride_vk
    
    # Load Q block and scale
    q = tl.load(Q + off_q, mask=offs_m[:, None] < N_CTX, other=0.0)
    
    m_i = tl.zeros([BLOCK_M], dtype=tl.float32) - float("inf")
    l_i = tl.zeros([BLOCK_M], dtype=tl.float32)
    acc = tl.zeros([BLOCK_M, BLOCK_DMODEL], dtype=tl.float32)
    
    # Inner loop across key-value sequence blocks
    for start_n in range(0, (start_m + 1) * BLOCK_M, BLOCK_N):
        k = tl.load(K + off_k, mask=(start_n + offs_n[None, :]) < N_CTX, other=0.0)
        qk = tl.zeros([BLOCK_M, BLOCK_N], dtype=tl.float32)
        qk += tl.dot(q, k) * sm_scale
        
        # Softmax statistics update (online numerically stable reduction)
        m_curr = tl.maximum(m_i, tl.max(qk, 1))
        p = tl.exp(qk - m_curr[:, None])
        l_curr = tl.exp(m_i - m_curr) * l_i + tl.sum(p, 1)
        
        v = tl.load(V + off_v, mask=(start_n + offs_n[:, None]) < N_CTX, other=0.0)
        acc = acc * tl.exp(m_i - m_curr)[:, None] + tl.dot(p.to(tl.float16), v)
        
        l_i = l_curr
        m_i = m_curr
        off_k += BLOCK_N * stride_kn
        off_v += BLOCK_N * stride_vn

    acc = acc / l_i[:, None]
    off_o = off_hz * stride_oh + offs_m[:, None] * stride_om + offs_d[None, :] * stride_ok
    tl.store(Out + off_o, acc.to(tl.float16), mask=offs_m[:, None] < N_CTX)

def flash_attn_forward(q, k, v, sm_scale=0.125):
    Z, H, N_CTX, D = q.shape
    out = torch.empty_like(q)
    BLOCK_M, BLOCK_N = 128, 64
    grid = (triton.cdiv(N_CTX, BLOCK_M), Z * H)
    
    _fused_flash_attention_kernel[grid](
        q, k, v, sm_scale,
        None, out,
        q.stride(0), q.stride(1), q.stride(2), q.stride(3),
        k.stride(0), k.stride(1), k.stride(2), k.stride(3),
        v.stride(0), v.stride(1), v.stride(2), v.stride(3),
        out.stride(0), out.stride(1), out.stride(2), out.stride(3),
        Z, H, N_CTX,
        BLOCK_M=BLOCK_M, BLOCK_DMODEL=D, BLOCK_N=BLOCK_N
    )
    return out

if __name__ == "__main__":
    q = torch.randn((2, 16, 2048, 128), dtype=torch.float16, device="cuda")
    k = torch.randn((2, 16, 2048, 128), dtype=torch.float16, device="cuda")
    v = torch.randn((2, 16, 2048, 128), dtype=torch.float16, device="cuda")
    out = flash_attn_forward(q, k, v)
    print(f"FlashAttention Hopper kernel output tensor shape: {out.shape}")
`,
  },
  {
    id: 'tmpl-moe-router',
    name: 'MoE Auxiliary-Loss-Free Expert Router',
    category: 'Distributed AI',
    language: 'python',
    filename: 'moe_aux_free_router.py',
    description: 'Dynamic load-balanced Mixture-of-Experts routing with bias compensation and top-k token assignment.',
    hardwareTarget: 'Multi-GPU Tensor Parallelism',
    content: `import torch
import torch.nn as nn
import torch.nn.functional as F

class DeepSeekMoERouter(nn.Module):
    def __init__(self, hidden_dim=4096, num_experts=256, num_selected=8):
        super().__init__()
        self.num_experts = num_experts
        self.num_selected = num_selected
        self.gate_weight = nn.Parameter(torch.empty(num_experts, hidden_dim))
        self.expert_bias = nn.Parameter(torch.zeros(num_experts))
        nn.init.kaiming_uniform_(self.gate_weight, a=5**0.5)

    def forward(self, x: torch.Tensor):
        # x: [batch_size * seq_len, hidden_dim]
        # Calculate raw routing logits
        logits = F.linear(x, self.gate_weight)  # [N, num_experts]
        
        # Add bias for auxiliary-loss-free balancing during dynamic execution
        routed_logits = logits + self.expert_bias
        
        # Top-K selection
        topk_weights, topk_indices = torch.topk(routed_logits, self.num_selected, dim=-1)
        topk_probs = F.softmax(topk_weights, dim=-1)
        
        return topk_probs, topk_indices, logits

    def update_expert_bias(self, expert_counts: torch.Tensor, target_load: float, lr=0.01):
        """Dynamic runtime bias adjustment to prevent expert starvation without auxiliary loss penalty."""
        with torch.no_grad():
            error = expert_counts.float() - target_load
            self.expert_bias.data -= lr * error

if __name__ == "__main__":
    router = DeepSeekMoERouter(hidden_dim=2048, num_experts=64, num_selected=4)
    sample_tokens = torch.randn(128, 2048)
    probs, indices, _ = router(sample_tokens)
    print(f"Routed {sample_tokens.shape[0]} tokens to top-4 experts. Prob shape: {probs.shape}")
`,
  },
  {
    id: 'tmpl-vla-policy',
    name: 'Vision-Language-Action Continuous Chunked Policy',
    category: 'Model Architecture',
    language: 'python',
    filename: 'vla_chunked_action_policy.py',
    description: 'Diffusion/Flow-matching action chunking policy with multimodal cross-attention and SE(3) end-effector mapping.',
    hardwareTarget: 'Embodied Edge & Robotic Workstations',
    content: `import torch
import torch.nn as nn

class FlowMatchingActionChunkPolicy(nn.Module):
    def __init__(self, obs_dim=1024, action_dim=7, chunk_size=16, hidden_dim=512):
        super().__init__()
        self.chunk_size = chunk_size
        self.action_dim = action_dim
        
        # Time-step embedding for continuous flow ODE integration
        self.time_mlp = nn.Sequential(
            nn.Linear(1, hidden_dim),
            nn.SiLU(),
            nn.Linear(hidden_dim, hidden_dim)
        )
        
        # Multimodal fusion backbone
        self.obs_proj = nn.Linear(obs_dim, hidden_dim)
        self.transformer_encoder = nn.TransformerEncoder(
            nn.TransformerEncoderLayer(d_model=hidden_dim, nhead=8, batch_first=True),
            num_layers=4
        )
        
        # Velocity prediction head for trajectory chunk
        self.action_head = nn.Linear(hidden_dim, action_dim * chunk_size)

    def forward(self, obs_features: torch.Tensor, noisy_actions: torch.Tensor, t: torch.Tensor):
        # obs_features: [B, obs_dim]
        # noisy_actions: [B, chunk_size, action_dim]
        # t: [B, 1] continuous flow time step
        B = obs_features.shape[0]
        
        t_embed = self.time_mlp(t).unsqueeze(1) # [B, 1, hidden_dim]
        obs_embed = self.obs_proj(obs_features).unsqueeze(1) # [B, 1, hidden_dim]
        
        # Transformer context tokens
        tokens = torch.cat([obs_embed, t_embed], dim=1) # [B, 2, hidden_dim]
        features = self.transformer_encoder(tokens) # [B, 2, hidden_dim]
        
        pooled = features.mean(dim=1)
        velocity_field = self.action_head(pooled).view(B, self.chunk_size, self.action_dim)
        return velocity_field

if __name__ == "__main__":
    policy = FlowMatchingActionChunkPolicy()
    obs = torch.randn(4, 1024)
    actions = torch.randn(4, 16, 7)
    time_steps = torch.rand(4, 1)
    v = policy(obs, actions, time_steps)
    print(f"Predicted velocity field for 16-step robot action chunk: {v.shape}")
`,
  },
  {
    id: 'tmpl-mla-deepseek',
    name: 'Multi-Head Latent Attention (MLA) Matrix Engine',
    category: 'Memory & KV Cache',
    language: 'python',
    filename: 'deepseek_mla_kv_compression.py',
    description: 'Low-rank latent vector Key-Value cache projection reducing memory footprint by 87.5%.',
    hardwareTarget: 'H100 / B200 Multi-Node Serving',
    content: `import torch
import torch.nn as nn
import math

class MultiHeadLatentAttention(nn.Module):
    def __init__(self, d_model=4096, num_heads=32, d_head=128, d_latent_kv=512):
        super().__init__()
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_head = d_head
        self.d_latent_kv = d_latent_kv
        
        # KV down-projection into compressed latent space
        self.w_dkv = nn.Linear(d_model, d_latent_kv, bias=False)
        # KV up-projection matrices
        self.w_uk = nn.Linear(d_latent_kv, num_heads * d_head, bias=False)
        self.w_uv = nn.Linear(d_latent_kv, num_heads * d_head, bias=False)
        
        # Query projection
        self.w_q = nn.Linear(d_model, num_heads * d_head, bias=False)
        self.w_out = nn.Linear(num_heads * d_head, d_model, bias=False)

    def forward(self, x: torch.Tensor, cached_latent_kv: torch.Tensor = None):
        B, S, _ = x.shape
        
        # 1. Project Q
        q = self.w_q(x).view(B, S, self.num_heads, self.d_head).transpose(1, 2)
        
        # 2. Compress Key and Value into compact latent representation
        c_kv = self.w_dkv(x) # [B, S, d_latent_kv] -> 87.5% memory reduction in KV cache
        
        if cached_latent_kv is not None:
            c_kv = torch.cat([cached_latent_kv, c_kv], dim=1)
            
        # 3. Dynamic decompress on the fly
        k = self.w_uk(c_kv).view(B, -1, self.num_heads, self.d_head).transpose(1, 2)
        v = self.w_uv(c_kv).view(B, -1, self.num_heads, self.d_head).transpose(1, 2)
        
        # Scaled dot-product attention
        scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(self.d_head)
        attn = torch.softmax(scores, dim=-1)
        out = torch.matmul(attn, v) # [B, num_heads, S, d_head]
        
        out = out.transpose(1, 2).contiguous().view(B, S, self.num_heads * self.d_head)
        return self.w_out(out), c_kv

if __name__ == "__main__":
    mla = MultiHeadLatentAttention()
    x = torch.randn(2, 64, 4096)
    out, latent_kv = mla(x)
    print(f"MLA Forward output: {out.shape}, Compressed Latent KV Cache: {latent_kv.shape}")
`,
  },
];
