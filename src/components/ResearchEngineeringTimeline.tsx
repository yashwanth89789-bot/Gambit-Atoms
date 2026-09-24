import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  BookOpen, 
  Cpu, 
  Atom, 
  BrainCircuit, 
  GitPullRequest, 
  ExternalLink,
  Target,
  BarChart3,
  Calendar,
  X,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useAdaptiveTheme } from '../context/ThemeContext';

export interface Milestone {
  id: string;
  step: string;
  title: string;
  track: 'research' | 'engineering' | 'quantum' | 'cognitive' | 'opensource';
  trackLabel: string;
  targetQuarter: string;
  dateRange: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  statusLabel: string;
  progressPct: number;
  workspaceId: string;
  deliverable: string;
  metric: string;
  leadGroup: string;
  technicalPrereqs: string[];
  keyInvariants: string[];
  icon: any;
}

interface ResearchEngineeringTimelineProps {
  setActiveTab: (tab: string) => void;
}

export const MILESTONES_DATA: Milestone[] = [
  {
    id: 'ms-quantum-surface',
    step: '01',
    title: 'Surface Code Fault-Tolerance QPU Benchmark',
    track: 'quantum',
    trackLabel: 'Quantum Labs',
    targetQuarter: 'Q1 2026',
    dateRange: 'Jan 2026 – Mar 2026',
    status: 'completed',
    statusLabel: 'Completed & Verified',
    progressPct: 100,
    workspaceId: 'quantum',
    deliverable: 'Distance-5 surface code with < 0.12% logical error threshold verified at 12.4 mK cryostat.',
    metric: '100% Threshold Pass (99.88% gate fidelity)',
    leadGroup: 'Advanced Cryo-QPU Group',
    technicalPrereqs: ['Transmon qubit lattice calibration', 'FPGA real-time syndrome extraction (<400ns)'],
    keyInvariants: ['Syndrome cycle duration ≤ 200ns', 'Crosstalk leakage < -45dB'],
    icon: Atom,
  },
  {
    id: 'ms-roce-ring-buffer',
    step: '02',
    title: 'Zero-Copy Ring Buffer & InfiniBand RoCE v2',
    track: 'engineering',
    trackLabel: 'Systems Engineering',
    targetQuarter: 'Q2 2026',
    dateRange: 'Apr 2026 – Jun 2026',
    status: 'completed',
    statusLabel: 'Completed & Verified',
    progressPct: 100,
    workspaceId: 'engineering',
    deliverable: 'NVMe-oF bypass with kernel-level RDMA zero-copy attention KV caching across distributed GPU clusters.',
    metric: '140k TPS Peak Throughput @ p99 1.8ms',
    leadGroup: 'Distributed Systems & Fabric',
    technicalPrereqs: ['Linux io_uring kernel 6.8 patchset', 'Mellanox ConnectX-7 400Gbps fabric topology'],
    keyInvariants: ['Zero memory copy in hot path', 'Backpressure latency ≤ 50μs'],
    icon: Layers,
  },
  {
    id: 'ms-vla-sharding',
    step: '03',
    title: 'VLA Multi-Modal Decision & Tensor Sharding',
    track: 'engineering',
    trackLabel: 'Platform Architecture',
    targetQuarter: 'Q3 2026',
    dateRange: 'Jul 2026 – Sep 2026',
    status: 'in_progress',
    statusLabel: 'Active Sprint',
    progressPct: 84,
    workspaceId: 'platform',
    deliverable: '4D parallelism sharding plan (TP:8, PP:4, DP:16) for 70B VLA multi-modal spatial reasoning nodes.',
    metric: 'Time-to-First-Token (TTFT) ≤ 38ms',
    leadGroup: 'Autonomous Platform Team',
    technicalPrereqs: ['NCCL 2.20 custom ring reduction', 'KV-cache paging with continuous batching'],
    keyInvariants: ['GPU compute efficiency ≥ 78%', 'Inter-node collective jitter < 5%'],
    icon: Cpu,
  },
  {
    id: 'ms-autonomous-peer-review',
    step: '04',
    title: 'Double-Blind Autonomous Research Peer Review',
    track: 'research',
    trackLabel: 'Scientific Research',
    targetQuarter: 'Q3 2026',
    dateRange: 'Aug 2026 – Oct 2026',
    status: 'in_progress',
    statusLabel: 'Active Sprint',
    progressPct: 76,
    workspaceId: 'research',
    deliverable: 'Multi-agent adversarial peer review matrix verifying claims, citations, and mathematical proofs.',
    metric: '9.4/10 Epistemic Consistency Score',
    leadGroup: 'Cognitive Verification Group',
    technicalPrereqs: ['Cross-engine arXiv DOI resolver', 'Automated counter-hypothesis generation'],
    keyInvariants: ['Zero unverified hallucinated citations', 'Reproducibility score ≥ 9.0'],
    icon: BookOpen,
  },
  {
    id: 'ms-apex-cognitive-os',
    step: '05',
    title: 'Neuro-Symbolic APEX Cognitive OS Engine',
    track: 'cognitive',
    trackLabel: 'Cognitive Core',
    targetQuarter: 'Q4 2026',
    dateRange: 'Sep 2026 – Nov 2026',
    status: 'in_progress',
    statusLabel: 'Active Sprint',
    progressPct: 58,
    workspaceId: 'cognitive',
    deliverable: 'Tree-of-Thought reasoning planner unified with persistent semantic vector memory and invariant guards.',
    metric: '91.4% First-Pass Logic Convergence',
    leadGroup: 'Cognitive Architecture Lab',
    technicalPrereqs: ['Hierarchical state tree engine', 'Attentional heatmap spatial memory'],
    keyInvariants: ['Deterministic rollback on invariant violation', 'Latency overhead ≤ 14ms'],
    icon: BrainCircuit,
  },
  {
    id: 'ms-oss-paged-attention',
    step: '06',
    title: 'vLLM PagedAttention v3 Kernel Upstream PR',
    track: 'opensource',
    trackLabel: 'Open Source Studio',
    targetQuarter: 'Q4 2026',
    dateRange: 'Oct 2026 – Dec 2026',
    status: 'in_progress',
    statusLabel: 'Active Sprint',
    progressPct: 35,
    workspaceId: 'opensource',
    deliverable: 'Upstream Triton/CUDA flash-decoding kernel PR reducing memory fragmentation in shared prefix prompt caching.',
    metric: '35% VRAM Reduction in Multi-Turn RAG',
    leadGroup: 'OSS Acceleration Team',
    technicalPrereqs: ['CUDA 12.4 Triton compiler backend', 'vLLM upstream contributor CI validation'],
    keyInvariants: ['100% parity with baseline attention test suites', 'Zero CUDA memory leaks'],
    icon: GitPullRequest,
  },
  {
    id: 'ms-trapped-ion-mesh',
    step: '07',
    title: '100-Qubit Trapped-Ion Topologically Protected Mesh',
    track: 'quantum',
    trackLabel: 'Quantum Labs',
    targetQuarter: 'Q1 2027',
    dateRange: 'Jan 2027 – Mar 2027',
    status: 'upcoming',
    statusLabel: 'Scheduled Protocol',
    progressPct: 12,
    workspaceId: 'quantum',
    deliverable: 'Monolithic shuttling architecture with all-to-all topological connectivity for Shor algorithm trials.',
    metric: 'Coherence Time > 120s @ 99.9% 2-qubit fidelity',
    leadGroup: 'Advanced Cryo-QPU Group',
    technicalPrereqs: ['Micro-fabricated surface trap calibration', 'Optical phase-locked Raman laser array'],
    keyInvariants: ['Shuttling heating rate < 0.05 phonons/ms', 'All-to-all connectivity depth ≤ 4'],
    icon: Atom,
  },
  {
    id: 'ms-autonomous-agent-sandbox',
    step: '08',
    title: 'Hierarchical Multi-Agent Synthesis Sandbox',
    track: 'cognitive',
    trackLabel: 'AI & Cognition',
    targetQuarter: 'Q2 2027',
    dateRange: 'Apr 2027 – Jun 2027',
    status: 'upcoming',
    statusLabel: 'Scheduled Protocol',
    progressPct: 0,
    workspaceId: 'assistant',
    deliverable: 'Autonomous self-reflecting agent coordinator with formal verification of tool execution safety constraints.',
    metric: 'Zero unsafe tool calls across 10k simulations',
    leadGroup: 'Autonomous Systems & Agent Group',
    technicalPrereqs: ['E2B containerized execution sandbox', 'Gemini structured JSON function call routing'],
    keyInvariants: ['Sandboxed process isolation', 'Hard timeout at 30.0s per subagent cycle'],
    icon: Sparkles,
  },
];

export const ResearchEngineeringTimeline: React.FC<ResearchEngineeringTimelineProps> = ({ setActiveTab }) => {
  const { currentTheme } = useAdaptiveTheme();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeMilestoneModal, setActiveMilestoneModal] = useState<Milestone | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Filtered milestones
  const filteredMilestones = MILESTONES_DATA.filter((m) => {
    const trackMatch = selectedTrack === 'all' || m.track === selectedTrack;
    const statusMatch = selectedStatus === 'all' || m.status === selectedStatus;
    return trackMatch && statusMatch;
  });

  // Calculate high-level pipeline metrics
  const totalMilestones = MILESTONES_DATA.length;
  const completedCount = MILESTONES_DATA.filter(m => m.status === 'completed').length;
  const inProgressCount = MILESTONES_DATA.filter(m => m.status === 'in_progress').length;
  const overallAverageProgress = Math.round(
    MILESTONES_DATA.reduce((acc, m) => acc + m.progressPct, 0) / totalMilestones
  );

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress(Math.min(100, Math.max(0, (scrollLeft / maxScroll) * 100)));
    } else {
      setScrollProgress(100);
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [filteredMilestones]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 360;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const tracks: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All Tracks' },
    { id: 'research', label: 'Scientific Research' },
    { id: 'engineering', label: 'Systems & Infra' },
    { id: 'quantum', label: 'Quantum Labs' },
    { id: 'cognitive', label: 'Cognitive Core' },
    { id: 'opensource', label: 'Open Source' },
  ];

  const statuses: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All States' },
    { id: 'in_progress', label: 'Active Sprints' },
    { id: 'completed', label: 'Completed' },
    { id: 'upcoming', label: 'Scheduled' },
  ];

  return (
    <section 
      className="rounded-3xl border transition-all shadow-sm overflow-hidden"
      style={{
        backgroundColor: currentTheme.palette.surface,
        borderColor: currentTheme.palette.border,
      }}
      aria-label="Research and Engineering Milestones Timeline"
    >
      {/* 1. Header Zone: Title, Overall Progress Gauge, and Scroll Controls */}
      <div 
        className="p-5 sm:p-7 border-b flex flex-col lg:flex-row lg:items-center justify-between gap-5"
        style={{ borderColor: currentTheme.palette.border }}
      >
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center space-x-2 text-xs font-semibold">
            <span 
              className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md font-mono text-[11px]"
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                color: currentTheme.palette.accent,
                borderColor: currentTheme.palette.borderStrong,
              }}
            >
              <Target className="w-3.5 h-3.5 mr-1" />
              <span>Milestone Roadmap</span>
            </span>
            <span className="opacity-40">·</span>
            <span className="text-xs opacity-75 font-sans">
              Autonomous Systems & Research Initiatives (2026 – 2027)
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-balance">
            Active Research & Systems Engineering Milestones
          </h2>

          <p className="text-xs opacity-70 leading-relaxed">
            Continuous verification pipeline tracking empirical proofs, high-throughput tensor sharding, quantum error correction, and neuro-symbolic reasoning milestones.
          </p>
        </div>

        {/* Global Progress Metrics & Scroll Nav Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 lg:self-center">
          
          {/* Progress Overview Card */}
          <div 
            className="flex items-center space-x-4 px-4 py-2.5 rounded-2xl border text-xs shadow-2xs font-mono"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.border,
            }}
          >
            <div>
              <div className="text-[10px] opacity-60 uppercase font-sans tracking-wide">
                Pipeline Velocity
              </div>
              <div className="text-base font-bold tabular-nums flex items-baseline space-x-1">
                <span>{overallAverageProgress}%</span>
                <span className="text-[10px] font-normal opacity-60">Avg. Done</span>
              </div>
            </div>

            <div className="h-7 w-px opacity-20 bg-current" />

            <div>
              <div className="text-[10px] opacity-60 uppercase font-sans tracking-wide">
                Active Sprints
              </div>
              <div className="text-base font-bold tabular-nums flex items-center space-x-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1" />
                <span>{inProgressCount}</span>
                <span className="text-[10px] font-normal opacity-60 text-current">/ {totalMilestones}</span>
              </div>
            </div>
          </div>

          {/* Scroll Navigation Arrows */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll milestones left"
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                canScrollLeft 
                  ? 'hover:scale-105 active:scale-95 shadow-xs' 
                  : 'opacity-35 cursor-not-allowed'
              }`}
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: currentTheme.palette.border,
                color: currentTheme.palette.textPrimary,
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              aria-label="Scroll milestones right"
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                canScrollRight 
                  ? 'hover:scale-105 active:scale-95 shadow-xs' 
                  : 'opacity-35 cursor-not-allowed'
              }`}
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: currentTheme.palette.border,
                color: currentTheme.palette.textPrimary,
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* 2. Interactive Segmented Filters: Track & Status */}
      <div 
        className="px-5 sm:px-7 py-3 border-b flex flex-wrap items-center justify-between gap-3 text-xs"
        style={{ 
          backgroundColor: currentTheme.palette.surfaceRaised,
          borderColor: currentTheme.palette.border 
        }}
      >
        {/* Track Filter */}
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-semibold opacity-60 mr-1.5 whitespace-nowrap">
            Domain Track:
          </span>
          {tracks.map((t) => {
            const isSelected = selectedTrack === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTrack(t.id)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected ? 'font-bold shadow-xs text-white' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: isSelected ? currentTheme.palette.accent : 'transparent',
                  color: isSelected ? '#ffffff' : currentTheme.palette.textSecondary,
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-semibold opacity-60 mr-1.5 whitespace-nowrap">
            Status:
          </span>
          {statuses.map((s) => {
            const isSelected = selectedStatus === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedStatus(s.id)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected ? 'font-bold shadow-xs' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: isSelected ? currentTheme.palette.surface : 'transparent',
                  borderColor: isSelected ? currentTheme.palette.borderStrong : 'transparent',
                  color: isSelected ? currentTheme.palette.textPrimary : currentTheme.palette.textSecondary,
                }}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Horizontal Scrollable Roadmap Track */}
      <div className="relative py-7 px-5 sm:px-7">
        
        {/* Horizontal Connecting Guide Line running through the center */}
        <div 
          className="absolute left-0 right-0 top-15 h-0.5 pointer-events-none hidden sm:block opacity-25"
          style={{ backgroundColor: currentTheme.palette.borderStrong }}
        />

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-5 overflow-x-auto pb-4 pt-1 snap-x scroll-smooth no-scrollbar"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {filteredMilestones.map((milestone) => {
            const Icon = milestone.icon;
            const isCompleted = milestone.status === 'completed';
            const isInProgress = milestone.status === 'in_progress';
            const isUpcoming = milestone.status === 'upcoming';

            return (
              <div
                key={milestone.id}
                className="w-[320px] sm:w-[350px] shrink-0 snap-start flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 relative group"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: isInProgress 
                    ? currentTheme.palette.accent 
                    : currentTheme.palette.border,
                }}
              >
                {/* Node Step Marker & Status Indicator */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    
                    {/* Step Node */}
                    <div className="flex items-center space-x-2">
                      <div 
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-transform group-hover:scale-105 ${
                          isCompleted 
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : isInProgress
                            ? 'text-white shadow-xs'
                            : 'bg-black/5 dark:bg-white/5 opacity-60 border border-current/20'
                        }`}
                        style={{
                          backgroundColor: isInProgress ? currentTheme.palette.accent : undefined,
                        }}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <span>{milestone.step}</span>
                        )}
                      </div>

                      <div className="text-xs font-sans">
                        <span className="font-semibold">{milestone.targetQuarter}</span>
                        <span className="opacity-40 mx-1">·</span>
                        <span className="opacity-60 text-[11px]">{milestone.trackLabel}</span>
                      </div>
                    </div>

                    {/* Status Badge without pill spam */}
                    <div className="flex items-center space-x-1.5 text-[11px] font-mono">
                      {isCompleted && (
                        <span className="text-emerald-400 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verified</span>
                        </span>
                      )}
                      {isInProgress && (
                        <span 
                          className="flex items-center space-x-1 font-semibold"
                          style={{ color: currentTheme.palette.accent }}
                        >
                          <span className="w-2 h-2 rounded-full animate-ping mr-0.5" style={{ backgroundColor: currentTheme.palette.accent }} />
                          <span>Active</span>
                        </span>
                      )}
                      {isUpcoming && (
                        <span className="opacity-50 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Scheduled</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Deliverable Description */}
                  <div>
                    <h3 className="text-sm font-bold tracking-tight line-clamp-1 group-hover:opacity-90">
                      {milestone.title}
                    </h3>
                    <p className="text-xs opacity-75 mt-1.5 leading-relaxed line-clamp-2">
                      {milestone.deliverable}
                    </p>
                  </div>

                  {/* Target Metric Highlight */}
                  <div 
                    className="p-2.5 rounded-xl border text-xs font-mono"
                    style={{
                      backgroundColor: currentTheme.palette.surface,
                      borderColor: currentTheme.palette.border,
                    }}
                  >
                    <div className="flex items-center justify-between text-[10px] opacity-60 mb-0.5 font-sans">
                      <span>Target Milestone Metric</span>
                      <BarChart3 className="w-3 h-3" />
                    </div>
                    <div className="font-bold text-xs truncate">
                      {milestone.metric}
                    </div>
                  </div>

                  {/* Progress Bar & Tabular Percentage */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="opacity-60 font-sans">Sprint Progress</span>
                      <span className="font-bold tabular-nums">
                        {milestone.progressPct}%
                      </span>
                    </div>

                    <div 
                      className="w-full h-1.5 rounded-full overflow-hidden"
                      style={{ backgroundColor: currentTheme.palette.surface }}
                    >
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted ? 'bg-emerald-400' : ''
                        }`}
                        style={{
                          width: `${milestone.progressPct}%`,
                          backgroundColor: isCompleted ? undefined : currentTheme.palette.accent,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Action Footer: Inspect & Jump to Workspace */}
                <div 
                  className="pt-3.5 mt-4 border-t flex items-center justify-between text-xs"
                  style={{ borderColor: currentTheme.palette.border }}
                >
                  <button
                    onClick={() => setActiveMilestoneModal(milestone)}
                    className="opacity-75 hover:opacity-100 font-medium transition-opacity cursor-pointer flex items-center space-x-1"
                  >
                    <span>View Specifications</span>
                  </button>

                  <button
                    onClick={() => setActiveTab(milestone.workspaceId)}
                    className="flex items-center space-x-1 font-semibold group/btn cursor-pointer transition-colors"
                    style={{ color: currentTheme.palette.accent }}
                  >
                    <span>Open Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredMilestones.length === 0 && (
            <div 
              className="w-full py-12 text-center rounded-2xl border space-y-2"
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: currentTheme.palette.border,
              }}
            >
              <Target className="w-8 h-8 opacity-40 mx-auto" />
              <p className="text-sm font-semibold">No milestones found in this track or status.</p>
              <button
                onClick={() => {
                  setSelectedTrack('all');
                  setSelectedStatus('all');
                }}
                className="text-xs font-bold underline cursor-pointer"
                style={{ color: currentTheme.palette.accent }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Horizontal Mini-Scroll Position Indicator */}
        <div className="flex items-center justify-between pt-2 px-1 text-[11px] opacity-60 font-sans">
          <span>Scroll horizontally to inspect sequential timeline</span>
          <div className="flex items-center space-x-2">
            <span className="font-mono tabular-nums">{Math.round(scrollProgress)}%</span>
            <div 
              className="w-24 h-1 rounded-full overflow-hidden"
              style={{ backgroundColor: currentTheme.palette.surfaceRaised }}
            >
              <div 
                className="h-full rounded-full transition-all duration-150"
                style={{ 
                  width: `${scrollProgress}%`,
                  backgroundColor: currentTheme.palette.accent 
                }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* 4. Milestone Specification Modal / Detail Drawer */}
      {activeMilestoneModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setActiveMilestoneModal(null)}
        >
          <div 
            className="w-full max-w-lg rounded-3xl border shadow-xl p-6 sm:p-7 space-y-5 animate-scaleUp overflow-hidden"
            style={{
              backgroundColor: currentTheme.palette.surface,
              borderColor: currentTheme.palette.borderStrong,
              color: currentTheme.palette.textPrimary,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs font-mono">
                  <span className="font-bold opacity-60">PHASE {activeMilestoneModal.step}</span>
                  <span className="opacity-40">·</span>
                  <span className="text-emerald-400 font-semibold">{activeMilestoneModal.targetQuarter}</span>
                  <span className="opacity-40">·</span>
                  <span className="opacity-70">{activeMilestoneModal.trackLabel}</span>
                </div>
                <h3 className="text-lg font-bold tracking-tight">
                  {activeMilestoneModal.title}
                </h3>
              </div>

              <button
                onClick={() => setActiveMilestoneModal(null)}
                className="p-1.5 rounded-xl border opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.border,
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status & Progress Bar */}
            <div 
              className="p-4 rounded-2xl border space-y-2"
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: currentTheme.palette.border,
              }}
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="opacity-70 font-sans">Verification Status</span>
                <span className="font-bold tabular-nums">
                  {activeMilestoneModal.statusLabel} ({activeMilestoneModal.progressPct}%)
                </span>
              </div>
              <div 
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: currentTheme.palette.surface }}
              >
                <div 
                  className={`h-full rounded-full transition-all ${
                    activeMilestoneModal.status === 'completed' ? 'bg-emerald-400' : ''
                  }`}
                  style={{
                    width: `${activeMilestoneModal.progressPct}%`,
                    backgroundColor: activeMilestoneModal.status === 'completed' ? undefined : currentTheme.palette.accent,
                  }}
                />
              </div>
            </div>

            {/* Deliverable & Metric */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold opacity-60 uppercase text-[10px] tracking-wider">
                  Deliverable Scope
                </span>
                <p className="mt-1 leading-relaxed opacity-85">
                  {activeMilestoneModal.deliverable}
                </p>
              </div>

              <div>
                <span className="font-semibold opacity-60 uppercase text-[10px] tracking-wider">
                  Quantitative Target
                </span>
                <p className="mt-1 font-mono font-bold opacity-90">
                  {activeMilestoneModal.metric}
                </p>
              </div>

              <div>
                <span className="font-semibold opacity-60 uppercase text-[10px] tracking-wider">
                  Operational Group
                </span>
                <p className="mt-1 font-sans opacity-80">
                  {activeMilestoneModal.leadGroup}
                </p>
              </div>
            </div>

            {/* Technical Prerequisites & Invariants */}
            <div className="space-y-2 text-xs">
              <span className="font-semibold opacity-60 uppercase text-[10px] tracking-wider">
                Key Invariants & Pre-requisites
              </span>
              <ul className="space-y-1.5 opacity-80 list-disc list-inside">
                {activeMilestoneModal.technicalPrereqs.map((req, idx) => (
                  <li key={idx} className="leading-snug">{req}</li>
                ))}
                {activeMilestoneModal.keyInvariants.map((inv, idx) => (
                  <li key={`inv-${idx}`} className="leading-snug">{inv}</li>
                ))}
              </ul>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t" style={{ borderColor: currentTheme.palette.border }}>
              <button
                onClick={() => setActiveMilestoneModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold opacity-70 hover:opacity-100 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const targetWs = activeMilestoneModal.workspaceId;
                  setActiveMilestoneModal(null);
                  setActiveTab(targetWs);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white flex items-center space-x-1.5 cursor-pointer shadow-sm hover:opacity-90"
                style={{ backgroundColor: currentTheme.palette.accent }}
              >
                <span>Launch Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
