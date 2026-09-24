import React, { useState, useEffect, useRef } from 'react';
import { 
  Atom, Sparkles, Sliders, RefreshCw, Play, Pause, 
  RotateCw, Zap, Compass, CheckCircle2, ChevronRight, Activity
} from 'lucide-react';
import { useAdaptiveTheme } from '../../context/ThemeContext';

export const BlochSphereVisualizer: React.FC = () => {
  const { currentTheme } = useAdaptiveTheme();

  // Spherical Coordinates
  const [theta, setTheta] = useState<number>(60); // polar angle [0, 180 deg]
  const [phi, setPhi] = useState<number>(45); // azimuthal angle [0, 360 deg]
  const [purity, setPurity] = useState<number>(1.0); // radius [0, 1.0] for mixed states

  // Precession animation state
  const [isPrecessing, setIsPrecessing] = useState<boolean>(false);
  const precessionRef = useRef<number | null>(null);

  // Single-Shot Measurement State
  const [measurementHistory, setMeasurementHistory] = useState<Array<'|0⟩' | '|1⟩'>>([]);
  const [lastShot, setLastShot] = useState<'|0⟩' | '|1⟩' | null>(null);
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);

  // Math conversions
  const thetaRad = (theta * Math.PI) / 180;
  const phiRad = (phi * Math.PI) / 180;

  // Quantum Amplitudes & Probabilities
  const alpha = Math.cos(thetaRad / 2);
  const betaMag = Math.sin(thetaRad / 2);
  const prob0 = Math.pow(alpha, 2);
  const prob1 = Math.pow(betaMag, 2);

  // Pauli Expectation Values: <X> = r*sin(th)*cos(ph), <Y> = r*sin(th)*sin(ph), <Z> = r*cos(th)
  const expX = purity * Math.sin(thetaRad) * Math.cos(phiRad);
  const expY = purity * Math.sin(thetaRad) * Math.sin(phiRad);
  const expZ = purity * Math.cos(thetaRad);

  // SVG 3D Isometric Projection
  // Sphere Radius R = 85, Center (125, 125)
  const R = 85;
  const cx = 125;
  const cy = 125;

  // 3D vector tip with isometric tilt (tilt sphere towards viewer by 20 deg)
  const tiltRad = (20 * Math.PI) / 180;
  const vecX = expX;
  const vecY = expY * Math.cos(tiltRad) - expZ * Math.sin(tiltRad);
  const vecZ = expY * Math.sin(tiltRad) + expZ * Math.cos(tiltRad);

  const px = cx + R * vecX;
  const py = cy - R * vecZ;

  // Precession Loop (Larmor precession around Z axis)
  useEffect(() => {
    if (isPrecessing) {
      const interval = setInterval(() => {
        setPhi((prev) => (prev + 3) % 360);
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isPrecessing]);

  // Single-shot quantum projective measurement
  const handleMeasure = () => {
    setIsMeasuring(true);
    setTimeout(() => {
      const outcome: '|0⟩' | '|1⟩' = Math.random() < prob0 ? '|0⟩' : '|1⟩';
      setLastShot(outcome);
      setMeasurementHistory((prev) => [outcome, ...prev].slice(0, 15));
      setIsMeasuring(false);
    }, 250);
  };

  const handleApplyPreset = (presetTheta: number, presetPhi: number) => {
    setTheta(presetTheta);
    setPhi(presetPhi);
    setPurity(1.0);
  };

  // Shot Statistics
  const totalShots = measurementHistory.length;
  const count0 = measurementHistory.filter((s) => s === '|0⟩').length;
  const count1 = measurementHistory.filter((s) => s === '|1⟩').length;
  const empiricalPct0 = totalShots > 0 ? ((count0 / totalShots) * 100).toFixed(1) : (prob0 * 100).toFixed(1);

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
        <div className="flex items-center space-x-2.5">
          <div 
            className="w-9 h-9 rounded-xl flex items-center justify-center border"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.borderStrong,
            }}
          >
            <Compass className="w-5 h-5" style={{ color: currentTheme.palette.accent }} />
          </div>
          <div>
            <h3 className="font-bold text-base tracking-tight">Bloch Sphere 3D State Visualizer</h3>
            <p className="text-xs opacity-70">Single-qubit superposition vector and Pauli expectation metrics</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPrecessing(!isPrecessing)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold flex items-center space-x-1.5 transition-all ${
              isPrecessing 
                ? 'bg-purple-500/15 text-purple-400 border-purple-500/40' 
                : 'opacity-80 hover:opacity-100'
            }`}
            style={!isPrecessing ? {
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.borderStrong,
            } : {}}
          >
            {isPrecessing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPrecessing ? 'Precessing' : 'Larmor Precession'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: 3D SVG Bloch Sphere (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-xl border relative" style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}>
          <svg width="250" height="250" viewBox="0 0 250 250" className="overflow-visible select-none">
            <defs>
              <radialGradient id="sphereGlow" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.02" />
              </radialGradient>
              <linearGradient id="vectorGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
            </defs>

            {/* Sphere Background Glow */}
            <circle cx={cx} cy={cy} r={R} fill="url(#sphereGlow)" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

            {/* Equator Ellipse */}
            <ellipse cx={cx} cy={cy} rx={R} ry={R * 0.35} fill="none" stroke="#6B7280" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />

            {/* Prime Meridian Ellipse */}
            <ellipse cx={cx} cy={cy} rx={R * 0.35} ry={R} fill="none" stroke="#6B7280" strokeWidth="1" strokeDasharray="2 2" opacity="0.3" />

            {/* X, Y, Z Coordinate Axes */}
            {/* Z-Axis (Vertical) */}
            <line x1={cx} y1={cy - R - 15} x2={cx} y2={cy + R + 15} stroke="#9CA3AF" strokeWidth="1.2" opacity="0.7" />
            <text x={cx + 6} y={cy - R - 5} fill="#10B981" fontSize="11" fontWeight="bold" fontFamily="monospace">|0⟩ (+z)</text>
            <text x={cx + 6} y={cy + R + 14} fill="#EF4444" fontSize="11" fontWeight="bold" fontFamily="monospace">|1⟩ (-z)</text>

            {/* X-Axis (Diagonal Left) */}
            <line x1={cx - R * 0.85} y1={cy + R * 0.4} x2={cx + R * 0.85} y2={cy - R * 0.4} stroke="#9CA3AF" strokeWidth="1" opacity="0.5" strokeDasharray="2 2" />
            <text x={cx + R * 0.85 + 4} y={cy - R * 0.4} fill="#6366F1" fontSize="10" fontFamily="monospace">|+⟩ (+x)</text>

            {/* Y-Axis (Horizontal) */}
            <line x1={cx - R - 12} y1={cy} x2={cx + R + 12} stroke="#9CA3AF" strokeWidth="1" opacity="0.5" strokeDasharray="2 2" />
            <text x={cx + R + 14} y={cy + 3} fill="#EC4899" fontSize="10" fontFamily="monospace">|+i⟩ (+y)</text>

            {/* Center Origin Dot */}
            <circle cx={cx} cy={cy} r="2.5" fill="#9CA3AF" />

            {/* State Vector Line */}
            <line 
              x1={cx} 
              y1={cy} 
              x2={px} 
              y2={py} 
              stroke="url(#vectorGrad)" 
              strokeWidth="3" 
              strokeLinecap="round"
            />

            {/* Vector Tip Sphere */}
            <circle 
              cx={px} 
              cy={py} 
              r="6.5" 
              fill="#10B981" 
              stroke="#FFFFFF" 
              strokeWidth="2"
              className="drop-shadow-md cursor-pointer transition-transform"
            />
          </svg>

          {/* Dirac Ket State readout badge */}
          <div className="mt-2 px-3 py-1.5 rounded-lg border font-mono text-xs font-bold text-center w-full shadow-2xs" style={{ backgroundColor: currentTheme.palette.surface, borderColor: currentTheme.palette.borderStrong }}>
            <span className="text-emerald-500">|ψ⟩</span> = {alpha.toFixed(3)}|0⟩ + {betaMag.toFixed(3)}e<sup>{phi}°i</sup>|1⟩
          </div>
        </div>

        {/* Right Column: Controls & Quantum Expectation Values (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Quick Presets */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase opacity-65">Basis State Presets</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: '|0⟩ (Ground)', th: 0, ph: 0 },
                { label: '|1⟩ (Excited)', th: 180, ph: 0 },
                { label: '|+⟩ (Superposition)', th: 90, ph: 0 },
                { label: '|-⟩ (Superposition)', th: 90, ph: 180 },
                { label: '|+i⟩ (Phase +Y)', th: 90, ph: 90 },
                { label: '|-i⟩ (Phase -Y)', th: 90, ph: 270 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handleApplyPreset(preset.th, preset.ph)}
                  className="px-2.5 py-1 rounded-md border text-[11px] font-mono font-semibold transition-all hover:border-purple-400"
                  style={{
                    backgroundColor: currentTheme.palette.surfaceRaised,
                    borderColor: currentTheme.palette.borderStrong,
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders: Polar Angle θ, Phase Angle φ, and Purity r */}
          <div className="space-y-3 pt-2">
            {/* Theta */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="opacity-75">Polar Angle (θ): <span className="font-bold">{theta}°</span></span>
                <span className="opacity-50">Prob(|0⟩) = {(prob0 * 100).toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                value={theta}
                onChange={(e) => setTheta(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer h-1.5 rounded-lg bg-zinc-700"
              />
            </div>

            {/* Phi */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="opacity-75">Azimuthal Phase (φ): <span className="font-bold">{phi}°</span></span>
                <span className="opacity-50">e<sup>iφ</sup> = ({Math.cos(phiRad).toFixed(2)} + {Math.sin(phiRad).toFixed(2)}i)</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={phi}
                onChange={(e) => setPhi(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer h-1.5 rounded-lg bg-zinc-700"
              />
            </div>

            {/* Purity / Decoherence */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="opacity-75">State Purity (r): <span className="font-bold">{purity.toFixed(2)}</span></span>
                <span className="opacity-50">{purity === 1.0 ? 'Pure State' : 'Mixed State (Decohered)'}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={purity}
                onChange={(e) => setPurity(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 rounded-lg bg-zinc-700"
              />
            </div>
          </div>

          {/* Pauli Expectation Values & Projective Measurement */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-xs font-mono">
            <div className="p-2 rounded-lg border text-center" style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}>
              <span className="text-[10px] opacity-60 block">⟨σ_x⟩ Expectation</span>
              <span className="font-bold text-blue-400">{expX.toFixed(3)}</span>
            </div>
            <div className="p-2 rounded-lg border text-center" style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}>
              <span className="text-[10px] opacity-60 block">⟨σ_y⟩ Expectation</span>
              <span className="font-bold text-pink-400">{expY.toFixed(3)}</span>
            </div>
            <div className="p-2 rounded-lg border text-center" style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}>
              <span className="text-[10px] opacity-60 block">⟨σ_z⟩ Expectation</span>
              <span className="font-bold text-emerald-400">{expZ.toFixed(3)}</span>
            </div>
          </div>

          {/* Single-Shot Measurement Simulator */}
          <div className="p-3.5 rounded-xl border space-y-2.5" style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Quantum Projective Measurement</span>
              </span>
              <button
                onClick={handleMeasure}
                disabled={isMeasuring}
                className="px-3 py-1 rounded-md text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-xs disabled:opacity-50"
                style={{ backgroundColor: currentTheme.palette.accent }}
              >
                {isMeasuring ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Activity className="w-3 h-3" />}
                <span>Measure Qubit</span>
              </button>
            </div>

            {/* Probability Progress Bar */}
            <div className="space-y-1">
              <div className="w-full h-2 rounded-full overflow-hidden flex bg-zinc-800">
                <div style={{ width: `${prob0 * 100}%` }} className="bg-emerald-500 h-full transition-all duration-300" title={`P(|0>) = ${(prob0 * 100).toFixed(1)}%`} />
                <div style={{ width: `${prob1 * 100}%` }} className="bg-red-500 h-full transition-all duration-300" title={`P(|1>) = ${(prob1 * 100).toFixed(1)}%`} />
              </div>
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-emerald-500 font-bold">P(|0⟩): {(prob0 * 100).toFixed(1)}%</span>
                {lastShot && (
                  <span className="font-bold text-amber-400 animate-pulse">Collapsed to: {lastShot}</span>
                )}
                <span className="text-red-400 font-bold">P(|1⟩): {(prob1 * 100).toFixed(1)}%</span>
              </div>
            </div>

            {/* Measurement History Log */}
            {measurementHistory.length > 0 && (
              <div className="pt-1 text-[10px] font-mono flex items-center space-x-1 overflow-x-auto opacity-80">
                <span className="opacity-60">History:</span>
                {measurementHistory.map((res, idx) => (
                  <span
                    key={idx}
                    className={`px-1.5 py-0.2 rounded ${res === '|0⟩' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}
                  >
                    {res}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
