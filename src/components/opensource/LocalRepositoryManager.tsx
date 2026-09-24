import React, { useState } from 'react';
import { 
  GitFork, Star, FolderGit2, ShieldCheck, CheckCircle2, AlertCircle, 
  ExternalLink, Plus, Search, Filter, Terminal, Sparkles, RefreshCw, 
  Layers, ArrowUpRight, Cpu, BookOpen, Clock, Tag
} from 'lucide-react';
import { useAdaptiveTheme } from '../../context/ThemeContext';

export interface ManagedRepo {
  id: string;
  name: string;
  owner: string;
  description: string;
  stars: number;
  forks: number;
  isStarred: boolean;
  isForked: boolean;
  forkBranch?: string;
  healthScore: number; // 0 - 100
  healthMetrics: {
    ciBuild: number;
    testCoverage: number;
    securityAudit: number;
    docQuality: number;
  };
  primaryLang: string;
  langColor: string;
  openIssues: number;
  lastCommit: string;
  tags: string[];
}

interface LocalRepositoryManagerProps {
  onSelectRepoForPR: (repoFullName: string) => void;
  selectedRepo: string;
}

const INITIAL_REPOSITORIES: ManagedRepo[] = [
  {
    id: 'repo-1',
    name: 'vllm',
    owner: 'vllm-project',
    description: 'High-throughput and memory-efficient LLM serving engine with PagedAttention v3 and tensor parallelism.',
    stars: 34200,
    forks: 5890,
    isStarred: true,
    isForked: true,
    forkBranch: 'apex/vla-kvcache-opt',
    healthScore: 96,
    healthMetrics: { ciBuild: 100, testCoverage: 94, securityAudit: 95, docQuality: 95 },
    primaryLang: 'Python / CUDA',
    langColor: '#3572A5',
    openIssues: 142,
    lastCommit: '12 mins ago (commit #8f92a1)',
    tags: ['Inference', 'CUDA', 'LLM', 'PagedAttention'],
  },
  {
    id: 'repo-2',
    name: 'transformers',
    owner: 'huggingface',
    description: 'State-of-the-art Machine Learning for PyTorch, TensorFlow, and JAX with 100k+ pretrained model architectures.',
    stars: 131500,
    forks: 26400,
    isStarred: true,
    isForked: false,
    healthScore: 92,
    healthMetrics: { ciBuild: 95, testCoverage: 91, securityAudit: 90, docQuality: 92 },
    primaryLang: 'Python',
    langColor: '#3572A5',
    openIssues: 420,
    lastCommit: '1 hour ago (commit #b4d1c9)',
    tags: ['NLP', 'Multi-Modal', 'Vision', 'PyTorch'],
  },
  {
    id: 'repo-3',
    name: 'pytorch',
    owner: 'pytorch',
    description: 'Tensors and Dynamic neural networks in Python with strong GPU acceleration and torch.compile inductor backends.',
    stars: 84900,
    forks: 22100,
    isStarred: false,
    isForked: false,
    healthScore: 94,
    healthMetrics: { ciBuild: 96, testCoverage: 95, securityAudit: 92, docQuality: 93 },
    primaryLang: 'C++ / Python',
    langColor: '#F34B7D',
    openIssues: 890,
    lastCommit: '3 hours ago (commit #3e810f)',
    tags: ['Deep Learning', 'Autograd', 'Distributed', 'GPU'],
  },
  {
    id: 'repo-4',
    name: 'triton',
    owner: 'openai',
    description: 'Development environment for parallel programming and custom GPU kernels with high-performance compiler backend.',
    stars: 15400,
    forks: 2100,
    isStarred: false,
    isForked: true,
    forkBranch: 'apex/flash-infer-triton',
    healthScore: 89,
    healthMetrics: { ciBuild: 90, testCoverage: 88, securityAudit: 88, docQuality: 90 },
    primaryLang: 'Python / C++',
    langColor: '#3572A5',
    openIssues: 88,
    lastCommit: '5 hours ago (commit #9a4c21)',
    tags: ['Compiler', 'GPU Kernel', 'LLVM', 'CUDA'],
  },
  {
    id: 'repo-5',
    name: 'DeepSeek-V3',
    owner: 'deepseek-ai',
    description: 'Ultra-scale Mixture-of-Experts (MoE) with Multi-Head Latent Attention (MLA) and FP8 mixed-precision training framework.',
    stars: 48900,
    forks: 7400,
    isStarred: true,
    isForked: false,
    healthScore: 91,
    healthMetrics: { ciBuild: 92, testCoverage: 89, securityAudit: 94, docQuality: 89 },
    primaryLang: 'Python / CUDA',
    langColor: '#3572A5',
    openIssues: 65,
    lastCommit: '8 hours ago (commit #7d2a55)',
    tags: ['MoE', 'MLA', 'FP8', 'OpenWeights'],
  },
  {
    id: 'repo-6',
    name: 'llama.cpp',
    owner: 'ggerganov',
    description: 'LLM inference in C/C++ with 1.5-bit to 8-bit quantization for CPU and Apple Silicon edge devices.',
    stars: 69800,
    forks: 10800,
    isStarred: false,
    isForked: false,
    healthScore: 88,
    healthMetrics: { ciBuild: 88, testCoverage: 85, securityAudit: 90, docQuality: 89 },
    primaryLang: 'C / C++',
    langColor: '#555555',
    openIssues: 210,
    lastCommit: '1 day ago (commit #1c55aa)',
    tags: ['Quantization', 'GGUF', 'Edge AI', 'Metal'],
  },
];

export const LocalRepositoryManager: React.FC<LocalRepositoryManagerProps> = ({
  onSelectRepoForPR,
  selectedRepo,
}) => {
  const { currentTheme } = useAdaptiveTheme();
  const [repositories, setRepositories] = useState<ManagedRepo[]>(INITIAL_REPOSITORIES);
  const [filterMode, setFilterMode] = useState<'all' | 'forked' | 'starred' | 'healthy'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [forkingRepoId, setForkingRepoId] = useState<string | null>(null);
  const [selectedRepoDetails, setSelectedRepoDetails] = useState<ManagedRepo | null>(null);
  const [isDiagnosingHealth, setIsDiagnosingHealth] = useState(false);

  // Toggle Star
  const handleToggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRepositories(prev => prev.map(repo => {
      if (repo.id === id) {
        const nextStarred = !repo.isStarred;
        return {
          ...repo,
          isStarred: nextStarred,
          stars: nextStarred ? repo.stars + 1 : repo.stars - 1,
        };
      }
      return repo;
    }));
  };

  // Simulated Fork Workflow
  const handleForkRepo = (repo: ManagedRepo, e: React.MouseEvent) => {
    e.stopPropagation();
    if (repo.isForked) return;

    setForkingRepoId(repo.id);
    setTimeout(() => {
      setRepositories(prev => prev.map(r => {
        if (r.id === repo.id) {
          return {
            ...r,
            isForked: true,
            forks: r.forks + 1,
            forkBranch: `apex/${r.name}-workspace`,
          };
        }
        return r;
      }));
      setForkingRepoId(null);
    }, 700);
  };

  // Run Health Optimization Diagnostic
  const handleRunHealthCheck = (repoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDiagnosingHealth(true);
    setTimeout(() => {
      setRepositories(prev => prev.map(r => {
        if (r.id === repoId) {
          const boostedScore = Math.min(99, r.healthScore + 3);
          return {
            ...r,
            healthScore: boostedScore,
            healthMetrics: {
              ciBuild: 100,
              testCoverage: Math.min(100, r.healthMetrics.testCoverage + 4),
              securityAudit: 100,
              docQuality: Math.min(100, r.healthMetrics.docQuality + 2),
            },
          };
        }
        return r;
      }));
      setIsDiagnosingHealth(false);
    }, 800);
  };

  // Filtered List
  const filteredRepos = repositories.filter(repo => {
    const matchesSearch = 
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterMode === 'forked') return repo.isForked;
    if (filterMode === 'starred') return repo.isStarred;
    if (filterMode === 'healthy') return repo.healthScore >= 92;
    return true;
  });

  const getHealthColor = (score: number) => {
    if (score >= 92) return { bg: 'bg-emerald-500', text: 'text-emerald-500', badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' };
    if (score >= 80) return { bg: 'bg-blue-500', text: 'text-blue-500', badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30' };
    return { bg: 'bg-amber-500', text: 'text-amber-500', badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' };
  };

  return (
    <div 
      className="border rounded-2xl p-6 shadow-sm space-y-6 transition-colors"
      style={{
        backgroundColor: currentTheme.palette.surface,
        borderColor: currentTheme.palette.border,
        color: currentTheme.palette.textPrimary,
      }}
    >
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b"
        style={{ borderColor: currentTheme.palette.border }}
      >
        <div className="flex items-center space-x-3">
          <div 
            className="w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.borderStrong,
              color: currentTheme.palette.accent,
            }}
          >
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-base sm:text-lg tracking-tight">Simulated Open-Source Local Repository Hub</h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                ● Git Workspace Sync Active
              </span>
            </div>
            <p className="text-xs opacity-70">Fork, star, and track health telemetry across top AI model architectures and compiler runtimes</p>
          </div>
        </div>

        {/* Global Action Stats */}
        <div className="flex flex-wrap items-center gap-2">
          <div 
            className="px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center space-x-3"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.border,
            }}
          >
            <span className="flex items-center space-x-1">
              <GitFork className="w-3.5 h-3.5 text-blue-500" />
              <span>Forks: <strong>{repositories.filter(r => r.isForked).length}</strong></span>
            </span>
            <span className="opacity-30">|</span>
            <span className="flex items-center space-x-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Starred: <strong>{repositories.filter(r => r.isStarred).length}</strong></span>
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 opacity-50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search open-source repositories by name, language, tag..."
            className="w-full pl-9 pr-4 py-2 rounded-lg text-xs font-mono border transition-colors focus:outline-none"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.border,
              color: currentTheme.palette.textPrimary,
            }}
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Projects', count: repositories.length },
            { id: 'forked', label: 'My Forks', count: repositories.filter(r => r.isForked).length },
            { id: 'starred', label: 'Starred', count: repositories.filter(r => r.isStarred).length },
            { id: 'healthy', label: 'High Health (>92%)', count: repositories.filter(r => r.healthScore >= 92).length },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterMode(f.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border shrink-0 flex items-center space-x-1.5 ${
                filterMode === f.id
                  ? 'font-bold shadow-2xs'
                  : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: filterMode === f.id ? currentTheme.palette.surfaceRaised : 'transparent',
                borderColor: filterMode === f.id ? currentTheme.palette.accent : currentTheme.palette.border,
                color: filterMode === f.id ? currentTheme.palette.accent : currentTheme.palette.textPrimary,
              }}
            >
              <span>{f.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full opacity-80" style={{ backgroundColor: `${currentTheme.palette.borderStrong}` }}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Repositories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRepos.map((repo) => {
          const isSelected = selectedRepo === `${repo.owner}/${repo.name}`;
          const healthStyle = getHealthColor(repo.healthScore);
          const isForking = forkingRepoId === repo.id;

          return (
            <div
              key={repo.id}
              onClick={() => onSelectRepoForPR(`${repo.owner}/${repo.name}`)}
              className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 group relative ${
                isSelected 
                  ? 'shadow-md scale-[1.01]' 
                  : 'hover:scale-[1.005] shadow-xs'
              }`}
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: isSelected ? currentTheme.palette.accent : currentTheme.palette.border,
              }}
            >
              {/* Top Row: Owner/Name, Star & Fork Buttons */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: repo.langColor }} />
                    <h4 className="font-bold text-sm font-mono tracking-tight group-hover:underline">
                      <span className="opacity-60">{repo.owner}/</span>
                      <span style={{ color: currentTheme.palette.accent }}>{repo.name}</span>
                    </h4>
                  </div>

                  {/* Interactive Star & Fork Quick Action Buttons */}
                  <div className="flex items-center space-x-1">
                    {/* Star Button */}
                    <button
                      onClick={(e) => handleToggleStar(repo.id, e)}
                      className={`p-1.5 rounded-md border text-xs font-mono transition-all flex items-center space-x-1 ${
                        repo.isStarred 
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      style={!repo.isStarred ? { backgroundColor: currentTheme.palette.surface, borderColor: currentTheme.palette.border } : {}}
                      title={repo.isStarred ? 'Unstar repo' : 'Star repo'}
                    >
                      <Star className={`w-3.5 h-3.5 ${repo.isStarred ? 'fill-amber-500 text-amber-500' : ''}`} />
                      <span className="text-[11px] font-bold">{repo.stars.toLocaleString()}</span>
                    </button>

                    {/* Fork Button */}
                    <button
                      onClick={(e) => handleForkRepo(repo, e)}
                      disabled={repo.isForked || isForking}
                      className={`p-1.5 rounded-md border text-xs font-mono transition-all flex items-center space-x-1 ${
                        repo.isForked 
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      style={!repo.isForked ? { backgroundColor: currentTheme.palette.surface, borderColor: currentTheme.palette.border } : {}}
                      title={repo.isForked ? `Forked at ${repo.forkBranch}` : 'Fork repo to local workspace'}
                    >
                      {isForking ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
                      ) : (
                        <GitFork className="w-3.5 h-3.5" />
                      )}
                      <span className="text-[11px] font-bold">{repo.forks.toLocaleString()}</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs opacity-75 line-clamp-2 leading-relaxed mb-3">
                  {repo.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {repo.tags.map((tag, i) => (
                    <span 
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-mono border opacity-80"
                      style={{
                        backgroundColor: currentTheme.palette.surface,
                        borderColor: currentTheme.palette.border,
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Row: Repository Health Visual Progress Bar & Branch */}
              <div className="space-y-3 pt-3 border-t" style={{ borderColor: currentTheme.palette.border }}>
                {/* Health Progress Indicator */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="opacity-70 flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Repository Health:</span>
                    </span>
                    <span className={`font-bold ${healthStyle.text}`}>
                      {repo.healthScore}% Optimal
                    </span>
                  </div>

                  {/* Multi-Segment Health Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden relative">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${healthStyle.bg}`}
                      style={{ width: `${repo.healthScore}%` }}
                    />
                  </div>

                  {/* Micro-metrics below progress bar */}
                  <div className="flex justify-between text-[10px] font-mono opacity-60">
                    <span>CI: {repo.healthMetrics.ciBuild}%</span>
                    <span>Tests: {repo.healthMetrics.testCoverage}%</span>
                    <span>Sec: {repo.healthMetrics.securityAudit}%</span>
                    <span>Docs: {repo.healthMetrics.docQuality}%</span>
                  </div>
                </div>

                {/* Fork Status Pill or Select Button */}
                <div className="flex items-center justify-between pt-1">
                  {repo.isForked ? (
                    <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded flex items-center space-x-1 truncate max-w-[170px]">
                      <GitFork className="w-3 h-3 shrink-0" />
                      <span className="truncate">{repo.forkBranch}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono opacity-50">
                      Upstream main
                    </span>
                  )}

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => handleRunHealthCheck(repo.id, e)}
                      disabled={isDiagnosingHealth}
                      className="px-2 py-1 rounded text-[10px] font-mono font-bold border transition-colors opacity-70 hover:opacity-100"
                      style={{
                        backgroundColor: currentTheme.palette.surface,
                        borderColor: currentTheme.palette.border,
                      }}
                      title="Run automated health diagnostic check"
                    >
                      Audit
                    </button>
                    <button
                      onClick={() => onSelectRepoForPR(`${repo.owner}/${repo.name}`)}
                      className="px-2.5 py-1 rounded text-[10px] font-mono font-bold text-white transition-colors"
                      style={{ backgroundColor: currentTheme.palette.accent }}
                    >
                      {isSelected ? 'Selected' : 'Use in PR'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
