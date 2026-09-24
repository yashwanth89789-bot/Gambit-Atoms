export interface PlatformComponent {
  id: string;
  name: string;
  type: string;
  description: string;
  techStack: string[];
  codeSnippet: string;
  latencyMs?: number;
  memoryMb?: number;
  status?: 'optimal' | 'warning' | 'degraded';
  throughput?: number;
  category?: 'ingress' | 'perception' | 'reasoning' | 'kvcache' | 'guardrails' | 'action';
  connections?: string[];
}

export interface PlatformMetrics {
  estimatedLatencyMs: number;
  throughputTps: number;
  gpuEfficiencyPct: number;
  carbonFootprintKgPerM: number;
  ttftMs?: number;
  vramUsageGb?: number;
  networkBandwidthGbps?: number;
}

export interface PlatformDesign {
  name: string;
  tagline: string;
  architectureOverview: string;
  components: PlatformComponent[];
  metrics: PlatformMetrics;
  deploymentConfig: string;
  shardingPlan?: {
    tp: number;
    pp: number;
    cp: number;
    gpuModel: string;
    totalGpus: number;
    vramPerGpuGb: number;
  };
  iacManifests?: {
    kubernetes: string;
    terraform: string;
    dockerCompose: string;
  };
}

export interface ResearchSection {
  heading: string;
  content: string;
}

export interface PeerReview {
  reviewer: string;
  score: number;
  recommendation: string;
  comments: string;
}

export type EpistemicStatus = 
  | 'Established Fact' 
  | 'Strong Evidence' 
  | 'Plausible Inference' 
  | 'Speculation' 
  | 'Unresolved Question';

export interface CitationItem {
  id: string;
  originalClaim: string;
  citedSource: string;
  status: 'hallucinated' | 'unverified' | 'misattributed' | 'verified_accurate';
  correctionReason: string;
  verifiedSource: string;
  doiOrArxiv: string;
  venue: string;
  year: number;
}

export interface HypothesisAudit {
  originalHypothesis: string;
  flawsIdentified: string[];
  falsificationCriterion: string;
  correctedHypothesis: string;
  testabilityScore: number;
  operationalBounds: string;
  falsificationExperiment: string;
}

export interface InterpretationAudit {
  id: string;
  originalClaim: string;
  originalInterpretation: string;
  flawOrBias: string;
  epistemicCategory: EpistemicStatus;
  correctedInterpretation: string;
  statisticalBounds: string;
}

export interface IndependentVerificationReport {
  timestamp: string;
  overallScoreBefore: number;
  overallScoreAfter: number;
  verificationVerdict: 'Self-Corrected & Mathematically Grounded' | 'Rigorous Empirical Alignment' | 'Awaiting Physical Grounding';
  hypothesisAudit: HypothesisAudit;
  citationsAudit: CitationItem[];
  interpretationsAudit: InterpretationAudit[];
  epistemicBreakdown: {
    establishedFacts: number;
    strongEvidence: number;
    plausibleInference: number;
    speculation: number;
    unresolvedQuestions: number;
  };
  mostEfficientDisproofExperiment: string;
  auditTrailLog: Array<{ step: string; status: 'passed' | 'corrected' | 'critical'; detail: string }>;
}

export interface ResearchPaper {
  title: string;
  abstract: string;
  authors: string[];
  sections: ResearchSection[];
  peerReviews: PeerReview[];
  hypothesis?: string;
  bibliography?: Array<{ id: string; citation: string; verified: boolean; doiOrArxiv?: string }>;
  verificationReport?: IndependentVerificationReport;
  isSelfCorrected?: boolean;
}

export interface FileChange {
  filename: string;
  changeType: 'modified' | 'added' | 'deleted';
  diff: string;
}

export interface BenchmarkResults {
  baselineQps: number;
  optimizedQps: number;
  latencyReductionPct: number;
  memoryFootprintMb: number;
}

export interface OpenSourcePR {
  repo: string;
  prTitle: string;
  prNumber: number;
  description: string;
  filesChanged: FileChange[];
  benchmarkResults: BenchmarkResults;
  testCoveragePct: number;
}

export interface EngineeringStep {
  phase: string;
  action: string;
  code: string;
}

export interface EngineeringSolution {
  problemTitle: string;
  severity: string;
  executiveSummary: string;
  architectureSteps: EngineeringStep[];
  riskMitigation: string[];
  verificationPlan: string;
}

export interface CodeFile {
  id: string;
  name: string;
  language: string;
  content: string;
  isModified?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
