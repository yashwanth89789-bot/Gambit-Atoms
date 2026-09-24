import React, { useState } from 'react';
import { Globe, Sparkles, Server, CheckCircle2, RefreshCw, ShieldAlert, Terminal } from 'lucide-react';
import { EngineeringSolution } from '../types';

export const EngineeringSolverTab: React.FC = () => {
  const [problemStatement, setProblemStatement] = useState('Scaling real-time multi-modal Vision Language-Action agent inference across 10 global TPU v5e data centers with sub-50ms tail latency.');
  const [constraints, setConstraints] = useState('Strict memory bandwidth limits, zero-downtime rolling updates, and strict carbon-aware power capping.');
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState<EngineeringSolution | null>(null);

  const handleSolve = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/engineering/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemStatement, constraints }),
      });
      const data = await res.json();
      if (res.ok) {
        setSolution(data);
      } else {
        alert(data.error || 'Failed to solve engineering problem');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while solving engineering problem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 lg:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-gray-100 text-gray-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Global Scale Engineering Solver</span>
          </div>
          <h1 className="text-3xl font-bold text-[#111111] tracking-tight sm:text-4xl mb-3">
            Distributed Systems & Infrastructure Architect
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Solve world-class engineering challenges involving distributed model parallelism, fault-tolerant agentic clusters, and low-latency tensor networking.
          </p>
        </div>

        <form onSubmit={handleSolve} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                Global Engineering Problem
              </label>
              <textarea
                rows={3}
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-2.5 text-[#111111] placeholder-gray-400 focus:outline-none focus:border-black text-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                Hard Constraints & Requirements
              </label>
              <textarea
                rows={3}
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-2.5 text-[#111111] placeholder-gray-400 focus:outline-none focus:border-black text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-md bg-black hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Solution Blueprint...</span>
                </>
              ) : (
                <>
                  <Globe className="w-3.5 h-3.5" />
                  <span>Solve Engineering Problem</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Solution Results */}
      {solution ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
          {/* Main Blueprint */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-8 shadow-sm space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                  {solution.severity}
                </span>
                <span className="text-xs text-gray-500 font-mono">Verified Distributed Spec</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight mb-4">
                {solution.problemTitle}
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed bg-[#F9FAFB] border border-gray-200 p-5 rounded-md">
                {solution.executiveSummary}
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-[#111111] border-b border-gray-200 pb-2">Execution Phases & Architecture</h3>
              {solution.architectureSteps.map((step, i) => (
                <div key={i} className="bg-[#F9FAFB] border border-gray-200 rounded-md p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#111111]">{step.phase}</span>
                    <span className="text-xs text-gray-500 font-mono">Phase {i + 1}</span>
                  </div>
                  <p className="text-xs text-gray-600">{step.action}</p>
                  <pre className="bg-white border border-gray-200 p-3.5 rounded text-xs font-mono text-gray-800 overflow-x-auto">
                    <code>{step.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Mitigation & Verification */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-700 flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Risk Mitigation & Fault Tolerance</span>
              </h3>
              <ul className="space-y-3">
                {solution.riskMitigation.map((risk, i) => (
                  <li key={i} className="flex items-start space-x-2 text-xs text-gray-600 bg-[#F9FAFB] p-3 rounded border border-gray-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-700 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verification & Chaos Plan</span>
              </h3>
              <p className="text-xs text-gray-600 bg-[#F9FAFB] p-4 rounded border border-gray-200 leading-relaxed">
                {solution.verificationPlan}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-500 shadow-sm">
          <Globe className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#111111] mb-1">Global Scale Solver Ready</h3>
          <p className="text-xs max-w-md mx-auto text-gray-500">
            Enter your distributed systems challenge above to synthesize an end-to-end resilient architecture blueprint.
          </p>
        </div>
      )}
    </div>
  );
};

