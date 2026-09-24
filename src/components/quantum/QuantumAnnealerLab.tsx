import React, { useState, useEffect } from 'react';
import { 
  Flame, Zap, Play, RotateCcw, Activity, 
  TrendingDown, CheckCircle2, Sliders, Cpu, Sparkles 
} from 'lucide-react';
import { useAdaptiveTheme } from '../../context/ThemeContext';

export interface SpinNode {
  id: number;
  spin: 1 | -1;
  bias: number; // h_i
  x: number;
  y: number;
}

export const QuantumAnnealerLab: React.FC = () => {
  const { currentTheme } = useAdaptiveTheme();

  // 6 Spin Nodes in a circle
  const [spins, setSpins] = useState<SpinNode[]>([
    { id: 0, spin: 1, bias: -0.5, x: 80, y: 50 },
    { id: 1, spin: -1, bias: 0.2, x: 180, y: 50 },
    { id: 2, spin: 1, bias: 0.8, x: 230, y: 130 },
    { id: 3, spin: -1, bias: -0.4, x: 180, y: 210 },
    { id: 4, spin: 1, bias: 0.1, x: 80, y: 210 },
    { id: 5, spin: -1, bias: -0.9, x: 30, y: 130 },
  ]);

  // Transverse Field Annealing Parameters
  const [annealProgress, setAnnealProgress] = useState<number>(0); // s in [0, 1]
  const [isAnnealing, setIsAnnealing] = useState<boolean>(false);
  const [tunnelingStrength, setTunnelingStrength] = useState<number>(2.4); // Gamma_0 in GHz
  const [annealTimeUs, setAnnealTimeUs] = useState<number>(20); // 20 microseconds
  const [energyHistory, setEnergyHistory] = useState<number[]>([]);

  // Coupling Matrix J_ij between adjacent nodes
  const couplings = [
    { from: 0, to: 1, j: -1.2 },
    { from: 1, to: 2, j: 0.8 },
    { from: 2, to: 3, j: -1.5 },
    { from: 3, to: 4, j: 0.9 },
    { from: 4, to: 5, j: -1.1 },
    { from: 5, to: 0, j: 1.4 },
    { from: 0, to: 3, j: -0.7 }, // cross coupling
  ];

  // Calculate current Ising Energy H = sum J_ij * s_i * s_j + sum h_i * s_i
  const currentEnergy = spins.reduce((sum, node) => sum + node.bias * node.spin, 0) +
    couplings.reduce((sum, c) => {
      const s1 = spins.find(s => s.id === c.from)?.spin || 1;
      const s2 = spins.find(s => s.id === c.to)?.spin || 1;
      return sum + c.j * s1 * s2;
    }, 0);

  // Toggle individual spin
  const handleToggleSpin = (id: number) => {
    setSpins(prev => prev.map(s => s.id === id ? { ...s, spin: s.spin === 1 ? -1 : 1 } : s));
  };

  // Run Quantum Annealing Trajectory
  const handleRunAnneal = () => {
    setIsAnnealing(true);
    setAnnealProgress(0);
    setEnergyHistory([]);

    let s = 0;
    const history: number[] = [];

    const interval = setInterval(() => {
      s += 0.05;
      setAnnealProgress(Math.min(1, s));

      // Quantum fluctuation with tunneling probability
      setSpins(prev => prev.map(spinNode => {
        // As transverse field decreases, spins align to minimize local field
        const localField = spinNode.bias + couplings
          .filter(c => c.from === spinNode.id || c.to === spinNode.id)
          .reduce((acc, c) => {
            const neighborId = c.from === spinNode.id ? c.to : c.from;
            const neighborSpin = prev.find(n => n.id === neighborId)?.spin || 1;
            return acc + c.j * neighborSpin;
          }, 0);

        const targetSpin = localField < 0 ? 1 : -1;
        // Thermal / quantum tunneling probability
        const probFlip = (1 - s) * 0.4 + (s > 0.7 ? 0.95 : 0.5);
        return Math.random() < probFlip ? { ...spinNode, spin: targetSpin } : spinNode;
      }));

      history.push(currentEnergy);
      setEnergyHistory([...history]);

      if (s >= 1) {
        clearInterval(interval);
        setIsAnnealing(false);
      }
    }, 80);
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
            <Flame className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-base tracking-tight">Quantum Annealer & Ising Hamiltonian Engine</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                Transverse Field Ising Model
              </span>
            </div>
            <p className="text-xs opacity-70">Solve combinatorial optimization via quantum tunneling through potential barriers</p>
          </div>
        </div>

        <button
          onClick={handleRunAnneal}
          disabled={isAnnealing}
          className="px-3.5 py-1.5 rounded-lg text-white font-mono font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: currentTheme.palette.accent }}
        >
          <Play className={`w-3.5 h-3.5 ${isAnnealing ? 'animate-spin' : ''}`} />
          <span>{isAnnealing ? 'Annealing QPU...' : 'Run Quantum Annealer'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Spin Glass Graph SVG (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 rounded-xl border relative" style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}>
          <svg width="270" height="260" viewBox="0 0 270 260" className="overflow-visible select-none">
            {/* Coupling Lines */}
            {couplings.map((c, i) => {
              const fromNode = spins.find(s => s.id === c.from);
              const toNode = spins.find(s => s.id === c.to);
              if (!fromNode || !toNode) return null;

              const isFerro = c.j < 0; // Ferromagnetic (prefers aligned spins)

              return (
                <g key={i}>
                  <line 
                    x1={fromNode.x} 
                    y1={fromNode.y} 
                    x2={toNode.x} 
                    y2={toNode.y} 
                    stroke={isFerro ? '#3B82F6' : '#EF4444'} 
                    strokeWidth={Math.abs(c.j) * 2} 
                    strokeDasharray={isFerro ? '' : '3 3'}
                    opacity="0.6"
                  />
                </g>
              );
            })}

            {/* Spin Nodes */}
            {spins.map(s => {
              const isUp = s.spin === 1;
              return (
                <g key={s.id} className="cursor-pointer" onClick={() => handleToggleSpin(s.id)}>
                  <circle 
                    cx={s.x} 
                    cy={s.y} 
                    r="18" 
                    fill={isUp ? '#10B981' : '#F59E0B'} 
                    stroke="#FFFFFF" 
                    strokeWidth="2"
                    className="drop-shadow-md hover:scale-110 transition-transform"
                  />
                  <text x={s.x} y={s.y + 4} fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    {isUp ? '↑' : '↓'}
                  </text>
                  <text x={s.x} y={s.y + 30} fill="#9CA3AF" fontSize="9" textAnchor="middle" fontFamily="monospace">
                    s{s.id} ({s.bias > 0 ? `+${s.bias}` : s.bias})
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="mt-2 text-center text-xs opacity-75 font-mono">
            Click spin nodes (<span className="text-emerald-400 font-bold">↑ +1</span> / <span className="text-amber-400 font-bold">↓ -1</span>) to manually toggle magnetic orientations.
          </div>
        </div>

        {/* Right Column: Annealing Schedule & Energy Metrics (6 cols) */}
        <div className="lg:col-span-6 space-y-4 font-mono text-xs">
          {/* Energy Readout Card */}
          <div className="p-4 rounded-xl border flex items-center justify-between" style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}>
            <div>
              <span className="opacity-60 text-[10px] block">Current Ising Energy H(s)</span>
              <span className="text-xl font-bold text-amber-400">{currentEnergy.toFixed(2)} eV</span>
            </div>
            <div className="text-right">
              <span className="opacity-60 text-[10px] block">Anneal Progress (s = t/T)</span>
              <span className="text-sm font-bold text-indigo-400">{(annealProgress * 100).toFixed(0)}%</span>
            </div>
          </div>

          {/* Anneal Schedule Visualization */}
          <div className="space-y-1.5 p-3 rounded-lg border" style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}>
            <span className="text-[10px] uppercase font-bold opacity-70 block">Transverse Field Schedule A(s) vs Ising Problem B(s)</span>
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-zinc-800">
              <div style={{ width: `${(1 - annealProgress) * 100}%` }} className="bg-purple-500 h-full transition-all" title="Transverse Tunneling Field A(s)" />
              <div style={{ width: `${annealProgress * 100}%` }} className="bg-amber-500 h-full transition-all" title="Problem Hamiltonian B(s)" />
            </div>
            <div className="flex justify-between text-[10px] opacity-70">
              <span className="text-purple-400">Tunneling Field: {((1 - annealProgress) * tunnelingStrength).toFixed(1)} GHz</span>
              <span className="text-amber-400">Problem Weight: {(annealProgress * 100).toFixed(0)}%</span>
            </div>
          </div>

          {/* Parameters */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border space-y-1" style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}>
              <span className="text-[10px] opacity-60 block">Transverse Field (Γ₀)</span>
              <span className="font-bold text-indigo-400">{tunnelingStrength} GHz</span>
            </div>
            <div className="p-3 rounded-lg border space-y-1" style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}>
              <span className="text-[10px] opacity-60 block">Annealing Duration</span>
              <span className="font-bold text-emerald-400">{annealTimeUs} µs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
