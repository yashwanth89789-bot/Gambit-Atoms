import React, { useState } from 'react';
import { 
  GitBranch, CheckCircle2, XCircle, ArrowRight, 
  Sparkles, RefreshCw, Zap, Play, Activity 
} from 'lucide-react';
import { useAdaptiveTheme } from '../../context/ThemeContext';

export interface ThoughtBranch {
  id: string;
  step: string;
  strategy: string;
  heuristicScore: number;
  status: 'OPTIMAL' | 'PRUNED' | 'STANDBY';
  evaluation: string;
  substeps: string[];
}

interface Props {
  stimulus: string;
}

export const TreeOfThoughtPlanner: React.FC<Props> = ({ stimulus }) => {
  const { currentTheme } = useAdaptiveTheme();

  const [branches, setBranches] = useState<ThoughtBranch[]>([
    {
      id: 'b1',
      step: 'Branch A: Deterministic Vector Grounding',
      strategy: 'Zero-Copy Semantic Search & Local Pipeline',
      heuristicScore: 0.94,
      status: 'OPTIMAL',
      evaluation: 'High confidence match in local vector index. Lowest latency (12ms), zero external hallucination risk.',
      substeps: [
        'Query 768-D embedding against local Pinecone/FAISS index',
        'Verify SHA-256 telemetry digest',
        'Synthesize deterministic structured mitigation payload',
      ],
    },
    {
      id: 'b2',
      step: 'Branch B: Multi-Agent Subordinate Consensus',
      strategy: 'DAG Task Decomposition & Parallel IPC',
      heuristicScore: 0.88,
      status: 'STANDBY',
      evaluation: 'Robust multi-perspective cross-examination, but higher compute cost and context overhead.',
      substeps: [
        'Fork 2 child subagents for independent code analysis',
        'Collect intermediate findings and run Bayesian voting',
        'Resolve conflicts and finalize consensus',
      ],
    },
    {
      id: 'b3',
      step: 'Branch C: Live Web Grounding Ingest',
      strategy: 'External Search Crawl & Real-time Scrape',
      heuristicScore: 0.62,
      status: 'PRUNED',
      evaluation: 'Pruned: Stimulus targets internal telemetry artifacts; external crawl introduces unverified latency and privacy leak risks.',
      substeps: [
        'Execute broad web query for similar public CVE reports',
        'Filter search results via domain authority threshold',
      ],
    },
  ]);

  const [isExpanding, setIsExpanding] = useState(false);

  const handleRecomputeTree = () => {
    setIsExpanding(true);
    setTimeout(() => {
      setIsExpanding(false);
    }, 600);
  };

  return (
    <div 
      className="border rounded-2xl p-6 shadow-sm space-y-6 transition-all"
      style={{
        backgroundColor: currentTheme.palette.surface,
        borderColor: currentTheme.palette.border,
        color: currentTheme.palette.textPrimary,
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b" style={{ borderColor: currentTheme.palette.border }}>
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center border"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.borderStrong,
            }}
          >
            <GitBranch className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-base tracking-tight">Tree-of-Thought (ToT) Deliberation Engine</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                Heuristic Search V(s)
              </span>
            </div>
            <p className="text-xs opacity-70">Multi-branch path exploration, state evaluation, and proactive branch pruning</p>
          </div>
        </div>

        <button
          onClick={handleRecomputeTree}
          disabled={isExpanding}
          className="px-3.5 py-1.5 rounded-lg text-white font-mono font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: currentTheme.palette.accent }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isExpanding ? 'animate-spin' : ''}`} />
          <span>{isExpanding ? 'Synthesizing...' : 'Re-Evaluate Branches'}</span>
        </button>
      </div>

      {/* Tree Branches */}
      <div className="space-y-4 font-mono text-xs">
        {branches.map((branch) => {
          const isOptimal = branch.status === 'OPTIMAL';
          const isPruned = branch.status === 'PRUNED';

          return (
            <div
              key={branch.id}
              className={`p-4 rounded-xl border space-y-3 transition-all ${
                isOptimal 
                  ? 'border-emerald-500 ring-1 ring-emerald-500/30 bg-emerald-500/5' 
                  : isPruned 
                    ? 'border-zinc-800 opacity-60 bg-zinc-900/30' 
                    : 'border-zinc-700 bg-zinc-800/30'
              }`}
            >
              {/* Branch Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  {isOptimal ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isPruned ? (
                    <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  ) : (
                    <Activity className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <span className="font-bold text-sm" style={{ color: currentTheme.palette.textPrimary }}>
                    {branch.step}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-[10px]">
                  <span className="opacity-60">Value Score V(s):</span>
                  <span className={`font-bold ${isOptimal ? 'text-emerald-400 text-xs' : 'text-zinc-400'}`}>
                    {(branch.heuristicScore * 100).toFixed(0)}%
                  </span>
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    isOptimal ? 'bg-emerald-500/20 text-emerald-300' : isPruned ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {branch.status}
                  </span>
                </div>
              </div>

              {/* Evaluation Note */}
              <p className="text-[11px] opacity-80 leading-relaxed font-sans">
                {branch.evaluation}
              </p>

              {/* Substeps */}
              <div className="space-y-1 pt-1 border-t border-zinc-800 text-[10px]">
                {branch.substeps.map((step, idx) => (
                  <div key={idx} className="flex items-center space-x-2 opacity-75">
                    <ArrowRight className="w-3 h-3 text-purple-400 shrink-0" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
