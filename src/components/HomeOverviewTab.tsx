import React, { useState } from 'react';
import { 
  Cpu, 
  BookOpen, 
  GitPullRequest, 
  Globe, 
  Terminal, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Layers, 
  Command, 
  Atom,
  BrainCircuit,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react';
import { useAdaptiveTheme } from '../context/ThemeContext';
import { ResearchEngineeringTimeline } from './ResearchEngineeringTimeline';

interface HomeOverviewTabProps {
  setActiveTab: (tab: string) => void;
  onOpenCommandPalette: () => void;
}

type CategoryFilter = 'all' | 'ai' | 'science' | 'dev';

export const HomeOverviewTab: React.FC<HomeOverviewTabProps> = ({ setActiveTab, onOpenCommandPalette }) => {
  const { currentTheme } = useAdaptiveTheme();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const modules = [
    {
      id: 'cognitive',
      category: 'ai',
      categoryLabel: 'AI & Cognition',
      title: 'Cognitive Architecture Engine',
      description: 'APEX Cognitive OS, Evidence-Driven Learning Engine, neuro-symbolic knowledge graphs & dynamic attention memory.',
      icon: BrainCircuit,
      badge: 'APEX OS & Learning',
      pillColor: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
    },
    {
      id: 'assistant',
      category: 'ai',
      categoryLabel: 'AI & Cognition',
      title: 'Assistant Creator',
      description: 'Design, constrain, and deploy specialized autonomous multi-modal agents powered by Gemini reasoning models.',
      icon: Sparkles,
      badge: 'Autonomous Agents',
      pillColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30'
    },
    {
      id: 'quantum',
      category: 'science',
      categoryLabel: 'Scientific Labs',
      title: 'Quantum Computing & QPU Lab',
      description: 'Simulate transmon qubit superposition, Bloch spheres, entanglement circuits, and solve NP-hard problems via quantum annealing.',
      icon: Atom,
      badge: '12.4 mK Cryo QPU',
      pillColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30'
    },
    {
      id: 'research',
      category: 'science',
      categoryLabel: 'Scientific Labs',
      title: 'Research & Peer Review Lab',
      description: 'Autonomous research paper authoring and double-blind peer review simulation powered by Gemini reasoning models.',
      icon: BookOpen,
      badge: 'Academic Review',
      pillColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    },
    {
      id: 'platform',
      category: 'science',
      categoryLabel: 'Scientific Labs',
      title: 'Platform Architecture Designer',
      description: 'Design hyper-scale Vision Language-Action (VLA) multi-modal decision systems with tensor sharding and RLAIF.',
      icon: Cpu,
      badge: 'VLA Architecture',
      pillColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
    },
    {
      id: 'ide',
      category: 'dev',
      categoryLabel: 'Engineering & Dev',
      title: 'Collaborative IDE Workspace',
      description: 'Modular code editor with real-time PyTorch sandbox, multi-file tree, terminal execution, and AI copilot.',
      icon: Terminal,
      badge: 'PyTorch IDE',
      pillColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30'
    },
    {
      id: 'engineering',
      category: 'dev',
      categoryLabel: 'Engineering & Dev',
      title: 'Global Scale Ops Solver',
      description: 'Synthesize distributed systems architecture, RoCE v2 InfiniBand fabric, and NVMe KV-cache swapping strategies.',
      icon: Globe,
      badge: 'Global Infra',
      pillColor: 'bg-orange-500/15 text-orange-400 border-orange-500/30'
    },
    {
      id: 'opensource',
      category: 'dev',
      categoryLabel: 'Engineering & Dev',
      title: 'Open Source AI Contributor Studio',
      description: 'Generate production-ready pull requests, zero-copy paged attention patches, and benchmarks for vLLM and HuggingFace.',
      icon: GitPullRequest,
      badge: 'OSS Sync',
      pillColor: 'bg-teal-500/15 text-teal-400 border-teal-500/30'
    }
  ];

  const filteredModules = modules.filter(mod => {
    const matchesCategory = selectedCategory === 'all' || mod.category === selectedCategory;
    const matchesSearch = 
      mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories: Array<{ id: CategoryFilter; label: string; count: number }> = [
    { id: 'all', label: 'All Workspaces', count: modules.length },
    { id: 'ai', label: 'AI & Cognition', count: modules.filter(m => m.category === 'ai').length },
    { id: 'science', label: 'Scientific Labs', count: modules.filter(m => m.category === 'science').length },
    { id: 'dev', label: 'Engineering & Dev', count: modules.filter(m => m.category === 'dev').length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadeIn">
      
      {/* Clean, Non-Complex Hero Banner */}
      <div 
        className="rounded-3xl p-6 sm:p-10 border relative overflow-hidden transition-all shadow-sm"
        style={{
          backgroundColor: currentTheme.palette.surface,
          borderColor: currentTheme.palette.border,
          color: currentTheme.palette.textPrimary,
        }}
      >
        <div className="relative z-10 max-w-3xl space-y-5">
          <div 
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-semibold border"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.borderStrong,
              color: currentTheme.palette.accent,
            }}
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Gambit Atoms Unified System • Powered by Google Gemini 3.1 Pro & Flash</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Autonomous Intelligence, Scientific Labs & Systems Engineering
          </h1>

          <p className="text-xs sm:text-sm opacity-75 max-w-2xl leading-relaxed">
            A cohesive, uncluttered platform uniting cognitive architectures, quantum hardware simulation, automated peer-reviewed research, collaborative IDE, and global infrastructure solvers.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('cognitive')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-white font-semibold text-xs transition-all hover:opacity-90 shadow-sm cursor-pointer"
              style={{ backgroundColor: currentTheme.palette.accent }}
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Launch APEX Cognitive Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenCommandPalette}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all hover:scale-102 cursor-pointer shadow-2xs"
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: currentTheme.palette.border,
                color: currentTheme.palette.textPrimary,
              }}
            >
              <Command className="w-3.5 h-3.5 opacity-70" />
              <span>Quick Actions</span>
              <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/10 dark:bg-white/10 opacity-75">
                Ctrl+K
              </kbd>
            </button>
          </div>
        </div>
      </div>

      {/* Live System Performance Telemetry Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
        <div 
          className="p-4 rounded-2xl border transition-all shadow-2xs"
          style={{
            backgroundColor: currentTheme.palette.surfaceRaised,
            borderColor: currentTheme.palette.border,
          }}
        >
          <div className="flex items-center justify-between opacity-60 text-[11px] mb-1">
            <span>Cluster Throughput</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold tracking-tight">140k TPS</div>
          <p className="text-[10px] text-emerald-400 font-sans mt-0.5 flex items-center">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5 animate-ping" />
            Zero-copy ring buffer online
          </p>
        </div>

        <div 
          className="p-4 rounded-2xl border transition-all shadow-2xs"
          style={{
            backgroundColor: currentTheme.palette.surfaceRaised,
            borderColor: currentTheme.palette.border,
          }}
        >
          <div className="flex items-center justify-between opacity-60 text-[11px] mb-1">
            <span>Inference Latency</span>
            <Zap className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-bold tracking-tight">38 ms</div>
          <p className="text-[10px] text-blue-400 font-sans mt-0.5">FlashAttention v2 optimized</p>
        </div>

        <div 
          className="p-4 rounded-2xl border transition-all shadow-2xs"
          style={{
            backgroundColor: currentTheme.palette.surfaceRaised,
            borderColor: currentTheme.palette.border,
          }}
        >
          <div className="flex items-center justify-between opacity-60 text-[11px] mb-1">
            <span>Peer Review Score</span>
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-bold tracking-tight">9.4 / 10</div>
          <p className="text-[10px] text-purple-400 font-sans mt-0.5">Autonomous Double-Blind</p>
        </div>

        <div 
          className="p-4 rounded-2xl border transition-all shadow-2xs"
          style={{
            backgroundColor: currentTheme.palette.surfaceRaised,
            borderColor: currentTheme.palette.border,
          }}
        >
          <div className="flex items-center justify-between opacity-60 text-[11px] mb-1">
            <span>Quantum & Node Grid</span>
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold tracking-tight">12.4 mK • 1,024 H100</div>
          <p className="text-[10px] opacity-60 font-sans mt-0.5">QPU transmon + RoCE v2 fabric</p>
        </div>
      </div>

      {/* Visual Roadmap & Engineering Milestones Horizontal Timeline */}
      <ResearchEngineeringTimeline setActiveTab={setActiveTab} />

      {/* Workspace Filter & Search Controls */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Category Filter Pills */}
          <div 
            className="flex items-center p-1 rounded-xl border overflow-x-auto text-xs font-medium space-x-1 no-scrollbar"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.border,
            }}
          >
            {categories.map(cat => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
                    isSelected 
                      ? 'shadow-xs font-bold' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: isSelected ? currentTheme.palette.accent : 'transparent',
                    color: isSelected ? '#ffffff' : currentTheme.palette.textSecondary,
                  }}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-black/20 text-white' : 'bg-black/10 dark:bg-white/10'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Filter Search */}
          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 opacity-50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter workspaces (e.g. quantum, ide, apex)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border text-xs font-sans focus:outline-hidden transition-colors"
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: currentTheme.palette.border,
                color: currentTheme.palette.textPrimary,
              }}
            />
          </div>
        </div>

        {/* Modular Grid (Uncluttered, High Contrast, Anti-Slop Compliant) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => setActiveTab(mod.id)}
                className="group p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-md hover:scale-[1.01]"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.border,
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors border"
                      style={{
                        backgroundColor: currentTheme.palette.surface,
                        borderColor: currentTheme.palette.borderStrong,
                        color: currentTheme.palette.accent,
                      }}
                    >
                      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border ${mod.pillColor}`}>
                      {mod.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-bold tracking-tight">
                      {mod.title}
                    </h3>
                    <p className="text-xs opacity-70 mt-1.5 leading-relaxed">
                      {mod.description}
                    </p>
                  </div>
                </div>

                <div 
                  className="pt-4 mt-5 border-t flex items-center justify-between text-xs font-semibold"
                  style={{ borderColor: currentTheme.palette.border }}
                >
                  <span className="opacity-70 group-hover:opacity-100 flex items-center space-x-1" style={{ color: currentTheme.palette.accent }}>
                    <span>Launch Workspace</span>
                  </span>
                  <div 
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                    style={{
                      backgroundColor: currentTheme.palette.surface,
                      color: currentTheme.palette.textPrimary,
                    }}
                  >
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Quick Command Launcher Card */}
          <div
            onClick={onOpenCommandPalette}
            className="group p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-md hover:scale-[1.01]"
            style={{
              backgroundColor: currentTheme.palette.surface,
              borderColor: currentTheme.palette.borderStrong,
            }}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/30 bg-emerald-500/10"
                >
                  <Command className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Global Action
                </span>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold tracking-tight">
                  Global Command Center
                </h3>
                <p className="text-xs opacity-70 mt-1.5 leading-relaxed">
                  Press <kbd className="px-1.5 py-0.5 rounded font-mono border text-[10px] bg-black/10 dark:bg-white/10">Ctrl+K</kbd> anywhere to search all 8 workspaces, start solvers, or run automated audits.
                </p>
              </div>
            </div>

            <div 
              className="pt-4 mt-5 border-t flex items-center justify-between text-xs font-semibold text-emerald-400"
              style={{ borderColor: currentTheme.palette.border }}
            >
              <span>Press Ctrl+K</span>
              <div 
                className="w-7 h-7 rounded-full flex items-center justify-center bg-emerald-500/15 text-emerald-400"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Empty Search Result Fallback */}
        {filteredModules.length === 0 && (
          <div 
            className="text-center py-12 rounded-2xl border p-8 space-y-3"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.border,
            }}
          >
            <Search className="w-8 h-8 opacity-30 mx-auto" />
            <p className="text-sm font-semibold">No workspaces found matching &quot;{searchQuery}&quot;</p>
            <p className="text-xs opacity-60">Try searching for keywords like &quot;quantum&quot;, &quot;agent&quot;, &quot;paper&quot;, or &quot;ide&quot;</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white mt-2 cursor-pointer"
              style={{ backgroundColor: currentTheme.palette.accent }}
            >
              Clear Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
