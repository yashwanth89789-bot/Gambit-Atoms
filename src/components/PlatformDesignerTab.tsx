import React, { useState, useEffect } from 'react';
import { 
  Cpu, Sparkles, Layers, Activity, Zap, Server, CheckCircle2, RefreshCw, 
  Download, Code2, ArrowRight, Globe, ShieldCheck, AlertCircle, X, MapPin, 
  AlertTriangle, Brain, Sliders, Play, Radio, FileText, ChevronRight
} from 'lucide-react';
import { PlatformDesign, PlatformComponent } from '../types';
import { ARCHITECTURE_PRESETS, synthesizeArchitectureClientSide } from '../data/architecturePresets';
import { ArchitectureTopologyVisualizer } from './architecture/ArchitectureTopologyVisualizer';
import { TensorShardingProfiler } from './architecture/TensorShardingProfiler';
import { IaCManifestViewer } from './architecture/IaCManifestViewer';
import { useAdaptiveTheme } from '../context/ThemeContext';

export const PlatformDesignerTab: React.FC = () => {
  const { currentTheme, densityMode } = useAdaptiveTheme();

  // Synthesis Form States
  const [prompt, setPrompt] = useState('Design a hyper-scale Vision Language-Action (VLA) multi-modal decision making cluster with Evolutionary Fine-Tuning and Chain-of-Agents RAG.');
  const [architectureType, setArchitectureType] = useState('Agentic RAG & VLA Autonomous Loop');
  const [scale, setScale] = useState('Global Cluster (100k+ TPS)');
  const [loading, setLoading] = useState(false);
  
  // Active Generated Architecture
  const [design, setDesign] = useState<PlatformDesign>(
    ARCHITECTURE_PRESETS['Agentic RAG & VLA Autonomous Loop']
  );
  const [activeComponentId, setActiveComponentId] = useState<string | null>('c1');

  // Modals & Panels
  const [showBlueprintModal, setShowBlueprintModal] = useState(false);
  const [selectedBlueprintNode, setSelectedBlueprintNode] = useState<string | null>(null);
  const [showReasoningDrawer, setShowReasoningDrawer] = useState(false);
  const [activeWorkspaceView, setActiveWorkspaceView] = useState<'topology' | 'sharding' | 'iac' | 'components'>('topology');

  // Global Ops Multi-Region Chaos State
  const [regions, setRegions] = useState([
    { id: 'us-east', name: 'US-East (Virginia)', latencyMs: 12, tps: 45200, status: 'Optimal', loadPct: 68 },
    { id: 'eu-central', name: 'EU-Central (Frankfurt)', latencyMs: 24, tps: 38100, status: 'Optimal', loadPct: 74 },
    { id: 'ap-southeast', name: 'Asia-Pacific (Singapore)', latencyMs: 42, tps: 52400, status: 'Optimal', loadPct: 82 },
  ]);
  const [isSimulatingFailover, setIsSimulatingFailover] = useState(false);
  const [failoverMessage, setFailoverMessage] = useState<string | null>(null);
  const [chaosMode, setChaosMode] = useState<'fiber-cut' | 'traffic-spike' | 'node-crash' | null>(null);

  // Client-Side Synthesis Engine (No API dependency required)
  const handleDesign = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    
    // Simulate high-speed AI architectural derivation
    setTimeout(() => {
      const synthesized = synthesizeArchitectureClientSide(prompt, architectureType, scale);
      setDesign(synthesized);
      if (synthesized.components?.[0]) {
        setActiveComponentId(synthesized.components[0].id);
      }
      setLoading(false);
    }, 450);
  };

  const handleSelectPreset = (presetKey: string) => {
    setArchitectureType(presetKey);
    const selected = ARCHITECTURE_PRESETS[presetKey];
    if (selected) {
      setDesign(selected);
      if (selected.components?.[0]) {
        setActiveComponentId(selected.components[0].id);
      }
    }
  };

  const handleRunChaosExperiment = (mode: 'fiber-cut' | 'traffic-spike' | 'node-crash') => {
    setIsSimulatingFailover(true);
    setChaosMode(mode);

    if (mode === 'fiber-cut') {
      setFailoverMessage('Injecting Trans-Atlantic Fiber Cut between US-East and EU-Central...');
      setTimeout(() => {
        setRegions(prev => prev.map(r => 
          r.id === 'us-east' 
            ? { ...r, status: 'Rerouting Active', latencyMs: 38, loadPct: 88 } 
            : r.id === 'eu-central'
            ? { ...r, status: 'Failover Active', loadPct: 92 }
            : r
        ));
        setFailoverMessage('Fiber cut mitigated. BGP Anycast automatically rerouted 38.1k TPS via Asia-Pacific ring with 0% dropped transactions.');
        setIsSimulatingFailover(false);
      }, 1000);
    } else if (mode === 'traffic-spike') {
      setFailoverMessage('Injecting 5x Sudden Ingress Traffic Spike across all edge gateways...');
      setTimeout(() => {
        setRegions(prev => prev.map(r => ({
          ...r,
          tps: Math.round(r.tps * 2.2),
          loadPct: Math.min(96, r.loadPct + 20),
          status: 'Auto-Scaled',
        })));
        setFailoverMessage('Horizontal GPU Pod Autoscaler (HPA) spawned 24 auxiliary vLLM worker replicas. Latency stabilized within SLO bounds.');
        setIsSimulatingFailover(false);
      }, 1000);
    } else {
      setFailoverMessage('Triggering simulated Out-of-Memory (OOM) Kernel Panic on Primary Node in US-East...');
      setTimeout(() => {
        setRegions(prev => prev.map(r => 
          r.id === 'us-east' 
            ? { ...r, status: 'Node Evicted', latencyMs: 14, loadPct: 0 } 
            : { ...r, loadPct: Math.min(95, r.loadPct + 35), status: 'Load Absorbed' }
        ));
        setFailoverMessage('StatefulSet rescheduled Pod to healthy B200 GPU node in 2.8s. Zero active connection termination.');
        setIsSimulatingFailover(false);
      }, 1000);
    }
  };

  const handleResetChaos = () => {
    setRegions([
      { id: 'us-east', name: 'US-East (Virginia)', latencyMs: 12, tps: 45200, status: 'Optimal', loadPct: 68 },
      { id: 'eu-central', name: 'EU-Central (Frankfurt)', latencyMs: 24, tps: 38100, status: 'Optimal', loadPct: 74 },
      { id: 'ap-southeast', name: 'Asia-Pacific (Singapore)', latencyMs: 42, tps: 52400, status: 'Optimal', loadPct: 82 },
    ]);
    setFailoverMessage(null);
    setChaosMode(null);
  };

  return (
    <div 
      className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fadeIn transition-colors duration-300"
      style={{ color: currentTheme.palette.textPrimary }}
    >
      {/* Header Banner with Adaptive Theme Palette */}
      <div 
        className="border rounded-2xl p-6 lg:p-8 shadow-sm transition-all duration-300 space-y-6"
        style={{
          backgroundColor: currentTheme.palette.surface,
          borderColor: currentTheme.palette.border,
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div 
              className="inline-flex items-center space-x-2 px-3 py-1 rounded-md text-xs font-mono font-semibold border"
              style={{
                backgroundColor: currentTheme.palette.badgeBg,
                borderColor: currentTheme.palette.borderStrong,
                color: currentTheme.palette.badgeText,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: currentTheme.palette.accent }} />
              <span>Next-Gen Autonomous Architecture Synthesis & Simulation Studio</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              AI Platform Designer & Distributed System Workbench
            </h1>
            
            <p className="text-sm leading-relaxed opacity-80">
              Synthesize enterprise-grade AI backbones featuring Vision-Language-Action (VLA) loops, Evolutionary Multi-Agent Swarms, Hierarchical Chain-of-Agents, and Mixture-of-Experts Tensor Sharding with interactive roofline profiling.
            </p>
          </div>

          {/* Quick Preset Badges */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold opacity-60">
              Quick Architecture Presets:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(ARCHITECTURE_PRESETS).map((key) => (
                <button
                  key={key}
                  onClick={() => handleSelectPreset(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono text-left truncate border transition-all ${
                    architectureType === key 
                      ? 'font-bold shadow-xs' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: architectureType === key ? currentTheme.palette.surfaceRaised : currentTheme.palette.surface,
                    borderColor: architectureType === key ? currentTheme.palette.accent : currentTheme.palette.border,
                    color: architectureType === key ? currentTheme.palette.accent : currentTheme.palette.textPrimary,
                  }}
                  title={key}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Synthesis Controls Form */}
        <form onSubmit={handleDesign} className="space-y-4 pt-2 border-t" style={{ borderColor: currentTheme.palette.border }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider opacity-70 mb-1.5 font-mono">
                System Specification & Objective
              </label>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full rounded-lg px-4 py-2.5 text-sm font-sans border transition-colors focus:outline-none"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.borderStrong,
                  color: currentTheme.palette.textPrimary,
                }}
                placeholder="Describe target system topology, latency constraints, and GPU cluster requirements..."
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider opacity-70 mb-1.5 font-mono">
                Target Architecture Paradigm
              </label>
              <select
                value={architectureType}
                onChange={(e) => handleSelectPreset(e.target.value)}
                className="w-full rounded-lg px-3 py-2.5 text-sm font-mono border transition-colors focus:outline-none"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.borderStrong,
                  color: currentTheme.palette.textPrimary,
                }}
              >
                {Object.keys(ARCHITECTURE_PRESETS).map((key) => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono opacity-70 font-medium">Target Deployment Scale:</span>
              <select
                value={scale}
                onChange={(e) => setScale(e.target.value)}
                className="rounded-md px-3 py-1.5 text-xs font-mono border transition-colors focus:outline-none"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.border,
                  color: currentTheme.palette.textPrimary,
                }}
              >
                <option value="Global Cluster (100k+ TPS)">Global Cluster (100k+ TPS)</option>
                <option value="Enterprise Hybrid Cloud">Enterprise Hybrid Cloud</option>
                <option value="Edge Autonomous Robot Swarm">Edge Autonomous Robot Swarm</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-lg text-white font-bold text-xs uppercase font-mono tracking-wider transition-all disabled:opacity-50 shadow-sm"
              style={{ backgroundColor: currentTheme.palette.accent }}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Topology...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Synthesize Architecture</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Main Architecture Overview & Key Metrics Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Overview Card */}
        <div 
          className="lg:col-span-2 border rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4"
          style={{
            backgroundColor: currentTheme.palette.surface,
            borderColor: currentTheme.palette.border,
          }}
        >
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{design.name}</h2>
              <span 
                className="px-3 py-0.5 rounded-full text-xs font-mono font-bold border"
                style={{
                  backgroundColor: `${currentTheme.palette.accent}15`,
                  borderColor: `${currentTheme.palette.accent}40`,
                  color: currentTheme.palette.accent,
                }}
              >
                ● Active Verified Spec
              </span>
            </div>
            
            <p className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: currentTheme.palette.accent }}>
              {design.tagline}
            </p>
            
            <p className="text-sm leading-relaxed opacity-85">
              {design.architectureOverview}
            </p>
          </div>

          <div 
            className="pt-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs"
            style={{ borderColor: currentTheme.palette.border }}
          >
            <span className="flex items-center space-x-1.5 opacity-80">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Full-Stack Zero-Jitter Multi-GPU Execution Matrix</span>
            </span>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowBlueprintModal(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-mono text-xs font-bold border transition-colors shadow-2xs"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.borderStrong,
                }}
              >
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span>Blueprint Modal</span>
              </button>

              <button
                onClick={() => setShowReasoningDrawer(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-mono text-xs font-bold text-white shadow-2xs transition-colors"
                style={{ backgroundColor: '#7C3AED' }}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>AI Reasoning</span>
              </button>
            </div>
          </div>
        </div>

        {/* Real-Time Metrics & SLA Envelope */}
        <div 
          className="border rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4"
          style={{
            backgroundColor: currentTheme.palette.surface,
            borderColor: currentTheme.palette.border,
          }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-70 font-mono">
              Cluster Performance Metrics
            </h3>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* Latency */}
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="opacity-70">P99 Service Latency</span>
                <span className="font-bold text-emerald-500">{design.metrics.estimatedLatencyMs} ms</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '32%' }} />
              </div>
            </div>

            {/* Throughput */}
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="opacity-70">Aggregated Throughput</span>
                <span className="font-bold" style={{ color: currentTheme.palette.accent }}>
                  {design.metrics.throughputTps.toLocaleString()} TPS
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: '88%', backgroundColor: currentTheme.palette.accent }} />
              </div>
            </div>

            {/* GPU Compute Efficiency */}
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="opacity-70">GPU Tensor Core Efficiency</span>
                <span className="font-bold text-emerald-500">{design.metrics.gpuEfficiencyPct}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${design.metrics.gpuEfficiencyPct}%` }} />
              </div>
            </div>

            {/* Inter-GPU Bandwidth */}
            <div className="pt-2 border-t flex justify-between opacity-80" style={{ borderColor: currentTheme.palette.border }}>
              <span>NVLink Bandwidth:</span>
              <span className="font-bold">{design.metrics.networkBandwidthGbps || 800} Gbps</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Workbench Workspace Switcher */}
      <div className="space-y-4">
        <div 
          className="flex items-center justify-between border-b pb-2"
          style={{ borderColor: currentTheme.palette.border }}
        >
          <div className="flex items-center space-x-2">
            {[
              { id: 'topology', label: 'Topology Flow Canvas', icon: Radio },
              { id: 'sharding', label: 'Tensor Sharding & Roofline Profiler', icon: Sliders },
              { id: 'iac', label: 'IaC Manifest Studio', icon: Code2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeWorkspaceView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveWorkspaceView(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-mono transition-all border ${
                    isActive
                      ? 'font-bold shadow-xs'
                      : 'opacity-70 hover:opacity-100 border-transparent'
                  }`}
                  style={{
                    backgroundColor: isActive ? currentTheme.palette.surfaceRaised : 'transparent',
                    borderColor: isActive ? currentTheme.palette.accent : 'transparent',
                    color: isActive ? currentTheme.palette.accent : currentTheme.palette.textPrimary,
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* View 1: Topology Flow Visualizer */}
        {activeWorkspaceView === 'topology' && (
          <ArchitectureTopologyVisualizer
            components={design.components}
            activeComponentId={activeComponentId}
            onSelectComponent={(id) => setActiveComponentId(id)}
            systemThroughput={design.metrics.throughputTps}
          />
        )}

        {/* View 2: Tensor Sharding Profiler */}
        {activeWorkspaceView === 'sharding' && (
          <TensorShardingProfiler />
        )}

        {/* View 3: IaC Manifests */}
        {activeWorkspaceView === 'iac' && (
          <IaCManifestViewer
            manifests={design.iacManifests}
            designName={design.name}
          />
        )}
      </div>

      {/* Global Ops Multi-Region Disaster Recovery & Chaos Engineering Bench */}
      <div 
        className="border rounded-2xl p-6 lg:p-8 shadow-sm space-y-6 transition-colors"
        style={{
          backgroundColor: currentTheme.palette.surface,
          borderColor: currentTheme.palette.border,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b"
          style={{ borderColor: currentTheme.palette.border }}
        >
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-widest text-blue-500 mb-1">
              <Globe className="w-4 h-4" />
              <span>Multi-Region Edge Orchestration & Chaos Lab</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">Active-Active Global Cluster & Disaster Recovery Matrix</h2>
          </div>

          {/* Chaos Experiment Triggers */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleRunChaosExperiment('fiber-cut')}
              disabled={isSimulatingFailover}
              className="px-3 py-1.5 rounded-md border text-xs font-mono font-bold transition-all disabled:opacity-50"
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: currentTheme.palette.borderStrong,
              }}
            >
              Simulate Fiber Cut
            </button>

            <button
              onClick={() => handleRunChaosExperiment('traffic-spike')}
              disabled={isSimulatingFailover}
              className="px-3 py-1.5 rounded-md border text-xs font-mono font-bold transition-all disabled:opacity-50"
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: currentTheme.palette.borderStrong,
              }}
            >
              Simulate 5x Surge
            </button>

            <button
              onClick={() => handleRunChaosExperiment('node-crash')}
              disabled={isSimulatingFailover}
              className="px-3 py-1.5 rounded-md border text-xs font-mono font-bold transition-all disabled:opacity-50"
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: currentTheme.palette.borderStrong,
              }}
            >
              Simulate Node OOM
            </button>

            {chaosMode && (
              <button
                onClick={handleResetChaos}
                className="px-3 py-1.5 rounded-md text-xs font-mono font-bold bg-gray-200 dark:bg-gray-800 hover:opacity-80 transition-opacity"
              >
                Reset Chaos
              </button>
            )}
          </div>
        </div>

        {failoverMessage && (
          <div 
            className="p-3.5 rounded-lg border text-xs font-mono flex items-center space-x-2 animate-fadeIn"
            style={{
              backgroundColor: `${currentTheme.palette.accent}15`,
              borderColor: `${currentTheme.palette.accent}40`,
              color: currentTheme.palette.accent,
            }}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{failoverMessage}</span>
          </div>
        )}

        {/* Regions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {regions.map((reg) => (
            <div 
              key={reg.id} 
              className="border rounded-xl p-5 space-y-4 transition-all"
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: reg.status.includes('Failover') || reg.status.includes('Rerouting') 
                  ? '#F59E0B' 
                  : currentTheme.palette.border,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">{reg.name}</span>
                <span 
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                    reg.status === 'Optimal'
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-500 border-amber-500/30 animate-pulse'
                  }`}
                >
                  {reg.status}
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="opacity-60">Edge Latency:</span>
                  <span className="font-bold text-emerald-500">{reg.latencyMs} ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Throughput:</span>
                  <span className="font-bold">{reg.tps.toLocaleString()} TPS</span>
                </div>
                <div>
                  <div className="flex justify-between font-medium mb-1">
                    <span className="opacity-60">Node GPU Load</span>
                    <span className="font-bold">{reg.loadPct}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        reg.loadPct > 85 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${reg.loadPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Blueprint Preview Modal */}
      {showBlueprintModal && design && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-fadeIn border"
            style={{
              backgroundColor: currentTheme.palette.surface,
              borderColor: currentTheme.palette.border,
              color: currentTheme.palette.textPrimary,
            }}
          >
            {/* Modal Header */}
            <div 
              className="px-6 py-4 flex items-center justify-between border-b"
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: currentTheme.palette.border,
              }}
            >
              <div className="flex items-center space-x-2.5">
                <MapPin className="w-5 h-5" style={{ color: currentTheme.palette.accent }} />
                <div>
                  <h3 className="font-bold text-base">Architectural Blueprint & Scalability Audit</h3>
                  <p className="text-xs opacity-60 font-mono">{design.name} • Topology Validation</p>
                </div>
              </div>
              <button
                onClick={() => setShowBlueprintModal(false)}
                className="p-1.5 rounded-lg hover:opacity-80 transition-opacity"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Node Graph */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {design.components.map((comp, idx) => (
                  <div
                    key={comp.id}
                    onClick={() => setSelectedBlueprintNode(comp.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedBlueprintNode === comp.id
                        ? 'ring-2 ring-blue-500 shadow-md'
                        : 'hover:opacity-90'
                    }`}
                    style={{
                      backgroundColor: currentTheme.palette.surfaceRaised,
                      borderColor: selectedBlueprintNode === comp.id ? currentTheme.palette.accent : currentTheme.palette.border,
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span 
                        className="w-6 h-6 rounded-full text-white text-xs font-mono font-bold flex items-center justify-center"
                        style={{ backgroundColor: currentTheme.palette.accent }}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-[10px] font-mono uppercase opacity-70">
                        {comp.type.split(' ')[0]}
                      </span>
                    </div>
                    <h5 className="font-bold text-sm mb-1 truncate">{comp.name}</h5>
                    <p className="text-xs opacity-70 line-clamp-2">{comp.description}</p>
                  </div>
                ))}
              </div>

              {/* Scalability Bottlenecks & Security Guardrails */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  className="p-5 rounded-xl border space-y-3"
                  style={{
                    backgroundColor: currentTheme.palette.surfaceRaised,
                    borderColor: currentTheme.palette.border,
                  }}
                >
                  <div className="flex items-center space-x-2 text-amber-500 font-bold text-xs uppercase tracking-wider font-mono">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Identified Scalability Bottlenecks & Mitigations</span>
                  </div>
                  <ul className="space-y-2 text-xs font-mono opacity-90">
                    <li className="p-2.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <strong>KV-Cache Memory Fragmentation:</strong> Mitigated via vLLM PagedAttention v3 with dynamic chunked prefill scheduling.
                    </li>
                    <li className="p-2.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <strong>All-to-All NVLink Saturation:</strong> Overlapped tensor parallel reductions with forward GEMM kernels.
                    </li>
                  </ul>
                </div>

                <div 
                  className="p-5 rounded-xl border space-y-3"
                  style={{
                    backgroundColor: currentTheme.palette.surfaceRaised,
                    borderColor: currentTheme.palette.border,
                  }}
                >
                  <div className="flex items-center space-x-2 text-emerald-500 font-bold text-xs uppercase tracking-wider font-mono">
                    <ShieldCheck className="w-4 h-4" />
                    <span>High-Availability & Zero-Day Hardening</span>
                  </div>
                  <ul className="space-y-2 text-xs font-mono opacity-90">
                    <li className="p-2.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <strong>Active-Active Multi-Region:</strong> Continuous sub-25ms synchronization between US, EU, and APAC clusters.
                    </li>
                    <li className="p-2.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <strong>Automated AST Scanner:</strong> Continuous code safety guard checks for prompt injection and out-of-envelope actuator commands.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div 
              className="px-6 py-4 border-t flex items-center justify-between"
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: currentTheme.palette.border,
              }}
            >
              <span className="text-xs font-mono opacity-60">Status: All nodes verified and production-ready</span>
              <button
                onClick={() => setShowBlueprintModal(false)}
                className="px-4 py-2 rounded-lg text-white font-bold text-xs uppercase font-mono tracking-wider transition-colors"
                style={{ backgroundColor: currentTheme.palette.accent }}
              >
                Close Blueprint
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Reasoning Slide-Out Drawer */}
      {showReasoningDrawer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-fadeIn">
          <div 
            className="w-full max-w-xl h-full shadow-2xl flex flex-col border-l overflow-hidden"
            style={{
              backgroundColor: currentTheme.palette.surface,
              borderColor: currentTheme.palette.border,
              color: currentTheme.palette.textPrimary,
            }}
          >
            {/* Drawer Header */}
            <div 
              className="px-6 py-5 flex items-center justify-between border-b"
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: currentTheme.palette.border,
              }}
            >
              <div className="flex items-center space-x-2.5">
                <Brain className="w-5 h-5 text-purple-500" />
                <div>
                  <h3 className="font-bold text-base">Architectural Derivation & Reasoning</h3>
                  <p className="text-xs opacity-60 font-mono">Step-by-step cognitive synthesis breakdown</p>
                </div>
              </div>
              <button
                onClick={() => setShowReasoningDrawer(false)}
                className="p-1.5 rounded-lg hover:opacity-80 transition-opacity"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div 
                className="p-4 rounded-xl border text-xs font-mono space-y-1"
                style={{
                  backgroundColor: `${currentTheme.palette.accent}10`,
                  borderColor: `${currentTheme.palette.accent}30`,
                }}
              >
                <span className="font-bold uppercase tracking-wider block" style={{ color: currentTheme.palette.accent }}>
                  Active Prompt Context
                </span>
                <p className="italic">"{prompt}"</p>
              </div>

              {[
                { step: 1, title: 'Constraint & SLA Formulation', desc: 'Analyzed high-throughput multi-modal constraints requiring sub-18ms tactile inference latency and cross-region high-availability.' },
                { step: 2, title: 'Hardware Topology & Tensor Sharding', desc: `Configured Tensor Parallelism (TP=${design.shardingPlan?.tp || 4}) and Pipeline Parallelism (PP=${design.shardingPlan?.pp || 2}) across ${design.shardingPlan?.gpuModel || 'NVIDIA H100 SXM5'} clusters.` },
                { step: 3, title: 'KV-Cache & Memory Footprint Optimization', desc: 'Integrated PagedAttention v3 with FP8 quantized key-value caches to eliminate memory fragmentation during 100k+ concurrent token generation.' },
                { step: 4, title: 'Multi-Region Disaster Recovery & BGP Anycast', desc: 'Engineered active-active automated failover with 0% packet loss and zero-downtime hot-swappable model weights.' },
              ].map((item) => (
                <div 
                  key={item.step}
                  className="p-4 rounded-xl border space-y-2"
                  style={{
                    backgroundColor: currentTheme.palette.surfaceRaised,
                    borderColor: currentTheme.palette.border,
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <span 
                      className="w-6 h-6 rounded-full text-white text-xs font-mono font-bold flex items-center justify-center"
                      style={{ backgroundColor: currentTheme.palette.accent }}
                    >
                      {item.step}
                    </span>
                    <h4 className="font-bold text-sm">{item.title}</h4>
                  </div>
                  <p className="text-xs opacity-75 pl-8 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Drawer Footer */}
            <div 
              className="px-6 py-4 border-t flex items-center justify-between"
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: currentTheme.palette.border,
              }}
            >
              <span className="text-xs font-mono opacity-60">Synthesis Engine: Ready</span>
              <button
                onClick={() => setShowReasoningDrawer(false)}
                className="px-4 py-2 rounded-lg text-white font-bold text-xs uppercase font-mono tracking-wider transition-colors"
                style={{ backgroundColor: currentTheme.palette.accent }}
              >
                Close Reasoning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
