import React, { useState } from 'react';
import { 
  Sparkles, Plus, Trash2, ArrowUp, ArrowDown, CheckSquare, 
  Square, Shield, Terminal, Cpu, Database, BookOpen, Layers, 
  Code2, Check, Copy, RotateCcw, Eye, Download, Star, Sliders,
  HelpCircle, ChevronRight, FileText, Zap
} from 'lucide-react';
import { useAdaptiveTheme } from '../../context/ThemeContext';

export interface ReadmeDesignerSection {
  id: string;
  type: 'hero' | 'features' | 'benchmarks' | 'quickstart' | 'checklist' | 'contributing' | 'citation' | 'custom';
  title: string;
  enabled: boolean;
  content?: string;
  data?: any;
}

interface ReadmeInteractiveDesignerProps {
  repoName: string;
  currentMarkdown: string;
  onApplyMarkdown: (markdown: string) => void;
  onSwitchToPreview: () => void;
}

export const ReadmeInteractiveDesigner: React.FC<ReadmeInteractiveDesignerProps> = ({
  repoName,
  currentMarkdown,
  onApplyMarkdown,
  onSwitchToPreview,
}) => {
  const { currentTheme } = useAdaptiveTheme();

  // Template selector
  const [activeTemplate, setActiveTemplate] = useState<'llm' | 'agents' | 'research' | 'sdk'>('llm');

  // Hero section state
  const [projectTitle, setProjectTitle] = useState(repoName.split('/')[1] || 'Gambit Atoms');
  const [tagline, setTagline] = useState('High-throughput distributed inference engine with chunked PagedAttention v3 & zero-copy KV transfer');
  const [badges, setBadges] = useState<Array<{ label: string; text: string; color: string; enabled: boolean }>>([
    { label: 'Build', text: 'Passing', color: 'emerald', enabled: true },
    { label: 'PyTorch', text: '2.6.0', color: 'red', enabled: true },
    { label: 'CUDA', text: '12.8 | 12.4', color: 'purple', enabled: true },
    { label: 'License', text: 'Apache-2.0', color: 'blue', enabled: true },
    { label: 'Throughput', text: '1,840 tok/s', color: 'orange', enabled: true },
    { label: 'Coverage', text: '98.4%', color: 'brightgreen', enabled: true },
  ]);

  // Features list state
  const [features, setFeatures] = useState<Array<{ title: string; desc: string; icon: string }>>([
    { title: 'PagedAttention v3 Fusion', desc: 'Zero-copy memory pool reduction with fused Triton 3.2 kernel and 128-bit vectorized float4 loading.', icon: 'Zap' },
    { title: 'Multi-GPU NVLink Ring Buffer', desc: 'Overlapped KV-cache swapping with 900 GB/s bidirectional NVLink bandwidth across 8x H100 nodes.', icon: 'Cpu' },
    { title: 'Blackwell FP4 Tensor Core', desc: 'Micro-scaled 4-bit floating point GEMM acceleration with sub-millisecond first-token latency.', icon: 'Layers' },
    { title: 'Autonomous RLAIF Verification', desc: 'Continuous online policy alignment with self-synthesized mathematical proofs and invariant checks.', icon: 'CheckSquare' },
  ]);

  // Benchmarks Matrix state
  const [benchmarkRows, setBenchmarkRows] = useState<Array<{ engine: string; batchSize: number; ttft: string; throughput: string; speedup: string }>>([
    { engine: 'Gambit Atoms (PagedAttention v3)', batchSize: 64, ttft: '14.2 ms', throughput: '1,840.4 tok/s', speedup: '4.38x' },
    { engine: 'TensorRT-LLM (v0.9.1)', batchSize: 64, ttft: '18.6 ms', throughput: '1,420.2 tok/s', speedup: '3.38x' },
    { engine: 'vLLM (Baseline v0.7.2)', batchSize: 64, ttft: '26.4 ms', throughput: '860.1 tok/s', speedup: '2.05x' },
    { engine: 'HuggingFace TGI (Unfused)', batchSize: 64, ttft: '44.8 ms', throughput: '420.0 tok/s', speedup: '1.00x (ref)' },
  ]);

  // Quickstart state
  const [packageManager, setPackageManager] = useState<'pip' | 'uv' | 'docker' | 'conda'>('pip');
  const [gpuArch, setGpuArch] = useState<'h100' | 'ada' | 'rocm' | 'cpu'>('h100');

  // Interactive Checklist state
  const [tasks, setTasks] = useState<Array<{ text: string; done: boolean }>>([
    { text: 'PagedAttention v3 kernel fused with Triton 3.2', done: true },
    { text: 'Zero-copy NVMe-oF memory transfer verified on 8x H100', done: true },
    { text: 'Multi-head draft speculative verification engine', done: false },
    { text: 'FP4 quantization kernel integration for Blackwell', done: false },
    { text: 'CI unit test suite passing with 98.4% coverage', done: true },
    { text: 'Upstream documentation translation & community tutorials', done: false },
  ]);
  const [newTaskInput, setNewTaskInput] = useState('');

  // Citation state
  const [citationAuthors, setCitationAuthors] = useState('Vance, Alex and Rostova, Elena and Gambit Team');
  const [citationYear, setCitationYear] = useState('2026');
  const [citationTitle, setCitationTitle] = useState('Gambit Atoms: Sub-Millisecond Autonomous Tensor Sharding and Paged Inference');

  // Enabled sections
  const [enabledSections, setEnabledSections] = useState<Record<string, boolean>>({
    hero: true,
    badges: true,
    features: true,
    benchmarks: true,
    quickstart: true,
    checklist: true,
    contributing: true,
    citation: true,
  });

  const [copiedDesigned, setCopiedDesigned] = useState(false);
  const [appliedNotice, setAppliedNotice] = useState(false);

  // Generate complete Markdown from current state
  const generateMarkdownFromDesign = (): string => {
    let md = '';

    // 1. Hero & Title
    if (enabledSections.hero) {
      md += `# ${projectTitle}\n\n`;
      md += `> **${tagline}**\n\n`;
    }

    // 2. Badges
    if (enabledSections.badges) {
      const activeBadges = badges.filter(b => b.enabled);
      if (activeBadges.length > 0) {
        md += activeBadges.map(b => 
          `[![${b.label}](https://img.shields.io/badge/${encodeURIComponent(b.label)}-${encodeURIComponent(b.text)}-${b.color}.svg)](https://github.com/${repoName})`
        ).join(' ') + '\n\n---\n\n';
      }
    }

    // 3. Features
    if (enabledSections.features && features.length > 0) {
      md += `## ⚡ Key Architectural Highlights\n\n`;
      features.forEach(f => {
        md += `- **${f.title}**: ${f.desc}\n`;
      });
      md += '\n---\n\n';
    }

    // 4. Benchmarks Table
    if (enabledSections.benchmarks && benchmarkRows.length > 0) {
      md += `## 📊 Verified Inference Benchmarks\n\n`;
      md += `*Evaluated on 8x NVIDIA H100 SXM5 80GB with FP8 tensor cores (Concurrency: 128)*\n\n`;
      md += `| Inference Engine | Batch Size | TTFT (Latency) | Throughput (tok/s) | Speedup |\n`;
      md += `| :--- | :---: | :---: | :---: | :---: |\n`;
      benchmarkRows.forEach(r => {
        md += `| **${r.engine}** | \`${r.batchSize}\` | \`${r.ttft}\` | **\`${r.throughput}\`** | **${r.speedup}** |\n`;
      });
      md += '\n---\n\n';
    }

    // 5. Quickstart & Installation
    if (enabledSections.quickstart) {
      md += `## 🚀 Quickstart & Installation\n\n`;
      if (packageManager === 'pip') {
        md += `\`\`\`bash\n# Install latest wheel with CUDA ${gpuArch === 'h100' ? '12.8' : '12.4'} support\npip install ${projectTitle.toLowerCase().replace(/\s+/g, '-')} --extra-index-url https://wheels.gambitatoms.org/cu128\n\`\`\`\n\n`;
      } else if (packageManager === 'uv') {
        md += `\`\`\`bash\n# Ultra-fast installation with uv\nuv pip install ${projectTitle.toLowerCase().replace(/\s+/g, '-')}\n\`\`\`\n\n`;
      } else if (packageManager === 'docker') {
        md += `\`\`\`bash\n# Launch optimized container\ndocker run --gpus all -it --ipc=host ghcr.io/${repoName.toLowerCase()}:latest-cuda128\n\`\`\`\n\n`;
      } else {
        md += `\`\`\`bash\n# Build optimized kernels from source with Triton\ngit clone https://github.com/${repoName}.git\ncd ${repoName.split('/')[1] || 'repo'}\nMAX_JOBS=16 pip install -e .\n\`\`\`\n\n`;
      }

      md += `### Python Usage Example\n\n`;
      md += `\`\`\`python\nimport torch\nfrom ${projectTitle.toLowerCase().replace(/\s+/g, '_')} import LLMServer, EngineConfig\n\n# Configure persistent KV pool\nconfig = EngineConfig(\n    model="distilbert-base-uncased",\n    tensor_parallel_size=8,\n    kv_cache_utilization=0.92,\n    kernel="paged_attention_v3"\n)\n\nserver = LLMServer(config)\noutput = server.generate("Explain quantum entanglement in 2 sentences:")\nprint(f"Throughput: {output.metrics.tokens_per_sec:.1f} tok/s")\n\`\`\`\n\n---\n\n`;
    }

    // 6. Checklist
    if (enabledSections.checklist && tasks.length > 0) {
      md += `## 📋 Production Readiness Checklist\n\n`;
      tasks.forEach(t => {
        md += `- [${t.done ? 'x' : ' '}] ${t.text}\n`;
      });
      md += '\n---\n\n';
    }

    // 7. Contributing
    if (enabledSections.contributing) {
      md += `## 🛠️ Contribution Guidelines\n\n`;
      md += `We welcome pull requests from researchers and distributed systems engineers!\n\n`;
      md += `1. **Numerical Parity**: Verify tests against fp32 reference in \`tests/test_parity.py\`.\n`;
      md += `2. **Nsight Profiling**: Ensure kernel occupancy is >90% without warp stall stalls.\n`;
      md += `3. **Linting**: Enforce Google C++ and Ruff / Black formatting.\n\n---\n\n`;
    }

    // 8. BibTeX Citation
    if (enabledSections.citation) {
      md += `## 📑 Citation (BibTeX)\n\n`;
      md += `If you use this repository in academic research, please cite:\n\n`;
      md += `\`\`\`bibtex\n@article{${repoName.split('/')[1] || 'project'}${citationYear},\n`;
      md += `  title={${citationTitle}},\n`;
      md += `  author={${citationAuthors}},\n`;
      md += `  journal={arXiv preprint arXiv:2603.09148},\n`;
      md += `  year={${citationYear}}\n`;
      md += `}\n\`\`\`\n`;
    }

    return md;
  };

  // Load Preset Templates
  const handleLoadTemplate = (type: 'llm' | 'agents' | 'research' | 'sdk') => {
    setActiveTemplate(type);
    if (type === 'llm') {
      setProjectTitle('Gambit Atoms vLLM Kernel');
      setTagline('High-throughput distributed inference engine with chunked PagedAttention v3');
      setFeatures([
        { title: 'PagedAttention v3 Fusion', desc: 'Zero-copy memory pool reduction with fused Triton 3.2 kernel and 128-bit vectorized float4 loading.', icon: 'Zap' },
        { title: 'Multi-GPU NVLink Ring Buffer', desc: 'Overlapped KV-cache swapping with 900 GB/s bidirectional NVLink bandwidth across 8x H100 nodes.', icon: 'Cpu' },
        { title: 'Blackwell FP4 Tensor Core', desc: 'Micro-scaled 4-bit floating point GEMM acceleration with sub-millisecond first-token latency.', icon: 'Layers' },
      ]);
    } else if (type === 'agents') {
      setProjectTitle('Gambit Atoms Autonomous VLA Policy');
      setTagline('Vision-Language-Action Multi-Agent Perception and Sub-Millisecond Policy Execution');
      setFeatures([
        { title: 'Sensorimotor Perception Tokenizer', desc: 'Encodes 120 FPS camera feeds and spatial lidar into multimodal prompt representations.', icon: 'Cpu' },
        { title: 'Hierarchical Chain-of-Agents', desc: 'Multi-tier agent orchestration with strategic planner, safety supervisor, and motor executor.', icon: 'Layers' },
        { title: 'Deterministic RTOS Loop', desc: 'Guaranteed 250 Hz control loop latency with hard real-time safety invariants.', icon: 'Zap' },
      ]);
      setBenchmarkRows([
        { engine: 'Gambit VLA Agent (FP8)', batchSize: 32, ttft: '8.4 ms', throughput: '2,420 tok/s', speedup: '5.10x' },
        { engine: 'RT-2 Base Policy', batchSize: 32, ttft: '32.1 ms', throughput: '640 tok/s', speedup: '1.35x' },
        { engine: 'OpenVLA (Unoptimized)', batchSize: 32, ttft: '43.2 ms', throughput: '475 tok/s', speedup: '1.00x (ref)' },
      ]);
    } else if (type === 'research') {
      setProjectTitle('Gambit Atoms: Empirical Proofs & Quantum Circuit Synthesis');
      setTagline('Formal verification and peer-reviewed benchmark suite for high-dimensional tensor networks');
      setFeatures([
        { title: 'Surface-17 QEC Simulation', desc: 'Simulates fault-tolerant logical qubits with distance-3 surface codes and stabilizer circuits.', icon: 'Layers' },
        { title: 'Exact Numerical Parity', desc: 'Bit-exact fp64 matrix exponential comparison against Qiskit Aer and QuTiP references.', icon: 'Zap' },
        { title: 'Automated ArXiv Typesetting', desc: 'Continuous CI pipeline compiling LaTeX papers with verified benchmark figures.', icon: 'BookOpen' },
      ]);
    } else if (type === 'sdk') {
      setProjectTitle('Gambit Atoms Cloud SDK');
      setTagline('TypeScript and Python developer toolchain for orchestrating autonomous AI workloads');
      setFeatures([
        { title: 'End-to-End Type Safety', desc: 'Fully typed API client for REST, WebSocket streaming, and gRPC endpoints.', icon: 'Code2' },
        { title: 'Auto-Scaling Pod Orchestration', desc: 'Automatically scales GPU worker pools based on queue depth and KV-cache pressure.', icon: 'Zap' },
      ]);
    }
  };

  // Add task helper
  const handleAddTask = () => {
    if (!newTaskInput.trim()) return;
    setTasks(prev => [...prev, { text: newTaskInput.trim(), done: false }]);
    setNewTaskInput('');
  };

  // Delete task helper
  const handleDeleteTask = (index: number) => {
    setTasks(prev => prev.filter((_, i) => i !== index));
  };

  // Toggle task helper
  const handleToggleTask = (index: number) => {
    setTasks(prev => prev.map((t, i) => i === index ? { ...t, done: !t.done } : t));
  };

  // Add feature helper
  const handleAddFeature = () => {
    setFeatures(prev => [
      ...prev,
      { title: 'New Architectural Component', desc: 'Describe key invariant, speedup, or capability of this module.', icon: 'Zap' }
    ]);
  };

  // Delete feature helper
  const handleDeleteFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  // Apply changes to parent
  const handleApply = () => {
    const md = generateMarkdownFromDesign();
    onApplyMarkdown(md);
    setAppliedNotice(true);
    setTimeout(() => setAppliedNotice(false), 2000);
  };

  // Copy designed markdown
  const handleCopy = () => {
    const md = generateMarkdownFromDesign();
    navigator.clipboard.writeText(md);
    setCopiedDesigned(true);
    setTimeout(() => setCopiedDesigned(false), 1500);
  };

  return (
    <div className="p-5 sm:p-7 space-y-7 text-xs font-mono">
      {/* 1. Designer Header & Template Quick-Load Bar */}
      <div 
        className="p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{
          backgroundColor: currentTheme.palette.surfaceRaised,
          borderColor: currentTheme.palette.border,
        }}
      >
        <div className="space-y-1">
          <div className="flex items-center space-x-2 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-sans">Interactive GitHub README Architect</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Live Two-Way Sync
            </span>
          </div>
          <p className="text-[11px] opacity-75 font-sans">
            Visually configure sections, benchmarks, badges, and quickstart commands. Edits instantly compile into compliant GitHub Markdown.
          </p>
        </div>

        {/* Template Quick Selectors */}
        <div className="flex items-center space-x-1.5 flex-wrap">
          <span className="text-[10px] opacity-60 uppercase mr-1">Presets:</span>
          {[
            { id: 'llm', label: '⚡ LLM / Kernel' },
            { id: 'agents', label: '🤖 Multi-Agent' },
            { id: 'research', label: '🔬 Research Lab' },
            { id: 'sdk', label: '📦 Cloud SDK' },
          ].map(tpl => (
            <button
              key={tpl.id}
              onClick={() => handleLoadTemplate(tpl.id as any)}
              className={`px-2.5 py-1 rounded-md border text-[11px] transition-all cursor-pointer ${
                activeTemplate === tpl.id 
                  ? 'font-bold border-current text-emerald-400 bg-emerald-500/10' 
                  : 'opacity-70 hover:opacity-100'
              }`}
              style={{ borderColor: activeTemplate === tpl.id ? undefined : currentTheme.palette.border }}
            >
              {tpl.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Primary Action Bar: Apply, Preview, Copy */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b"
        style={{ borderColor: currentTheme.palette.border }}
      >
        <div className="flex items-center space-x-2 text-xs">
          <span className="font-bold opacity-80">Configured Sections:</span>
          {Object.entries(enabledSections).filter(([_, val]) => val).length} of {Object.keys(enabledSections).length} active
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg border flex items-center space-x-1.5 transition-colors opacity-80 hover:opacity-100 cursor-pointer"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.border,
            }}
          >
            {copiedDesigned ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Markdown</span>
              </>
            )}
          </button>

          <button
            onClick={handleApply}
            className="px-4 py-1.5 rounded-lg text-white font-bold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer hover:opacity-90"
            style={{ backgroundColor: currentTheme.palette.accent }}
          >
            {appliedNotice ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>README Synced!</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                <span>Apply to README</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              handleApply();
              onSwitchToPreview();
            }}
            className="px-3 py-1.5 rounded-lg border font-bold flex items-center space-x-1.5 transition-all cursor-pointer hover:opacity-100 opacity-90"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.borderStrong,
              color: currentTheme.palette.accent,
            }}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Rendered GitHub Preview</span>
          </button>
        </div>
      </div>

      {/* 3. Interactive Section Blocks Grid */}
      <div className="space-y-6">

        {/* SECTION 1: HERO & BADGES */}
        <div 
          className="border rounded-xl p-5 space-y-4 transition-all"
          style={{
            backgroundColor: currentTheme.palette.surface,
            borderColor: enabledSections.hero ? currentTheme.palette.borderStrong : currentTheme.palette.border,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 font-bold text-xs">
              <span className="w-5 h-5 rounded bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-[10px] font-mono">01</span>
              <span>Project Hero, Pitch & GitHub Badges</span>
            </div>

            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-1.5 cursor-pointer text-[11px]">
                <input 
                  type="checkbox"
                  checked={enabledSections.hero}
                  onChange={(e) => setEnabledSections(p => ({ ...p, hero: e.target.checked }))}
                  className="rounded accent-emerald-500"
                />
                <span className="opacity-70">Include in README</span>
              </label>
            </div>
          </div>

          {enabledSections.hero && (
            <div className="space-y-3 pt-2 font-sans">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-1">
                  <label className="block text-[11px] font-mono opacity-60 uppercase mb-1">Project Name (H1)</label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-xs font-mono"
                    style={{
                      backgroundColor: currentTheme.palette.surfaceRaised,
                      borderColor: currentTheme.palette.border,
                      color: currentTheme.palette.textPrimary,
                    }}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-mono opacity-60 uppercase mb-1">Tagline / Mission Pitch</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-xs font-sans"
                    style={{
                      backgroundColor: currentTheme.palette.surfaceRaised,
                      borderColor: currentTheme.palette.border,
                      color: currentTheme.palette.textPrimary,
                    }}
                  />
                </div>
              </div>

              {/* Badges Array */}
              <div className="pt-2">
                <label className="block text-[11px] font-mono opacity-60 uppercase mb-2">Active Shields & Verification Badges</label>
                <div className="flex flex-wrap gap-2">
                  {badges.map((b, i) => (
                    <div 
                      key={i}
                      onClick={() => {
                        setBadges(prev => prev.map((item, idx) => idx === i ? { ...item, enabled: !item.enabled } : item));
                      }}
                      className={`px-2.5 py-1 rounded-md border text-[11px] font-mono flex items-center space-x-1.5 cursor-pointer transition-all ${
                        b.enabled ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'opacity-40 border-dashed'
                      }`}
                    >
                      <Shield className="w-3 h-3" />
                      <span>{b.label}: <strong>{b.text}</strong></span>
                      {b.enabled && <span className="text-[10px] text-emerald-400">✓</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: KEY ARCHITECTURAL FEATURES */}
        <div 
          className="border rounded-xl p-5 space-y-4 transition-all"
          style={{
            backgroundColor: currentTheme.palette.surface,
            borderColor: enabledSections.features ? currentTheme.palette.borderStrong : currentTheme.palette.border,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 font-bold text-xs">
              <span className="w-5 h-5 rounded bg-blue-500/15 text-blue-400 flex items-center justify-center text-[10px] font-mono">02</span>
              <span>Architectural Highlights & Capabilities</span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleAddFeature}
                className="px-2.5 py-1 rounded-md border text-[11px] font-mono flex items-center space-x-1 hover:border-current cursor-pointer"
                style={{ borderColor: currentTheme.palette.border }}
              >
                <Plus className="w-3 h-3" />
                <span>Add Feature</span>
              </button>
              <label className="flex items-center space-x-1.5 cursor-pointer text-[11px]">
                <input 
                  type="checkbox"
                  checked={enabledSections.features}
                  onChange={(e) => setEnabledSections(p => ({ ...p, features: e.target.checked }))}
                  className="rounded accent-emerald-500"
                />
                <span className="opacity-70">Include in README</span>
              </label>
            </div>
          </div>

          {enabledSections.features && (
            <div className="space-y-3 pt-1">
              {features.map((f, i) => (
                <div 
                  key={i}
                  className="p-3 rounded-lg border grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                  style={{
                    backgroundColor: currentTheme.palette.surfaceRaised,
                    borderColor: currentTheme.palette.border,
                  }}
                >
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      value={f.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFeatures(prev => prev.map((item, idx) => idx === i ? { ...item, title: val } : item));
                      }}
                      className="w-full px-2.5 py-1.5 rounded border text-xs font-bold font-mono"
                      style={{
                        backgroundColor: currentTheme.palette.surface,
                        borderColor: currentTheme.palette.border,
                        color: currentTheme.palette.textPrimary,
                      }}
                      placeholder="Feature Title"
                    />
                  </div>
                  <div className="sm:col-span-7">
                    <input
                      type="text"
                      value={f.desc}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFeatures(prev => prev.map((item, idx) => idx === i ? { ...item, desc: val } : item));
                      }}
                      className="w-full px-2.5 py-1.5 rounded border text-xs font-sans"
                      style={{
                        backgroundColor: currentTheme.palette.surface,
                        borderColor: currentTheme.palette.border,
                        color: currentTheme.palette.textPrimary,
                      }}
                      placeholder="Feature details and invariants"
                    />
                  </div>
                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      onClick={() => handleDeleteFeature(i)}
                      className="p-1.5 text-red-400 hover:text-red-300 opacity-60 hover:opacity-100 cursor-pointer"
                      title="Remove feature"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 3: INTERACTIVE BENCHMARK MATRIX */}
        <div 
          className="border rounded-xl p-5 space-y-4 transition-all"
          style={{
            backgroundColor: currentTheme.palette.surface,
            borderColor: enabledSections.benchmarks ? currentTheme.palette.borderStrong : currentTheme.palette.border,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 font-bold text-xs">
              <span className="w-5 h-5 rounded bg-purple-500/15 text-purple-400 flex items-center justify-center text-[10px] font-mono">03</span>
              <span>Benchmark Matrix & Quantitative Comparison Table</span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setBenchmarkRows(prev => [
                    ...prev,
                    { engine: 'Custom Engine Candidate', batchSize: 64, ttft: '20.0 ms', throughput: '1,200 tok/s', speedup: '2.85x' }
                  ]);
                }}
                className="px-2.5 py-1 rounded-md border text-[11px] font-mono flex items-center space-x-1 hover:border-current cursor-pointer"
                style={{ borderColor: currentTheme.palette.border }}
              >
                <Plus className="w-3 h-3" />
                <span>Add Row</span>
              </button>
              <label className="flex items-center space-x-1.5 cursor-pointer text-[11px]">
                <input 
                  type="checkbox"
                  checked={enabledSections.benchmarks}
                  onChange={(e) => setEnabledSections(p => ({ ...p, benchmarks: e.target.checked }))}
                  className="rounded accent-emerald-500"
                />
                <span className="opacity-70">Include in README</span>
              </label>
            </div>
          </div>

          {enabledSections.benchmarks && (
            <div className="overflow-x-auto pt-1">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b opacity-60 text-[10px] uppercase" style={{ borderColor: currentTheme.palette.border }}>
                    <th className="pb-2">Engine / Framework</th>
                    <th className="pb-2">Batch</th>
                    <th className="pb-2">Latency (TTFT)</th>
                    <th className="pb-2">Throughput</th>
                    <th className="pb-2">Speedup</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: currentTheme.palette.border }}>
                  {benchmarkRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-black/5 dark:hover:bg-white/5">
                      <td className="py-2 pr-2">
                        <input
                          type="text"
                          value={row.engine}
                          onChange={(e) => {
                            const val = e.target.value;
                            setBenchmarkRows(prev => prev.map((r, i) => i === idx ? { ...r, engine: val } : r));
                          }}
                          className="w-full px-2 py-1 rounded border text-xs font-bold"
                          style={{
                            backgroundColor: currentTheme.palette.surfaceRaised,
                            borderColor: currentTheme.palette.border,
                            color: currentTheme.palette.textPrimary,
                          }}
                        />
                      </td>
                      <td className="py-2 pr-2 w-20">
                        <input
                          type="number"
                          value={row.batchSize}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            setBenchmarkRows(prev => prev.map((r, i) => i === idx ? { ...r, batchSize: val } : r));
                          }}
                          className="w-full px-2 py-1 rounded border text-xs text-center"
                          style={{
                            backgroundColor: currentTheme.palette.surfaceRaised,
                            borderColor: currentTheme.palette.border,
                            color: currentTheme.palette.textPrimary,
                          }}
                        />
                      </td>
                      <td className="py-2 pr-2 w-28">
                        <input
                          type="text"
                          value={row.ttft}
                          onChange={(e) => {
                            const val = e.target.value;
                            setBenchmarkRows(prev => prev.map((r, i) => i === idx ? { ...r, ttft: val } : r));
                          }}
                          className="w-full px-2 py-1 rounded border text-xs text-center"
                          style={{
                            backgroundColor: currentTheme.palette.surfaceRaised,
                            borderColor: currentTheme.palette.border,
                            color: currentTheme.palette.textPrimary,
                          }}
                        />
                      </td>
                      <td className="py-2 pr-2 w-36">
                        <input
                          type="text"
                          value={row.throughput}
                          onChange={(e) => {
                            const val = e.target.value;
                            setBenchmarkRows(prev => prev.map((r, i) => i === idx ? { ...r, throughput: val } : r));
                          }}
                          className="w-full px-2 py-1 rounded border text-xs text-emerald-400 font-bold text-center"
                          style={{
                            backgroundColor: currentTheme.palette.surfaceRaised,
                            borderColor: currentTheme.palette.border,
                          }}
                        />
                      </td>
                      <td className="py-2 pr-2 w-28">
                        <input
                          type="text"
                          value={row.speedup}
                          onChange={(e) => {
                            const val = e.target.value;
                            setBenchmarkRows(prev => prev.map((r, i) => i === idx ? { ...r, speedup: val } : r));
                          }}
                          className="w-full px-2 py-1 rounded border text-xs text-center font-bold"
                          style={{
                            backgroundColor: currentTheme.palette.surfaceRaised,
                            borderColor: currentTheme.palette.border,
                            color: currentTheme.palette.textPrimary,
                          }}
                        />
                      </td>
                      <td className="py-2 text-right">
                        <button
                          onClick={() => setBenchmarkRows(prev => prev.filter((_, i) => i !== idx))}
                          className="p-1 text-red-400 opacity-60 hover:opacity-100 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* SECTION 4: QUICKSTART & INSTALLATION CONFIGURATOR */}
        <div 
          className="border rounded-xl p-5 space-y-4 transition-all"
          style={{
            backgroundColor: currentTheme.palette.surface,
            borderColor: enabledSections.quickstart ? currentTheme.palette.borderStrong : currentTheme.palette.border,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 font-bold text-xs">
              <span className="w-5 h-5 rounded bg-amber-500/15 text-amber-400 flex items-center justify-center text-[10px] font-mono">04</span>
              <span>Quickstart & Package Manager Selector</span>
            </div>

            <label className="flex items-center space-x-1.5 cursor-pointer text-[11px]">
              <input 
                type="checkbox"
                checked={enabledSections.quickstart}
                onChange={(e) => setEnabledSections(p => ({ ...p, quickstart: e.target.checked }))}
                className="rounded accent-emerald-500"
              />
              <span className="opacity-70">Include in README</span>
            </label>
          </div>

          {enabledSections.quickstart && (
            <div className="space-y-4 pt-1 font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div>
                  <label className="block text-[11px] opacity-60 uppercase mb-1">Package Manager</label>
                  <div className="flex items-center space-x-1 p-1 rounded-lg border"
                    style={{
                      backgroundColor: currentTheme.palette.surfaceRaised,
                      borderColor: currentTheme.palette.border,
                    }}
                  >
                    {(['pip', 'uv', 'docker', 'conda'] as const).map(pkg => (
                      <button
                        key={pkg}
                        onClick={() => setPackageManager(pkg)}
                        className={`flex-1 py-1 rounded text-center transition-all cursor-pointer ${
                          packageManager === pkg ? 'font-bold bg-emerald-500/20 text-emerald-400' : 'opacity-60'
                        }`}
                      >
                        {pkg}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] opacity-60 uppercase mb-1">Target Compute Architecture</label>
                  <select
                    value={gpuArch}
                    onChange={(e) => setGpuArch(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg border text-xs font-mono cursor-pointer"
                    style={{
                      backgroundColor: currentTheme.palette.surfaceRaised,
                      borderColor: currentTheme.palette.border,
                      color: currentTheme.palette.textPrimary,
                    }}
                  >
                    <option value="h100">NVIDIA Hopper / Blackwell (CUDA 12.8)</option>
                    <option value="ada">NVIDIA Ada Lovelace (CUDA 12.4)</option>
                    <option value="rocm">AMD ROCm 6.2 (Instinct MI300)</option>
                    <option value="cpu">CPU AVX-512 / Apple Silicon</option>
                  </select>
                </div>
              </div>

              {/* Code Preview */}
              <div className="rounded-lg p-3 bg-black/80 border border-gray-800 text-[11px] font-mono text-emerald-400">
                <span className="text-gray-500"># Generated bash command:</span>
                <p className="mt-1">
                  {packageManager === 'pip' && `pip install ${projectTitle.toLowerCase().replace(/\s+/g, '-')} --extra-index-url https://wheels.gambitatoms.org/cu128`}
                  {packageManager === 'uv' && `uv pip install ${projectTitle.toLowerCase().replace(/\s+/g, '-')}`}
                  {packageManager === 'docker' && `docker run --gpus all -it ghcr.io/${repoName.toLowerCase()}:latest`}
                  {packageManager === 'conda' && `git clone https://github.com/${repoName}.git && pip install -e .`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 5: INTERACTIVE CHECKLIST & ROADMAP */}
        <div 
          className="border rounded-xl p-5 space-y-4 transition-all"
          style={{
            backgroundColor: currentTheme.palette.surface,
            borderColor: enabledSections.checklist ? currentTheme.palette.borderStrong : currentTheme.palette.border,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 font-bold text-xs">
              <span className="w-5 h-5 rounded bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-[10px] font-mono">05</span>
              <span>Production Readiness Checklist & Milestones</span>
            </div>

            <label className="flex items-center space-x-1.5 cursor-pointer text-[11px]">
              <input 
                type="checkbox"
                checked={enabledSections.checklist}
                onChange={(e) => setEnabledSections(p => ({ ...p, checklist: e.target.checked }))}
                className="rounded accent-emerald-500"
              />
              <span className="opacity-70">Include in README</span>
            </label>
          </div>

          {enabledSections.checklist && (
            <div className="space-y-3 pt-1">
              <div className="space-y-2">
                {tasks.map((task, i) => (
                  <div 
                    key={i}
                    className="p-2.5 rounded-lg border flex items-center justify-between gap-3 text-xs"
                    style={{
                      backgroundColor: currentTheme.palette.surfaceRaised,
                      borderColor: currentTheme.palette.border,
                    }}
                  >
                    <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                      <button
                        onClick={() => handleToggleTask(i)}
                        className="cursor-pointer shrink-0"
                      >
                        {task.done ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4 opacity-50" />
                        )}
                      </button>
                      <span className={`truncate ${task.done ? 'line-through opacity-50' : 'font-medium'}`}>
                        {task.text}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteTask(i)}
                      className="text-red-400 hover:text-red-300 opacity-50 hover:opacity-100 cursor-pointer shrink-0 p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Task Input */}
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="text"
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                  placeholder="Add new milestone or checklist item..."
                  className="flex-1 px-3 py-1.5 rounded-lg border text-xs font-sans"
                  style={{
                    backgroundColor: currentTheme.palette.surfaceRaised,
                    borderColor: currentTheme.palette.border,
                    color: currentTheme.palette.textPrimary,
                  }}
                />
                <button
                  onClick={handleAddTask}
                  className="px-3 py-1.5 rounded-lg text-white font-bold text-xs flex items-center space-x-1 cursor-pointer"
                  style={{ backgroundColor: currentTheme.palette.accent }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 6: BIBTEX CITATION */}
        <div 
          className="border rounded-xl p-5 space-y-4 transition-all"
          style={{
            backgroundColor: currentTheme.palette.surface,
            borderColor: enabledSections.citation ? currentTheme.palette.borderStrong : currentTheme.palette.border,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 font-bold text-xs">
              <span className="w-5 h-5 rounded bg-cyan-500/15 text-cyan-400 flex items-center justify-center text-[10px] font-mono">06</span>
              <span>Academic BibTeX Citation</span>
            </div>

            <label className="flex items-center space-x-1.5 cursor-pointer text-[11px]">
              <input 
                type="checkbox"
                checked={enabledSections.citation}
                onChange={(e) => setEnabledSections(p => ({ ...p, citation: e.target.checked }))}
                className="rounded accent-emerald-500"
              />
              <span className="opacity-70">Include in README</span>
            </label>
          </div>

          {enabledSections.citation && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-[11px] opacity-60 uppercase mb-1">Paper / Project Title</label>
                <input
                  type="text"
                  value={citationTitle}
                  onChange={(e) => setCitationTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border text-xs"
                  style={{
                    backgroundColor: currentTheme.palette.surfaceRaised,
                    borderColor: currentTheme.palette.border,
                    color: currentTheme.palette.textPrimary,
                  }}
                />
              </div>
              <div>
                <label className="block text-[11px] opacity-60 uppercase mb-1">Author List</label>
                <input
                  type="text"
                  value={citationAuthors}
                  onChange={(e) => setCitationAuthors(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border text-xs"
                  style={{
                    backgroundColor: currentTheme.palette.surfaceRaised,
                    borderColor: currentTheme.palette.border,
                    color: currentTheme.palette.textPrimary,
                  }}
                />
              </div>
              <div>
                <label className="block text-[11px] opacity-60 uppercase mb-1">Year</label>
                <input
                  type="text"
                  value={citationYear}
                  onChange={(e) => setCitationYear(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border text-xs"
                  style={{
                    backgroundColor: currentTheme.palette.surfaceRaised,
                    borderColor: currentTheme.palette.border,
                    color: currentTheme.palette.textPrimary,
                  }}
                />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
