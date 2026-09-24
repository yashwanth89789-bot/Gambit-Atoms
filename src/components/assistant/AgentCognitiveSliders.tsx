import React from 'react';
import { 
  Sliders, Brain, Zap, Shield, Eye, Layers, 
  Sparkles, CheckCircle2, Lock, Activity
} from 'lucide-react';
import { useAdaptiveTheme } from '../../context/ThemeContext';

interface Props {
  selectedModel: string;
  onChangeModel: (model: string) => void;
  temperature: number;
  onChangeTemperature: (val: number) => void;
  topP: number;
  onChangeTopP: (val: number) => void;
  reasoningSteps: number;
  onChangeReasoningSteps: (val: number) => void;
  autonomyLevel: 'Supervised' | 'Semi-Autonomous' | 'Full Autonomous';
  onChangeAutonomyLevel: (val: 'Supervised' | 'Semi-Autonomous' | 'Full Autonomous') => void;
  confidenceThreshold: number;
  onChangeConfidenceThreshold: (val: number) => void;
  memoryHorizon: 'Short-Term' | 'Hybrid Vector' | 'Infinite Graph';
  onChangeMemoryHorizon: (val: 'Short-Term' | 'Hybrid Vector' | 'Infinite Graph') => void;
}

export const AgentCognitiveSliders: React.FC<Props> = ({
  selectedModel,
  onChangeModel,
  temperature,
  onChangeTemperature,
  topP,
  onChangeTopP,
  reasoningSteps,
  onChangeReasoningSteps,
  autonomyLevel,
  onChangeAutonomyLevel,
  confidenceThreshold,
  onChangeConfidenceThreshold,
  memoryHorizon,
  onChangeMemoryHorizon,
}) => {
  const { currentTheme } = useAdaptiveTheme();

  return (
    <div className="space-y-6">
      {/* Model Selection */}
      <div className="space-y-2">
        <label className="text-xs font-mono font-bold uppercase opacity-75 flex items-center space-x-1.5">
          <Brain className="w-3.5 h-3.5 text-indigo-400" />
          <span>Foundation Cognitive Model</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro', tag: 'Max Reasoning', desc: 'Complex formal logic, mathematical proofs, and deep architecture design.' },
            { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash', tag: 'Speed & Scale', desc: 'Sub-second real-time streaming, high throughput tool execution.' },
            { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite', tag: 'Edge Low-Latency', desc: 'Lightweight deterministic routing, edge deployment, lowest memory footprint.' },
          ].map((m) => {
            const isSelected = selectedModel === m.id;
            return (
              <div
                key={m.id}
                onClick={() => onChangeModel(m.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected ? 'ring-2 shadow-sm' : 'opacity-70 hover:opacity-100 hover:border-indigo-400'
                }`}
                style={{
                  backgroundColor: isSelected ? currentTheme.palette.surfaceRaised : currentTheme.palette.surface,
                  borderColor: isSelected ? currentTheme.palette.accent : currentTheme.palette.border,
                  boxShadow: isSelected ? `0 0 0 2px ${currentTheme.palette.accent}` : undefined,
                }}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-xs" style={{ color: currentTheme.palette.textPrimary }}>
                    {m.name}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                    {m.tag}
                  </span>
                </div>
                <p className="text-[11px] opacity-75 leading-relaxed" style={{ color: currentTheme.palette.textSecondary }}>
                  {m.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
        {/* Temperature */}
        <div className="p-3.5 rounded-xl border space-y-2" style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}>
          <div className="flex justify-between items-center">
            <span className="opacity-75">Temperature (T): <strong className="text-indigo-400">{temperature.toFixed(2)}</strong></span>
            <span className="text-[10px] opacity-60">
              {temperature <= 0.2 ? 'Deterministic (Strict)' : temperature <= 0.6 ? 'Balanced Precision' : 'Creative / Exploratory'}
            </span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.05"
            value={temperature}
            onChange={(e) => onChangeTemperature(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer h-1.5 rounded-lg bg-zinc-700"
          />
          <div className="flex justify-between text-[9px] opacity-50">
            <span>0.0 (Exact Proofs)</span>
            <span>1.0 (High Entropy)</span>
          </div>
        </div>

        {/* Top-P Nucleus */}
        <div className="p-3.5 rounded-xl border space-y-2" style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}>
          <div className="flex justify-between items-center">
            <span className="opacity-75">Top-P Sampling: <strong className="text-blue-400">{topP.toFixed(2)}</strong></span>
            <span className="text-[10px] opacity-60">Cumulative Probability Mass</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={topP}
            onChange={(e) => onChangeTopP(Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer h-1.5 rounded-lg bg-zinc-700"
          />
          <div className="flex justify-between text-[9px] opacity-50">
            <span>0.1 (Greedy Filter)</span>
            <span>1.0 (Full Vocabulary)</span>
          </div>
        </div>

        {/* CoT Reasoning Depth */}
        <div className="p-3.5 rounded-xl border space-y-2" style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}>
          <div className="flex justify-between items-center">
            <span className="opacity-75">CoT Reasoning Budget: <strong className="text-purple-400">{reasoningSteps} Steps</strong></span>
            <span className="text-[10px] opacity-60">Internal Chain-of-Thought</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={reasoningSteps}
            onChange={(e) => onChangeReasoningSteps(Number(e.target.value))}
            className="w-full accent-purple-500 cursor-pointer h-1.5 rounded-lg bg-zinc-700"
          />
          <div className="flex justify-between text-[9px] opacity-50">
            <span>1 (Fast Direct)</span>
            <span>10 (Exhaustive Proofs)</span>
          </div>
        </div>

        {/* Confidence Guardrail Threshold */}
        <div className="p-3.5 rounded-xl border space-y-2" style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}>
          <div className="flex justify-between items-center">
            <span className="opacity-75">Hallucination Guardrail: <strong className="text-emerald-400">{confidenceThreshold}%</strong></span>
            <span className="text-[10px] opacity-60">Rejection Threshold</span>
          </div>
          <input
            type="range"
            min="80"
            max="99"
            step="1"
            value={confidenceThreshold}
            onChange={(e) => onChangeConfidenceThreshold(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-1.5 rounded-lg bg-zinc-700"
          />
          <div className="flex justify-between text-[9px] opacity-50">
            <span>80% (Permissive)</span>
            <span>99% (Zero-Tolerance)</span>
          </div>
        </div>
      </div>

      {/* Autonomy Level & Memory Horizon Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Autonomy Level */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold uppercase opacity-75 block">
            Execution Autonomy Tier
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            {(['Supervised', 'Semi-Autonomous', 'Full Autonomous'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => onChangeAutonomyLevel(tier)}
                className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                  autonomyLevel === tier 
                    ? 'ring-1 border-indigo-400 bg-indigo-500/15 text-indigo-300 font-bold' 
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={autonomyLevel !== tier ? {
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.borderStrong,
                } : {}}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {/* Memory Horizon */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold uppercase opacity-75 block">
            Cognitive Memory Architecture
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            {(['Short-Term', 'Hybrid Vector', 'Infinite Graph'] as const).map((mem) => (
              <button
                key={mem}
                onClick={() => onChangeMemoryHorizon(mem)}
                className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                  memoryHorizon === mem 
                    ? 'ring-1 border-purple-400 bg-purple-500/15 text-purple-300 font-bold' 
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={memoryHorizon !== mem ? {
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.borderStrong,
                } : {}}
              >
                {mem}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
