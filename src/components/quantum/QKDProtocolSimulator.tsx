import React, { useState } from 'react';
import { 
  Key, ShieldCheck, ShieldAlert, Zap, Play, 
  RotateCcw, Eye, Lock, Unlock, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { useAdaptiveTheme } from '../../context/ThemeContext';

export interface QKDPhoton {
  id: number;
  aliceBit: 0 | 1;
  aliceBasis: '+' | 'x';
  aliceState: '|0⟩' | '|1⟩' | '|+⟩' | '|-⟩';
  eveIntercepted: boolean;
  eveBasis?: '+' | 'x';
  bobBasis: '+' | 'x';
  bobMeasuredBit: 0 | 1;
  basesMatch: boolean;
  bitError: boolean;
}

export const QKDProtocolSimulator: React.FC = () => {
  const { currentTheme } = useAdaptiveTheme();

  const [numPhotons, setNumPhotons] = useState<number>(12);
  const [eveEavesdropRate, setEveEavesdropRate] = useState<number>(50); // 50% intercept probability
  const [photons, setPhotons] = useState<QKDPhoton[]>([]);
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);
  const [protocolStatus, setProtocolStatus] = useState<string | null>(null);

  // Generate and transmit photon stream
  const handleTransmit = () => {
    setIsTransmitting(true);
    setProtocolStatus(null);

    setTimeout(() => {
      const generated: QKDPhoton[] = [];

      for (let i = 0; i < numPhotons; i++) {
        // 1. Alice generates random bit and basis
        const aliceBit: 0 | 1 = Math.random() > 0.5 ? 1 : 0;
        const aliceBasis: '+' | 'x' = Math.random() > 0.5 ? '+' : 'x';

        let aliceState: '|0⟩' | '|1⟩' | '|+⟩' | '|-⟩' = '|0⟩';
        if (aliceBasis === '+') {
          aliceState = aliceBit === 0 ? '|0⟩' : '|1⟩';
        } else {
          aliceState = aliceBit === 0 ? '|+⟩' : '|-⟩';
        }

        // 2. Eve intercept-resend attack
        const eveIntercepted = Math.random() * 100 < eveEavesdropRate;
        const eveBasis: '+' | 'x' = Math.random() > 0.5 ? '+' : 'x';
        
        let photonAfterEveBit = aliceBit;
        if (eveIntercepted && eveBasis !== aliceBasis) {
          // Eve measures in wrong basis, collapses quantum state randomly
          photonAfterEveBit = Math.random() > 0.5 ? 1 : 0;
        }

        // 3. Bob chooses random basis to measure
        const bobBasis: '+' | 'x' = Math.random() > 0.5 ? '+' : 'x';
        let bobMeasuredBit: 0 | 1 = photonAfterEveBit;

        if (bobBasis !== (eveIntercepted ? eveBasis : aliceBasis)) {
          // Mismatched basis gives 50/50 random collapse
          bobMeasuredBit = Math.random() > 0.5 ? 1 : 0;
        }

        const basesMatch = aliceBasis === bobBasis;
        const bitError = basesMatch && aliceBit !== bobMeasuredBit;

        generated.push({
          id: i + 1,
          aliceBit,
          aliceBasis,
          aliceState,
          eveIntercepted,
          eveBasis: eveIntercepted ? eveBasis : undefined,
          bobBasis,
          bobMeasuredBit,
          basesMatch,
          bitError,
        });
      }

      setPhotons(generated);

      // Sifted Key calculation
      const sifted = generated.filter(p => p.basesMatch);
      const errors = sifted.filter(p => p.bitError).length;
      const qber = sifted.length > 0 ? (errors / sifted.length) * 100 : 0;

      if (qber > 11.0) {
        setProtocolStatus(`ALERT: QBER is ${qber.toFixed(1)}% (Threshold: 11.0%). Quantum Eavesdropper Detected! Transmission aborted.`);
      } else {
        setProtocolStatus(`SUCCESS: QBER is ${qber.toFixed(1)}% (< 11.0%). Established ${sifted.length - errors}-bit provably secure quantum key!`);
      }

      setIsTransmitting(false);
    }, 600);
  };

  const siftedPhotons = photons.filter(p => p.basesMatch);
  const errorCount = siftedPhotons.filter(p => p.bitError).length;
  const currentQber = siftedPhotons.length > 0 ? (errorCount / siftedPhotons.length) * 100 : 0;

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
            <Key className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-base tracking-tight">Quantum Key Distribution (BB84 Protocol)</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                Quantum Cryptography
              </span>
            </div>
            <p className="text-xs opacity-70">Simulate photon polarization transmission, eavesdropping detection, and basis sifting</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleTransmit}
            disabled={isTransmitting}
            className="px-3.5 py-1.5 rounded-lg text-white font-mono font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: currentTheme.palette.accent }}
          >
            <Play className={`w-3.5 h-3.5 ${isTransmitting ? 'animate-spin' : ''}`} />
            <span>{isTransmitting ? 'Transmitting Photons...' : 'Send Photon Stream'}</span>
          </button>
        </div>
      </div>

      {/* Control Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        <div className="p-3 rounded-lg border space-y-1.5" style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}>
          <div className="flex justify-between">
            <span className="opacity-75 flex items-center space-x-1">
              <Eye className="w-3.5 h-3.5 text-red-400" />
              <span>Eve Eavesdrop Probability: <strong className="text-red-400">{eveEavesdropRate}%</strong></span>
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={eveEavesdropRate}
            onChange={(e) => setEveEavesdropRate(Number(e.target.value))}
            className="w-full accent-red-500 cursor-pointer h-1.5 rounded-lg bg-zinc-700"
          />
        </div>

        <div className="p-3 rounded-lg border space-y-1.5" style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}>
          <div className="flex justify-between">
            <span className="opacity-75">Quantum Bit Error Rate (QBER): <strong className={currentQber > 11 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>{currentQber.toFixed(1)}%</strong></span>
            <span className="text-[10px] opacity-60">Limit: 11.0%</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden bg-zinc-800">
            <div 
              style={{ width: `${Math.min(100, currentQber * 3)}%` }} 
              className={`h-full transition-all duration-300 ${currentQber > 11 ? 'bg-red-500' : 'bg-emerald-500'}`} 
            />
          </div>
        </div>
      </div>

      {/* Status Notice */}
      {protocolStatus && (
        <div className={`p-3 rounded-xl border flex items-center space-x-2.5 text-xs font-mono font-bold ${
          currentQber > 11 ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
          {currentQber > 11 ? <ShieldAlert className="w-4 h-4 shrink-0" /> : <ShieldCheck className="w-4 h-4 shrink-0" />}
          <span>{protocolStatus}</span>
        </div>
      )}

      {/* Photon Transmission Table */}
      {photons.length > 0 && (
        <div className="p-4 rounded-xl border overflow-x-auto space-y-2 font-mono text-xs" style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}>
          <span className="text-[10px] uppercase font-bold opacity-70 block">Photon Transmission & Sifting Matrix</span>
          <div className="min-w-[600px] border rounded-lg overflow-hidden" style={{ borderColor: currentTheme.palette.border }}>
            <table className="w-full text-left">
              <thead className="border-b text-[10px] uppercase opacity-70" style={{ backgroundColor: currentTheme.palette.surface, borderColor: currentTheme.palette.border }}>
                <tr>
                  <th className="p-2">#</th>
                  <th className="p-2">Alice Bit</th>
                  <th className="p-2">Alice Basis</th>
                  <th className="p-2">Photon State</th>
                  <th className="p-2">Eve Intercept</th>
                  <th className="p-2">Bob Basis</th>
                  <th className="p-2">Bob Meas</th>
                  <th className="p-2">Basis Match</th>
                  <th className="p-2">Sifted Key Bit</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: currentTheme.palette.border }}>
                {photons.map(p => (
                  <tr key={p.id} className={p.bitError ? 'bg-red-500/10' : ''}>
                    <td className="p-2 opacity-50">{p.id}</td>
                    <td className="p-2 font-bold text-indigo-400">{p.aliceBit}</td>
                    <td className="p-2">{p.aliceBasis}</td>
                    <td className="p-2 font-bold">{p.aliceState}</td>
                    <td className="p-2">{p.eveIntercepted ? <span className="text-red-400 font-bold">YES ({p.eveBasis})</span> : <span className="opacity-40">No</span>}</td>
                    <td className="p-2">{p.bobBasis}</td>
                    <td className="p-2 font-bold text-emerald-400">{p.bobMeasuredBit}</td>
                    <td className="p-2">{p.basesMatch ? <span className="text-emerald-400 font-bold">MATCH</span> : <span className="opacity-40">Discard</span>}</td>
                    <td className="p-2">
                      {p.basesMatch ? (
                        p.bitError ? (
                          <span className="text-red-400 font-bold">ERROR!</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">{p.bobMeasuredBit}</span>
                        )
                      ) : (
                        <span className="opacity-30">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
