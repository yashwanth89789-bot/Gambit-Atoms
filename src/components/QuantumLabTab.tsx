import React, { useState } from 'react';
import { 
  Atom, Cpu, Sparkles, Sliders, ShieldCheck, Flame, 
  Key, Activity, RefreshCw, Layers, Compass, Search, 
  ChevronRight, BarChart3, CheckCircle2, Zap, Radio
} from 'lucide-react';
import { useAdaptiveTheme } from '../context/ThemeContext';
import { BlochSphereVisualizer } from './quantum/BlochSphereVisualizer';
import { QuantumCircuitBuilder } from './quantum/QuantumCircuitBuilder';
import { SurfaceCodeErrorCorrection } from './quantum/SurfaceCodeErrorCorrection';
import { QuantumAnnealerLab } from './quantum/QuantumAnnealerLab';
import { QKDProtocolSimulator } from './quantum/QKDProtocolSimulator';
import { PhysicalHardwareLab } from './quantum/PhysicalHardwareLab';

type QuantumModuleTab = 'overview' | 'hardware' | 'circuit' | 'bloch' | 'surface_code' | 'annealer' | 'qkd' | 'grover';

export const QuantumLabTab: React.FC = () => {
  const { currentTheme } = useAdaptiveTheme();
  const [activeModule, setActiveModule] = useState<QuantumModuleTab>('overview');

  // Grover's Search State
  const [targetItem, setTargetItem] = useState<number>(2); // Target item in 4-item database
  const [groverIteration, setGroverIteration] = useState<number>(0);
  const [isGroverRunning, setIsGroverRunning] = useState<boolean>(false);
  const [groverProbs, setGroverProbs] = useState<number[]>([0.25, 0.25, 0.25, 0.25]);

  const handleRunGroverStep = () => {
    setIsGroverRunning(true);
    setTimeout(() => {
      if (groverIteration === 0) {
        // Oracle Phase Inversion: Flip phase of target item
        setGroverIteration(1);
        setGroverProbs([0.1, 0.1, 0.1, 0.7].map((p, i) => i === targetItem ? 0.7 : 0.1));
      } else {
        // Diffusion Operator (Inversion about average): Amplifies target probability to ~95%
        setGroverIteration(2);
        const probs = [0.02, 0.02, 0.02, 0.02];
        probs[targetItem] = 0.94;
        setGroverProbs(probs);
      }
      setIsGroverRunning(false);
    }, 450);
  };

  const handleResetGrover = () => {
    setGroverIteration(0);
    setGroverProbs([0.25, 0.25, 0.25, 0.25]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div 
        className="border rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all"
        style={{
          backgroundColor: currentTheme.palette.surface,
          borderColor: currentTheme.palette.border,
          color: currentTheme.palette.textPrimary,
        }}
      >
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider" style={{ backgroundColor: `${currentTheme.palette.accent}15`, color: currentTheme.palette.accent, borderColor: `${currentTheme.palette.accent}30` }}>
            <Atom className="w-3.5 h-3.5 animate-spin" />
            <span>Quantum Processing Unit (QPU) v5.0 • Superconducting Transmon</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Quantum Computing & Co-Pilot Lab</h1>
          <p className="text-xs sm:text-sm max-w-2xl opacity-75 leading-relaxed">
            Multi-qubit circuit synthesizer, physical sub-kelvin laboratory hardware controller, SCPI instrument bus, 3D Bloch sphere vector simulator, fault-tolerant Surface Code decoder, Ising annealer, and BB84 cryptography.
          </p>
        </div>

        {/* QPU Cryogenic Telemetry Card */}
        <div 
          className="grid grid-cols-2 gap-3 p-4 rounded-xl border font-mono text-xs"
          style={{
            backgroundColor: currentTheme.palette.surfaceRaised,
            borderColor: currentTheme.palette.borderStrong,
          }}
        >
          <div>
            <span className="block text-[10px] opacity-60">Coherence ($T_2^*$):</span>
            <span className="font-bold text-emerald-400">124.8 µs</span>
          </div>
          <div>
            <span className="block text-[10px] opacity-60">Cryo Dilution:</span>
            <span className="font-bold text-indigo-400">12.4 mK</span>
          </div>
          <div>
            <span className="block text-[10px] opacity-60">2Q Gate Fidelity:</span>
            <span className="font-bold text-purple-400">99.87%</span>
          </div>
          <div>
            <span className="block text-[10px] opacity-60">Readout Fidelity:</span>
            <span className="font-bold text-amber-400">99.12%</span>
          </div>
        </div>
      </div>

      {/* Module Selector Navigation Tabs */}
      <div 
        className="flex items-center space-x-1.5 p-1.5 rounded-xl border overflow-x-auto text-xs font-mono font-bold"
        style={{
          backgroundColor: currentTheme.palette.surface,
          borderColor: currentTheme.palette.border,
        }}
      >
        {[
          { id: 'overview' as const, label: 'All Modules Overview', icon: Layers },
          { id: 'hardware' as const, label: 'Physical Lab Hardware Rig', icon: Radio },
          { id: 'circuit' as const, label: 'Circuit Matrix & Statevector', icon: Cpu },
          { id: 'bloch' as const, label: 'Bloch 3D Visualizer', icon: Compass },
          { id: 'surface_code' as const, label: 'Surface Code (QEC)', icon: ShieldCheck },
          { id: 'annealer' as const, label: 'Ising Annealer', icon: Flame },
          { id: 'qkd' as const, label: 'BB84 Cryptography', icon: Key },
          { id: 'grover' as const, label: "Grover's Search", icon: Search },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeModule === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveModule(tab.id)}
              className={`px-3.5 py-2 rounded-lg flex items-center space-x-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive ? 'shadow-xs scale-100' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: isActive ? currentTheme.palette.surfaceRaised : 'transparent',
                color: isActive ? currentTheme.palette.accent : currentTheme.palette.textPrimary,
                borderWidth: isActive ? 1 : 0,
                borderColor: isActive ? currentTheme.palette.borderStrong : 'transparent',
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Views */}
      {activeModule === 'overview' && (
        <div className="space-y-8">
          {/* Physical Laboratory Hardware Controller & Validation Rig */}
          <PhysicalHardwareLab />

          {/* Circuit Builder & Statevector */}
          <QuantumCircuitBuilder />

          {/* Bloch Sphere & Surface Code Side-by-Side on Desktop */}
          <div className="grid grid-cols-1 gap-8">
            <BlochSphereVisualizer />
            <SurfaceCodeErrorCorrection />
          </div>

          {/* Annealer & QKD Side-by-Side */}
          <div className="grid grid-cols-1 gap-8">
            <QuantumAnnealerLab />
            <QKDProtocolSimulator />
          </div>
        </div>
      )}

      {activeModule === 'hardware' && <PhysicalHardwareLab />}
      {activeModule === 'circuit' && <QuantumCircuitBuilder />}
      {activeModule === 'bloch' && <BlochSphereVisualizer />}
      {activeModule === 'surface_code' && <SurfaceCodeErrorCorrection />}
      {activeModule === 'annealer' && <QuantumAnnealerLab />}
      {activeModule === 'qkd' && <QKDProtocolSimulator />}

      {/* Grover's Search View */}
      {activeModule === 'grover' && (
        <div 
          className="border rounded-2xl p-6 shadow-sm space-y-6 transition-all"
          style={{
            backgroundColor: currentTheme.palette.surface,
            borderColor: currentTheme.palette.border,
            color: currentTheme.palette.textPrimary,
          }}
        >
          {/* Grover Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b" style={{ borderColor: currentTheme.palette.border }}>
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center border"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.borderStrong,
                }}
              >
                <Search className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-base tracking-tight">Grover's Quantum Search Algorithm</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                    O(√N) Speedup
                  </span>
                </div>
                <p className="text-xs opacity-70">Observe quantum amplitude amplification through Oracle phase marking and Diffusion inversion</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleResetGrover}
                className="px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all hover:bg-white/5"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.borderStrong,
                }}
              >
                Reset
              </button>
              <button
                onClick={handleRunGroverStep}
                disabled={isGroverRunning || groverIteration >= 2}
                className="px-3.5 py-1.5 rounded-lg text-white font-mono font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: currentTheme.palette.accent }}
              >
                <Zap className={`w-3.5 h-3.5 ${isGroverRunning ? 'animate-spin' : ''}`} />
                <span>
                  {groverIteration === 0 ? 'Apply Oracle Phase Flip' : groverIteration === 1 ? 'Apply Diffusion Operator' : 'Target Amplified!'}
                </span>
              </button>
            </div>
          </div>

          {/* Database Target Selector */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase opacity-65">Select Target Marked Item (N = 4)</span>
            <div className="grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((idx) => {
                const bin = idx.toString(2).padStart(2, '0');
                const isTarget = targetItem === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setTargetItem(idx);
                      handleResetGrover();
                    }}
                    className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                      isTarget 
                        ? 'ring-2 ring-indigo-400 border-indigo-400' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: currentTheme.palette.surfaceRaised,
                      borderColor: isTarget ? currentTheme.palette.accent : currentTheme.palette.borderStrong,
                    }}
                  >
                    <span className="text-xs font-mono opacity-50 block">Item #{idx}</span>
                    <span className="text-base font-mono font-bold block text-indigo-400">|{bin}⟩</span>
                    {isTarget && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold mt-1 inline-block">
                        Marked Oracle
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amplitude Bars */}
          <div className="p-4 rounded-xl border space-y-3 font-mono text-xs" style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}>
            <div className="flex justify-between items-center">
              <span className="font-bold">Probability Amplitude Landscape ($|\alpha_x|^2$)</span>
              <span className="text-[10px] opacity-70">
                Current Step: {groverIteration === 0 ? 'Equal Superposition' : groverIteration === 1 ? 'Phase Inversion' : 'Diffusion Amplified'}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3 pt-2">
              {groverProbs.map((prob, i) => {
                const isTarget = targetItem === i;
                const bin = i.toString(2).padStart(2, '0');
                return (
                  <div key={i} className="space-y-1.5 text-center">
                    <div className="h-32 bg-zinc-800/60 rounded-lg p-1 flex flex-col justify-end">
                      <div 
                        style={{ height: `${prob * 100}%` }} 
                        className={`w-full rounded transition-all duration-500 ${isTarget ? 'bg-indigo-500 shadow-md shadow-indigo-500/50' : 'bg-zinc-600'}`} 
                      />
                    </div>
                    <span className="block font-bold">|{bin}⟩</span>
                    <span className={`text-[11px] font-bold ${isTarget ? 'text-indigo-400' : 'opacity-60'}`}>
                      {(prob * 100).toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
