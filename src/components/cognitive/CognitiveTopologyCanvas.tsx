import React from 'react';
import { 
  Eye, Layers, Zap, Database, ShieldCheck, 
  Cpu, Activity, Play, Pause, RotateCcw, Sparkles, CheckCircle2 
} from 'lucide-react';
import { useAdaptiveTheme } from '../../context/ThemeContext';

export type CognitiveStage = 'idle' | 'perception' | 'working_memory' | 'executive' | 'memory_retrieval' | 'safety_guard' | 'actuator';

interface Props {
  activeStage: CognitiveStage;
  isRunning: boolean;
  onToggleLoop: () => void;
  onReset: () => void;
  onStepForward: () => void;
  currentStimulus: string;
}

export const CognitiveTopologyCanvas: React.FC<Props> = ({
  activeStage,
  isRunning,
  onToggleLoop,
  onReset,
  onStepForward,
  currentStimulus,
}) => {
  const { currentTheme } = useAdaptiveTheme();

  const MODULES = [
    {
      id: 'perception' as const,
      name: 'Sensory Perception',
      subtitle: 'Multimodal Ingest & Tokenizer',
      icon: Eye,
      color: '#EC4899',
      stage: 'perception',
      description: 'Ingests text, audio, and visual tensors; projects into 768-d latent space.',
      metric: '768-D Tensor',
    },
    {
      id: 'working_memory' as const,
      name: 'Working Memory',
      subtitle: 'Transient KV Attention Buffer',
      icon: Layers,
      color: '#F59E0B',
      stage: 'working_memory',
      description: 'Maintains active context window (128K tokens) and sliding attention cache.',
      metric: '128K Tokens (84% Util)',
    },
    {
      id: 'executive' as const,
      name: 'Executive Controller',
      subtitle: 'Meta-Planner & Tool Arbiter',
      icon: Zap,
      color: '#8B5CF6',
      stage: 'executive',
      description: 'Deconstructs goals into Tree-of-Thought branches and schedules atomic tool calls.',
      metric: 'Tree-of-Thought (Depth 4)',
    },
    {
      id: 'memory_retrieval' as const,
      name: 'Dual Memory Core',
      subtitle: 'Episodic Vectors + Knowledge Graph',
      icon: Database,
      color: '#3B82F6',
      stage: 'memory_retrieval',
      description: 'Retrieves cosine-similar embeddings and queries symbolic knowledge triples.',
      metric: 'Cosine Match (0.962)',
    },
    {
      id: 'safety_guard' as const,
      name: 'Safety & Alignment',
      subtitle: 'Neuromorphic Guardrail Filter',
      icon: ShieldCheck,
      color: '#10B981',
      stage: 'safety_guard',
      description: 'Zero-trust verification verifying privilege escalation, privacy, and bias bounds.',
      metric: '0 Policy Violations',
    },
    {
      id: 'actuator' as const,
      name: 'Actuator & Emitter',
      subtitle: 'Structured Output Synthesizer',
      icon: Cpu,
      color: '#06B6D4',
      stage: 'actuator',
      description: 'Decodes final latent tensors into structured JSON, code artifacts, or actions.',
      metric: '18.4ms Latency',
    },
  ];

  return (
    <div 
      className="border rounded-2xl p-6 shadow-sm space-y-6 transition-all"
      style={{
        backgroundColor: currentTheme.palette.surface,
        borderColor: currentTheme.palette.border,
        color: currentTheme.palette.textPrimary,
      }}
    >
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b" style={{ borderColor: currentTheme.palette.border }}>
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center border"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.borderStrong,
            }}
          >
            <Activity className="w-5 h-5 text-fuchsia-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-base tracking-tight">Neuro-Symbolic Topology Graph</h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                isRunning ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 animate-pulse' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}>
                {isRunning ? `ACTIVE LOOP • ${activeStage.toUpperCase()}` : 'COGNITIVE STANDBY'}
              </span>
            </div>
            <p className="text-xs opacity-70">Interactive synchronous data-flow across 6 cognitive subsystems</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onStepForward}
            disabled={isRunning}
            className="px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold flex items-center space-x-1.5 transition-all hover:bg-white/5 disabled:opacity-40"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.borderStrong,
            }}
            title="Step through one cognitive cycle"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Step Cycle</span>
          </button>

          <button
            onClick={onReset}
            className="p-1.5 rounded-lg border opacity-70 hover:opacity-100 transition-all hover:text-red-400"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.borderStrong,
            }}
            title="Reset Cognitive Loop"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleLoop}
            className="px-4 py-1.5 rounded-lg text-white font-mono font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all hover:opacity-90"
            style={{ backgroundColor: currentTheme.palette.accent }}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'Pause Loop' : 'Execute Full Loop'}</span>
          </button>
        </div>
      </div>

      {/* Grid of 6 Modules with Visual Synapses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODULES.map((mod, idx) => {
          const Icon = mod.icon;
          const isActive = activeStage === mod.stage;
          const isPassed = activeStage !== 'idle' && (
            (mod.stage === 'perception') ||
            (mod.stage === 'working_memory' && activeStage !== 'perception') ||
            (mod.stage === 'executive' && (activeStage === 'executive' || activeStage === 'memory_retrieval' || activeStage === 'safety_guard' || activeStage === 'actuator')) ||
            (mod.stage === 'memory_retrieval' && (activeStage === 'memory_retrieval' || activeStage === 'safety_guard' || activeStage === 'actuator')) ||
            (mod.stage === 'safety_guard' && (activeStage === 'safety_guard' || activeStage === 'actuator')) ||
            (mod.stage === 'actuator' && activeStage === 'actuator')
          );

          return (
            <div
              key={mod.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 relative overflow-hidden ${
                isActive 
                  ? 'ring-2 shadow-lg scale-[1.02]' 
                  : isPassed 
                    ? 'shadow-sm opacity-90' 
                    : 'opacity-65'
              }`}
              style={{
                backgroundColor: isActive ? currentTheme.palette.surfaceRaised : currentTheme.palette.surface,
                borderColor: isActive ? mod.color : currentTheme.palette.border,
                boxShadow: isActive ? `0 0 0 2px ${mod.color}` : undefined,
              }}
            >
              {/* Active Synapse Progress Bar */}
              <div 
                className="absolute top-0 left-0 right-0 h-1 transition-all duration-300"
                style={{
                  backgroundColor: isActive ? mod.color : isPassed ? `${mod.color}88` : 'transparent',
                }}
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center border"
                    style={{
                      backgroundColor: `${mod.color}18`,
                      borderColor: `${mod.color}40`,
                      color: mod.color,
                    }}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                  </div>
                  <span 
                    className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                    style={{
                      backgroundColor: `${mod.color}15`,
                      color: mod.color,
                      borderColor: `${mod.color}30`,
                    }}
                  >
                    Step 0{idx + 1}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-xs tracking-tight" style={{ color: currentTheme.palette.textPrimary }}>
                    {mod.name}
                  </h4>
                  <span className="text-[10px] font-mono opacity-60 block">{mod.subtitle}</span>
                </div>

                <p className="text-[11px] opacity-75 line-clamp-2 leading-relaxed" style={{ color: currentTheme.palette.textSecondary }}>
                  {mod.description}
                </p>
              </div>

              {/* Status and Metric */}
              <div className="pt-2 border-t flex items-center justify-between text-[10px] font-mono" style={{ borderColor: currentTheme.palette.border }}>
                <span className="opacity-70">{mod.metric}</span>
                <span className={`font-bold ${isActive ? 'text-emerald-400 animate-pulse' : isPassed ? 'text-indigo-400' : 'opacity-40'}`}>
                  {isActive ? 'PROCESSING...' : isPassed ? 'SYNAPSE OK' : 'IDLE'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stimulus Ingest Bar */}
      <div className="p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs" style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}>
        <div className="flex items-center space-x-2 overflow-hidden">
          <span className="text-[10px] uppercase font-bold opacity-60 shrink-0">Active Stimulus Ingest:</span>
          <span className="text-indigo-400 font-bold truncate">"{currentStimulus}"</span>
        </div>
        <div className="flex items-center space-x-2 text-[10px] shrink-0">
          <span className="px-2.5 py-1 rounded-lg border font-mono" style={{ backgroundColor: currentTheme.palette.surface, borderColor: currentTheme.palette.borderStrong }}>
            <span className="opacity-60">Latent Dimension:</span> <strong className="text-fuchsia-400 font-bold">768-D</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg border font-mono" style={{ backgroundColor: currentTheme.palette.surface, borderColor: currentTheme.palette.borderStrong }}>
            <span className="opacity-60">Sampling:</span> <strong className="text-emerald-400 font-bold">Deterministic</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
