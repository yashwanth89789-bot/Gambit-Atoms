import React, { useState } from 'react';
import { 
  Layers, Sliders, Activity, Sparkles, Database, 
  Info, Check, Zap, Cpu 
} from 'lucide-react';
import { useAdaptiveTheme } from '../../context/ThemeContext';

interface Props {
  stimulus: string;
}

export const AttentionHeatmapViewer: React.FC<Props> = ({ stimulus }) => {
  const { currentTheme } = useAdaptiveTheme();
  const [selectedHead, setSelectedHead] = useState<number>(0);
  const [hoveredCell, setHoveredCell] = useState<{ query: string; key: string; weight: number; row: number; col: number } | null>(null);

  // Tokenize stimulus
  const tokens = stimulus
    .replace(/[^\w\s]/gi, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 8);

  const displayTokens = tokens.length > 0 ? tokens : ['Analyze', 'visual', 'telemetry', 'cross', 'reference', 'failure', 'modes'];

  // Synthetic deterministic attention matrices per head
  const generateAttentionMatrix = (headIdx: number, size: number) => {
    const matrix: number[][] = [];
    for (let i = 0; i < size; i++) {
      const row: number[] = [];
      let rowSum = 0;
      for (let j = 0; j < size; j++) {
        // Causal bias (prioritize diagonal and earlier tokens with head-specific variation)
        const dist = Math.abs(i - j);
        const headMod = ((headIdx + 1) * (i + 1) * (j + 1)) % 7;
        const rawScore = Math.exp(-dist * 0.4 + (headMod * 0.15) - (j > i ? 1.5 : 0));
        row.push(rawScore);
        rowSum += rawScore;
      }
      // Softmax normalize
      matrix.push(row.map(val => val / rowSum));
    }
    return matrix;
  };

  const attentionMatrix = generateAttentionMatrix(selectedHead, displayTokens.length);

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
            <Layers className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-base tracking-tight">Multi-Head Self-Attention Matrix & KV Cache</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                Q · Kᵀ / √d_k
              </span>
            </div>
            <p className="text-xs opacity-70">Inspect inter-token self-attention weights and transient KV-cache tensor allocation</p>
          </div>
        </div>

        {/* Head Selector */}
        <div className="flex items-center space-x-1.5 overflow-x-auto">
          <span className="text-[10px] font-mono opacity-60 uppercase font-bold mr-1">Head:</span>
          {Array.from({ length: 8 }).map((_, h) => (
            <button
              key={h}
              onClick={() => setSelectedHead(h)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border transition-all ${
                selectedHead === h 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-xs' 
                  : 'opacity-70 hover:opacity-100'
              }`}
              style={selectedHead !== h ? {
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: currentTheme.palette.borderStrong,
              } : {}}
            >
              H{h}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Attention Heatmap Matrix (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="opacity-75 font-bold">Self-Attention Softmax Heatmap (Head {selectedHead})</span>
            <span className="text-[10px] opacity-60">Rows: Queries (Q) • Cols: Keys (K)</span>
          </div>

          <div className="p-4 rounded-xl border overflow-x-auto" style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}>
            <div className="min-w-[360px]">
              {/* Header column token labels */}
              <div className="flex pl-20 mb-1 text-[10px] font-mono opacity-70">
                {displayTokens.map((tok, c) => (
                  <div key={c} className="flex-1 text-center truncate px-0.5" title={tok}>
                    {tok.substring(0, 5)}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {attentionMatrix.map((row, r) => (
                <div key={r} className="flex items-center space-y-1">
                  {/* Row Query Token Label */}
                  <div className="w-20 text-[10px] font-mono font-bold truncate pr-2 opacity-85" title={displayTokens[r]}>
                    {displayTokens[r]}
                  </div>

                  {/* Matrix Cells */}
                  <div className="flex-1 flex gap-1">
                    {row.map((weight, c) => {
                      const pct = Math.round(weight * 100);
                      const isSelf = r === c;

                      return (
                        <div
                          key={c}
                          onMouseEnter={() => setHoveredCell({ query: displayTokens[r], key: displayTokens[c], weight, row: r, col: c })}
                          onMouseLeave={() => setHoveredCell(null)}
                          className="flex-1 h-7 rounded flex items-center justify-center font-mono text-[10px] cursor-pointer transition-all hover:scale-105 hover:ring-1 hover:ring-white"
                          style={{
                            backgroundColor: `rgba(245, 158, 11, ${Math.max(0.12, weight * 1.8)})`,
                            color: weight > 0.3 ? '#FFFFFF' : currentTheme.palette.textPrimary,
                            border: isSelf ? '1px solid rgba(245, 158, 11, 0.6)' : 'none',
                          }}
                        >
                          {pct}%
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hovered Cell Detail */}
          {hoveredCell ? (
            <div className="p-2.5 rounded-lg border font-mono text-xs flex items-center justify-between animate-fadeIn" style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.borderStrong }}>
              <span>
                Attention from <strong className="text-amber-400">"{hoveredCell.query}"</strong> → <strong className="text-indigo-400">"{hoveredCell.key}"</strong>:
              </span>
              <span className="font-bold text-emerald-400">
                Weight: {(hoveredCell.weight * 100).toFixed(2)}%
              </span>
            </div>
          ) : (
            <div className="text-[11px] font-mono opacity-60 text-center">
              Hover over matrix cells to inspect pairwise token attention scores.
            </div>
          )}
        </div>

        {/* Right Column: KV Cache Real-Time Telemetry (5 cols) */}
        <div className="lg:col-span-5 space-y-4 font-mono text-xs">
          <div className="p-4 rounded-xl border space-y-3" style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}>
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center space-x-1.5">
                <Database className="w-4 h-4 text-indigo-400" />
                <span>KV Cache Allocation</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                FP16 PagedAttention
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 rounded-lg border" style={{ backgroundColor: currentTheme.palette.surface, borderColor: currentTheme.palette.border }}>
                <span className="text-[10px] opacity-60 block">Context Window</span>
                <span className="text-sm font-bold text-amber-400">128,000</span>
              </div>
              <div className="p-2.5 rounded-lg border" style={{ backgroundColor: currentTheme.palette.surface, borderColor: currentTheme.palette.border }}>
                <span className="text-[10px] opacity-60 block">Cache Footprint</span>
                <span className="text-sm font-bold text-indigo-400">1.42 GB</span>
              </div>
              <div className="p-2.5 rounded-lg border" style={{ backgroundColor: currentTheme.palette.surface, borderColor: currentTheme.palette.border }}>
                <span className="text-[10px] opacity-60 block">Cache Hit Rate</span>
                <span className="text-sm font-bold text-emerald-400">98.6%</span>
              </div>
              <div className="p-2.5 rounded-lg border" style={{ backgroundColor: currentTheme.palette.surface, borderColor: currentTheme.palette.border }}>
                <span className="text-[10px] opacity-60 block">Eviction Strategy</span>
                <span className="text-sm font-bold text-purple-400">H2O Heavy-Hitter</span>
              </div>
            </div>

            {/* Memory Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[10px] opacity-70">
                <span>VRAM Allocation (KV Tensors)</span>
                <span>84.2%</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden bg-zinc-800">
                <div style={{ width: '84.2%' }} className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 transition-all" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
