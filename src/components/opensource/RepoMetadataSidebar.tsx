import React, { useState } from 'react';
import { 
  Star, GitFork, Clock, Code2, FolderGit2, ShieldCheck, 
  ExternalLink, Copy, Check, Sparkles, Terminal, Activity, 
  AlertCircle, Tag, GitPullRequest, Eye, Layers, Compass,
  TrendingUp, CheckCircle2, ChevronRight, RefreshCw, Cpu
} from 'lucide-react';
import { useAdaptiveTheme } from '../../context/ThemeContext';

export interface RepoDetails {
  fullName: string;
  name: string;
  owner: string;
  description: string;
  stars: number;
  starsWeeklyGrowth: number;
  forks: number;
  watchers: number;
  primaryLang: string;
  langColor: string;
  langBreakdown: Array<{ name: string; pct: number; color: string }>;
  lastCommitTimestamp: string;
  lastCommitHash: string;
  lastCommitAuthor: string;
  latestRelease: string;
  openIssues: number;
  openPRs: number;
  license: string;
  licenseScore: number;
  healthScore: number;
  defaultBranch: string;
  topics: string[];
}

export const REPO_DETAILS_MAP: Record<string, RepoDetails> = {
  'vllm-project/vllm': {
    fullName: 'vllm-project/vllm',
    name: 'vllm',
    owner: 'vllm-project',
    description: 'High-throughput and memory-efficient LLM serving engine with PagedAttention v3 and tensor parallelism.',
    stars: 34200,
    starsWeeklyGrowth: 480,
    forks: 5890,
    watchers: 820,
    primaryLang: 'Python / CUDA',
    langColor: '#3572A5',
    langBreakdown: [
      { name: 'Python', pct: 64.2, color: '#3572A5' },
      { name: 'C++ / CUDA', pct: 32.5, color: '#F34B7D' },
      { name: 'C', pct: 2.1, color: '#555555' },
      { name: 'Shell / CMake', pct: 1.2, color: '#89E051' },
    ],
    lastCommitTimestamp: '12 mins ago',
    lastCommitHash: '8f92a1c',
    lastCommitAuthor: 'Woosuk Kwon',
    latestRelease: 'v0.7.3 (Hopper TMA support)',
    openIssues: 142,
    openPRs: 38,
    license: 'Apache-2.0',
    licenseScore: 96,
    healthScore: 96,
    defaultBranch: 'main',
    topics: ['Inference', 'CUDA', 'LLM', 'PagedAttention', 'TensorRT'],
  },
  'deepseek-ai/DeepSeek-V3': {
    fullName: 'deepseek-ai/DeepSeek-V3',
    name: 'DeepSeek-V3',
    owner: 'deepseek-ai',
    description: 'Ultra-scale Mixture-of-Experts (MoE) with Multi-Head Latent Attention (MLA) and FP8 mixed-precision training framework.',
    stars: 48900,
    starsWeeklyGrowth: 1250,
    forks: 7400,
    watchers: 1450,
    primaryLang: 'Python / CUDA',
    langColor: '#3572A5',
    langBreakdown: [
      { name: 'Python', pct: 58.4, color: '#3572A5' },
      { name: 'CUDA', pct: 36.1, color: '#F34B7D' },
      { name: 'Triton', pct: 4.2, color: '#8B5CF6' },
      { name: 'C++', pct: 1.3, color: '#555555' },
    ],
    lastCommitTimestamp: '8 hours ago',
    lastCommitHash: '7d2a55e',
    lastCommitAuthor: 'DeepSeek Core Arch',
    latestRelease: 'v3.1.0 (DualPipe Overlap)',
    openIssues: 65,
    openPRs: 14,
    license: 'MIT',
    licenseScore: 98,
    healthScore: 91,
    defaultBranch: 'main',
    topics: ['MoE', 'MLA', 'FP8', 'OpenWeights', 'DeepSeek'],
  },
  'openai/triton': {
    fullName: 'openai/triton',
    name: 'triton',
    owner: 'openai',
    description: 'Development environment for parallel programming and custom GPU kernels with high-performance compiler backend.',
    stars: 15400,
    starsWeeklyGrowth: 210,
    forks: 2100,
    watchers: 430,
    primaryLang: 'Python / C++',
    langColor: '#3572A5',
    langBreakdown: [
      { name: 'C++', pct: 54.8, color: '#F34B7D' },
      { name: 'Python', pct: 41.2, color: '#3572A5' },
      { name: 'LLVM IR', pct: 3.0, color: '#10B981' },
      { name: 'CMake', pct: 1.0, color: '#89E051' },
    ],
    lastCommitTimestamp: '5 hours ago',
    lastCommitHash: '9a4c21b',
    lastCommitAuthor: 'Philippe Tillet',
    latestRelease: 'v3.2.0 (Persistent TMA)',
    openIssues: 88,
    openPRs: 22,
    license: 'MIT',
    licenseScore: 98,
    healthScore: 89,
    defaultBranch: 'main',
    topics: ['Compiler', 'GPU Kernel', 'LLVM', 'CUDA', 'JIT'],
  },
  'huggingface/transformers': {
    fullName: 'huggingface/transformers',
    name: 'transformers',
    owner: 'huggingface',
    description: 'State-of-the-art Machine Learning for PyTorch, TensorFlow, and JAX with 100k+ pretrained model architectures.',
    stars: 131500,
    starsWeeklyGrowth: 940,
    forks: 26400,
    watchers: 3200,
    primaryLang: 'Python',
    langColor: '#3572A5',
    langBreakdown: [
      { name: 'Python', pct: 96.8, color: '#3572A5' },
      { name: 'Docker / Shell', pct: 2.1, color: '#89E051' },
      { name: 'Rust', pct: 1.1, color: '#DEA584' },
    ],
    lastCommitTimestamp: '1 hour ago',
    lastCommitHash: 'b4d1c9f',
    lastCommitAuthor: 'Arthur Zucker',
    latestRelease: 'v4.49.0 (Dynamic Speculative)',
    openIssues: 420,
    openPRs: 86,
    license: 'Apache-2.0',
    licenseScore: 96,
    healthScore: 92,
    defaultBranch: 'main',
    topics: ['NLP', 'Multi-Modal', 'Vision', 'PyTorch', 'JAX'],
  },
  'pytorch/pytorch': {
    fullName: 'pytorch/pytorch',
    name: 'pytorch',
    owner: 'pytorch',
    description: 'Tensors and Dynamic neural networks in Python with strong GPU acceleration and torch.compile inductor backends.',
    stars: 84900,
    starsWeeklyGrowth: 620,
    forks: 22100,
    watchers: 2800,
    primaryLang: 'C++ / Python',
    langColor: '#F34B7D',
    langBreakdown: [
      { name: 'C++', pct: 52.4, color: '#F34B7D' },
      { name: 'Python', pct: 40.8, color: '#3572A5' },
      { name: 'CUDA', pct: 5.6, color: '#76B900' },
      { name: 'Other', pct: 1.2, color: '#89E051' },
    ],
    lastCommitTimestamp: '3 hours ago',
    lastCommitHash: '3e810fa',
    lastCommitAuthor: 'Soumith Chintala',
    latestRelease: 'v2.6.0 (Inductor FP8)',
    openIssues: 890,
    openPRs: 145,
    license: 'BSD-3-Clause',
    licenseScore: 95,
    healthScore: 94,
    defaultBranch: 'main',
    topics: ['Deep Learning', 'Autograd', 'Distributed', 'GPU', 'TorchCompile'],
  },
  'ggerganov/llama.cpp': {
    fullName: 'ggerganov/llama.cpp',
    name: 'llama.cpp',
    owner: 'ggerganov',
    description: 'LLM inference in C/C++ with 1.5-bit to 8-bit quantization for CPU and Apple Silicon edge devices.',
    stars: 69800,
    starsWeeklyGrowth: 810,
    forks: 10800,
    watchers: 1100,
    primaryLang: 'C / C++',
    langColor: '#555555',
    langBreakdown: [
      { name: 'C / C++', pct: 91.2, color: '#555555' },
      { name: 'Metal', pct: 4.8, color: '#007AFF' },
      { name: 'CUDA', pct: 2.8, color: '#76B900' },
      { name: 'Python / CMake', pct: 1.2, color: '#3572A5' },
    ],
    lastCommitTimestamp: '1 day ago',
    lastCommitHash: '1c55aa3',
    lastCommitAuthor: 'Georgi Gerganov',
    latestRelease: 'b4820 (Metal FlashAttention)',
    openIssues: 210,
    openPRs: 34,
    license: 'MIT',
    licenseScore: 98,
    healthScore: 88,
    defaultBranch: 'master',
    topics: ['Quantization', 'EdgeAI', 'AppleSilicon', 'GGUF', 'Inference'],
  },
};

interface RepoMetadataSidebarProps {
  selectedRepo: string;
  onSelectRepo: (repoFullName: string) => void;
  liveRepoData?: any | null;
  onOpenSyncModal?: () => void;
}

export const RepoMetadataSidebar: React.FC<RepoMetadataSidebarProps> = ({
  selectedRepo,
  onSelectRepo,
  liveRepoData,
  onOpenSyncModal,
}) => {
  const { currentTheme } = useAdaptiveTheme();

  // Local state for interactive star toggle
  const [starredMap, setStarredMap] = useState<Record<string, boolean>>({
    'vllm-project/vllm': true,
    'deepseek-ai/DeepSeek-V3': true,
    'huggingface/transformers': true,
  });

  const [copiedClone, setCopiedClone] = useState(false);

  // Retrieve current repo data with safe fallback or overlay live GitHub data
  const fallbackDetails = REPO_DETAILS_MAP[selectedRepo] || REPO_DETAILS_MAP['vllm-project/vllm'];
  
  const currentDetails: RepoDetails = (liveRepoData && (liveRepoData.fullName === selectedRepo || liveRepoData.name === selectedRepo.split('/')[1])) ? {
    fullName: liveRepoData.fullName || selectedRepo,
    name: liveRepoData.name || selectedRepo.split('/')[1] || selectedRepo,
    owner: liveRepoData.owner || selectedRepo.split('/')[0],
    description: liveRepoData.description || fallbackDetails.description,
    stars: liveRepoData.stars ?? fallbackDetails.stars,
    starsWeeklyGrowth: fallbackDetails.starsWeeklyGrowth,
    forks: liveRepoData.forks ?? fallbackDetails.forks,
    watchers: liveRepoData.watchers ?? fallbackDetails.watchers,
    primaryLang: liveRepoData.primaryLang || fallbackDetails.primaryLang,
    langColor: liveRepoData.langColor || fallbackDetails.langColor,
    langBreakdown: (liveRepoData.langBreakdown && liveRepoData.langBreakdown.length > 0) 
      ? liveRepoData.langBreakdown 
      : fallbackDetails.langBreakdown,
    lastCommitTimestamp: liveRepoData.lastCommit?.relativeTime || fallbackDetails.lastCommitTimestamp,
    lastCommitHash: liveRepoData.lastCommit?.hash || fallbackDetails.lastCommitHash,
    lastCommitAuthor: liveRepoData.lastCommit?.author || fallbackDetails.lastCommitAuthor,
    latestRelease: fallbackDetails.latestRelease,
    openIssues: liveRepoData.openIssues ?? fallbackDetails.openIssues,
    openPRs: fallbackDetails.openPRs,
    license: liveRepoData.license || fallbackDetails.license,
    licenseScore: liveRepoData.licenseScore ?? fallbackDetails.licenseScore,
    healthScore: liveRepoData.healthScore ?? fallbackDetails.healthScore,
    defaultBranch: liveRepoData.defaultBranch || fallbackDetails.defaultBranch,
    topics: (liveRepoData.topics && liveRepoData.topics.length > 0) ? liveRepoData.topics : fallbackDetails.topics,
  } : fallbackDetails;

  const isLive = !!(liveRepoData && (liveRepoData.fullName === selectedRepo || liveRepoData.name === selectedRepo.split('/')[1]));
  const isStarred = !!starredMap[currentDetails.fullName];
  const displayStars = currentDetails.stars + (isStarred ? 1 : 0);

  const handleToggleStar = () => {
    setStarredMap(prev => ({
      ...prev,
      [currentDetails.fullName]: !prev[currentDetails.fullName],
    }));
  };

  const handleCopyCloneUri = () => {
    navigator.clipboard.writeText(`git clone https://github.com/${currentDetails.fullName}.git`);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toLocaleString();
  };

  return (
    <aside 
      className="border rounded-2xl p-5 sm:p-6 shadow-sm space-y-6 transition-all duration-300"
      style={{
        backgroundColor: currentTheme.palette.surface,
        borderColor: currentTheme.palette.border,
        color: currentTheme.palette.textPrimary,
      }}
    >
      {/* Header: Title, Live Sync Status & Repo Selector */}
      <div className="space-y-3 pb-4 border-b" style={{ borderColor: currentTheme.palette.border }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4" style={{ color: currentTheme.palette.accent }} />
            <span>Repository Metadata</span>
          </div>

          <button
            onClick={onOpenSyncModal}
            className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold border flex items-center space-x-1.5 transition-all shadow-2xs ${
              isLive 
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/25' 
                : 'hover:border-emerald-500/50'
            }`}
            style={!isLive ? {
              backgroundColor: currentTheme.palette.badgeBg,
              borderColor: currentTheme.palette.borderStrong,
              color: currentTheme.palette.badgeText,
            } : {}}
            title="Open GitHub Sync Control"
          >
            <RefreshCw className={`w-3 h-3 ${isLive ? 'text-emerald-400 animate-spin-slow' : 'text-emerald-500'}`} />
            <span>{isLive ? 'GitHub Live Sync' : 'Sync with GitHub'}</span>
          </button>
        </div>

        {/* Quick Repository Selector Dropdown */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-[10px] font-mono font-bold uppercase opacity-60">
              Selected Target
            </label>
            {isLive && (
              <span className="text-[10px] font-mono text-emerald-500 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Live REST Data</span>
              </span>
            )}
          </div>
          <select
            value={currentDetails.fullName}
            onChange={(e) => onSelectRepo(e.target.value)}
            className="w-full rounded-lg px-3 py-2 text-xs font-mono border font-semibold focus:outline-none cursor-pointer transition-colors"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.borderStrong,
              color: currentTheme.palette.textPrimary,
            }}
          >
            {Object.keys(REPO_DETAILS_MAP).map((repoKey) => (
              <option key={repoKey} value={repoKey}>
                {repoKey}
              </option>
            ))}
            {/* Include custom live repo if not already in list */}
            {isLive && !Object.keys(REPO_DETAILS_MAP).includes(currentDetails.fullName) && (
              <option value={currentDetails.fullName}>
                {currentDetails.fullName} (Live Synced)
              </option>
            )}
          </select>
        </div>

        {/* Repo Name & Owner */}
        <div className="pt-1">
          <div className="flex items-center space-x-2">
            <FolderGit2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <h3 className="font-bold text-base tracking-tight truncate">{currentDetails.name}</h3>
          </div>
          <p className="text-xs opacity-75 line-clamp-2 mt-1 leading-relaxed">
            {currentDetails.description}
          </p>
        </div>
      </div>

      {/* 3 Core Highlight Cards: Star Count, Primary Language, and Last Updated */}
      <div className="space-y-3">
        {/* 1. Repository Star Count Card */}
        <div 
          className="p-3.5 rounded-xl border space-y-2 transition-all hover:scale-[1.01]"
          style={{
            backgroundColor: currentTheme.palette.surfaceRaised,
            borderColor: currentTheme.palette.border,
          }}
        >
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="opacity-70 flex items-center space-x-1.5 font-bold">
              <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-400 text-amber-400' : 'text-amber-400'}`} />
              <span>Star Count</span>
            </span>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center space-x-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>+{currentDetails.starsWeeklyGrowth}/wk</span>
            </span>
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <div className="font-mono">
              <span className="text-2xl font-bold tracking-tight">{formatNumber(displayStars)}</span>
              <span className="text-xs opacity-50 ml-1.5 font-sans">({displayStars.toLocaleString()} total)</span>
            </div>

            <button
              onClick={handleToggleStar}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 transition-all border shadow-2xs ${
                isStarred 
                  ? 'bg-amber-400/15 text-amber-500 border-amber-400/40' 
                  : 'opacity-80 hover:opacity-100 hover:border-amber-400/50'
              }`}
              style={!isStarred ? {
                backgroundColor: currentTheme.palette.surface,
                borderColor: currentTheme.palette.borderStrong,
              } : {}}
            >
              <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>{isStarred ? 'Starred' : 'Star'}</span>
            </button>
          </div>
        </div>

        {/* 2. Primary Language Card */}
        <div 
          className="p-3.5 rounded-xl border space-y-2.5 transition-all hover:scale-[1.01]"
          style={{
            backgroundColor: currentTheme.palette.surfaceRaised,
            borderColor: currentTheme.palette.border,
          }}
        >
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="opacity-70 flex items-center space-x-1.5 font-bold">
              <Code2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Primary Language</span>
            </span>
            <span 
              className="text-[10px] font-mono px-2 py-0.5 rounded font-bold border"
              style={{
                backgroundColor: currentTheme.palette.surface,
                borderColor: currentTheme.palette.borderStrong,
                color: currentDetails.langColor,
              }}
            >
              {currentDetails.primaryLang}
            </span>
          </div>

          {/* Multi-language breakdown progress bar */}
          <div className="space-y-1.5 pt-0.5">
            <div className="w-full h-2 rounded-full overflow-hidden flex bg-black/10 dark:bg-white/10">
              {currentDetails.langBreakdown.map((lang) => (
                <div 
                  key={lang.name} 
                  style={{ width: `${lang.pct}%`, backgroundColor: lang.color }}
                  className="h-full first:rounded-l-full last:rounded-r-full"
                  title={`${lang.name}: ${lang.pct}%`}
                />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono opacity-80 pt-0.5">
              {currentDetails.langBreakdown.map((lang) => (
                <span key={lang.name} className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: lang.color }}></span>
                  <span className="font-semibold">{lang.name}</span>
                  <span className="opacity-60">{lang.pct}%</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Last Updated Timestamp Card */}
        <div 
          className="p-3.5 rounded-xl border space-y-2 transition-all hover:scale-[1.01]"
          style={{
            backgroundColor: currentTheme.palette.surfaceRaised,
            borderColor: currentTheme.palette.border,
          }}
        >
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="opacity-70 flex items-center space-x-1.5 font-bold">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>Last Updated</span>
            </span>
            <span className="text-[10px] text-emerald-500 font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">
              ● Active
            </span>
          </div>

          <div className="pt-0.5 font-mono space-y-1">
            <div className="text-sm font-bold tracking-tight text-emerald-500">
              {currentDetails.lastCommitTimestamp}
            </div>
            <div className="flex items-center space-x-2 text-[11px] opacity-70">
              <span>Commit: <span className="font-bold underline">#{currentDetails.lastCommitHash}</span></span>
              <span>•</span>
              <span className="truncate">by {currentDetails.lastCommitAuthor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Repository Metadata Grid */}
      <div 
        className="p-3.5 rounded-xl border space-y-3 font-mono text-xs"
        style={{
          backgroundColor: currentTheme.palette.surfaceRaised,
          borderColor: currentTheme.palette.border,
        }}
      >
        <div className="text-[10px] font-bold uppercase tracking-wider opacity-60">
          Telemetry & Engineering Specs
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="space-y-0.5">
            <span className="opacity-60 text-[10px]">Forks</span>
            <div className="font-bold flex items-center space-x-1">
              <GitFork className="w-3 h-3 text-purple-400" />
              <span>{formatNumber(currentDetails.forks)}</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="opacity-60 text-[10px]">Open Issues</span>
            <div className="font-bold flex items-center space-x-1">
              <AlertCircle className="w-3 h-3 text-amber-500" />
              <span>{currentDetails.openIssues} issues</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="opacity-60 text-[10px]">Latest Release</span>
            <div className="font-bold truncate text-emerald-500">
              {currentDetails.latestRelease}
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="opacity-60 text-[10px]">SPDX License</span>
            <div className="font-bold flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-blue-400" />
              <span>{currentDetails.license} ({currentDetails.licenseScore}%)</span>
            </div>
          </div>
        </div>

        {/* Topics / Tags */}
        <div className="pt-2 border-t space-y-1.5" style={{ borderColor: currentTheme.palette.border }}>
          <span className="text-[10px] opacity-60 font-bold uppercase">Topics</span>
          <div className="flex flex-wrap gap-1">
            {currentDetails.topics.map((t) => (
              <span 
                key={t}
                className="px-2 py-0.5 rounded text-[10px] font-mono border"
                style={{
                  backgroundColor: currentTheme.palette.surface,
                  borderColor: currentTheme.palette.borderStrong,
                  color: currentTheme.palette.accent,
                }}
              >
                #{t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Action Footer: Copy Clone URI & GitHub Link */}
      <div className="pt-1 flex items-center space-x-2 font-mono">
        <button
          onClick={handleCopyCloneUri}
          className="flex-1 py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center space-x-1.5 transition-all opacity-85 hover:opacity-100"
          style={{
            backgroundColor: currentTheme.palette.surfaceRaised,
            borderColor: currentTheme.palette.borderStrong,
          }}
          title="Copy Git Clone Command"
        >
          {copiedClone ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-500">Copied URI</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Clone URI</span>
            </>
          )}
        </button>

        <a
          href={`https://github.com/${currentDetails.fullName}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg border opacity-80 hover:opacity-100 transition-colors flex items-center justify-center"
          style={{
            backgroundColor: currentTheme.palette.surfaceRaised,
            borderColor: currentTheme.palette.borderStrong,
          }}
          title="Open Repository on GitHub"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </aside>
  );
};
