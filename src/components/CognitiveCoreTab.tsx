import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, Activity, Network, Layers, 
  GitBranch, Database, ChevronRight, Play, 
  Pause, RotateCcw, Sparkles, Send, Zap, CheckCircle2,
  Cpu
} from 'lucide-react';
import { useAdaptiveTheme } from '../context/ThemeContext';
import { CognitiveTopologyCanvas, CognitiveStage } from './cognitive/CognitiveTopologyCanvas';
import { AttentionHeatmapViewer } from './cognitive/AttentionHeatmapViewer';
import { SymbolicKnowledgeGraph } from './cognitive/SymbolicKnowledgeGraph';
import { TreeOfThoughtPlanner } from './cognitive/TreeOfThoughtPlanner';
import { PersistentCognitiveStore } from './cognitive/PersistentCognitiveStore';
import { ApexCognitiveOS } from './cognitive/ApexCognitiveOS';
import { ApexLearningEngine } from './cognitive/ApexLearningEngine';

type CognitiveTab = 'apex_os' | 'learning_engine' | 'topology' | 'attention' | 'knowledge_graph' | 'tot_planner' | 'memory_store';

export const CognitiveCoreTab: React.FC = () => {
  const { currentTheme } = useAdaptiveTheme();

  // Active Sub-Tab
  const [activeTab, setActiveTab] = useState<CognitiveTab>('apex_os');

  // Cognitive Loop State
  const [activeStage, setActiveStage] = useState<CognitiveStage>('idle');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [inputQuery, setInputQuery] = useState<string>('Analyze visual telemetry and cross-reference with historical failure modes.');
  const [neuralLogs, setNeuralLogs] = useState<string[]>([
    '[INIT] Neuro-Symbolic Cognitive Core standby.',
    '[CALIBRATION] Latent dimension set to 768-D. Multi-head attention initialized (8 Heads).',
  ]);

  // Automated Cognitive Cycle
  useEffect(() => {
    if (!isRunning) return;

    const stages: CognitiveStage[] = [
      'perception',
      'working_memory',
      'executive',
      'memory_retrieval',
      'safety_guard',
      'actuator',
    ];

    let currentIdx = 0;

    const interval = setInterval(() => {
      if (currentIdx < stages.length) {
        const nextStage = stages[currentIdx];
        setActiveStage(nextStage);

        // Add log
        switch (nextStage) {
          case 'perception':
            setNeuralLogs(l => [...l, `[PERCEPTION] Tokenizing stimulus into 768-D tensor embeddings...`]);
            break;
          case 'working_memory':
            setNeuralLogs(l => [...l, `[WORKING MEMORY] Allocated 128K context window. Softmax attention computed across 8 heads.`]);
            break;
          case 'executive':
            setNeuralLogs(l => [...l, `[EXECUTIVE] Decomposing goals into Tree-of-Thought branches (V(s) = 0.94).`]);
            break;
          case 'memory_retrieval':
            setNeuralLogs(l => [...l, `[DUAL MEMORY] Cosine similarity search matched historical cluster (Score: 0.962). Traversing symbolic knowledge triples.`]);
            break;
          case 'safety_guard':
            setNeuralLogs(l => [...l, `[SAFETY GUARD] Zero-trust validation passed. 0 policy violations detected.`]);
            break;
          case 'actuator':
            setNeuralLogs(l => [...l, `[ACTUATOR] Latent state synthesized into deterministic action payload in 18.4ms.`]);
            break;
        }

        currentIdx++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setNeuralLogs(l => [...l, `[SYSTEM] Cognitive loop completed successfully with high fidelity.`]);
      }
    }, 1100);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleToggleLoop = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      setActiveStage('perception');
      setIsRunning(true);
      setNeuralLogs(l => [...l, `--- Starting new Cognitive Cycle for: "${inputQuery}" ---`]);
    }
  };

  const handleStepForward = () => {
    const sequence: CognitiveStage[] = [
      'idle', 'perception', 'working_memory', 'executive', 'memory_retrieval', 'safety_guard', 'actuator'
    ];
    const curr = sequence.indexOf(activeStage);
    const next = sequence[(curr + 1) % sequence.length];
    setActiveStage(next);
    setNeuralLogs(l => [...l, `[STEP] Advanced cognitive stage to: ${next.toUpperCase()}`]);
  };

  const handleReset = () => {
    setIsRunning(false);
    setActiveStage('idle');
    setNeuralLogs(l => [...l, `[RESET] Cognitive loop reset to idle state.`]);
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
            <BrainCircuit className="w-3.5 h-3.5 animate-pulse" />
            <span>Neuro-Symbolic Cognitive Core • Architecture Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Cognitive Architecture Engine</h1>
          <p className="text-xs sm:text-sm max-w-2xl opacity-75 leading-relaxed">
            Simulate and orchestrate multi-modal perception, multi-head attention matrices, Tree-of-Thought executive planning, and dual episodic-symbolic memory systems.
          </p>
        </div>

        {/* Telemetry Indicator */}
        <div 
          className="grid grid-cols-2 gap-3 p-4 rounded-xl border font-mono text-xs"
          style={{
            backgroundColor: currentTheme.palette.surfaceRaised,
            borderColor: currentTheme.palette.borderStrong,
          }}
        >
          <div>
            <span className="block text-[10px] opacity-60">Latent Space:</span>
            <span className="font-bold text-fuchsia-400">768-D Tensor</span>
          </div>
          <div>
            <span className="block text-[10px] opacity-60">Attention Heads:</span>
            <span className="font-bold text-amber-400">8 Multi-Heads</span>
          </div>
          <div>
            <span className="block text-[10px] opacity-60">Working Context:</span>
            <span className="font-bold text-indigo-400">128K Tokens</span>
          </div>
          <div>
            <span className="block text-[10px] opacity-60">Loop Latency:</span>
            <span className="font-bold text-emerald-400">18.4 ms</span>
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
          { id: 'apex_os' as const, label: 'APEX Cognitive OS', icon: Cpu },
          { id: 'learning_engine' as const, label: 'APEX Learning Engine', icon: Sparkles },
          { id: 'topology' as const, label: 'Cognitive Topology Graph', icon: Network },
          { id: 'attention' as const, label: 'Attention Heatmap & KV Cache', icon: Layers },
          { id: 'knowledge_graph' as const, label: 'Symbolic Knowledge Graph', icon: Database },
          { id: 'tot_planner' as const, label: 'Tree-of-Thought Planner', icon: GitBranch },
          { id: 'memory_store' as const, label: 'Persistent Memory Core', icon: BrainCircuit },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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

      {/* APEX COGNITIVE OS TAB */}
      {activeTab === 'apex_os' && (
        <ApexCognitiveOS />
      )}

      {/* APEX LEARNING ENGINE TAB */}
      {activeTab === 'learning_engine' && (
        <ApexLearningEngine />
      )}

      {/* TOPOLOGY TAB (Interactive Canvas + Live Neural Stream) */}
      {activeTab === 'topology' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Interactive Canvas (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <CognitiveTopologyCanvas
                activeStage={activeStage}
                isRunning={isRunning}
                onToggleLoop={handleToggleLoop}
                onReset={handleReset}
                onStepForward={handleStepForward}
                currentStimulus={inputQuery}
              />

              {/* Stimulus Input Field */}
              <div 
                className="border rounded-2xl p-6 shadow-sm space-y-3 transition-all"
                style={{
                  backgroundColor: currentTheme.palette.surface,
                  borderColor: currentTheme.palette.border,
                  color: currentTheme.palette.textPrimary,
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold uppercase opacity-75">
                    Sensory Stimulus Ingest (Multi-Modal Prompt)
                  </span>
                  <span className="text-[10px] font-mono opacity-50">
                    Input tensor tokenization target
                  </span>
                </div>
                <textarea
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  disabled={isRunning}
                  rows={3}
                  className="w-full p-3.5 rounded-xl border text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-fuchsia-500 disabled:opacity-50 transition-all"
                  style={{
                    backgroundColor: currentTheme.palette.surfaceRaised,
                    borderColor: currentTheme.palette.borderStrong,
                    color: currentTheme.palette.textPrimary,
                  }}
                  placeholder="Enter input query or sensory stimulus to process through the cognitive pipeline..."
                />
              </div>
            </div>

            {/* Right: Neural Event Stream Log (4 cols) */}
            <div className="lg:col-span-4">
              <div 
                className="border rounded-2xl shadow-sm flex flex-col h-[520px] overflow-hidden sticky top-6"
                style={{
                  backgroundColor: currentTheme.appearance === 'light' ? '#18181B' : '#09090B',
                  borderColor: currentTheme.palette.borderStrong,
                }}
              >
                {/* Event Header */}
                <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between bg-black/40">
                  <div className="flex items-center space-x-2 text-white">
                    <Activity className="w-4 h-4 text-fuchsia-400" />
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider">Neural Event Stream</h4>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-ping' : 'bg-zinc-600'}`} />
                    <span className="text-[10px] font-mono text-zinc-400">{isRunning ? 'STREAMING' : 'IDLE'}</span>
                  </div>
                </div>

                {/* Log List */}
                <div className="p-4 flex-1 overflow-y-auto space-y-2.5 font-mono text-[11px] text-zinc-300">
                  {neuralLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start space-x-1.5 leading-relaxed animate-fadeIn">
                      <ChevronRight className="w-3.5 h-3.5 text-fuchsia-400 shrink-0 mt-0.5" />
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ATTENTION & KV CACHE TAB */}
      {activeTab === 'attention' && (
        <AttentionHeatmapViewer stimulus={inputQuery} />
      )}

      {/* KNOWLEDGE GRAPH TAB */}
      {activeTab === 'knowledge_graph' && (
        <SymbolicKnowledgeGraph />
      )}

      {/* TREE OF THOUGHT PLANNER TAB */}
      {activeTab === 'tot_planner' && (
        <TreeOfThoughtPlanner stimulus={inputQuery} />
      )}

      {/* PERSISTENT MEMORY STORE TAB */}
      {activeTab === 'memory_store' && (
        <PersistentCognitiveStore />
      )}
    </div>
  );
};
