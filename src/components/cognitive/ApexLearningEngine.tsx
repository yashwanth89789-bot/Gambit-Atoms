import React, { useState } from 'react';
import { 
  Sparkles, ShieldCheck, AlertTriangle, ArrowRight, 
  RotateCcw, CheckCircle2, Play, RefreshCw, Cpu, Layers, 
  HelpCircle, Eye, Sliders, Database, Search, Terminal,
  Atom, ShieldAlert, FileText, ChevronRight, Lock, Activity,
  BookOpen, GitCommit, Check, Filter, Info, Shield, Award
} from 'lucide-react';
import { useAdaptiveTheme } from '../../context/ThemeContext';

export type MemoryTierKey = 
  | 'all'
  | 'temporaryTaskState'
  | 'episodicMemory'
  | 'semanticKnowledge'
  | 'proceduralKnowledge'
  | 'verifiedKnowledge'
  | 'hypotheses';

interface LearningCycleData {
  observe: string;
  predict: string;
  act: string;
  measure: string;
  compare: string;
  explain: string;
  update: string;
}

interface LearningRecordData {
  whatWasExpected: string;
  whatActuallyHappened: string;
  whatWasCorrect: string;
  whatWasIncorrect: string;
  whyErrorOccurred: string;
  whichAssumptionsFailed: string[];
  whichStrategyWorked: string;
  whichStrategyFailed: string;
  reusableKnowledgeDiscovered: string;
  futureDecisionToChange: string;
}

interface AnomalyAuditData {
  isAnomalousObservation: boolean;
  anomalyConfidenceScore: number;
  evidenceCount: number;
  evidenceRequiredForPromotion: number;
  establishedKnowledgeProtected: boolean;
  protectionRationale: string;
}

interface MemoryTiersData {
  temporaryTaskState: {
    items: string[];
    lifetime: string;
  };
  episodicMemory: {
    eventId: string;
    timestamp: string;
    context: string;
    takeaway: string;
  };
  semanticKnowledge: {
    concepts: Array<{ term: string; definition: string; confidence: number }>;
  };
  proceduralKnowledge: {
    procedures: Array<{ name: string; rule: string; status: 'VALIDATED' | 'UNDER_OBSERVATION' }>;
  };
  verifiedKnowledge: {
    verifiedFacts: Array<{ claim: string; verificationProof: string; stability: number }>;
  };
  hypotheses: {
    activeHypotheses: Array<{
      hypothesis: string;
      falsificationTest: string;
      empiricalEvidenceScore: number;
      promotionStatus: 'HELD_IN_TRIAL' | 'PROMOTED' | 'REJECTED';
    }>;
  };
}

interface LearningEngineResponse {
  success: boolean;
  timestamp: string;
  learningCycle: LearningCycleData;
  record: LearningRecordData;
  anomalyAndEvidenceAudit: AnomalyAuditData;
  memoryTiers: MemoryTiersData;
}

export const ApexLearningEngine: React.FC = () => {
  const { currentTheme } = useAdaptiveTheme();

  // Inputs
  const [taskDescription, setTaskDescription] = useState<string>(
    'Calibrate high-frequency microwave drive pulse train for transmon qubit X-gate at 12.4 mK'
  );
  const [expectedOutcome, setExpectedOutcome] = useState<string>(
    'Linear Rabi oscillation with π-pulse amplitude at 384 mV and fidelity > 99.9%'
  );
  const [observedOutcome, setObservedOutcome] = useState<string>(
    'Fidelity dropped to 97.4% during bursts exceeding 400 ns; detected 1.2 mK thermal transient on MXC'
  );
  const [priorEvidenceCount, setPriorEvidenceCount] = useState<number>(1);
  const [selectedCycleStep, setSelectedCycleStep] = useState<keyof LearningCycleData>('compare');
  const [activeMemoryTier, setActiveMemoryTier] = useState<MemoryTierKey>('all');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Active State
  const [data, setData] = useState<LearningEngineResponse>({
    success: true,
    timestamp: new Date().toISOString(),
    learningCycle: {
      observe: 'Recorded 1,000 continuous X-gate pulse trains on transmon Q0 while monitoring cryogenic Still and MXC resistance thermometry.',
      predict: 'Expected continuous linear Rabi oscillation with π-pulse amplitude at 384 mV and fidelity > 99.9% without thermal dissipation lag.',
      act: 'Dispatched Zurich HDAWG8 pulse sequence at 5.24 GHz carrier with Gaussian DRAG parameter β = 0.184.',
      measure: 'Fidelity dropped to 97.4% on pulse bursts > 400 ns. MXC temperature sensor logged a transient +1.2 mK rise.',
      compare: 'Identified a 2.5% fidelity deficit directly correlated with continuous RF duty cycle exceeding 35%.',
      explain: 'Discrepancy caused by thermal dielectric loss in the attenuator chain and finite thermal relaxation rate of the copper cold finger.',
      update: 'Updated Bayesian model for cryogenic thermal relaxation time. Established core theorems remain safely quarantined and protected.'
    },
    record: {
      whatWasExpected: 'Full gate fidelity across arbitrary continuous microwave pulse trains without localized chip heating.',
      whatActuallyHappened: 'Thermal accumulation in drive line attenuators softened the effective Rabi pulse envelope for late pulses in the train.',
      whatWasCorrect: 'Single isolated π-pulse calibrated cleanly to 99.92% fidelity; phase DRAG compensation functioned as expected.',
      whatWasIncorrect: 'Assumed thermal dissipation was instantaneous between back-to-back pulses in rapid succession.',
      whyErrorOccurred: 'The simulation world model treated attenuation as passive and heatless rather than tracking cumulative thermal power dissipation.',
      whichAssumptionsFailed: [
        'Assumption of zero heat load transfer from 4K stage down the 10 dB attenuators to MXC',
        'Assumption of static T1 coherence regardless of RF pulse repetition density'
      ],
      whichStrategyWorked: 'Closed-loop tomography and differential thermometry telemetry monitoring.',
      whichStrategyFailed: 'Continuous uninterrupted pulse firing without duty-cycle throttling.',
      reusableKnowledgeDiscovered: 'Microwave pulse trains require an inter-burst thermal relaxation budget: Dwell time ≥ 1.4 × (Burst Duration)^1.15.',
      futureDecisionToChange: 'Enforce automatic 120 ns inter-burst dwell injection in the AWG compiler whenever sequence duty cycle exceeds 30%.'
    },
    anomalyAndEvidenceAudit: {
      isAnomalousObservation: true,
      anomalyConfidenceScore: 88.4,
      evidenceCount: 1,
      evidenceRequiredForPromotion: 3,
      establishedKnowledgeProtected: true,
      protectionRationale: 'Single anomalous trial detected (Trial 1 of 3 required). Verified baseline knowledge is strictly protected against premature mutation until corroborated.'
    },
    memoryTiers: {
      temporaryTaskState: {
        items: [
          'Active sweep ID: swp-20260909-0012',
          'AWG buffer address: 0x7FFF0040',
          'Transient readout matrix unpinned'
        ],
        lifetime: 'EPHEMERAL_POST_RUN'
      },
      episodicMemory: {
        eventId: 'EPISODE-XGATE-BURST-09',
        timestamp: '2026-09-09T09:30:00.000Z',
        context: 'Microwave burst heating under 1,000 continuous X-gates at 5.24 GHz',
        takeaway: 'Duty cycle > 30% causes localized thermal detuning of 12.4 mK transmon.'
      },
      semanticKnowledge: {
        concepts: [
          {
            term: 'Dielectric Attenuator Heating',
            definition: 'RF dissipation in cryogenic coaxial attenuators converting microwave power into phonon excitations.',
            confidence: 0.95
          },
          {
            term: 'Epistemic Quota Barrier',
            definition: 'Architectural constraint preventing one-off anomalies from rewriting established verified rules.',
            confidence: 0.99
          }
        ]
      },
      proceduralKnowledge: {
        procedures: [
          {
            name: 'Duty-Cycle Aware Pulse Compilation',
            rule: 'IF duty_cycle > 0.30 THEN inject_cooldown_dwell(min = 120ns)',
            status: 'VALIDATED'
          },
          {
            name: 'Multi-Trial Corroboration Gate',
            rule: 'IF corroborating_trials < 3 THEN retain_in_hypothesis_tier()',
            status: 'VALIDATED'
          }
        ]
      },
      verifiedKnowledge: {
        verifiedFacts: [
          {
            claim: 'Base mixing chamber reaches 12.4 mK under zero RF load',
            verificationProof: 'Validated over 1,200 continuous hours of calibrated RuO2 thermometry',
            stability: 0.999
          },
          {
            claim: 'Single qubit π-pulse requires 384.2 mV at 5.24 GHz',
            verificationProof: 'Confirmed via 10,000-shot randomized benchmarking',
            stability: 0.995
          }
        ]
      },
      hypotheses: {
        activeHypotheses: [
          {
            hypothesis: 'Attenuator thermal coefficient shifts effective Rabi frequency by Δf = -140 kHz per millikelvin rise',
            falsificationTest: 'Conduct controlled temperature sweep from 12 mK to 30 mK while tracking S21 peak shift',
            empiricalEvidenceScore: 0.58,
            promotionStatus: 'HELD_IN_TRIAL'
          }
        ]
      }
    }
  });

  const cycleSteps: Array<{ key: keyof LearningCycleData; label: string; desc: string }> = [
    { key: 'observe', label: 'OBSERVE', desc: 'Acquire raw empirical telemetry and sensor outputs' },
    { key: 'predict', label: 'PREDICT', desc: 'Retrieve model predictions and theoretical bounds' },
    { key: 'act', label: 'ACT', desc: 'Trace the specific action dispatched into the environment' },
    { key: 'measure', label: 'MEASURE', desc: 'Quantify actual physical or computational outcomes' },
    { key: 'compare', label: 'COMPARE', desc: 'Detect exact deltas and divergences between prediction and measurement' },
    { key: 'explain', label: 'EXPLAIN', desc: 'Perform root-cause failure analysis and isolate violated assumptions' },
    { key: 'update', label: 'UPDATE', desc: 'Calibrate priors while guarding established knowledge against single anomalies' },
  ];

  const handleRunCycle = async (evidenceCount: number = priorEvidenceCount) => {
    if (!taskDescription.trim()) return;
    setIsRunning(true);
    try {
      const res = await fetch('/api/apex/learning-engine/cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskDescription,
          expectedOutcome,
          observedOutcome,
          priorEvidenceCount: evidenceCount,
          trialNumber: evidenceCount,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setData(result);
        setPriorEvidenceCount(evidenceCount);
      }
    } catch (err) {
      console.error('Failed to run APEX Learning Engine:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const memoryTierConfigs: Record<MemoryTierKey, { label: string; color: string; desc: string }> = {
    all: { label: 'All Memory Tiers', color: 'indigo', desc: 'Comprehensive multi-tier cognitive memory structure' },
    temporaryTaskState: { label: 'Temporary Task State', color: 'zinc', desc: 'Ephemeral execution registers and volatile task context' },
    episodicMemory: { label: 'Episodic Memory', color: 'amber', desc: 'Specific event history, timestamps, and contextual trial logs' },
    semanticKnowledge: { label: 'Semantic Knowledge', color: 'cyan', desc: 'Ontological concepts, domain terminology, and definitions' },
    proceduralKnowledge: { label: 'Procedural Knowledge', color: 'purple', desc: 'Executable rules, workflows, and validated operational playbooks' },
    verifiedKnowledge: { label: 'Verified Knowledge', color: 'emerald', desc: 'Axiomatic facts and hardened theorems protected from single-run mutation' },
    hypotheses: { label: 'Hypotheses', color: 'rose', desc: 'Candidate ideas undergoing falsification and requiring evidence before promotion' },
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Engine Header & Safety Invariants */}
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
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>APEX Learning Engine • Post-Task Epistemic Adaptation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Evidence-Driven Improvement Engine</h2>
            <p className="text-xs sm:text-sm max-w-3xl opacity-75 leading-relaxed">
              "The objective is not uncontrolled self-modification. The objective is evidence-driven improvement."
              Safeguards established verified knowledge against premature perturbation by single anomalous events.
            </p>
          </div>

          {/* Anomaly Quarantine & Promotion Status Widget */}
          <div 
            className="p-4 rounded-xl border font-mono text-xs space-y-2"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.borderStrong,
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-[10px] opacity-60">Verified Core Protection:</span>
              <span className="font-bold flex items-center space-x-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ACTIVE (ARMED)</span>
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[10px] opacity-60">Corroborating Trials:</span>
              <span className="font-bold text-indigo-400">
                {data.anomalyAndEvidenceAudit.evidenceCount} / {data.anomalyAndEvidenceAudit.evidenceRequiredForPromotion} Required
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[10px] opacity-60">Anomaly Classification:</span>
              <span className={`font-bold ${data.anomalyAndEvidenceAudit.isAnomalousObservation ? 'text-amber-400' : 'text-emerald-400'}`}>
                {data.anomalyAndEvidenceAudit.isAnomalousObservation ? 'Isolated Anomaly' : 'Corroborated Trend'}
              </span>
            </div>
          </div>
        </div>

        {/* Invariant Banner */}
        <div className="p-3.5 rounded-xl border bg-black/25 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono" style={{ borderColor: currentTheme.palette.border }}>
          <div className="flex items-center space-x-2 text-zinc-300">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Never Modify Verified Core on 1 Anomaly</span>
          </div>
          <div className="hidden sm:block text-zinc-600">•</div>
          <div className="flex items-center space-x-2 text-zinc-300">
            <Award className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Require Multi-Trial Evidence to Promote</span>
          </div>
          <div className="hidden sm:block text-zinc-600">•</div>
          <div className="flex items-center space-x-2 text-zinc-300">
            <Layers className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Strict 6-Tier Epistemic Memory Separation</span>
          </div>
        </div>
      </div>

      {/* Task Learning Cycle Execution Controls */}
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
            Post-Task Learning Ingestion
          </span>
          <span className="text-[10px] font-mono opacity-50">
            Feed completed task outcomes to run the 7-step learning cycle
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold opacity-60">Task Description</label>
            <input
              type="text"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              disabled={isRunning}
              className="w-full px-3 py-2 rounded-xl border text-xs font-mono focus:outline-hidden"
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: currentTheme.palette.borderStrong,
                color: currentTheme.palette.textPrimary,
              }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold opacity-60">What Was Expected (Prediction)</label>
            <input
              type="text"
              value={expectedOutcome}
              onChange={(e) => setExpectedOutcome(e.target.value)}
              disabled={isRunning}
              className="w-full px-3 py-2 rounded-xl border text-xs font-mono focus:outline-hidden"
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: currentTheme.palette.borderStrong,
                color: currentTheme.palette.textPrimary,
              }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold opacity-60">What Actually Happened (Measurement)</label>
            <input
              type="text"
              value={observedOutcome}
              onChange={(e) => setObservedOutcome(e.target.value)}
              disabled={isRunning}
              className="w-full px-3 py-2 rounded-xl border text-xs font-mono focus:outline-hidden"
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: currentTheme.palette.borderStrong,
                color: currentTheme.palette.textPrimary,
              }}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {/* Trial / Corroboration Stepper */}
          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="opacity-70">Simulation Evidence Trials:</span>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 5].map((count) => (
                <button
                  key={count}
                  onClick={() => handleRunCycle(count)}
                  disabled={isRunning}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                    priorEvidenceCount === count 
                      ? 'bg-indigo-600 text-white font-bold border-indigo-400' 
                      : 'border-zinc-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  {count} {count === 1 ? 'Trial (Anomaly Test)' : 'Trials (Corroborated)'}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleRunCycle(priorEvidenceCount)}
            disabled={isRunning || !taskDescription.trim()}
            className="px-5 py-2.5 rounded-xl text-white font-mono font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-all hover:opacity-90 disabled:opacity-50 cursor-pointer"
            style={{ backgroundColor: currentTheme.palette.accent }}
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running Learning Cycle...' : 'Execute Learning Cycle'}</span>
          </button>
        </div>
      </div>

      {/* 7-Step Learning Cycle Visualizer */}
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
            <RotateCcw className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-xs uppercase tracking-wider font-mono">
              Learning Cycle (OBSERVE → PREDICT → ACT → MEASURE → COMPARE → EXPLAIN → UPDATE)
            </span>
          </div>
          <span className="text-[10px] font-mono opacity-60">Click any step to inspect</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {cycleSteps.map((st, idx) => {
            const isSelected = selectedCycleStep === st.key;
            return (
              <div
                key={st.key}
                onClick={() => setSelectedCycleStep(st.key)}
                className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1 ${
                  isSelected ? 'ring-2 ring-indigo-400 border-indigo-400' : 'hover:border-zinc-500 opacity-85'
                }`}
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: isSelected ? currentTheme.palette.accent : currentTheme.palette.borderStrong,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs">{st.label}</span>
                  <span className="text-[10px] opacity-40">#{idx + 1}</span>
                </div>
                <p className="text-[10px] opacity-70 line-clamp-2 leading-relaxed">
                  {data.learningCycle[st.key]}
                </p>
              </div>
            );
          })}
        </div>

        {/* Selected Step Inspector */}
        <div className="p-4 rounded-xl border bg-black/25 font-mono text-xs space-y-1.5" style={{ borderColor: currentTheme.palette.border }}>
          <div className="flex items-center justify-between text-indigo-400 font-bold">
            <span>Stage: {cycleSteps.find(s => s.key === selectedCycleStep)?.label}</span>
            <span className="text-[10px] text-zinc-400">{cycleSteps.find(s => s.key === selectedCycleStep)?.desc}</span>
          </div>
          <p className="text-zinc-200 leading-relaxed text-xs pt-1">
            {data.learningCycle[selectedCycleStep]}
          </p>
        </div>
      </div>

      {/* Ten Required Diagnostic Learning Records */}
      <div 
        className="border rounded-2xl p-6 shadow-sm space-y-6"
        style={{
          backgroundColor: currentTheme.palette.surface,
          borderColor: currentTheme.palette.border,
          color: currentTheme.palette.textPrimary,
        }}
      >
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: currentTheme.palette.border }}>
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-purple-400" />
            <h3 className="font-bold text-sm tracking-tight font-mono uppercase">
              Formal Post-Task Evaluation Record
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-400 font-bold border border-purple-500/30">
            10 Diagnostic Dimensions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {/* What was expected vs actually happened */}
          <div className="p-4 rounded-xl border bg-black/25 space-y-2" style={{ borderColor: currentTheme.palette.borderStrong }}>
            <div className="flex items-center space-x-2 text-indigo-400 font-bold">
              <ChevronRight className="w-3.5 h-3.5" />
              <span>What Was Expected</span>
            </div>
            <p className="text-zinc-300 pl-5 leading-relaxed">{data.record.whatWasExpected}</p>
          </div>

          <div className="p-4 rounded-xl border bg-black/25 space-y-2" style={{ borderColor: currentTheme.palette.borderStrong }}>
            <div className="flex items-center space-x-2 text-amber-400 font-bold">
              <ChevronRight className="w-3.5 h-3.5" />
              <span>What Actually Happened</span>
            </div>
            <p className="text-zinc-300 pl-5 leading-relaxed">{data.record.whatActuallyHappened}</p>
          </div>

          {/* What was correct vs incorrect */}
          <div className="p-4 rounded-xl border bg-black/25 space-y-2" style={{ borderColor: currentTheme.palette.borderStrong }}>
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>What Was Correct</span>
            </div>
            <p className="text-zinc-300 pl-5 leading-relaxed">{data.record.whatWasCorrect}</p>
          </div>

          <div className="p-4 rounded-xl border bg-black/25 space-y-2" style={{ borderColor: currentTheme.palette.borderStrong }}>
            <div className="flex items-center space-x-2 text-rose-400 font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>What Was Incorrect</span>
            </div>
            <p className="text-zinc-300 pl-5 leading-relaxed">{data.record.whatWasIncorrect}</p>
          </div>

          {/* Why the error occurred & failed assumptions */}
          <div className="p-4 rounded-xl border bg-black/25 space-y-2" style={{ borderColor: currentTheme.palette.borderStrong }}>
            <div className="flex items-center space-x-2 text-rose-300 font-bold">
              <Info className="w-3.5 h-3.5" />
              <span>Why The Error Occurred</span>
            </div>
            <p className="text-zinc-300 pl-5 leading-relaxed">{data.record.whyErrorOccurred}</p>
          </div>

          <div className="p-4 rounded-xl border bg-black/25 space-y-2" style={{ borderColor: currentTheme.palette.borderStrong }}>
            <div className="flex items-center space-x-2 text-amber-300 font-bold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Which Assumptions Failed</span>
            </div>
            <ul className="list-disc list-inside text-zinc-300 pl-5 space-y-1">
              {data.record.whichAssumptionsFailed.map((assump, idx) => (
                <li key={idx}>{assump}</li>
              ))}
            </ul>
          </div>

          {/* Strategies: Worked vs Failed */}
          <div className="p-4 rounded-xl border bg-black/25 space-y-2" style={{ borderColor: currentTheme.palette.borderStrong }}>
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <Check className="w-3.5 h-3.5" />
              <span>Which Strategy Worked</span>
            </div>
            <p className="text-zinc-300 pl-5 leading-relaxed">{data.record.whichStrategyWorked}</p>
          </div>

          <div className="p-4 rounded-xl border bg-black/25 space-y-2" style={{ borderColor: currentTheme.palette.borderStrong }}>
            <div className="flex items-center space-x-2 text-rose-400 font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Which Strategy Failed</span>
            </div>
            <p className="text-zinc-300 pl-5 leading-relaxed">{data.record.whichStrategyFailed}</p>
          </div>

          {/* Reusable Knowledge & Future Decision To Change */}
          <div className="p-4 rounded-xl border bg-indigo-500/10 border-indigo-500/30 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>What Reusable Knowledge Was Discovered</span>
            </div>
            <p className="text-zinc-200 pl-5 leading-relaxed">{data.record.reusableKnowledgeDiscovered}</p>
          </div>

          <div className="p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/30 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>What Future Decision Should Change</span>
            </div>
            <p className="text-zinc-200 pl-5 leading-relaxed">{data.record.futureDecisionToChange}</p>
          </div>
        </div>
      </div>

      {/* Six-Tier Separated Epistemic Memory System */}
      <div 
        className="border rounded-2xl p-6 shadow-sm space-y-6"
        style={{
          backgroundColor: currentTheme.palette.surface,
          borderColor: currentTheme.palette.border,
          color: currentTheme.palette.textPrimary,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b" style={{ borderColor: currentTheme.palette.border }}>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-sm tracking-tight font-mono uppercase">
                Separated Epistemic Memory Architecture
              </h3>
            </div>
            <p className="text-[11px] opacity-60">
              Strict compartmentalization preventing ephemeral states or speculative hypotheses from contaminating verified axioms.
            </p>
          </div>

          {/* Tier Filter Buttons */}
          <div className="flex items-center space-x-1.5 overflow-x-auto text-[11px] font-mono">
            {(Object.keys(memoryTierConfigs) as MemoryTierKey[]).map((key) => {
              const cfg = memoryTierConfigs[key];
              const isSelected = activeMemoryTier === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveMemoryTier(key)}
                  className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                    isSelected ? 'bg-white/15 font-bold border-indigo-400 text-indigo-300' : 'opacity-70 hover:opacity-100 border-zinc-800'
                  }`}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Memory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          {/* 1. Temporary Task State */}
          {(activeMemoryTier === 'all' || activeMemoryTier === 'temporaryTaskState') && (
            <div className="p-4 rounded-xl border bg-black/25 space-y-3" style={{ borderColor: currentTheme.palette.borderStrong }}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-300 flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Temporary Task State</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                  {data.memoryTiers.temporaryTaskState.lifetime}
                </span>
              </div>
              <ul className="space-y-1.5 text-zinc-400 text-[11px]">
                {data.memoryTiers.temporaryTaskState.items.map((item, idx) => (
                  <li key={idx} className="p-2 rounded bg-black/40 border border-zinc-800 truncate">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 2. Episodic Memory */}
          {(activeMemoryTier === 'all' || activeMemoryTier === 'episodicMemory') && (
            <div className="p-4 rounded-xl border bg-black/25 space-y-3" style={{ borderColor: currentTheme.palette.borderStrong }}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300 flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>Episodic Memory</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-400">
                  {data.memoryTiers.episodicMemory.eventId}
                </span>
              </div>
              <div className="space-y-1 text-[11px] text-zinc-300">
                <div className="text-[10px] text-zinc-500">{data.memoryTiers.episodicMemory.timestamp}</div>
                <div className="font-bold text-zinc-200">{data.memoryTiers.episodicMemory.context}</div>
                <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-200">
                  <span className="font-bold block text-[10px] text-amber-400">Takeaway:</span>
                  {data.memoryTiers.episodicMemory.takeaway}
                </div>
              </div>
            </div>
          )}

          {/* 3. Semantic Knowledge */}
          {(activeMemoryTier === 'all' || activeMemoryTier === 'semanticKnowledge') && (
            <div className="p-4 rounded-xl border bg-black/25 space-y-3" style={{ borderColor: currentTheme.palette.borderStrong }}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-300 flex items-center space-x-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Semantic Knowledge</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400">
                  Ontology
                </span>
              </div>
              <div className="space-y-2 text-[11px]">
                {data.memoryTiers.semanticKnowledge.concepts.map((concept, idx) => (
                  <div key={idx} className="p-2 rounded bg-cyan-500/5 border border-cyan-500/20 space-y-1">
                    <div className="flex items-center justify-between text-cyan-300 font-bold">
                      <span>{concept.term}</span>
                      <span className="text-[10px] opacity-75">{(concept.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <p className="text-zinc-300 text-[10px]">{concept.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Procedural Knowledge */}
          {(activeMemoryTier === 'all' || activeMemoryTier === 'proceduralKnowledge') && (
            <div className="p-4 rounded-xl border bg-black/25 space-y-3" style={{ borderColor: currentTheme.palette.borderStrong }}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-300 flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  <span>Procedural Knowledge</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/15 text-purple-400">
                  Playbooks
                </span>
              </div>
              <div className="space-y-2 text-[11px]">
                {data.memoryTiers.proceduralKnowledge.procedures.map((proc, idx) => (
                  <div key={idx} className="p-2 rounded bg-purple-500/5 border border-purple-500/20 space-y-1">
                    <div className="flex items-center justify-between text-purple-300 font-bold">
                      <span>{proc.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        {proc.status}
                      </span>
                    </div>
                    <p className="text-zinc-300 font-mono text-[10px] bg-black/40 p-1.5 rounded">
                      {proc.rule}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Verified Knowledge */}
          {(activeMemoryTier === 'all' || activeMemoryTier === 'verifiedKnowledge') && (
            <div className="p-4 rounded-xl border bg-black/25 space-y-3" style={{ borderColor: currentTheme.palette.borderStrong }}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300 flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Knowledge (Core)</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                  Immutable Axioms
                </span>
              </div>
              <div className="space-y-2 text-[11px]">
                {data.memoryTiers.verifiedKnowledge.verifiedFacts.map((fact, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                    <div className="text-emerald-200 font-bold">{fact.claim}</div>
                    <div className="text-[10px] text-zinc-400">
                      Proof: <span className="text-zinc-300">{fact.verificationProof}</span>
                    </div>
                    <div className="text-[9px] text-emerald-400 font-bold">
                      Stability: {(fact.stability * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Hypotheses */}
          {(activeMemoryTier === 'all' || activeMemoryTier === 'hypotheses') && (
            <div className="p-4 rounded-xl border bg-black/25 space-y-3" style={{ borderColor: currentTheme.palette.borderStrong }}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-300 flex items-center space-x-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Hypotheses (Trial Gated)</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">
                  Falsifiable
                </span>
              </div>
              <div className="space-y-2 text-[11px]">
                {data.memoryTiers.hypotheses.activeHypotheses.map((hypo, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-rose-500/5 border border-rose-500/20 space-y-1">
                    <div className="flex items-center justify-between text-rose-300 font-bold">
                      <span>{hypo.hypothesis}</span>
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      Test: <span className="text-zinc-300">{hypo.falsificationTest}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-zinc-800 text-[10px]">
                      <span className="text-zinc-500">Evidence: {(hypo.empiricalEvidenceScore * 100).toFixed(0)}%</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        hypo.promotionStatus === 'PROMOTED' 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {hypo.promotionStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
