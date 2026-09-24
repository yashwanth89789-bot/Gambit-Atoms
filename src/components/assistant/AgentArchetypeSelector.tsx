import React from 'react';
import { 
  ShieldAlert, Sparkles, Code2, Database, Cpu, 
  TrendingUp, Atom, Network, Bot, Check, Workflow
} from 'lucide-react';
import { useAdaptiveTheme } from '../../context/ThemeContext';

export interface AgentArchetype {
  id: string;
  name: string;
  designation: string;
  category: string;
  icon: any;
  accentColor: string;
  description: string;
  systemPrompt: string;
  model: string;
  temperature: number;
  autonomyLevel: 'Supervised' | 'Semi-Autonomous' | 'Full Autonomous';
  recommendedTools: string[];
}

export const AGENT_ARCHETYPES: AgentArchetype[] = [
  {
    id: 'cyber-sentinel',
    name: 'Cyber Defense Sentinel',
    designation: 'AEGIS-9',
    category: 'Security & SOC',
    icon: ShieldAlert,
    accentColor: '#EF4444',
    description: 'Zero-trust security auditor, automated vulnerability triage, CVE patching assistant, and exploit mitigation strategist.',
    model: 'gemini-3.1-pro-preview',
    temperature: 0.15,
    autonomyLevel: 'Semi-Autonomous',
    recommendedTools: ['fs.read', 'bash.exec', 'crypto.signPayload', 'rag.vectorSearch'],
    systemPrompt: `You are AEGIS-9, a specialized Zero-Trust Cybersecurity Sentinel.
PRIMARY DIRECTIVES:
1. Conduct deterministic security audits and vulnerability triages across all ingested artifacts.
2. Formulate immediate containment strategies, CVE remediation advisories, and cryptographic mitigations.
3. Strictly adhere to defense-in-depth and least-privilege principles. Reject all dangerous unverified code paths.
4. Output structured analysis in CVSS v3.1 severity metrics with reproducible mitigation proof-of-concepts.`,
  },
  {
    id: 'deep-researcher',
    name: 'Deep Research Scientist',
    designation: 'SYNAPSE-X',
    category: 'Science & Academia',
    icon: Atom,
    accentColor: '#8B5CF6',
    description: 'Literature synthesizer, formal proof validator, mathematical derivation checker, and multi-hypothesis explorer.',
    model: 'gemini-3.1-pro-preview',
    temperature: 0.35,
    autonomyLevel: 'Semi-Autonomous',
    recommendedTools: ['web.grounding', 'rag.vectorSearch', 'qpu.transmonCircuit'],
    systemPrompt: `You are SYNAPSE-X, an advanced Autonomous Deep Research Scientist.
PRIMARY DIRECTIVES:
1. Synthesize foundational literature across physics, computational mathematics, and machine intelligence.
2. Validate mathematical derivations with formal theorem verification and empirical counter-example searches.
3. Propose rigorous hypotheses with measurable falsifiability criteria and experimental methodologies.
4. Format all technical outputs in LaTeX mathematical notation with precise bibliographic citations.`,
  },
  {
    id: 'fullstack-architect',
    name: 'Distributed Systems Architect',
    designation: 'TITAN-Core',
    category: 'Engineering & Systems',
    icon: Code2,
    accentColor: '#3B82F6',
    description: 'Ultra-low latency backend architect, distributed consensus designer, database sharding specialist, and cloud resilience optimizer.',
    model: 'gemini-3.5-flash',
    temperature: 0.2,
    autonomyLevel: 'Full Autonomous',
    recommendedTools: ['fs.read', 'fs.write', 'bash.exec', 'rag.vectorSearch'],
    systemPrompt: `You are TITAN-Core, a Senior Principal Distributed Systems Architect.
PRIMARY DIRECTIVES:
1. Design fault-tolerant, horizontally scalable distributed architectures with p99.9 latency under 20ms.
2. Enforce strict type safety, zero-copy memory management, and asynchronous non-blocking event loops.
3. Provide production-grade, self-contained implementation code with exhaustive unit and integration test harnesses.
4. Optimize for linear horizontal scaling, cache-coherence protocols, and deterministic failure recovery.`,
  },
  {
    id: 'swarm-orchestrator',
    name: 'Multi-Agent Swarm Orchestrator',
    designation: 'HIVE-Mind',
    category: 'Autonomous Multi-Agent',
    icon: Workflow,
    accentColor: '#10B981',
    description: 'Directed Acyclic Graph (DAG) task decomposer, subagent dispatcher, consensus validator, and parallel execution coordinator.',
    model: 'gemini-3.1-pro-preview',
    temperature: 0.25,
    autonomyLevel: 'Full Autonomous',
    recommendedTools: ['ipc.spawnSubagent', 'rag.vectorSearch', 'fs.read', 'fs.write'],
    systemPrompt: `You are HIVE-Mind, a Central Multi-Agent Swarm Orchestrator.
PRIMARY DIRECTIVES:
1. Deconstruct complex open-ended goals into structured Directed Acyclic Graphs (DAGs) of executable subtasks.
2. Delegate atomic assignments to specialized subagents, monitoring convergence and detecting deadlocks.
3. Reconcile conflicting subagent outputs using Bayesian consensus verification and majority voting.
4. Maintain deterministic global state and log intermediate execution traces with millisecond timestamps.`,
  },
  {
    id: 'quant-synthesizer',
    name: 'Quantitative Market Modeler',
    designation: 'STOCH-8',
    category: 'Finance & Math',
    icon: TrendingUp,
    accentColor: '#F59E0B',
    description: 'Stochastic calculus simulator, Black-Scholes options pricer, risk parity allocator, and high-frequency volatility forecaster.',
    model: 'gemini-3.5-flash',
    temperature: 0.1,
    autonomyLevel: 'Semi-Autonomous',
    recommendedTools: ['web.grounding', 'bash.exec', 'rag.vectorSearch'],
    systemPrompt: `You are STOCH-8, a Quantitative Finance and Algorithmic Risk Analyst.
PRIMARY DIRECTIVES:
1. Model market dynamics via stochastic differential equations, jump-diffusion processes, and Monte Carlo paths.
2. Optimize risk-adjusted yield across multi-asset portfolios using Kelly criterion and CVaR tail-risk constraints.
3. Verify statistical arbitrage signals with walk-forward backtesting and slippage-inclusive cost matrices.
4. Never issue speculative guesses; provide mathematically grounded volatility bounds and Sharpe/Sortino ratios.`,
  },
];

interface Props {
  selectedArchetypeId: string;
  onSelectArchetype: (archetype: AgentArchetype) => void;
}

export const AgentArchetypeSelector: React.FC<Props> = ({ selectedArchetypeId, onSelectArchetype }) => {
  const { currentTheme } = useAdaptiveTheme();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold uppercase opacity-75 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5" style={{ color: currentTheme.palette.accent }} />
          <span>Specialized Persona Archetypes (Instant Presets)</span>
        </span>
        <span className="text-[10px] font-mono opacity-60">Select to auto-populate neural identity</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {AGENT_ARCHETYPES.map((arch) => {
          const Icon = arch.icon;
          const isSelected = selectedArchetypeId === arch.id;

          return (
            <div
              key={arch.id}
              onClick={() => onSelectArchetype(arch)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected ? 'ring-2 shadow-md' : 'opacity-80 hover:opacity-100 hover:border-indigo-400'
              }`}
              style={{
                backgroundColor: isSelected ? currentTheme.palette.surfaceRaised : currentTheme.palette.surface,
                borderColor: isSelected ? arch.accentColor : currentTheme.palette.border,
                boxShadow: isSelected ? `0 0 0 2px ${arch.accentColor}` : undefined,
              }}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center border"
                    style={{
                      backgroundColor: `${arch.accentColor}18`,
                      borderColor: `${arch.accentColor}40`,
                      color: arch.accentColor,
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span 
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                      style={{
                        backgroundColor: `${arch.accentColor}15`,
                        color: arch.accentColor,
                      }}
                    >
                      {arch.designation}
                    </span>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: arch.accentColor }}>
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-xs tracking-tight" style={{ color: currentTheme.palette.textPrimary }}>
                    {arch.name}
                  </h4>
                  <span className="text-[10px] font-mono opacity-60 block">{arch.category}</span>
                </div>

                <p className="text-[11px] opacity-75 line-clamp-2 leading-relaxed" style={{ color: currentTheme.palette.textSecondary }}>
                  {arch.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t flex items-center justify-between text-[10px] font-mono opacity-70" style={{ borderColor: currentTheme.palette.border }}>
                <span>{arch.model.replace('gemini-', '')}</span>
                <span>T={arch.temperature.toFixed(2)}</span>
                <span>{arch.autonomyLevel}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
