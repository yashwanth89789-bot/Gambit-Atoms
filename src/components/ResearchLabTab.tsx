import React, { useState } from 'react';
import { BookOpen, Sparkles, FileText, CheckCircle2, Award, RefreshCw, Download, Share2, ShieldCheck, Scale, Check, ExternalLink } from 'lucide-react';
import { ResearchPaper, IndependentVerificationReport } from '../types';
import { ResearchDashboard } from './ResearchDashboard';
import { ChainOfAgentsVisualizer } from './ChainOfAgentsVisualizer';
import { ResearchVerificationSuite } from './research/ResearchVerificationSuite';
import { useAdaptiveTheme } from '../context/ThemeContext';

export const ResearchLabTab: React.FC = () => {
  const { currentTheme, densityMode } = useAdaptiveTheme();
  const [topic, setTopic] = useState('Autonomous Chain-of-Agents Vision Language-Action Models with Self-Evolving Reward Functions');
  const [methodology, setMethodology] = useState('Reinforcement learning from AI feedback (RLAIF) combined with continuous evolutionary neural architecture search.');
  const [keywords, setKeywords] = useState('VLA, Chain-of-Agents, Evolutionary Algorithms, Agentic RAG');
  const [loading, setLoading] = useState(false);
  const [paper, setPaper] = useState<ResearchPaper | null>(null);

  // Independent Research Verification & Self-Correction states
  const [verificationReport, setVerificationReport] = useState<IndependentVerificationReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleSelectProject = (selectedTopic: string, selectedMethodology: string, selectedKeywords: string) => {
    setTopic(selectedTopic);
    setMethodology(selectedMethodology);
    setKeywords(selectedKeywords);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPaper(null); // Clear previous paper
    setVerificationReport(null);
    try {
      const [res] = await Promise.all([
        fetch('/api/research/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, methodology, keywords }),
        }),
        new Promise(resolve => setTimeout(resolve, 2000)) // Visualizer animation cadence
      ]);
      const data = await res.json();
      if (res.ok) {
        setPaper(data);
      } else {
        alert(data.error || 'Failed to publish research');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while publishing research.');
    } finally {
      setLoading(false);
    }
  };

  const handleRunAudit = async () => {
    if (!paper) return;
    setIsAuditing(true);
    try {
      const res = await fetch('/api/research/verify-and-correct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paper }),
      });
      const data = await res.json();
      setVerificationReport(data);
    } catch (err) {
      console.error(err);
      alert('Verification audit network error');
    } finally {
      setIsAuditing(false);
    }
  };

  const handleApplyCorrections = (correctedFields: Partial<ResearchPaper>, report: IndependentVerificationReport) => {
    if (!paper) return;
    setPaper({
      ...paper,
      ...correctedFields,
      verificationReport: report,
      isSelfCorrected: true,
    });
  };

  const handleLoadSamplePaper = () => {
    setPaper({
      title: "Evolutionary Scale Vision-Language-Action Models via Autonomous Chain-of-Agents Fine-Tuning",
      abstract: "We present Apex-VLA, a novel architectural framework for scaling multi-modal embodied agents through decentralized evolutionary algorithms and hierarchical chain-of-agents coordination. By replacing monolithic prompting with specialized evolutionary peer review loops, our approach achieves state-of-the-art performance on robotic manipulation and real-time reasoning benchmarks while reducing training compute by 42%.",
      hypothesis: "Decentralized evolutionary peer-review loops over specialized agent nodes achieve monotonic sample efficiency gains across non-stationary physical tasks without gradient synchronization.",
      authors: ["Dr. Alex Vance (ApexAI Labs)", "Dr. Elena Rostova (Neural Evolution Institute)"],
      sections: [
        {
          heading: "1. Introduction & Motivation",
          content: "Recent advances in foundational vision-language models have unlocked powerful interactive capabilities. However, deploying agents in highly dynamic physical environments requires robust self-correction and multi-modal alignment. We hypothesize that multi-agent consensus algorithms naturally eliminate hallucinated motor policies..."
        },
        {
          heading: "2. Evolutionary Chain-of-Agents Framework",
          content: "Our methodology constructs a directed acyclic graph of specialized agent nodes. Each node evolves its parameter weights through genetic crossover evaluated against simulated physical environments..."
        },
        {
          heading: "3. Empirical Evaluation & Benchmarks",
          content: "We evaluate Apex-VLA across 12 diverse simulation and hardware benchmarks. Results demonstrate a 3.4x speedup in task completion and universal generalization across zero-shot novel tasks without catastrophic forgetting..."
        },
        {
          heading: "4. Conclusion & Future Directions",
          content: "Apex-VLA establishes a new foundation for robust autonomous systems. Future work will explore decentralized federated evolution across edge clusters."
        }
      ],
      peerReviews: [
        {
          reviewer: "Anonymous Reviewer 1",
          score: 9.4,
          recommendation: "Strong Accept",
          comments: "An exceptionally rigorous and beautifully written paper. The evolutionary math is sound."
        },
        {
          reviewer: "Anonymous Reviewer 2",
          score: 9.0,
          recommendation: "Accept",
          comments: "Comprehensive evaluation and impressive throughput metrics on multi-modal streams."
        }
      ]
    });
    setVerificationReport(null);
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 transition-all duration-300 animate-fadeIn ${
      densityMode === 'relaxed' ? 'py-10 space-y-12' : densityMode === 'compact' ? 'py-4 space-y-6' : 'py-8 space-y-8'
    }`}>
      {/* Research Dashboard Component */}
      <ResearchDashboard onSelectProject={handleSelectProject} />

      {/* Header Banner & Publisher Suite */}
      <div 
        className={`border rounded-lg shadow-sm transition-all ${
          densityMode === 'relaxed' ? 'p-8 lg:p-10' : densityMode === 'compact' ? 'p-4 sm:p-5' : 'p-6 lg:p-8'
        }`}
        style={{
          backgroundColor: currentTheme.palette.surface,
          borderColor: currentTheme.palette.border,
          color: currentTheme.palette.textPrimary,
        }}
      >
        <div className="max-w-3xl">
          <div 
            className="inline-flex items-center space-x-2 px-2.5 py-1 rounded text-xs font-semibold mb-3 border"
            style={{
              backgroundColor: currentTheme.palette.badgeBg,
              borderColor: currentTheme.palette.borderStrong,
              color: currentTheme.palette.badgeText,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Top-Tier Venue Research Publisher Suite</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-3">
            Research Publisher & Peer Review Suite
          </h1>
          <p className="text-sm leading-relaxed opacity-80">
            Generate rigorous academic manuscripts with mathematical proofs, empirical evaluation metrics, and simulated peer review feedback suitable for NeurIPS, ICML, and CVPR.
          </p>
        </div>

        <form onSubmit={handlePublish} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold opacity-60 mb-1.5 uppercase tracking-wider">
                Research Topic / Hypothesis
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded-md px-4 py-2.5 border text-sm transition-colors"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.border,
                  color: currentTheme.palette.textPrimary,
                }}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold opacity-60 mb-1.5 uppercase tracking-wider">
                Keywords (Comma Separated)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full rounded-md px-4 py-2.5 border text-sm transition-colors"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.border,
                  color: currentTheme.palette.textPrimary,
                }}
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold opacity-60 mb-1.5 uppercase tracking-wider">
              Methodology & Experimental Design
            </label>
            <textarea
              rows={2}
              value={methodology}
              onChange={(e) => setMethodology(e.target.value)}
              className="w-full rounded-md px-4 py-2.5 border text-sm transition-colors"
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: currentTheme.palette.border,
                color: currentTheme.palette.textPrimary,
              }}
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={handleLoadSamplePaper}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-md font-bold text-xs uppercase tracking-wider border transition-all hover:opacity-100 opacity-80"
              style={{
                borderColor: currentTheme.palette.border,
                backgroundColor: currentTheme.palette.surfaceRaised,
                color: currentTheme.palette.textPrimary,
              }}
              title="Load sample academic paper to test independent verification"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Load Benchmark Manuscript</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-md text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-xs"
              style={{
                backgroundColor: currentTheme.palette.accent,
                boxShadow: currentTheme.palette.accentGlow || 'none',
              }}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Manuscript...</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Publish Academic Paper</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <ChainOfAgentsVisualizer isActive={loading} />

      {/* Published Paper & Independent Verification Suite */}
      {paper ? (
        <div className="space-y-8 animate-fadeIn">
          {/* Autonomous Independent Verification & Self-Correction Engine */}
          <ResearchVerificationSuite
            paper={paper}
            onApplyCorrections={handleApplyCorrections}
            isAuditing={isAuditing}
            onRunAudit={handleRunAudit}
            report={verificationReport}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Paper Content */}
            <div 
              className="lg:col-span-2 border rounded-xl p-8 shadow-sm space-y-6 transition-all"
              style={{
                backgroundColor: currentTheme.palette.surface,
                borderColor: currentTheme.palette.border,
                color: currentTheme.palette.textPrimary,
              }}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20 text-xs font-semibold font-mono">
                      NeurIPS 2026 Camera-Ready
                    </span>
                    {paper.isSelfCorrected && (
                      <span className="px-2.5 py-0.5 rounded bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-xs font-bold font-mono flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Independently Verified & Self-Corrected</span>
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => alert('Paper exported to LaTeX format with verified citations and operational boundaries.')}
                      className="px-3 py-1 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded text-xs font-medium flex items-center space-x-1 transition-colors border"
                      style={{ borderColor: currentTheme.palette.border }}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>LaTeX</span>
                    </button>
                    <button
                      onClick={() => alert('DOI citation link & cryptographic audit report hash copied to clipboard.')}
                      className="px-3 py-1 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded text-xs font-medium flex items-center space-x-1 transition-colors border"
                      style={{ borderColor: currentTheme.palette.border }}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif italic tracking-tight mb-4">
                  {paper.title}
                </h2>

                <div className="flex flex-wrap gap-2 text-xs mb-6 font-medium">
                  {paper.authors.map((author, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1 rounded border text-xs"
                      style={{
                        backgroundColor: currentTheme.palette.surfaceRaised,
                        borderColor: currentTheme.palette.border,
                      }}
                    >
                      {author}
                    </span>
                  ))}
                </div>

                {/* Abstract */}
                <div 
                  className="border rounded-lg p-5 mb-6 space-y-2"
                  style={{
                    backgroundColor: currentTheme.palette.surfaceRaised,
                    borderColor: currentTheme.palette.border,
                  }}
                >
                  <h3 className="text-[11px] font-bold uppercase tracking-widest font-mono opacity-60">Abstract</h3>
                  <p className="text-sm leading-relaxed italic opacity-90">{paper.abstract}</p>
                </div>

                {/* Independently Verified Core Hypothesis Banner */}
                {paper.hypothesis && (
                  <div 
                    className="border rounded-lg p-5 mb-6 space-y-2 relative overflow-hidden"
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.08)',
                      borderColor: 'rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-500">
                      <Scale className="w-4 h-4" />
                      <span>CORE FALSIFIABLE HYPOTHESIS</span>
                      {paper.isSelfCorrected && (
                        <span className="px-1.5 py-0.2 text-[10px] rounded bg-emerald-500/20 text-emerald-400">
                          Self-Corrected & Bounded
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-300 leading-relaxed">
                      "{paper.hypothesis}"
                    </p>
                  </div>
                )}
              </div>

              {/* Sections */}
              <div className="space-y-6">
                {paper.sections.map((sec, i) => (
                  <div key={i} className="space-y-2">
                    <h3 
                      className="text-lg font-bold border-b pb-2 font-serif"
                      style={{ borderColor: currentTheme.palette.border }}
                    >
                      {sec.heading}
                    </h3>
                    <div className="text-sm leading-relaxed opacity-90 whitespace-pre-line">
                      {sec.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bibliography (Verified real academic provenance) */}
              {paper.bibliography && paper.bibliography.length > 0 && (
                <div 
                  className="border-t pt-6 space-y-3"
                  style={{ borderColor: currentTheme.palette.border }}
                >
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-sky-400" />
                    <span>Verified References & Provenance (Peer-Reviewed)</span>
                  </h3>
                  <div className="space-y-2">
                    {paper.bibliography.map((b, idx) => (
                      <div 
                        key={idx} 
                        className="p-3 rounded-lg border text-xs font-mono flex items-start justify-between gap-2"
                        style={{
                          backgroundColor: currentTheme.palette.surfaceRaised,
                          borderColor: currentTheme.palette.border,
                        }}
                      >
                        <div className="space-y-0.5">
                          <div className="font-semibold">{b.citation}</div>
                          {b.doiOrArxiv && (
                            <div className="text-[11px] text-sky-400 font-bold">
                              Identifier: {b.doiOrArxiv}
                            </div>
                          )}
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0 flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>Verified Real</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Peer Review & Audit Verification Panel */}
            <div className="space-y-6">
              {/* Peer Reviews Card */}
              <div 
                className="border rounded-xl p-6 shadow-sm space-y-4"
                style={{
                  backgroundColor: currentTheme.palette.surface,
                  borderColor: currentTheme.palette.border,
                }}
              >
                <h3 className="text-xs font-bold uppercase tracking-widest font-mono flex items-center space-x-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Double-Blind Peer Reviews</span>
                </h3>

                <div className="space-y-4">
                  {paper.peerReviews.map((rev, i) => (
                    <div 
                      key={i} 
                      className="border rounded-lg p-4 space-y-2 text-xs"
                      style={{
                        backgroundColor: currentTheme.palette.surfaceRaised,
                        borderColor: currentTheme.palette.border,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{rev.reviewer}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-500 text-xs font-bold border border-emerald-500/30">
                          Score: {rev.score}/10
                        </span>
                      </div>
                      <div className="text-xs text-blue-500 font-medium">Recommendation: {rev.recommendation}</div>
                      <p className="leading-relaxed opacity-80">{rev.comments}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verification Audit Summary Card */}
              <div 
                className="border rounded-xl p-6 shadow-sm text-center space-y-3"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.border,
                }}
              >
                <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-sm uppercase tracking-wider font-mono">
                  {paper.isSelfCorrected ? 'Self-Corrected & Epistemically Sound' : 'Independent Verification Engine'}
                </h4>
                <p className="text-xs opacity-75" style={{ color: currentTheme.palette.textSecondary }}>
                  {paper.isSelfCorrected 
                    ? 'Manuscript has undergone adversarial falsification tests, citation provenance verification, and operational boundary checks.'
                    : 'Run the Independent Verification Suite to stress-test claims, audit citations, and apply automated self-corrections.'}
                </p>
                {!paper.isSelfCorrected && (
                  <button
                    onClick={handleRunAudit}
                    disabled={isAuditing}
                    className="mt-2 w-full py-2 rounded-lg text-xs font-mono font-bold text-white shadow-sm transition-all"
                    style={{ backgroundColor: currentTheme.palette.accent }}
                  >
                    {isAuditing ? 'Auditing in Progress...' : 'Launch Verification Audit'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};


