import React from 'react';
import { 
  Terminal, FileText, Database, Globe, Network, 
  Key, Atom, ShieldAlert, Cpu, Sparkles, Check, Lock
} from 'lucide-react';
import { useAdaptiveTheme } from '../../context/ThemeContext';

export interface AgentTool {
  id: string;
  name: string;
  category: 'I/O & Workspace' | 'Compute & Runtime' | 'Memory & Retrieval' | 'IPC & Security';
  riskLevel: 'Safe' | 'Moderate' | 'Privileged';
  description: string;
  signature: string;
}

export const AVAILABLE_TOOLS: AgentTool[] = [
  {
    id: 'fs.read',
    name: 'Workspace File Inspector',
    category: 'I/O & Workspace',
    riskLevel: 'Safe',
    description: 'Read file contents, inspect project structure, and parse source AST nodes.',
    signature: 'fs.readFile({ path: string }): Promise<string>',
  },
  {
    id: 'fs.write',
    name: 'Artifact & Code Emitter',
    category: 'I/O & Workspace',
    riskLevel: 'Moderate',
    description: 'Create new modules, edit existing source files, and format codebases.',
    signature: 'fs.writeFile({ path: string, content: string }): Promise<void>',
  },
  {
    id: 'bash.exec',
    name: 'Sandboxed Shell Runner',
    category: 'Compute & Runtime',
    riskLevel: 'Privileged',
    description: 'Execute build pipelines, install npm packages, and run local test suites in isolated sandbox.',
    signature: 'bash.execute({ cmd: string, timeoutMs: number }): Promise<ExecResult>',
  },
  {
    id: 'rag.vectorSearch',
    name: 'Neural Vector Knowledge Retrieval',
    category: 'Memory & Retrieval',
    riskLevel: 'Safe',
    description: 'Cosine similarity semantic search over indexed documentation and research corpus.',
    signature: 'rag.search({ query: string, topK: number }): Promise<DocChunk[]>',
  },
  {
    id: 'memory.episodicStore',
    name: 'Episodic Memory Graph',
    category: 'Memory & Retrieval',
    riskLevel: 'Safe',
    description: 'Store and recall persistent cross-session facts, user preferences, and decision histories.',
    signature: 'memory.recall({ topic: string }): Promise<MemoryRecord[]>',
  },
  {
    id: 'web.grounding',
    name: 'Live Web Grounding Ingest',
    category: 'IPC & Security',
    riskLevel: 'Moderate',
    description: 'Query live search indexes to retrieve real-time domain facts and API documentation.',
    signature: 'web.search({ query: string }): Promise<SearchResult[]>',
  },
  {
    id: 'ipc.spawnSubagent',
    name: 'Swarm Subagent Dispatcher',
    category: 'IPC & Security',
    riskLevel: 'Privileged',
    description: 'Fork autonomous child subagents for parallelized problem-solving and map-reduce tasks.',
    signature: 'ipc.spawn({ role: string, goal: string }): Promise<SubagentResult>',
  },
  {
    id: 'qpu.transmonCircuit',
    name: 'Quantum QPU Simulator Driver',
    category: 'Compute & Runtime',
    riskLevel: 'Moderate',
    description: 'Synthesize unitary quantum circuits, compute statevectors, and sample measurement shots.',
    signature: 'qpu.executeCircuit({ qasm: string, shots: number }): Promise<QpuResult>',
  },
  {
    id: 'crypto.signPayload',
    name: 'Cryptographic Key Signer',
    category: 'IPC & Security',
    riskLevel: 'Privileged',
    description: 'Sign output payloads and verify SHA-256 / Ed25519 digital signatures for zero-trust compliance.',
    signature: 'crypto.sign({ payload: string, keyId: string }): Promise<Signature>',
  },
];

interface Props {
  selectedTools: string[];
  onToggleTool: (toolId: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export const AgentToolMatrix: React.FC<Props> = ({
  selectedTools,
  onToggleTool,
  onSelectAll,
  onClearAll,
}) => {
  const { currentTheme } = useAdaptiveTheme();

  const getRiskBadge = (risk: AgentTool['riskLevel']) => {
    switch (risk) {
      case 'Safe':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Moderate':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Privileged':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b" style={{ borderColor: currentTheme.palette.border }}>
        <div>
          <span className="text-xs font-mono font-bold uppercase opacity-75 flex items-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Modular Capability & Tool Matrix ({selectedTools.length} of {AVAILABLE_TOOLS.length} Active)</span>
          </span>
          <p className="text-[11px] opacity-60">Toggle callable functions and hardware interface permissions</p>
        </div>

        <div className="flex items-center space-x-2 text-[10px] font-mono">
          <button
            onClick={onSelectAll}
            className="px-2.5 py-1 rounded border hover:bg-white/5 transition-colors"
            style={{ borderColor: currentTheme.palette.borderStrong }}
          >
            Enable All
          </button>
          <button
            onClick={onClearAll}
            className="px-2.5 py-1 rounded border hover:bg-white/5 transition-colors text-red-400"
            style={{ borderColor: currentTheme.palette.borderStrong }}
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {AVAILABLE_TOOLS.map((tool) => {
          const isEnabled = selectedTools.includes(tool.id);

          return (
            <div
              key={tool.id}
              onClick={() => onToggleTool(tool.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isEnabled ? 'ring-1 shadow-sm' : 'opacity-65 hover:opacity-100 hover:border-indigo-400'
              }`}
              style={{
                backgroundColor: isEnabled ? currentTheme.palette.surfaceRaised : currentTheme.palette.surface,
                borderColor: isEnabled ? currentTheme.palette.accent : currentTheme.palette.border,
                boxShadow: isEnabled ? `0 0 0 1px ${currentTheme.palette.accent}` : undefined,
              }}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-400 truncate max-w-[170px]">
                    {tool.id}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${getRiskBadge(tool.riskLevel)}`}>
                      {tool.riskLevel}
                    </span>
                    <div 
                      className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                        isEnabled ? 'bg-indigo-600 text-white' : 'border border-zinc-700 bg-zinc-900'
                      }`}
                    >
                      {isEnabled && <Check className="w-2.5 h-2.5" />}
                    </div>
                  </div>
                </div>

                <h5 className="text-xs font-bold" style={{ color: currentTheme.palette.textPrimary }}>
                  {tool.name}
                </h5>

                <p className="text-[11px] opacity-75 line-clamp-2 leading-relaxed" style={{ color: currentTheme.palette.textSecondary }}>
                  {tool.description}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t font-mono text-[9px] text-zinc-400 truncate" style={{ borderColor: currentTheme.palette.border }}>
                <code>{tool.signature}</code>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
