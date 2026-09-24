import { PlatformDesign } from '../types';

export const ARCHITECTURE_PRESETS: Record<string, PlatformDesign> = {
  'Agentic RAG & VLA Autonomous Loop': {
    name: 'Autonomous Vision-Language-Action (VLA) Hyper-Mesh',
    tagline: 'Multi-Modal Spatial Decision Engine with Real-Time ROS2 Edge Ingestion',
    architectureOverview:
      'A decoupled, ultra-low-latency distributed pipeline architected for real-time spatial vision-language-action (VLA) reasoning. Ingests 4K 60FPS multi-camera sensor feeds into tensorized visual tokenizers, coordinates task planning via speculative sub-agent arbitration, and guarantees sub-18ms tactile actuator execution with zero-jitter CAN-bus/ROS2 bridge adapters.',
    metrics: {
      estimatedLatencyMs: 14.8,
      throughputTps: 124500,
      gpuEfficiencyPct: 94.6,
      carbonFootprintKgPerM: 0.42,
      ttftMs: 8.2,
      vramUsageGb: 320,
      networkBandwidthGbps: 800,
    },
    shardingPlan: {
      tp: 4,
      pp: 2,
      cp: 2,
      gpuModel: 'NVIDIA H100 SXM5 80GB',
      totalGpus: 16,
      vramPerGpuGb: 80,
    },
    deploymentConfig: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: apex-vla-mesh
  namespace: apex-production
spec:
  replicas: 8
  selector:
    matchLabels:
      app: apex-vla-mesh
  template:
    metadata:
      labels:
        app: apex-vla-mesh
    spec:
      containers:
      - name: vla-inference-engine
        image: apexai/vla-engine:v3.4-cuda12.4
        resources:
          limits:
            nvidia.com/gpu: "8"
            memory: 256Gi
            cpu: "64"
        env:
        - name: TENSOR_PARALLEL_DEGREE
          value: "4"
        - name: PIPELINE_PARALLEL_DEGREE
          value: "2"
        - name: FLASH_ATTN_VERSION
          value: "3.0.0.post1"`,
    iacManifests: {
      kubernetes: `# Kubernetes Distributed VLA Cluster Configuration
apiVersion: v1
kind: Service
metadata:
  name: apex-vla-service
  namespace: apex-production
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
spec:
  type: LoadBalancer
  ports:
  - port: 50051
    targetPort: 50051
    name: grpc-vla
  - port: 8080
    targetPort: 8080
    name: http-metrics
  selector:
    app: apex-vla-mesh
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: apex-vla-worker
  namespace: apex-production
spec:
  serviceName: apex-vla-service
  replicas: 4
  template:
    spec:
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
            - matchExpressions:
              - key: node.kubernetes.io/instance-type
                operator: In
                values: ["p5.48xlarge", "g6e.48xlarge"]
      containers:
      - name: worker
        image: apexai/vla-worker:v3.4
        resources:
          limits:
            nvidia.com/gpu: "8"`,
      terraform: `# Terraform Multi-Region Distributed GPU Cluster Spec
terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.40"
    }
  }
}

module "gpu_cluster_useast" {
  source = "./modules/apex_gpu_cluster"
  region = "us-east-1"
  node_count = 8
  instance_type = "p5.48xlarge" # 8x NVIDIA H100 SXM5
  enable_nvlink = true
  efa_enabled = true
}

module "gpu_cluster_eucentral" {
  source = "./modules/apex_gpu_cluster"
  region = "eu-central-1"
  node_count = 8
  instance_type = "p5.48xlarge"
  enable_nvlink = true
  efa_enabled = true
}`,
      dockerCompose: `version: '3.8'
services:
  vla-router:
    image: apexai/vla-router:latest
    ports:
      - "50051:50051"
      - "9090:9090"
    environment:
      - TP_DEGREE=4
      - PP_DEGREE=2
      - REDIS_CLUSTER_URI=redis://cache:6379
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
  vector-memory:
    image: milvusdb/milvus:v2.4.0
    ports:
      - "19530:19530"`,
    },
    components: [
      {
        id: 'c1',
        name: '4K Sensor Ingestion & Spatio-Temporal Tokenizer',
        type: 'Perception & Tokenizer',
        category: 'perception',
        latencyMs: 2.1,
        memoryMb: 12800,
        status: 'optimal',
        throughput: 180000,
        connections: ['c2'],
        techStack: ['PyTorch 2.4', 'CUDA 12.4', 'TensorRT-LLM', 'VideoMAE-v2'],
        description:
          'Continuous asynchronous camera stream intake pipeline. Converts raw 4K spatial frames into quantized continuous visual embeddings with temporal patch projection.',
        codeSnippet: `import torch
import torch.nn as nn

class SpatioTemporalVisionTokenizer(nn.Module):
    def __init__(self, patch_size=14, embed_dim=1536):
        super().__init__()
        self.proj = nn.Conv3d(3, embed_dim, kernel_size=(2, patch_size, patch_size), stride=(2, patch_size, patch_size))
        self.norm = nn.LayerNorm(embed_dim)
        
    @torch.inference_mode()
    def forward(self, pixel_values: torch.Tensor) -> torch.Tensor:
        # pixel_values shape: [B, C, T, H, W]
        x = self.proj(pixel_values).flatten(2).transpose(1, 2)
        return self.norm(x)`,
      },
      {
        id: 'c2',
        name: 'Hybrid Milvus Vector Cache & Semantic RAG',
        type: 'Retrieval & KV-Cache',
        category: 'kvcache',
        latencyMs: 3.4,
        memoryMb: 48000,
        status: 'optimal',
        throughput: 140000,
        connections: ['c3'],
        techStack: ['Milvus 2.4', 'HNSW Index', 'Sparse BM25', 'PagedAttention v3'],
        description:
          'Sub-millisecond hybrid dense-sparse vector retriever. Queries 50M+ episodic spatial memories and trajectory exemplars with reciprocal rank fusion.',
        codeSnippet: `from pymilvus import Collection

def hybrid_spatial_retrieval(collection: Collection, dense_vector, sparse_vector, top_k=8):
    req_dense = AnnSearchRequest(data=[dense_vector], anns_field="vector", param={"metric_type": "COSINE", "params": {"ef": 64}}, limit=top_k)
    req_sparse = AnnSearchRequest(data=[sparse_vector], anns_field="sparse_vector", param={"metric_type": "IP"}, limit=top_k)
    return collection.hybrid_search(
        reqs=[req_dense, req_sparse],
        rerank=RRFRanker(k=60),
        limit=top_k
    )`,
      },
      {
        id: 'c3',
        name: 'Speculative Chain-of-Agents Planner',
        type: 'Cognitive Reasoning Core',
        category: 'reasoning',
        latencyMs: 6.8,
        memoryMb: 180000,
        status: 'optimal',
        throughput: 125000,
        connections: ['c4'],
        techStack: ['vLLM v0.6', 'Megatron-LM', 'Speculative Decoding', 'FP8 FlashInfer'],
        description:
          'Distributed multi-agent planning arbitrator. Orchestrates tactical decomposition, world-state prediction, and verification with 4-way tensor parallelism.',
        codeSnippet: `async def arbitrate_action_plan(visual_tokens, memory_context, draft_agent, target_agent):
    # Speculative drafting loop with verification
    draft_tokens = await draft_agent.generate_async(visual_tokens, max_tokens=32)
    verified_plan = await target_agent.verify_and_accept(draft_tokens, memory_context)
    return verified_plan`,
      },
      {
        id: 'c4',
        name: 'Deterministic CAN/ROS2 Actuator Bridge',
        type: 'Action Execution & Safety',
        category: 'action',
        latencyMs: 2.5,
        memoryMb: 4200,
        status: 'optimal',
        throughput: 210000,
        connections: [],
        techStack: ['Rust', 'ROS2 Humble', 'SocketCAN', 'Formal Safety Guard'],
        description:
          'Zero-copy deterministic actuator command transmitter. Validates kinetic safety envelopes and transmits motor trajectories over real-time bus interfaces.',
        codeSnippet: `use socketcan::{CanSocket, EmbeddedFrame, StandardId};

pub fn transmit_kinematic_frame(socket: &mut CanSocket, motor_id: u32, torque: f32) -> Result<(), socketcan::Error> {
    let raw_payload = torque.to_le_bytes();
    let frame = socketcan::CanDataFrame::new(StandardId::new(motor_id as u16).unwrap(), &raw_payload).unwrap();
    socket.write_frame(&frame)
}`,
      },
    ],
  },

  'Evolutionary Multi-Agent Cluster': {
    name: 'Evolutionary Multi-Agent Swarm & Self-Reward Cluster',
    tagline: 'Continuous Neural Architecture Search (NAS) and Pareto Genetic Optimization',
    architectureOverview:
      'A continuous self-evolving multi-agent cluster. Uses non-dominated sorting genetic algorithms (NSGA-III) and continuous reinforcement learning from AI feedback (RLAIF) to iteratively mutate agent prompts, LoRA weights, and routing policies on live production traffic with zero downtime.',
    metrics: {
      estimatedLatencyMs: 22.4,
      throughputTps: 89000,
      gpuEfficiencyPct: 97.2,
      carbonFootprintKgPerM: 0.38,
      ttftMs: 12.1,
      vramUsageGb: 512,
      networkBandwidthGbps: 1200,
    },
    shardingPlan: {
      tp: 8,
      pp: 1,
      cp: 4,
      gpuModel: 'NVIDIA B200 SXM 192GB',
      totalGpus: 8,
      vramPerGpuGb: 192,
    },
    deploymentConfig: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: apex-evolution-swarm
spec:
  replicas: 4
  template:
    spec:
      containers:
      - name: genetic-optimizer
        image: apexai/evolution-optimizer:v2.1
        env:
        - name: POPULATION_SIZE
          value: "128"
        - name: MUTATION_RATE
          value: "0.08"`,
    iacManifests: {
      kubernetes: `apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: evolution-worker
spec:
  replicas: 4
  serviceName: evolution-mesh
  template:
    spec:
      containers:
      - name: agent-trainer
        image: apexai/agent-trainer:v2.1
        resources:
          limits:
            nvidia.com/gpu: "8"`,
      terraform: `resource "aws_eks_node_group" "evolution_cluster" {
  cluster_name    = "apex-ai-prod"
  node_group_name = "evolution-b200-nodes"
  instance_types  = ["p5e.48xlarge"]
  scaling_config {
    desired_size = 4
    max_size     = 16
    min_size     = 2
  }
}`,
      dockerCompose: `version: '3.8'
services:
  evolution-master:
    image: apexai/evolution-master:latest
    ports:
      - "8000:8000"`,
    },
    components: [
      {
        id: 'c1',
        name: 'Genetic Mutation & Policy Permutator',
        type: 'Evolution Core',
        category: 'reasoning',
        latencyMs: 4.5,
        memoryMb: 32000,
        status: 'optimal',
        throughput: 95000,
        connections: ['c2'],
        techStack: ['PyTorch', 'DEAP', 'Ray Core', 'NSGA-III'],
        description:
          'Generates stochastic mutations of agent routing graphs and LoRA weight deltas across a continuous population of 128 competing candidates.',
        codeSnippet: `def mutate_agent_graph(graph, mutation_rate=0.08):
    for node in graph.nodes:
        if random.random() < mutation_rate:
            node.prompt_temperature = min(1.0, max(0.0, node.prompt_temperature + random.gauss(0, 0.1)))
            node.top_p = min(0.99, max(0.1, node.top_p + random.gauss(0, 0.05)))
    return graph`,
      },
      {
        id: 'c2',
        name: 'RLAIF Multi-Objective Pareto Evaluator',
        type: 'Evaluator & Critic',
        category: 'guardrails',
        latencyMs: 8.2,
        memoryMb: 64000,
        status: 'optimal',
        throughput: 88000,
        connections: ['c3'],
        techStack: ['vLLM', 'Ray Train', 'TRL (HuggingFace)', 'Triton'],
        description:
          'Scores mutated agents simultaneously along accuracy, token cost, latency, and safety Pareto frontiers using consensus judge models.',
        codeSnippet: `async def evaluate_pareto_fitness(candidate_agent, eval_dataset, judge_model):
    scores = await judge_model.batch_score(candidate_agent.predict(eval_dataset))
    return {
        "accuracy": scores.accuracy_mean,
        "latency_cost": 1.0 / (scores.latency_p99 + 1e-4),
        "safety_margin": scores.safety_pct
    }`,
      },
      {
        id: 'c3',
        name: 'Dynamic Hot-Swapping LoRA Weight Hub',
        type: 'Runtime Dispatcher',
        category: 'action',
        latencyMs: 9.7,
        memoryMb: 128000,
        status: 'optimal',
        throughput: 110000,
        connections: [],
        techStack: ['Punica CUDA', 'S-LoRA', 'Triton Kernel', 'Shared Memory IPC'],
        description:
          'Instantly loads winning mutated LoRA adapter weights directly into GPU unified memory without reloading the base 70B backbone model.',
        codeSnippet: `def hot_swap_winning_adapters(vllm_engine, winning_lora_ids):
    for lora_id in winning_lora_ids:
        vllm_engine.pin_lora_adapter(lora_id, gpu_rank=0)
    print("[HOT-SWAP] Winning generation live in 4.2ms")`,
      },
    ],
  },

  'Chain-of-Agents Distributed Inference': {
    name: 'Chain-of-Agents Ultra-Scale Inference Grid',
    tagline: 'Hierarchical Multi-Agent Context Aggregation & Parallel Map-Reduce',
    architectureOverview:
      'A massive context-window architecture capable of processing 10M+ tokens across distributed worker agents. Uses hierarchical map-reduce worker pools with speculative draft verifying to condense long-horizon document corpora with 99.4% needle-in-a-haystack recall.',
    metrics: {
      estimatedLatencyMs: 18.2,
      throughputTps: 160000,
      gpuEfficiencyPct: 96.1,
      carbonFootprintKgPerM: 0.35,
      ttftMs: 6.4,
      vramUsageGb: 640,
      networkBandwidthGbps: 1600,
    },
    shardingPlan: {
      tp: 8,
      pp: 2,
      cp: 8,
      gpuModel: 'NVIDIA H100 SXM5 80GB',
      totalGpus: 32,
      vramPerGpuGb: 80,
    },
    deploymentConfig: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: chain-of-agents-grid
spec:
  replicas: 16
  template:
    spec:
      containers:
      - name: worker-shard
        image: apexai/chain-worker:v1.9`,
    iacManifests: {
      kubernetes: `apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: coa-coordinator
spec:
  replicas: 2
  serviceName: coa-mesh`,
      terraform: `resource "google_container_cluster" "coa_primary" {
  name     = "coa-inference-gke"
  location = "us-central1"
  initial_node_count = 8
}`,
      dockerCompose: `version: '3.8'
services:
  coa-worker:
    image: apexai/coa-worker:v1.9`,
    },
    components: [
      {
        id: 'c1',
        name: 'Context Chunker & Shard Scatter Engine',
        type: 'Ingress & Chunking',
        category: 'ingress',
        latencyMs: 3.1,
        memoryMb: 24000,
        status: 'optimal',
        throughput: 190000,
        connections: ['c2'],
        techStack: ['Rust', 'Apache Arrow', 'Zero-Copy IPC', 'Tokenizers'],
        description:
          'Splits 10M+ token corpora into semantic sub-windows and routes them to 64 parallel worker agent shards with overlapping boundary buffers.',
        codeSnippet: `pub fn scatter_context_shards(document: &str, shard_size: usize, overlap: usize) -> Vec<&str> {
    // Zero-copy window slicing with UTF-8 byte boundary checking
    document.as_bytes().chunks(shard_size).map(|c| std::str::from_utf8(c).unwrap()).collect()
}`,
      },
      {
        id: 'c2',
        name: 'Parallel Worker Agent Shard Pool',
        type: 'Distributed Reasoning',
        category: 'reasoning',
        latencyMs: 9.4,
        memoryMb: 320000,
        status: 'optimal',
        throughput: 175000,
        connections: ['c3'],
        techStack: ['vLLM v0.6', 'Megatron-Core', 'FlashAttention-3', 'FP8 GEMM'],
        description:
          'Executes concurrent targeted extraction queries across all document shards simultaneously using fast 8B distilled specialist models.',
        codeSnippet: `async def map_worker_shards(shards: list[str], prompt: str, vllm_pool) -> list[str]:
    tasks = [vllm_pool.generate_async(f"{prompt}\\n\\nContext: {shard}") for shard in shards]
    return await asyncio.gather(*tasks)`,
      },
      {
        id: 'c3',
        name: 'Hierarchical Synthesis & Conflict Arbitrator',
        type: 'Reduction Core',
        category: 'guardrails',
        latencyMs: 5.7,
        memoryMb: 96000,
        status: 'optimal',
        throughput: 160000,
        connections: [],
        techStack: ['Gemini 3.1 Pro Engine', 'LangGraph', 'Formal Logic Checker'],
        description:
          'Synthesizes worker extractions, resolves factual discrepancies across fragments, and emits a verified global answer with citations.',
        codeSnippet: `def reduce_worker_findings(findings: list[str], master_llm) -> str:
    combined_summary = master_llm.generate(f"Synthesize and cross-validate findings:\\n" + "\\n".join(findings))
    return combined_summary`,
      },
    ],
  },

  'Multi-Modal Vision Language-Action System': {
    name: 'Distributed Mixture-of-Experts (MoE) Spatial Engine',
    tagline: 'Dynamic Top-2 Routing across 128 Sparse Vision-Action Experts',
    architectureOverview:
      'High-throughput sparse Mixture-of-Experts (MoE) cluster. Features top-2 expert routing with expert parallelism (EP=8) and tensor parallelism (TP=4), delivering 3.2x faster inference at 60% lower power footprint compared to dense monolithic equivalents.',
    metrics: {
      estimatedLatencyMs: 16.4,
      throughputTps: 195000,
      gpuEfficiencyPct: 98.4,
      carbonFootprintKgPerM: 0.28,
      ttftMs: 5.8,
      vramUsageGb: 768,
      networkBandwidthGbps: 3200,
    },
    shardingPlan: {
      tp: 4,
      pp: 4,
      cp: 4,
      gpuModel: 'NVIDIA H200 SXM 141GB',
      totalGpus: 16,
      vramPerGpuGb: 141,
    },
    deploymentConfig: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: apex-moe-cluster
spec:
  replicas: 8`,
    iacManifests: {
      kubernetes: `apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: moe-expert-node
spec:
  replicas: 8`,
      terraform: `resource "aws_instance" "moe_nodes" {
  count         = 8
  instance_type = "p5.48xlarge"
}`,
      dockerCompose: `version: '3.8'
services:
  moe-router:
    image: apexai/moe-router:v4.0`,
    },
    components: [
      {
        id: 'c1',
        name: 'Top-2 Expert Router Gate & Token Dispatcher',
        type: 'Routing Gate',
        category: 'ingress',
        latencyMs: 1.8,
        memoryMb: 16000,
        status: 'optimal',
        throughput: 240000,
        connections: ['c2'],
        techStack: ['Triton', 'Custom CUDA Kernel', 'Softmax Router', 'NVLink-4'],
        description:
          'Evaluates token routing logits and dispatches tokens to the top-2 most specialized experts with load-balancing auxiliary loss penalties.',
        codeSnippet: `import torch
import triton

def top2_expert_dispatch(gate_logits, top_k=2):
    weights, indices = torch.topk(torch.softmax(gate_logits, dim=-1), k=top_k)
    return weights / weights.sum(dim=-1, keepdim=True), indices`,
      },
      {
        id: 'c2',
        name: 'Expert Parallel (EP=8) Swarm Matrix',
        type: 'Expert Swarm',
        category: 'reasoning',
        latencyMs: 9.1,
        memoryMb: 600000,
        status: 'optimal',
        throughput: 210000,
        connections: ['c3'],
        techStack: ['DeepSpeed-MoE', 'Megatron-LM', 'All-to-All NVLink', 'FP8 GEMM'],
        description:
          'Hosts 128 sparse FFN expert networks distributed across 8 GPU ranks, performing asynchronous all-to-all communication without CPU stalls.',
        codeSnippet: `async def execute_expert_layers(tokens, expert_indices, weights, expert_pool):
    # Asynchronous non-blocking All-to-All communication
    routed_tokens = torch.distributed.all_to_all_single(tokens, expert_indices)
    output = expert_pool.forward(routed_tokens)
    return output`,
      },
      {
        id: 'c3',
        name: 'Action Quantizer & Actuator Command Cache',
        type: 'Output Egress',
        category: 'action',
        latencyMs: 5.5,
        memoryMb: 32000,
        status: 'optimal',
        throughput: 195000,
        connections: [],
        techStack: ['C++20', 'CUDA IPC', 'Real-Time Linux Kernel PREEMPT_RT'],
        description:
          'Aggregates expert outputs into deterministic joint angles and velocity vectors with bounded 100μs jitter guarantees.',
        codeSnippet: `void dispatch_actuator_vector(const float* trajectory, size_t dof) {
    // Direct DMA transfer to real-time EtherCAT bus
    memcpy(ethercat_dma_buffer, trajectory, dof * sizeof(float));
}`,
      },
    ],
  },
};

export function synthesizeArchitectureClientSide(prompt: string, architectureType: string, scale: string): PlatformDesign {
  const base = ARCHITECTURE_PRESETS[architectureType] || ARCHITECTURE_PRESETS['Agentic RAG & VLA Autonomous Loop'];
  
  // Clone and adapt based on prompt and scale
  const scaleMultiplier = scale.includes('100k') ? 1.4 : scale.includes('Hybrid') ? 1.0 : 0.7;
  const isEdge = scale.includes('Edge');

  return {
    ...base,
    name: `${base.name} (${scale.split(' ')[0]})`,
    tagline: `Engineered for: "${prompt.slice(0, 75)}${prompt.length > 75 ? '...' : ''}"`,
    architectureOverview: `Custom synthesized architecture optimized for ${scale}. ${base.architectureOverview}`,
    metrics: {
      estimatedLatencyMs: Math.round((isEdge ? 8.5 : base.metrics.estimatedLatencyMs) * 10) / 10,
      throughputTps: Math.round(base.metrics.throughputTps * scaleMultiplier),
      gpuEfficiencyPct: Math.min(99.4, Math.round((base.metrics.gpuEfficiencyPct + (Math.random() * 2 - 1)) * 10) / 10),
      carbonFootprintKgPerM: Math.round((base.metrics.carbonFootprintKgPerM * (isEdge ? 0.4 : 1.0)) * 100) / 100,
      ttftMs: Math.round((base.metrics.ttftMs || 8.0) * 10) / 10,
      vramUsageGb: Math.round((base.metrics.vramUsageGb || 320) * scaleMultiplier),
      networkBandwidthGbps: Math.round((base.metrics.networkBandwidthGbps || 800) * scaleMultiplier),
    },
    components: base.components.map((c, i) => ({
      ...c,
      throughput: Math.round((c.throughput || 100000) * scaleMultiplier),
    })),
  };
}
