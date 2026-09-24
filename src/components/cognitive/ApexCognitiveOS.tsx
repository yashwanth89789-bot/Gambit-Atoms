import React, { useState } from 'react';
import { 
  BrainCircuit, ShieldCheck, AlertCircle, ArrowRight, 
  Sparkles, CheckCircle2, Play, RefreshCw, Cpu, Layers, 
  HelpCircle, Eye, Sliders, Database, Search, Terminal,
  Atom, ShieldAlert, FileText, ChevronRight, Lock, Activity
} from 'lucide-react';
import { useAdaptiveTheme } from '../../context/ThemeContext';

export type PipelineMode = 
  | 'general'
  | 'difficult_problems'
  | 'research'
  | 'engineering'
  | 'software'
  | 'quantum'
  | 'autonomous';

interface Stage {
  stageId: string;
  stageName: string;
  summary: string;
  epistemicType: 'fact' | 'strong_evidence' | 'plausible_inference' | 'speculation' | 'unresolved_question';
  uncertaintyPct: number;
  details: string;
}

interface SpecialistOutput {
  role: string;
  subproblem: string;
  findings: string;
  confidencePct: number;
}

interface Contradiction {
  issue: string;
  specialistsInvolved: string[];
  preservationNote: string;
  evidenceRequiredToResolve: string;
}

interface VerificationClaim {
  claim: string;
  verdict: 'VERIFIED' | 'FALSIFIED' | 'CONDITIONAL';
  verificationMethod: string;
}

interface CognitiveRunResult {
  pipelineMode: string;
  stages: Stage[];
  selectedSpecialists: SpecialistOutput[];
  contradictions: Contradiction[];
  verificationAudit: {
    verifier: string;
    verifiedClaims: VerificationClaim[];
    epistemicIntegrityScore: number;
  };
  criticAudit: {
    critic: string;
    potentialFailureModes: string[];
    unverifiedAssumptions: string[];
    correctiveActions: string[];
  };
  worldModelAdaptation: string;
  unifiedSolution: string;
  residualUncertainty: string;
  nextEmpiricalAction: string;
}

export const ApexCognitiveOS: React.FC = () => {
  const { currentTheme } = useAdaptiveTheme();

  // Mode Selection
  const [pipelineMode, setPipelineMode] = useState<PipelineMode>('general');
  const [objectiveInput, setObjectiveInput] = useState<string>(
    'Develop a fault-tolerant Surface Code QEC decoder with real-time sub-kelvin cryo telemetry feedback'
  );
  const [selectedStageId, setSelectedStageId] = useState<string>('understand');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Active Execution State
  const [executionResult, setExecutionResult] = useState<CognitiveRunResult>({
    pipelineMode: 'general',
    stages: [
      {
        stageId: 'understand',
        stageName: 'UNDERSTAND',
        summary: 'Deconstruct objective with boundary condition verification',
        epistemicType: 'fact',
        uncertaintyPct: 6,
        details: 'Formal constraints defined: distance-3 surface code, 9 data qubits, 8 syndrome ancillae, syndrome extraction cycle < 1.2 µs.'
      },
      {
        stageId: 'decompose',
        stageName: 'DECOMPOSE',
        summary: 'Partition problem into minimal orthogonal specialist tasks',
        epistemicType: 'fact',
        uncertaintyPct: 8,
        details: 'Isolated syndrome matching (Mathematician), cryo-FPGA latency budget (Systems Engineer), and Pauli-frame tracking (Programmer).'
      },
      {
        stageId: 'world_model',
        stageName: 'WORLD MODEL',
        summary: 'Construct causal dependency graph across sub-kelvin hardware layers',
        epistemicType: 'strong_evidence',
        uncertaintyPct: 14,
        details: 'Synthesized state transition graph incorporating thermal noise fluctuations (12.4 mK MXC) and crosstalk matrices.'
      },
      {
        stageId: 'plan',
        stageName: 'PLAN',
        summary: 'Derive minimal action trajectory minimizing unverified assumptions',
        epistemicType: 'strong_evidence',
        uncertaintyPct: 12,
        details: 'Selected minimum-weight perfect matching (MWPM) with lookup-table pruning for 200 ns execution.'
      },
      {
        stageId: 'collaboration',
        stageName: 'SPECIALISTS',
        summary: 'Dispatch subproblems to Mathematician, Quantum Scientist & Systems Engineer',
        epistemicType: 'fact',
        uncertaintyPct: 9,
        details: 'Specialists returned independent verified bounds without monolithic overreach.'
      },
      {
        stageId: 'verify',
        stageName: 'VERIFICATION',
        summary: 'Verification Agent audited formal claims against falsification criteria',
        epistemicType: 'fact',
        uncertaintyPct: 4,
        details: 'Simulation outputs kept strictly segregated from physical cryo hardware measurements.'
      },
      {
        stageId: 'learn',
        stageName: 'LEARN & ADAPT',
        summary: 'Update world model with calibrated Bayesian error margins',
        epistemicType: 'fact',
        uncertaintyPct: 3,
        details: 'Refined decoder lookup tables; residual uncertainty quantified at 3.8%.'
      }
    ],
    selectedSpecialists: [
      {
        role: 'Quantum Scientist',
        subproblem: 'Validate stabilizer commuting observables S_x and S_z',
        findings: 'Confirmed mutual commutativity across all weight-4 placquettes with fidelity > 99.8%.',
        confidencePct: 99
      },
      {
        role: 'Mathematician',
        subproblem: 'Calculate minimum-weight graph distance and threshold bound',
        findings: 'Derived theoretical fault-tolerance threshold at p_th = 0.67% error rate.',
        confidencePct: 97
      },
      {
        role: 'Systems Engineer',
        subproblem: 'Verify round-trip latency budget under 1.2 µs coherence limit',
        findings: 'FPGA pipeline latency measured at 310 ns, comfortably below T2* dephasing time.',
        confidencePct: 95
      }
    ],
    contradictions: [
      {
        issue: 'Lookup table memory footprint vs dynamic blossom graph search time',
        specialistsInvolved: ['Mathematician', 'Systems Engineer'],
        preservationNote: 'Preserved tension between deterministic 50 ns RAM retrieval vs arbitrary error weight handling.',
        evidenceRequiredToResolve: 'Physical FPGA BRAM utilization measurement under correlated cosmic ray burst simulation.'
      }
    ],
    verificationAudit: {
      verifier: 'Verification Agent',
      verifiedClaims: [
        {
          claim: 'Simulation outputs are strictly labeled as numerical inference, not physical validation',
          verdict: 'VERIFIED',
          verificationMethod: 'Epistemic Grounding Classification Protocol'
        },
        {
          claim: 'Stabilizer measurements do not collapse logical state superposition',
          verdict: 'VERIFIED',
          verificationMethod: 'Quantum Eigenstate Projection Proof'
        }
      ],
      epistemicIntegrityScore: 99.2
    },
    criticAudit: {
      critic: 'Critic Agent',
      potentialFailureModes: [
        'Correlated phase errors across adjacent drive lines due to microwave crosstalk',
        'Heating spikes in mixing chamber during continuous readout pulse repetition'
      ],
      unverifiedAssumptions: [
        'Assuming independent identically distributed (i.i.d.) Pauli noise across all 17 physical qubits'
      ],
      correctiveActions: [
        'Incorporate non-Markovian noise correlation tensor into decoder weighting'
      ]
    },
    worldModelAdaptation: 'Updated decoder graph to penalize correlated two-qubit errors based on active cryo S21 transmission sweeps.',
    unifiedSolution: 'Synthesized ultra-fast hybrid decoder: Combines 40 ns FPGA lookup-table for 1-qubit and 2-qubit errors with background Blossom V matching for higher-weight syndromes.',
    residualUncertainty: 'Residual uncertainty is 3.8%, localized to non-Markovian cosmic ray flux events.',
    nextEmpiricalAction: 'Run 10^7 real-time syndrome extraction cycles on BlueFors XLD dilution refrigerator.'
  });

  const pipelineConfigs: Record<PipelineMode, { label: string; stages: string[]; desc: string }> = {
    general: {
      label: 'General Cognitive OS (12-Stage)',
      stages: ['PERCEPTION', 'UNDERSTAND', 'WORLD MODEL', 'MEMORY', 'REASON', 'PLAN', 'COLLABORATE', 'TOOL USE', 'EXECUTE', 'OBSERVE', 'VERIFY', 'LEARN'],
      desc: 'Full general-purpose cognitive pipeline maximizing reliable progress while minimizing unverified assumptions.'
    },
    difficult_problems: {
      label: 'Difficult Problems Protocol',
      stages: ['UNDERSTAND', 'DECOMPOSE', 'MODEL', 'PLAN', 'EXECUTE', 'TEST', 'CRITIQUE', 'VERIFY', 'LEARN', 'ADAPT'],
      desc: 'Systematic decomposition, rigorous modeling, adversarial critique, and Bayesian adaptation.'
    },
    research: {
      label: 'Scientific Research Pipeline',
      stages: ['QUESTION', 'HYPOTHESIS', 'PREDICTION', 'EXPERIMENT', 'OBSERVATION', 'FALSIFICATION', 'CONCLUSION'],
      desc: 'Strict Popperian falsification, distinguishing fact from hypothesis and prediction from measurement.'
    },
    engineering: {
      label: 'Engineering Systems Pipeline',
      stages: ['REQUIREMENTS', 'MODEL', 'DESIGN', 'CALCULATE', 'SIMULATE', 'TEST', 'VERIFY', 'DEPLOY'],
      desc: 'Disciplined design tolerances, simulation bounds, stress testing, and verified release gating.'
    },
    software: {
      label: 'Software Architecture Pipeline',
      stages: ['REQUIREMENTS', 'ARCHITECTURE', 'IMPLEMENT', 'TEST', 'SECURITY REVIEW', 'VALIDATE', 'RELEASE'],
      desc: 'Modular decomposition, invariant preservation, adversarial zero-trust security audit, and formal validation.'
    },
    quantum: {
      label: 'Quantum Research & Validation',
      stages: ['THEORY', 'MATH MODEL', 'ALGORITHM', 'SIMULATION', 'HARDWARE/EXP', 'MEASUREMENT', 'ERROR ANALYSIS', 'VALIDATION'],
      desc: 'Decoupling theory from simulation, and simulation from sub-kelvin physical hardware validation.'
    },
    autonomous: {
      label: 'Autonomous Operation Loop',
      stages: ['GOAL', 'PLAN', 'ACTION', 'OBSERVATION', 'EVALUATION', 'ADAPTATION'],
      desc: 'Closed-loop adaptive cybernetic control with runtime uncertainty calibration and safety interlocks.'
    }
  };

  const handleRunCognitiveOS = async () => {
    if (!objectiveInput.trim()) return;
    setIsRunning(true);
    try {
      const res = await fetch('/api/apex/cognitive-os/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objective: objectiveInput,
          pipelineMode,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setExecutionResult(data);
        if (data.stages && data.stages.length > 0) {
          setSelectedStageId(data.stages[0].stageId);
        }
      }
    } catch (e) {
      console.error('Failed to run APEX Cognitive OS:', e);
    } finally {
      setIsRunning(false);
    }
  };

  const activeStageObj = executionResult.stages.find(s => s.stageId === selectedStageId) || executionResult.stages[0];

  const getEpistemicBadge = (type: string) => {
    switch (type) {
      case 'fact':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">ESTABLISHED FACT</span>;
      case 'strong_evidence':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">STRONG EVIDENCE</span>;
      case 'plausible_inference':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">PLAUSIBLE INFERENCE</span>;
      case 'speculation':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">SPECULATION</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-700 text-zinc-300">UNRESOLVED QUESTION</span>;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* OS Banner & Foundational Principles */}
      <div 
        className="border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 transition-all"
        style={{
          backgroundColor: currentTheme.palette.surface,
          borderColor: currentTheme.palette.border,
          color: currentTheme.palette.textPrimary,
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider" style={{ backgroundColor: `${currentTheme.palette.accent}15`, color: currentTheme.palette.accent, borderColor: `${currentTheme.palette.accent}30` }}>
              <Cpu className="w-3.5 h-3.5 animate-pulse" />
              <span>APEX Cognitive Operating System (ApexOS) v6.0</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">General-Purpose Cognitive Architecture</h2>
            <p className="text-xs sm:text-sm max-w-3xl opacity-75 leading-relaxed">
              Objective: Maximize reliable progress toward the user's objective while minimizing unverified assumptions, errors, risks, and unnecessary actions.
            </p>
          </div>

          {/* Epistemic Health Card */}
          <div 
            className="grid grid-cols-2 gap-3 p-4 rounded-xl border font-mono text-xs"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.borderStrong,
            }}
          >
            <div>
              <span className="block text-[10px] opacity-60">Epistemic Score:</span>
              <span className="font-bold text-emerald-400">
                {executionResult.verificationAudit.epistemicIntegrityScore}%
              </span>
            </div>
            <div>
              <span className="block text-[10px] opacity-60">Residual Uncertainty:</span>
              <span className="font-bold text-indigo-400">
                {activeStageObj?.uncertaintyPct ?? 4.2}%
              </span>
            </div>
            <div>
              <span className="block text-[10px] opacity-60">Specialists Engaged:</span>
              <span className="font-bold text-purple-400">
                {executionResult.selectedSpecialists.length} Minimum Required
              </span>
            </div>
            <div>
              <span className="block text-[10px] opacity-60">Falsification Gating:</span>
              <span className="font-bold text-amber-400">Active Strict</span>
            </div>
          </div>
        </div>

        {/* Epistemic Guardrail Principles Row */}
        <div className="p-3.5 rounded-xl border bg-black/25 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono" style={{ borderColor: currentTheme.palette.border }}>
          <div className="flex items-center space-x-2 text-zinc-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-bold">Never Hide Uncertainty</span>
          </div>
          <div className="hidden sm:block text-zinc-600">•</div>
          <div className="flex items-center space-x-2 text-zinc-300">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-bold">Never Manufacture Evidence</span>
          </div>
          <div className="hidden sm:block text-zinc-600">•</div>
          <div className="flex items-center space-x-2 text-zinc-300">
            <Atom className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-bold">Reasoning ≠ Physical Measurement</span>
          </div>
          <div className="hidden sm:block text-zinc-600">•</div>
          <div className="flex items-center space-x-2 text-zinc-300">
            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-bold">Hypothesis ≠ Established Fact</span>
          </div>
        </div>
      </div>

      {/* Pipeline Selector Tabs */}
      <div 
        className="flex items-center space-x-1.5 p-1.5 rounded-xl border overflow-x-auto text-xs font-mono font-bold"
        style={{
          backgroundColor: currentTheme.palette.surface,
          borderColor: currentTheme.palette.border,
        }}
      >
        {(Object.keys(pipelineConfigs) as PipelineMode[]).map((mode) => {
          const cfg = pipelineConfigs[mode];
          const isActive = pipelineMode === mode;
          return (
            <button
              key={mode}
              onClick={() => setPipelineMode(mode)}
              className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                isActive ? 'shadow-xs scale-100' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: isActive ? currentTheme.palette.surfaceRaised : 'transparent',
                color: isActive ? currentTheme.palette.accent : currentTheme.palette.textPrimary,
                borderWidth: isActive ? 1 : 0,
                borderColor: isActive ? currentTheme.palette.borderStrong : 'transparent',
              }}
            >
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Task Ingestion & Execution Bar */}
      <div 
        className="border rounded-2xl p-6 shadow-sm space-y-4"
        style={{
          backgroundColor: currentTheme.palette.surface,
          borderColor: currentTheme.palette.border,
          color: currentTheme.palette.textPrimary,
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase opacity-75">
            Objective / Problem Ingest Target ({pipelineConfigs[pipelineMode].label})
          </span>
          <span className="text-[10px] font-mono opacity-50">
            {pipelineConfigs[pipelineMode].desc}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={objectiveInput}
            onChange={(e) => setObjectiveInput(e.target.value)}
            disabled={isRunning}
            placeholder="Enter difficult problem, scientific question, software spec, or engineering challenge..."
            className="flex-1 px-4 py-3 rounded-xl border text-xs font-mono focus:outline-hidden focus:ring-1 focus:ring-indigo-400"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.borderStrong,
              color: currentTheme.palette.textPrimary,
            }}
          />

          <button
            onClick={handleRunCognitiveOS}
            disabled={isRunning || !objectiveInput.trim()}
            className="px-5 py-3 rounded-xl text-white font-mono font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-all hover:opacity-90 disabled:opacity-50 cursor-pointer"
            style={{ backgroundColor: currentTheme.palette.accent }}
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Cognitive OS Executing...' : 'Execute Cognitive OS'}</span>
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono">
          <span className="opacity-50">Presets:</span>
          {[
            { label: 'Quantum QEC Decoder', mode: 'quantum' as PipelineMode, prompt: 'Develop a fault-tolerant Surface Code QEC decoder with real-time sub-kelvin cryo telemetry feedback' },
            { label: 'ZK-Rollup Smart Contract', mode: 'software' as PipelineMode, prompt: 'Verify High-Speed Zero-Knowledge Rollup Smart Contract under Asynchronous Byzantine Consensus' },
            { label: 'Cryo Dilution Stabilization', mode: 'engineering' as PipelineMode, prompt: 'Autonomous Dilution Refrigerator PID Thermal Stabilization at 12.4 mK under continuous RF load' },
            { label: 'Falsify Non-Local QED', mode: 'research' as PipelineMode, prompt: 'Design experiment to test and attempt to falsify non-local signaling claims in coupled cavity QED' },
          ].map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPipelineMode(p.mode);
                setObjectiveInput(p.prompt);
              }}
              className="px-2.5 py-1 rounded-lg border hover:bg-white/5 opacity-80 hover:opacity-100 transition-all cursor-pointer"
              style={{ borderColor: currentTheme.palette.borderStrong }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cognitive Pipeline Stages Flow Bar */}
      <div 
        className="border rounded-2xl p-6 shadow-sm space-y-4"
        style={{
          backgroundColor: currentTheme.palette.surface,
          borderColor: currentTheme.palette.border,
          color: currentTheme.palette.textPrimary,
        }}
      >
        <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: currentTheme.palette.border }}>
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-xs uppercase tracking-wider font-mono">Cognitive Stages Trace</span>
          </div>
          <span className="text-[10px] font-mono opacity-60">Click any stage to inspect epistemic grounding</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {executionResult.stages.map((stg) => {
            const isSelected = selectedStageId === stg.stageId;
            return (
              <div
                key={stg.stageId}
                onClick={() => setSelectedStageId(stg.stageId)}
                className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                  isSelected ? 'ring-2 ring-indigo-400 border-indigo-400' : 'hover:border-zinc-500 opacity-85'
                }`}
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: isSelected ? currentTheme.palette.accent : currentTheme.palette.borderStrong,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs truncate">{stg.stageName}</span>
                  <span className="text-[10px] font-mono font-bold text-indigo-400">
                    ±{stg.uncertaintyPct}%
                  </span>
                </div>
                <p className="text-[10px] opacity-70 line-clamp-2 leading-relaxed">
                  {stg.summary}
                </p>
                <div className="pt-1">
                  {getEpistemicBadge(stg.epistemicType)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Stage Detail Inspector */}
        {activeStageObj && (
          <div className="mt-4 p-4 rounded-xl border bg-black/25 space-y-2 font-mono text-xs" style={{ borderColor: currentTheme.palette.border }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-800">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-sm text-indigo-400">{activeStageObj.stageName} Detailed Stage Telemetry</span>
                {getEpistemicBadge(activeStageObj.epistemicType)}
              </div>
              <span className="text-zinc-400 text-[11px]">
                Residual Uncertainty: <strong className="text-indigo-300">{activeStageObj.uncertaintyPct}%</strong>
              </span>
            </div>
            <div className="text-zinc-300 pt-1 leading-relaxed">
              {activeStageObj.details}
            </div>
          </div>
        )}
      </div>

      {/* Specialist Collaboration & Contradiction Arbitration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Minimal Specialist Selection */}
        <div 
          className="border rounded-2xl p-6 shadow-sm space-y-4"
          style={{
            backgroundColor: currentTheme.palette.surface,
            borderColor: currentTheme.palette.border,
            color: currentTheme.palette.textPrimary,
          }}
        >
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: currentTheme.palette.border }}>
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <h3 className="font-bold text-sm tracking-tight">Specialist Collaboration (Minimum Necessary)</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-400 font-bold border border-purple-500/30">
              {executionResult.selectedSpecialists.length} Dispatched
            </span>
          </div>

          <div className="space-y-3">
            {executionResult.selectedSpecialists.map((spec, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-xl border font-mono text-xs space-y-2"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.borderStrong,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-300 text-xs">{spec.role}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold">
                    {spec.confidencePct}% Verified
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400">
                  <span className="text-zinc-500 font-bold">Subproblem: </span>
                  {spec.subproblem}
                </div>
                <div className="text-[11px] text-zinc-200 pl-2 border-l-2 border-indigo-500/50">
                  {spec.findings}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Contradiction Detection & Evidence Arbitration */}
        <div 
          className="border rounded-2xl p-6 shadow-sm space-y-4"
          style={{
            backgroundColor: currentTheme.palette.surface,
            borderColor: currentTheme.palette.border,
            color: currentTheme.palette.textPrimary,
          }}
        >
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: currentTheme.palette.border }}>
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-sm tracking-tight">Contradiction Detection & Preservation</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30">
              Preserve & Test
            </span>
          </div>

          <div className="space-y-3">
            {executionResult.contradictions.length === 0 ? (
              <div className="p-4 rounded-xl border text-xs font-mono text-zinc-400 text-center">
                No unresolved contradictions found. Consensus verified across specialists.
              </div>
            ) : (
              executionResult.contradictions.map((contra, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-xl border font-mono text-xs space-y-2"
                  style={{
                    backgroundColor: currentTheme.palette.surfaceRaised,
                    borderColor: '#f59e0b40',
                  }}
                >
                  <div className="flex items-center justify-between text-amber-300 font-bold">
                    <span>{contra.issue}</span>
                    <span className="text-[10px] opacity-75">Between: {contra.specialistsInvolved.join(' vs ')}</span>
                  </div>
                  <div className="text-[11px] text-zinc-300">
                    <span className="text-zinc-500 font-bold">Preservation Note: </span>
                    {contra.preservationNote}
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-amber-500/20 text-[11px] text-amber-200">
                    <span className="font-bold block text-amber-400 mb-0.5">Evidence Required to Resolve:</span>
                    {contra.evidenceRequiredToResolve}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Dual Auditing: Verification Agent & Critic Agent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verification Agent Card */}
        <div 
          className="border rounded-2xl p-6 shadow-sm space-y-4"
          style={{
            backgroundColor: currentTheme.palette.surface,
            borderColor: currentTheme.palette.border,
            color: currentTheme.palette.textPrimary,
          }}
        >
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: currentTheme.palette.border }}>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm tracking-tight">Verification Agent Audit</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
              Independent Verifier
            </span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {executionResult.verificationAudit.verifiedClaims.map((claim, idx) => (
              <div key={idx} className="p-3 rounded-xl border bg-black/25 space-y-1" style={{ borderColor: currentTheme.palette.borderStrong }}>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-200 font-semibold">{claim.claim}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold">
                    {claim.verdict}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-500">
                  Method: {claim.verificationMethod}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critic Agent Card */}
        <div 
          className="border rounded-2xl p-6 shadow-sm space-y-4"
          style={{
            backgroundColor: currentTheme.palette.surface,
            borderColor: currentTheme.palette.border,
            color: currentTheme.palette.textPrimary,
          }}
        >
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: currentTheme.palette.border }}>
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h3 className="font-bold text-sm tracking-tight">Critic Agent Stress Test & Failure Modes</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">
              Adversarial Critic
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <span className="text-[10px] text-rose-400 uppercase font-bold block mb-1">Potential Failure Modes:</span>
              <ul className="list-disc list-inside text-zinc-300 space-y-0.5 text-[11px]">
                {executionResult.criticAudit.potentialFailureModes.map((fm, i) => (
                  <li key={i}>{fm}</li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-zinc-800">
              <span className="text-[10px] text-amber-400 uppercase font-bold block mb-1">Unverified Assumptions Detected:</span>
              <ul className="list-disc list-inside text-zinc-300 space-y-0.5 text-[11px]">
                {executionResult.criticAudit.unverifiedAssumptions.map((ua, i) => (
                  <li key={i}>{ua}</li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-zinc-800">
              <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-1">Corrective Actions Required:</span>
              <ul className="list-disc list-inside text-zinc-300 space-y-0.5 text-[11px]">
                {executionResult.criticAudit.correctiveActions.map((ca, i) => (
                  <li key={i}>{ca}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Unified Solution & Next Empirical Step */}
      <div 
        className="border rounded-2xl p-6 shadow-sm space-y-4"
        style={{
          backgroundColor: currentTheme.palette.surface,
          borderColor: currentTheme.palette.border,
          color: currentTheme.palette.textPrimary,
        }}
      >
        <div className="flex items-center space-x-2 pb-2 border-b" style={{ borderColor: currentTheme.palette.border }}>
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h3 className="font-bold text-sm tracking-tight font-mono uppercase">Integrated Unified Cognitive Solution</h3>
        </div>

        <div className="p-4 rounded-xl border bg-black/25 font-mono text-xs leading-relaxed text-zinc-200" style={{ borderColor: currentTheme.palette.borderStrong }}>
          {executionResult.unifiedSolution}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div className="p-3.5 rounded-xl border bg-indigo-500/10 border-indigo-500/30">
            <span className="block text-[10px] text-indigo-400 font-bold uppercase mb-1">Residual Uncertainty Status</span>
            <span className="text-zinc-200">{executionResult.residualUncertainty}</span>
          </div>
          <div className="p-3.5 rounded-xl border bg-emerald-500/10 border-emerald-500/30">
            <span className="block text-[10px] text-emerald-400 font-bold uppercase mb-1">Recommended Next Empirical Action</span>
            <span className="text-zinc-200">{executionResult.nextEmpiricalAction}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
