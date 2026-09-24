import React, { useState, useMemo, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { 
  BookOpen, FileText, Code2, Copy, Check, Search, 
  ExternalLink, Clock, Layers, Sparkles, ChevronDown, 
  ChevronUp, Terminal, Cpu, ArrowUpRight, Hash, Eye,
  Play, RotateCcw, Download, GitBranch, Star, GitFork,
  Shield, CheckSquare, Square, Edit3, SplitSquareVertical,
  UploadCloud, AlertCircle, Trash2, Plus, Info, CheckCircle2
} from 'lucide-react';
import { useAdaptiveTheme } from '../../context/ThemeContext';
import { MOCK_README_MAP, RepoReadme } from '../../data/mockReadmeData';

interface ReadmeViewerCardProps {
  selectedRepo: string;
  onSelectRepo?: (repo: string) => void;
  liveMarkdown?: string;
  isLiveSynced?: boolean;
  onMarkdownChange?: (markdown: string) => void;
}

interface SandboxExecutionResult {
  codeId: string;
  status: 'running' | 'success' | 'failed';
  command: string;
  output: string[];
  executionTimeMs: number;
  memoryMb: number;
}

export const ReadmeViewerCard: React.FC<ReadmeViewerCardProps> = ({
  selectedRepo,
  onSelectRepo,
  liveMarkdown,
  isLiveSynced,
  onMarkdownChange,
}) => {
  const { currentTheme } = useAdaptiveTheme();
  
  // Interactive view modes: 'preview' (rendered), 'split' (side-by-side editor), 'raw' (plain text)
  const [viewMode, setViewMode] = useState<'preview' | 'split' | 'raw'>('preview');
  
  // Editable markdown buffer initialized from props or mock
  const [currentMarkdown, setCurrentMarkdown] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('main');
  const [isStarred, setIsStarred] = useState<boolean>(false);
  const [starCount, setStarCount] = useState<number>(48210);
  const [forkCount, setForkCount] = useState<number>(6430);
  const [isForked, setIsForked] = useState<boolean>(false);

  // Search & Navigation
  const [headingSearch, setHeadingSearch] = useState<string>('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Interactive Code Execution Sandbox Results
  const [executionResults, setExecutionResults] = useState<Record<string, SandboxExecutionResult>>({});
  
  // Interactive Badge & Shield Generator Drawer
  const [showBadgeGenerator, setShowBadgeGenerator] = useState<boolean>(false);
  const [badgeLabel, setBadgeLabel] = useState<string>('Production');
  const [badgeMessage, setBadgeMessage] = useState<string>('Verified-v3.8');
  const [badgeColor, setBadgeColor] = useState<string>('emerald');

  // Interactive Commit Modal
  const [showCommitModal, setShowCommitModal] = useState<boolean>(false);
  const [commitMessage, setCommitMessage] = useState<string>('docs: update production readiness checklist & benchmarks');
  const [commitStatus, setCommitStatus] = useState<'idle' | 'committing' | 'committed'>('idle');

  // Textarea Ref for toolbar injections
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Retrieve base markdown
  const defaultReadme: RepoReadme = useMemo(() => {
    if (liveMarkdown && liveMarkdown.trim().length > 0) {
      return {
        repoName: selectedRepo,
        lastUpdated: 'Live synced from GitHub main branch',
        estimatedReadTime: `${Math.max(1, Math.round(liveMarkdown.split(/\s+/).length / 200))} min read`,
        markdown: liveMarkdown,
      };
    }
    return MOCK_README_MAP[selectedRepo] || MOCK_README_MAP['vllm-project/vllm'];
  }, [selectedRepo, liveMarkdown]);

  // Sync internal markdown when repository changes
  useEffect(() => {
    setCurrentMarkdown(defaultReadme.markdown);
  }, [defaultReadme]);

  // Notify parent on change if handler provided
  const handleMarkdownEdit = (newText: string) => {
    setCurrentMarkdown(newText);
    onMarkdownChange?.(newText);
  };

  // Reset to original upstream
  const handleResetToUpstream = () => {
    setCurrentMarkdown(defaultReadme.markdown);
    onMarkdownChange?.(defaultReadme.markdown);
  };

  // Extract headings for quick-navigation table of contents
  const headings = useMemo(() => {
    const lines = currentMarkdown.split('\n');
    const list: Array<{ level: number; text: string; id: string }> = [];
    lines.forEach((line) => {
      if (line.startsWith('# ')) {
        const text = line.replace('# ', '').trim();
        list.push({ level: 1, text, id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-') });
      } else if (line.startsWith('## ')) {
        const text = line.replace('## ', '').trim();
        list.push({ level: 2, text, id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-') });
      } else if (line.startsWith('### ')) {
        const text = line.replace('### ', '').trim();
        list.push({ level: 3, text, id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-') });
      }
    });
    return list;
  }, [currentMarkdown]);

  // Filtered headings for search
  const filteredHeadings = useMemo(() => {
    if (!headingSearch.trim()) return headings;
    return headings.filter(h => h.text.toLowerCase().includes(headingSearch.toLowerCase()));
  }, [headings, headingSearch]);

  // Interactive Task List Progress Counter
  const taskStats = useMemo(() => {
    const checked = (currentMarkdown.match(/- \[[xX]\]/g) || []).length;
    const unchecked = (currentMarkdown.match(/- \[ \]/g) || []).length;
    const total = checked + unchecked;
    const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
    return { checked, unchecked, total, pct };
  }, [currentMarkdown]);

  // Word count & read time
  const docMetrics = useMemo(() => {
    const words = currentMarkdown.split(/\s+/).filter(Boolean).length;
    const readTimeMin = Math.max(1, Math.round(words / 200));
    const codeBlocks = (currentMarkdown.match(/```/g) || []).length / 2;
    return { words, readTimeMin, codeBlocks: Math.floor(codeBlocks) };
  }, [currentMarkdown]);

  // Copy raw markdown to clipboard
  const handleCopyAll = () => {
    navigator.clipboard.writeText(currentMarkdown);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  // Download README.md as local file
  const handleDownloadReadme = () => {
    const blob = new Blob([currentMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedRepo.replace('/', '_')}_README.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Star / Fork click handlers
  const handleToggleStar = () => {
    setIsStarred(prev => {
      const next = !prev;
      setStarCount(c => next ? c + 1 : c - 1);
      return next;
    });
  };

  const handleToggleFork = () => {
    setIsForked(prev => {
      const next = !prev;
      setForkCount(c => next ? c + 1 : c - 1);
      return next;
    });
  };

  // Interactive Task Item Toggle in Markdown
  const handleToggleTaskItem = (taskText: string, currentChecked: boolean) => {
    const escapedText = taskText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const oldPattern = currentChecked ? `- [x] ${escapedText}` : `- [ ] ${escapedText}`;
    const newPattern = currentChecked ? `- [ ] ${taskText}` : `- [x] ${taskText}`;
    
    if (currentMarkdown.includes(oldPattern)) {
      const updated = currentMarkdown.replace(oldPattern, newPattern);
      handleMarkdownEdit(updated);
    } else {
      // Alternate matching without space variations
      const altOld = currentChecked ? `- [X] ${escapedText}` : `- [ ] ${escapedText}`;
      const updated = currentMarkdown.replace(new RegExp(altOld), newPattern);
      handleMarkdownEdit(updated);
    }
  };

  // Execute Code Block in Simulated Sandbox
  const handleRunCodeSnippet = (codeId: string, codeContent: string, lang: string) => {
    setExecutionResults(prev => ({
      ...prev,
      [codeId]: {
        codeId,
        status: 'running',
        command: lang === 'bash' ? `$ bash script.sh` : `$ python3 runner.py`,
        output: [
          `[Sandbox Runtime] Allocating isolated container for ${selectedRepo}...`,
          `[Environment] Python 3.12.3 • PyTorch 2.6.0+cu128 • Triton 3.2.0`,
          `[Hardware] 8x NVIDIA H100 SXM5 80GB (PCIe gen5, NVLink 900 GB/s)`,
        ],
        executionTimeMs: 0,
        memoryMb: 0,
      }
    }));

    // Simulate execution settling
    setTimeout(() => {
      const isPython = lang.includes('python') || codeContent.includes('import');
      const sampleOutputs = isPython ? [
        `[PyTorch Hub] Initialized CUDA context on device:0 (NVIDIA H100 SXM5)`,
        `[vLLM Serving Core] Initializing PagedAttention v3 with 0-copy ring buffer...`,
        `[KV-Cache Allocator] Reserved 22.4 GB block memory pool (92.0% utilization)`,
        `[Inference Engine] Warming up kernel warmup passes (16 iterations)...`,
        `[STDOUT] Prompt processed: 'Explain quantum superposition in 3 concise bullet points:'`,
        `[STDOUT] Tokens generated: 142 tokens | TTFT: 18.2 ms | Inter-token: 2.1 ms`,
        `[STDOUT] Peak throughput: 1,840.4 tokens/sec (4.38x baseline speedup)`,
        `>>> Process finished with exit code 0 (success)`
      ] : [
        `[Pip Installer] Collecting vllm torch>=2.5.0...`,
        `[Dependencies] Downloading torch-2.6.0+cu128-cp312-manylinux2014_x86_64.whl (2.4 GB)`,
        `[CUDA Toolkit] Verified libcuda.so.1 compatibility with CUDA 12.8 driver`,
        `[Build Wheel] Installing custom flash_attn_v3_kernel extension...`,
        `[Verification] Successfully installed vllm-0.8.2 torch-2.6.0 triton-3.2.0`,
        `>>> Exit code 0 (Installed in 412ms via cache)`
      ];

      setExecutionResults(prev => ({
        ...prev,
        [codeId]: {
          codeId,
          status: 'success',
          command: isPython ? `$ python3 runner.py` : `$ bash setup.sh`,
          output: [
            `[Sandbox Runtime] Allocating isolated container for ${selectedRepo}...`,
            `[Environment] Python 3.12.3 • PyTorch 2.6.0+cu128 • Triton 3.2.0`,
            `[Hardware] 8x NVIDIA H100 SXM5 80GB (PCIe gen5, NVLink 900 GB/s)`,
            ...sampleOutputs
          ],
          executionTimeMs: Math.floor(Math.random() * 300 + 120),
          memoryMb: Math.floor(Math.random() * 800 + 1400),
        }
      }));
    }, 1200);
  };

  const handleClearCodeOutput = (codeId: string) => {
    setExecutionResults(prev => {
      const copy = { ...prev };
      delete copy[codeId];
      return copy;
    });
  };

  // Editor Toolbar helper
  const insertTextAtCursor = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = currentMarkdown.substring(start, end);
    const replacement = `${before}${selected || 'text'}${after}`;
    const newContent = currentMarkdown.substring(0, start) + replacement + currentMarkdown.substring(end);
    
    handleMarkdownEdit(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + (selected.length || 4));
    }, 10);
  };

  // Insert Generated Shield into Markdown
  const handleInsertShield = () => {
    const shieldMarkdown = `[![${badgeLabel}](https://img.shields.io/badge/${encodeURIComponent(badgeLabel)}-${encodeURIComponent(badgeMessage)}-${badgeColor}.svg)](https://github.com/${selectedRepo})\n`;
    handleMarkdownEdit(shieldMarkdown + currentMarkdown);
    setShowBadgeGenerator(false);
  };

  // Handle Commit to GitHub
  const handleCommitSubmit = () => {
    setCommitStatus('committing');
    setTimeout(() => {
      setCommitStatus('committed');
      setTimeout(() => {
        setCommitStatus('idle');
        setShowCommitModal(false);
      }, 1500);
    }, 1000);
  };

  return (
    <div 
      className="border rounded-2xl shadow-sm overflow-hidden transition-all duration-300 flex flex-col"
      style={{
        backgroundColor: currentTheme.palette.surface,
        borderColor: currentTheme.palette.border,
        color: currentTheme.palette.textPrimary,
      }}
      aria-label="Interactive GitHub README Studio"
    >
      {/* 1. GitHub Authentic Repository Bar & Navigation */}
      <div 
        className="p-4 sm:p-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ 
          backgroundColor: currentTheme.palette.surfaceRaised,
          borderColor: currentTheme.palette.border 
        }}
      >
        {/* Left: Breadcrumbs, Branch Selector & File Metadata */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono">
          <div className="flex items-center space-x-1.5 opacity-70">
            <BookOpen className="w-4 h-4" style={{ color: currentTheme.palette.accent }} />
            <span className="font-sans font-semibold">github.com</span>
            <span>/</span>
            <span className="font-semibold">{selectedRepo.split('/')[0]}</span>
            <span>/</span>
            <span className="font-bold text-sm" style={{ color: currentTheme.palette.accent }}>
              {selectedRepo.split('/')[1]}
            </span>
          </div>

          <span className="opacity-30">/</span>

          {/* Interactive Branch Switcher */}
          <div className="relative inline-flex items-center">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-2.5 py-1 rounded-lg border text-xs font-mono font-semibold transition-colors focus:outline-none cursor-pointer flex items-center space-x-1"
              style={{
                backgroundColor: currentTheme.palette.surface,
                borderColor: currentTheme.palette.borderStrong,
                color: currentTheme.palette.textPrimary,
              }}
            >
              <option value="main">🌿 main</option>
              <option value="dev">🌿 dev</option>
              <option value="v3.8-release">🏷️ v3.8-release</option>
              <option value="feature/vla-sharding">🌿 feature/vla-sharding</option>
            </select>
          </div>

          <span className="opacity-30">/</span>
          <span className="font-bold font-mono px-2 py-0.5 rounded border text-[11px]"
            style={{
              backgroundColor: currentTheme.palette.surface,
              borderColor: currentTheme.palette.border,
            }}
          >
            README.md
          </span>
        </div>

        {/* Right: GitHub Social & Repo Actions (Star, Fork, Commit, Download) */}
        <div className="flex items-center flex-wrap gap-2 text-xs font-mono">
          {/* Star Button */}
          <button
            onClick={handleToggleStar}
            className={`px-3 py-1.5 rounded-lg border transition-all flex items-center space-x-1.5 cursor-pointer ${
              isStarred ? 'bg-amber-500/15 text-amber-500 border-amber-500/30 font-bold' : 'hover:opacity-100 opacity-80'
            }`}
            style={!isStarred ? {
              backgroundColor: currentTheme.palette.surface,
              borderColor: currentTheme.palette.border,
            } : undefined}
            title={isStarred ? 'Starred' : 'Star on GitHub'}
          >
            <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>{isStarred ? 'Starred' : 'Star'}</span>
            <span className="opacity-50">·</span>
            <span className="tabular-nums font-bold">{starCount.toLocaleString()}</span>
          </button>

          {/* Fork Button */}
          <button
            onClick={handleToggleFork}
            className={`px-3 py-1.5 rounded-lg border transition-all flex items-center space-x-1.5 cursor-pointer ${
              isForked ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30 font-bold' : 'hover:opacity-100 opacity-80'
            }`}
            style={!isForked ? {
              backgroundColor: currentTheme.palette.surface,
              borderColor: currentTheme.palette.border,
            } : undefined}
            title="Fork Repository"
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>{isForked ? 'Forked' : 'Fork'}</span>
            <span className="opacity-50">·</span>
            <span className="tabular-nums font-bold">{forkCount.toLocaleString()}</span>
          </button>

          {/* Badge Generator Modal Trigger */}
          <button
            onClick={() => setShowBadgeGenerator(!showBadgeGenerator)}
            className="px-3 py-1.5 rounded-lg border transition-all flex items-center space-x-1.5 hover:opacity-100 opacity-80 cursor-pointer"
            style={{
              backgroundColor: currentTheme.palette.surface,
              borderColor: currentTheme.palette.border,
            }}
            title="Design & insert GitHub shields"
          >
            <Shield className="w-3.5 h-3.5 text-blue-500" />
            <span>Shields</span>
          </button>

          {/* Commit Button */}
          <button
            onClick={() => setShowCommitModal(true)}
            className="px-3 py-1.5 rounded-lg text-white font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs hover:opacity-90"
            style={{ backgroundColor: currentTheme.palette.accent }}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Commit</span>
          </button>

          {/* Download Raw README */}
          <button
            onClick={handleDownloadReadme}
            className="p-1.5 rounded-lg border transition-all hover:opacity-100 opacity-70 cursor-pointer"
            style={{
              backgroundColor: currentTheme.palette.surface,
              borderColor: currentTheme.palette.border,
            }}
            title="Download README.md"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Collapse/Expand */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg border transition-all hover:opacity-100 opacity-70 cursor-pointer"
            style={{
              backgroundColor: currentTheme.palette.surface,
              borderColor: currentTheme.palette.border,
            }}
            title={isExpanded ? 'Collapse README' : 'Expand README'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. Interactive Commit Metadata Banner */}
      {isExpanded && (
        <div 
          className="px-5 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 text-xs font-mono"
          style={{ 
            backgroundColor: currentTheme.palette.surface,
            borderColor: currentTheme.palette.border 
          }}
        >
          <div className="flex items-center space-x-2.5">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 flex items-center justify-center font-bold text-[10px]">
              GA
            </div>
            <span className="font-bold opacity-90">@gambit-atoms-core</span>
            <span className="opacity-50 truncate max-w-md hidden sm:inline">
              perf(paged-attn): fuse chunked KV projection with Triton 3.2 kernel
            </span>
          </div>

          <div className="flex items-center space-x-4 opacity-70 text-[11px]">
            <span>commit <code className="font-bold px-1 rounded bg-black/5 dark:bg-white/5">8f92a1d</code></span>
            <span>·</span>
            <span>{defaultReadme.lastUpdated}</span>
            <span>·</span>
            <span>{(new Blob([currentMarkdown]).size / 1024).toFixed(1)} KB</span>
          </div>
        </div>
      )}

      {/* 3. Interactive Mode Switcher & Metric Ribbon */}
      {isExpanded && (
        <div 
          className="px-5 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 text-xs font-mono"
          style={{ 
            backgroundColor: currentTheme.palette.surfaceRaised,
            borderColor: currentTheme.palette.border 
          }}
        >
          {/* Segmented View Mode Tabs */}
          <div 
            className="flex items-center p-1 rounded-lg border"
            style={{
              backgroundColor: currentTheme.palette.surface,
              borderColor: currentTheme.palette.border,
            }}
          >
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 rounded-md transition-all flex items-center space-x-1.5 cursor-pointer ${
                viewMode === 'preview' ? 'font-bold shadow-2xs' : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                backgroundColor: viewMode === 'preview' ? currentTheme.palette.surfaceRaised : 'transparent',
                color: viewMode === 'preview' ? currentTheme.palette.accent : currentTheme.palette.textPrimary,
              }}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>

            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1 rounded-md transition-all flex items-center space-x-1.5 cursor-pointer ${
                viewMode === 'split' ? 'font-bold shadow-2xs' : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                backgroundColor: viewMode === 'split' ? currentTheme.palette.surfaceRaised : 'transparent',
                color: viewMode === 'split' ? currentTheme.palette.accent : currentTheme.palette.textPrimary,
              }}
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span>Split Editor</span>
            </button>

            <button
              onClick={() => setViewMode('raw')}
              className={`px-3 py-1 rounded-md transition-all flex items-center space-x-1.5 cursor-pointer ${
                viewMode === 'raw' ? 'font-bold shadow-2xs' : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                backgroundColor: viewMode === 'raw' ? currentTheme.palette.surfaceRaised : 'transparent',
                color: viewMode === 'raw' ? currentTheme.palette.accent : currentTheme.palette.textPrimary,
              }}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Raw Markdown</span>
            </button>
          </div>

          {/* Interactive Task Completion Counter & Metrics */}
          <div className="flex items-center space-x-4">
            {taskStats.total > 0 && (
              <div className="flex items-center space-x-2 text-xs">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold opacity-80">Tasks:</span>
                <span className="font-bold tabular-nums">
                  {taskStats.checked}/{taskStats.total}
                </span>
                <div 
                  className="w-16 h-1.5 rounded-full overflow-hidden bg-black/10 dark:bg-white/10"
                >
                  <div 
                    className="h-full bg-emerald-400 rounded-full transition-all"
                    style={{ width: `${taskStats.pct}%` }}
                  />
                </div>
                <span className="text-[11px] opacity-60">({taskStats.pct}%)</span>
              </div>
            )}

            <div className="hidden sm:flex items-center space-x-3 opacity-60 text-[11px]">
              <span>{docMetrics.words} words</span>
              <span>·</span>
              <span>{docMetrics.readTimeMin} min read</span>
              <span>·</span>
              <span>{docMetrics.codeBlocks} runnable code blocks</span>
            </div>

            {/* Quick Copy Markdown */}
            <button
              onClick={handleCopyAll}
              className="px-2.5 py-1 rounded-md border text-xs font-mono flex items-center space-x-1 transition-colors opacity-80 hover:opacity-100 cursor-pointer"
              style={{
                backgroundColor: currentTheme.palette.surface,
                borderColor: currentTheme.palette.border,
              }}
              title="Copy markdown text"
            >
              {copiedAll ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-500 font-bold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 4. Interactive Shield & Badge Generator Drawer */}
      {showBadgeGenerator && isExpanded && (
        <div 
          className="p-5 border-b space-y-4 text-xs animate-fadeIn"
          style={{
            backgroundColor: currentTheme.palette.surface,
            borderColor: currentTheme.palette.border,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 font-mono font-bold">
              <Shield className="w-4 h-4 text-blue-500" />
              <span>Interactive GitHub Shield Generator</span>
            </div>
            <button 
              onClick={() => setShowBadgeGenerator(false)}
              className="text-xs opacity-60 hover:opacity-100 cursor-pointer"
            >
              Close
            </button>
          </div>

          {/* Presets Grid */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'CI Status', msg: 'passing', color: 'emerald' },
              { label: 'License', msg: 'Apache-2.0', color: 'blue' },
              { label: 'PyTorch', msg: '2.6', color: 'red' },
              { label: 'CUDA', msg: '12.4 | 12.8', color: 'purple' },
              { label: 'Coverage', msg: '98.4%', color: 'brightgreen' },
              { label: 'Throughput', msg: '1,840 tok/s', color: 'orange' },
              { label: 'Blackwell', msg: 'FP4 Ready', color: 'teal' },
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setBadgeLabel(preset.label);
                  setBadgeMessage(preset.msg);
                  setBadgeColor(preset.color);
                }}
                className="px-2.5 py-1 rounded-md border text-[11px] font-mono hover:border-current cursor-pointer"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.border,
                }}
              >
                {preset.label}: {preset.msg}
              </button>
            ))}
          </div>

          {/* Custom Shield Builder */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
            <div>
              <label className="block text-[10px] font-mono opacity-60 uppercase mb-1">Left Label</label>
              <input 
                type="text"
                value={badgeLabel}
                onChange={(e) => setBadgeLabel(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-md border text-xs font-mono"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.border,
                  color: currentTheme.palette.textPrimary,
                }}
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono opacity-60 uppercase mb-1">Right Status</label>
              <input 
                type="text"
                value={badgeMessage}
                onChange={(e) => setBadgeMessage(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-md border text-xs font-mono"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.border,
                  color: currentTheme.palette.textPrimary,
                }}
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono opacity-60 uppercase mb-1">Color Style</label>
              <select
                value={badgeColor}
                onChange={(e) => setBadgeColor(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-md border text-xs font-mono cursor-pointer"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.border,
                  color: currentTheme.palette.textPrimary,
                }}
              >
                <option value="emerald">Emerald / Green</option>
                <option value="blue">Blue</option>
                <option value="purple">Purple</option>
                <option value="red">Red</option>
                <option value="orange">Orange</option>
                <option value="black">Black / Neutral</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleInsertShield}
                className="w-full px-4 py-1.5 rounded-md text-white font-bold text-xs font-mono flex items-center justify-center space-x-1 cursor-pointer"
                style={{ backgroundColor: currentTheme.palette.accent }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Insert Shield</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Main Content Area: Preview vs Split vs Raw */}
      {isExpanded && (
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          
          {/* Quick-Jump Table of Contents & Navigation Sidebar (3 cols) */}
          <div 
            className="lg:col-span-3 p-4 sm:p-5 border-b lg:border-b-0 lg:border-r space-y-4 text-xs font-mono flex flex-col justify-between"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.border,
            }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider opacity-70 text-[11px] flex items-center space-x-1.5">
                  <Hash className="w-3.5 h-3.5" style={{ color: currentTheme.palette.accent }} />
                  <span>Document Outline</span>
                </span>
                <span className="text-[10px] opacity-50">{headings.length} sections</span>
              </div>

              {/* Heading Search Input */}
              <div className="relative">
                <Search className="w-3 h-3 absolute left-2.5 top-2.5 opacity-50" />
                <input
                  type="text"
                  value={headingSearch}
                  onChange={(e) => setHeadingSearch(e.target.value)}
                  placeholder="Filter sections..."
                  className="w-full pl-7 pr-2.5 py-1.5 rounded-lg border text-[11px] font-mono focus:outline-none"
                  style={{
                    backgroundColor: currentTheme.palette.surface,
                    borderColor: currentTheme.palette.border,
                    color: currentTheme.palette.textPrimary,
                  }}
                />
              </div>

              {/* Headings List with Anchor Jump */}
              <nav className="space-y-1 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
                {filteredHeadings.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const el = document.getElementById(h.id);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                        el.classList.add('ring-2', 'ring-emerald-400');
                        setTimeout(() => el.classList.remove('ring-2', 'ring-emerald-400'), 1200);
                      }
                    }}
                    className={`w-full text-left py-1.5 px-2 rounded transition-colors text-[11px] truncate opacity-75 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer ${
                      h.level === 1 ? 'font-bold' : h.level === 2 ? 'pl-3 font-semibold' : 'pl-5 opacity-60'
                    }`}
                    style={{
                      color: h.level === 1 ? currentTheme.palette.accent : currentTheme.palette.textPrimary,
                    }}
                  >
                    {h.text}
                  </button>
                ))}

                {filteredHeadings.length === 0 && (
                  <div className="py-4 text-center opacity-50 text-[11px]">
                    No sections matching "{headingSearch}"
                  </div>
                )}
              </nav>
            </div>

            {/* Quick Actions at bottom of sidebar */}
            <div className="pt-4 border-t space-y-2 text-[11px]" style={{ borderColor: currentTheme.palette.border }}>
              <div className="flex items-center justify-between opacity-70">
                <span>Repository upstream:</span>
                <span className="font-bold text-emerald-500">Live Synced</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleResetToUpstream}
                  className="w-full py-1.5 rounded border flex items-center justify-center space-x-1 opacity-70 hover:opacity-100 cursor-pointer"
                  style={{
                    backgroundColor: currentTheme.palette.surface,
                    borderColor: currentTheme.palette.border,
                  }}
                  title="Revert edits to upstream original"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Revert Edits</span>
                </button>
              </div>
            </div>
          </div>

          {/* Viewport: Preview / Split / Raw (9 cols) */}
          <div className="lg:col-span-9 flex flex-col">

            {/* Mode 1: Pure Rendered GitHub Preview */}
            {viewMode === 'preview' && (
              <div 
                ref={previewContainerRef}
                className="p-6 sm:p-8 max-h-[640px] overflow-y-auto space-y-4"
              >
                <Markdown
                  components={{
                    h1: ({ children }) => {
                      const text = String(children);
                      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                      return (
                        <h1 
                          id={id}
                          className="text-2xl sm:text-3xl font-extrabold tracking-tight pb-3 border-b mb-4 flex items-center gap-2 transition-all rounded-lg"
                          style={{ borderColor: currentTheme.palette.border }}
                        >
                          {children}
                        </h1>
                      );
                    },
                    h2: ({ children }) => {
                      const text = String(children);
                      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                      return (
                        <h2 
                          id={id}
                          className="text-xl sm:text-2xl font-bold tracking-tight mt-6 mb-3 flex items-center gap-2 transition-all rounded-lg"
                          style={{ color: currentTheme.palette.textPrimary }}
                        >
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children }) => {
                      const text = String(children);
                      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                      return (
                        <h3 
                          id={id}
                          className="text-base sm:text-lg font-bold mt-4 mb-2 opacity-90 transition-all rounded-lg"
                        >
                          {children}
                        </h3>
                      );
                    },
                    p: ({ children }) => (
                      <p className="text-sm leading-relaxed opacity-85 my-2">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc pl-5 space-y-1.5 text-sm opacity-85 my-3">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-5 space-y-1.5 text-sm opacity-85 my-3">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => {
                      // Check if this list item contains an interactive task checkbox
                      const contentString = String(children);
                      const isTaskCheck = contentString.startsWith('[x] ') || contentString.startsWith('[ ] ');

                      if (isTaskCheck) {
                        const isChecked = contentString.startsWith('[x] ');
                        const itemText = contentString.replace(/^\[[ xX]\] /, '');
                        return (
                          <li className="list-none -ml-5 flex items-start space-x-2 py-1">
                            <button
                              onClick={() => handleToggleTaskItem(itemText, isChecked)}
                              className="mt-0.5 p-0.5 rounded transition-transform active:scale-90 cursor-pointer shrink-0"
                              title={isChecked ? 'Mark uncompleted' : 'Mark completed'}
                            >
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Square className="w-4 h-4 opacity-50 hover:opacity-100" />
                              )}
                            </button>
                            <span className={isChecked ? 'line-through opacity-60' : 'font-medium'}>
                              {itemText}
                            </span>
                          </li>
                        );
                      }

                      return (
                        <li className="leading-relaxed">
                          {children}
                        </li>
                      );
                    },
                    blockquote: ({ children }) => (
                      <blockquote 
                        className="pl-4 py-2 border-l-4 rounded-r-lg my-3 text-xs italic opacity-90 font-sans"
                        style={{
                          backgroundColor: currentTheme.palette.surfaceRaised,
                          borderColor: currentTheme.palette.accent,
                        }}
                      >
                        {children}
                      </blockquote>
                    ),
                    code: ({ className, children }) => {
                      const isInline = !className;
                      if (isInline) {
                        return (
                          <code 
                            className="px-1.5 py-0.5 rounded text-xs font-mono border"
                            style={{
                              backgroundColor: currentTheme.palette.surfaceRaised,
                              borderColor: currentTheme.palette.borderStrong,
                              color: currentTheme.palette.accent,
                            }}
                          >
                            {children}
                          </code>
                        );
                      }

                      const lang = className?.replace('language-', '') || 'code';
                      const codeContent = String(children).replace(/\n$/, '');
                      const codeId = `code-${Math.abs(codeContent.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0))}`;
                      const isCopied = copiedCodeId === codeId;
                      const execution = executionResults[codeId];

                      return (
                        <div className="my-4 rounded-xl overflow-hidden border shadow-sm"
                          style={{ borderColor: '#27272A' }}
                        >
                          {/* Code Header with Language Tag, Interactive Copy & Run in Sandbox */}
                          <div className="bg-[#18181B] px-3.5 py-2 border-b border-[#27272A] flex items-center justify-between text-[11px] font-mono text-[#A1A1AA]">
                            <span className="flex items-center space-x-2">
                              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="font-bold text-gray-300">{lang}</span>
                            </span>

                            <div className="flex items-center space-x-2">
                              {/* Run in Sandbox Button */}
                              <button
                                onClick={() => handleRunCodeSnippet(codeId, codeContent, lang)}
                                disabled={execution?.status === 'running'}
                                className="px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30 flex items-center space-x-1 text-[11px] font-bold cursor-pointer transition-colors"
                                title="Execute snippet in isolated sandbox"
                              >
                                <Play className="w-3 h-3 fill-emerald-400" />
                                <span>{execution?.status === 'running' ? 'Running...' : 'Run in Sandbox'}</span>
                              </button>

                              {/* Copy Code Button */}
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(codeContent);
                                  setCopiedCodeId(codeId);
                                  setTimeout(() => setCopiedCodeId(null), 1500);
                                }}
                                className="px-2 py-1 rounded bg-[#27272A] hover:bg-[#3F3F46] text-gray-300 flex items-center space-x-1 text-[11px] cursor-pointer transition-colors"
                                title="Copy code"
                              >
                                {isCopied ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span className="text-emerald-400">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Code Content */}
                          <pre 
                            className="p-4 text-xs font-mono overflow-x-auto leading-relaxed"
                            style={{
                              backgroundColor: '#09090B',
                              color: '#E4E4E7',
                            }}
                          >
                            <code>{children}</code>
                          </pre>

                          {/* Interactive Execution Output Terminal Drawer */}
                          {execution && (
                            <div className="border-t border-[#27272A] bg-[#09090B] p-3 text-xs font-mono text-emerald-400 space-y-2">
                              <div className="flex items-center justify-between text-[11px] text-gray-400 pb-1 border-b border-[#27272A]">
                                <span className="flex items-center space-x-1.5 text-gray-300 font-bold">
                                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                  <span>Sandbox Terminal Output</span>
                                </span>
                                <div className="flex items-center space-x-3">
                                  {execution.executionTimeMs > 0 && (
                                    <span>Elapsed: {execution.executionTimeMs}ms</span>
                                  )}
                                  {execution.memoryMb > 0 && (
                                    <span>RAM: {execution.memoryMb} MB</span>
                                  )}
                                  <button
                                    onClick={() => handleClearCodeOutput(codeId)}
                                    className="text-gray-400 hover:text-white cursor-pointer"
                                    title="Close output"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>

                              <div className="space-y-1 font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto">
                                <div className="text-gray-500">{execution.command}</div>
                                {execution.output.map((line, lIdx) => (
                                  <div 
                                    key={lIdx} 
                                    className={line.startsWith('[STDOUT]') ? 'text-cyan-300 font-semibold' : line.startsWith('>>>') ? 'text-emerald-400 font-bold' : 'text-gray-400'}
                                  >
                                    {line}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    },
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-4 border rounded-xl"
                        style={{ borderColor: currentTheme.palette.border }}
                      >
                        <table className="w-full text-xs text-left font-mono">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead 
                        className="border-b uppercase font-bold text-[11px]"
                        style={{
                          backgroundColor: currentTheme.palette.surfaceRaised,
                          borderColor: currentTheme.palette.border,
                        }}
                      >
                        {children}
                      </thead>
                    ),
                    tbody: ({ children }) => (
                      <tbody className="divide-y" style={{ borderColor: currentTheme.palette.border }}>
                        {children}
                      </tbody>
                    ),
                    tr: ({ children }) => (
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        {children}
                      </tr>
                    ),
                    th: ({ children }) => (
                      <th className="px-4 py-2.5 font-bold">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-4 py-2.5 opacity-85">
                        {children}
                      </td>
                    ),
                    hr: () => (
                      <hr className="my-6 opacity-30" style={{ borderColor: currentTheme.palette.border }} />
                    ),
                    img: ({ src, alt }) => (
                      <img 
                        src={src} 
                        alt={alt || 'badge'} 
                        className="inline-block mr-1.5 my-1" 
                        referrerPolicy="no-referrer" 
                      />
                    ),
                    a: ({ href, children }) => (
                      <a 
                        href={href} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="font-medium underline hover:opacity-80 inline-flex items-center gap-0.5"
                        style={{ color: currentTheme.palette.accent }}
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {currentMarkdown}
                </Markdown>
              </div>
            )}

            {/* Mode 2: Interactive Split Editor (Markdown Textarea + Live Preview) */}
            {viewMode === 'split' && (
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x h-[640px]"
                style={{ borderColor: currentTheme.palette.border }}
              >
                {/* Left: Editor Toolbar + Textarea */}
                <div className="flex flex-col h-full">
                  {/* Markdown Quick Toolbar */}
                  <div 
                    className="p-2 border-b flex flex-wrap items-center gap-1 text-xs font-mono"
                    style={{
                      backgroundColor: currentTheme.palette.surfaceRaised,
                      borderColor: currentTheme.palette.border,
                    }}
                  >
                    <button
                      onClick={() => insertTextAtCursor('## ')}
                      className="px-2 py-1 rounded hover:bg-black/10 dark:hover:bg-white/10 font-bold cursor-pointer"
                      title="Heading"
                    >
                      H2
                    </button>
                    <button
                      onClick={() => insertTextAtCursor('**', '**')}
                      className="px-2 py-1 rounded hover:bg-black/10 dark:hover:bg-white/10 font-bold cursor-pointer"
                      title="Bold"
                    >
                      B
                    </button>
                    <button
                      onClick={() => insertTextAtCursor('*', '*')}
                      className="px-2 py-1 rounded hover:bg-black/10 dark:hover:bg-white/10 italic cursor-pointer"
                      title="Italic"
                    >
                      I
                    </button>
                    <button
                      onClick={() => insertTextAtCursor('```python\n', '\n```')}
                      className="px-2 py-1 rounded hover:bg-black/10 dark:hover:bg-white/10 font-mono cursor-pointer"
                      title="Code Block"
                    >
                      &lt;/&gt;
                    </button>
                    <button
                      onClick={() => insertTextAtCursor('- [ ] ')}
                      className="px-2 py-1 rounded hover:bg-black/10 dark:hover:bg-white/10 flex items-center space-x-1 cursor-pointer"
                      title="Task Checkbox"
                    >
                      <CheckSquare className="w-3 h-3" />
                      <span>Task</span>
                    </button>
                    <button
                      onClick={() => insertTextAtCursor('| Feature | Status | Speedup |\n| :--- | :--- | :--- |\n| PagedAttention | Active | 4.2x |\n')}
                      className="px-2 py-1 rounded hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
                      title="Table"
                    >
                      Table
                    </button>
                    <button
                      onClick={() => insertTextAtCursor('> ')}
                      className="px-2 py-1 rounded hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
                      title="Quote"
                    >
                      Quote
                    </button>
                  </div>

                  <textarea
                    ref={textareaRef}
                    value={currentMarkdown}
                    onChange={(e) => handleMarkdownEdit(e.target.value)}
                    placeholder="Type README markdown here..."
                    className="w-full flex-1 p-4 font-mono text-xs focus:outline-none resize-none leading-relaxed"
                    style={{
                      backgroundColor: currentTheme.appearance === 'light' ? '#FAFAFA' : '#09090B',
                      color: currentTheme.appearance === 'light' ? '#09090B' : '#E4E4E7',
                    }}
                  />
                </div>

                {/* Right: Live Interactive Render Preview */}
                <div className="p-5 overflow-y-auto h-full space-y-3">
                  <div className="text-[11px] font-mono opacity-50 uppercase tracking-wider pb-2 border-b flex items-center justify-between">
                    <span>Live Render Preview</span>
                    <span className="text-emerald-500 font-bold">Auto-Updating</span>
                  </div>
                  <Markdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-xl font-bold pb-2 border-b">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-lg font-bold mt-4 mb-2">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-sm font-bold mt-3 mb-1">{children}</h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-xs leading-relaxed opacity-85 my-1.5">{children}</p>
                      ),
                      code: ({ children }) => (
                        <code className="px-1 py-0.5 rounded text-[11px] font-mono bg-black/10 dark:bg-white/10">{children}</code>
                      ),
                      pre: ({ children }) => (
                        <pre className="p-3 rounded-lg bg-[#09090B] text-gray-200 text-xs font-mono overflow-x-auto my-2">{children}</pre>
                      ),
                    }}
                  >
                    {currentMarkdown}
                  </Markdown>
                </div>
              </div>
            )}

            {/* Mode 3: Raw Source Mode */}
            {viewMode === 'raw' && (
              <div className="p-6 h-[640px] flex flex-col">
                <div className="flex items-center justify-between pb-3 mb-3 border-b text-xs font-mono">
                  <span className="opacity-70">Raw Markdown Source ({currentMarkdown.length} characters)</span>
                  <button
                    onClick={handleCopyAll}
                    className="px-3 py-1 rounded border hover:opacity-100 opacity-80 cursor-pointer flex items-center space-x-1"
                    style={{
                      backgroundColor: currentTheme.palette.surfaceRaised,
                      borderColor: currentTheme.palette.border,
                    }}
                  >
                    {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAll ? 'Copied' : 'Copy All'}</span>
                  </button>
                </div>
                <pre 
                  className="p-5 flex-1 rounded-xl text-xs font-mono overflow-y-auto leading-relaxed border"
                  style={{
                    backgroundColor: '#09090B',
                    borderColor: '#27272A',
                    color: '#E4E4E7',
                  }}
                >
                  <code>{currentMarkdown}</code>
                </pre>
              </div>
            )}

          </div>

        </div>
      )}

      {/* 6. Commit to GitHub Modal */}
      {showCommitModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setShowCommitModal(false)}
        >
          <div 
            className="w-full max-w-md rounded-2xl border shadow-xl p-6 space-y-4 animate-scaleUp"
            style={{
              backgroundColor: currentTheme.palette.surface,
              borderColor: currentTheme.palette.borderStrong,
              color: currentTheme.palette.textPrimary,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 font-mono font-bold text-sm">
                <UploadCloud className="w-4 h-4 text-emerald-500" />
                <span>Commit README.md to GitHub</span>
              </div>
              <button 
                onClick={() => setShowCommitModal(false)}
                className="opacity-60 hover:opacity-100 cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-[11px] opacity-70 mb-1">Target Branch</label>
                <div className="p-2 rounded-lg border flex items-center space-x-2"
                  style={{
                    backgroundColor: currentTheme.palette.surfaceRaised,
                    borderColor: currentTheme.palette.border,
                  }}
                >
                  <GitBranch className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="font-bold">{selectedBranch}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] opacity-70 mb-1">Commit Message</label>
                <input
                  type="text"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  className="w-full p-2.5 rounded-lg border text-xs font-mono focus:outline-none"
                  style={{
                    backgroundColor: currentTheme.palette.surfaceRaised,
                    borderColor: currentTheme.palette.border,
                    color: currentTheme.palette.textPrimary,
                  }}
                />
              </div>

              <div className="p-3 rounded-lg border text-[11px] opacity-80 flex items-start space-x-2"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.border,
                }}
              >
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  This will commit the verified markdown diff directly to <strong>{selectedRepo}</strong> under branch <strong>{selectedBranch}</strong>.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowCommitModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold opacity-70 hover:opacity-100 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleCommitSubmit}
                disabled={commitStatus === 'committing' || commitStatus === 'committed'}
                className="px-4 py-2 rounded-lg text-xs font-mono font-bold text-white flex items-center space-x-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                style={{ backgroundColor: currentTheme.palette.accent }}
              >
                {commitStatus === 'committing' ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                    <span>Signing & Pushing...</span>
                  </>
                ) : commitStatus === 'committed' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Committed (#8f92a1e)!</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Commit Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
