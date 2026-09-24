import React, { useState } from 'react';
import { Cpu, Server, Zap, Database, Sliders, Activity, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAdaptiveTheme } from '../../context/ThemeContext';

export const TensorShardingProfiler: React.FC = () => {
  const { currentTheme, densityMode } = useAdaptiveTheme();

  // Sharding & Hardware States
  const [modelSizeB, setModelSizeB] = useState<number>(70); // 8, 70, 405, 1800
  const [tpDegree, setTpDegree] = useState<number>(4);
  const [ppDegree, setPpDegree] = useState<number>(2);
  const [cpDegree, setCpDegree] = useState<number>(1);
  const [precision, setPrecision] = useState<'FP8' | 'FP16' | 'INT4'>('FP8');
  const [gpuModel, setGpuModel] = useState<string>('H100'); // 'H100', 'B200', 'H200', 'TPUv5p'
  const [batchSize, setBatchSize] = useState<number>(32);
  const [contextTokensK, setContextTokensK] = useState<number>(32);

  // Hardware Specs lookup
  const gpuSpecs: Record<string, { name: string; vramGb: number; memBwTbps: number; tflopsFp8: number; costPerHour: number }> = {
    H100: { name: 'NVIDIA H100 SXM5', vramGb: 80, memBwTbps: 3.35, tflopsFp8: 1979, costPerHour: 3.85 },
    B200: { name: 'NVIDIA B200 SXM', vramGb: 192, memBwTbps: 8.0, tflopsFp8: 4500, costPerHour: 6.20 },
    H200: { name: 'NVIDIA H200 SXM', vramGb: 141, memBwTbps: 4.8, tflopsFp8: 1979, costPerHour: 4.50 },
    TPUv5p: { name: 'Google TPU v5p', vramGb: 95, memBwTbps: 2.76, tflopsFp8: 918, costPerHour: 3.10 },
  };

  const selectedGpu = gpuSpecs[gpuModel] || gpuSpecs.H100;
  const totalGpus = tpDegree * ppDegree * cpDegree;

  // Precision bytes multiplier
  const bytesPerParam = precision === 'INT4' ? 0.5 : precision === 'FP8' ? 1.0 : 2.0;

  // Model Weight VRAM calculation
  const totalModelWeightGb = modelSizeB * bytesPerParam;
  const weightVramPerGpuGb = totalModelWeightGb / totalGpus;

  // KV-Cache VRAM calculation per GPU
  // Rule of thumb: ~2 * layers * hidden_dim * context * batch / (tp * pp)
  const bytesPerKvToken = 0.5 * (modelSizeB >= 405 ? 16 : modelSizeB >= 70 ? 8 : 4);
  const totalKvCacheGb = (batchSize * (contextTokensK * 1024) * bytesPerKvToken) / (1024 * 1024);
  const kvCachePerGpuGb = totalKvCacheGb / (tpDegree * cpDegree);

  // Total VRAM per GPU & Overhead
  const activationOverheadGb = (batchSize * 0.8 * bytesPerParam);
  const totalVramUsedPerGpuGb = Math.round((weightVramPerGpuGb + kvCachePerGpuGb + activationOverheadGb) * 10) / 10;
  const vramUtilizationPct = Math.min(100, Math.round((totalVramUsedPerGpuGb / selectedGpu.vramGb) * 100));
  const isOOM = totalVramUsedPerGpuGb > selectedGpu.vramGb;

  // Roofline & Throughput estimate
  const interGpuAllReduceBandwidth = tpDegree > 1 ? 900 / tpDegree : 0; // NVLink
  const isMemoryBound = (contextTokensK > 64) || (batchSize <= 4);
  const tokensPerSecPerGpu = Math.round(
    ((selectedGpu.memBwTbps * 1000) / (Math.max(1, modelSizeB / totalGpus) * bytesPerParam)) * 
    (precision === 'FP8' ? 1.4 : precision === 'INT4' ? 1.8 : 1.0) * (isOOM ? 0 : 1)
  );
  const clusterTotalTokensSec = tokensPerSecPerGpu * totalGpus;
  const timeToFirstTokenMs = Math.round((contextTokensK * 0.45 * (modelSizeB / 70) / (totalGpus / 4)) * 10) / 10;
  const clusterCostPerHour = Math.round(totalGpus * selectedGpu.costPerHour * 100) / 100;

  return (
    <div 
      className="border rounded-xl p-5 md:p-6 transition-all duration-300 shadow-sm space-y-6"
      style={{
        backgroundColor: currentTheme.palette.surface,
        borderColor: currentTheme.palette.border,
        color: currentTheme.palette.textPrimary,
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b"
        style={{ borderColor: currentTheme.palette.border }}
      >
        <div className="flex items-center space-x-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center border"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.borderStrong,
              color: currentTheme.palette.accent,
            }}
          >
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base tracking-tight">Interactive Multi-GPU Tensor Sharding & Roofline Profiler</h3>
            <p className="text-xs opacity-70">Model parallel layout optimizer, KV-Cache memory capacity, and NVLink inter-connect profiler</p>
          </div>
        </div>

        {/* Live Cluster Specs Summary */}
        <div 
          className="flex items-center space-x-3 px-3 py-1.5 rounded-lg border text-xs font-mono"
          style={{
            backgroundColor: currentTheme.palette.surfaceRaised,
            borderColor: currentTheme.palette.border,
          }}
        >
          <span>Cluster: <strong style={{ color: currentTheme.palette.accent }}>{totalGpus}x {selectedGpu.name}</strong></span>
          <span className="opacity-40">|</span>
          <span>Cost: <strong>${clusterCostPerHour}/hr</strong></span>
        </div>
      </div>

      {/* Sharding Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Model Backbone Size */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider opacity-70">
            Model Parameters
          </label>
          <select
            value={modelSizeB}
            onChange={(e) => setModelSizeB(Number(e.target.value))}
            className="w-full rounded-md px-3 py-2 text-xs font-mono border transition-colors focus:outline-none"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.border,
              color: currentTheme.palette.textPrimary,
            }}
          >
            <option value={8}>8B Parameters (Llama-3 / Gemma-2)</option>
            <option value={70}>70B Parameters (Llama-3.1 70B)</option>
            <option value={405}>405B Parameters (Llama-3.1 405B)</option>
            <option value={1800}>1.8T Sparse MoE (Mixture of Experts)</option>
          </select>
        </div>

        {/* GPU Accelerator Model */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider opacity-70">
            GPU Accelerator
          </label>
          <select
            value={gpuModel}
            onChange={(e) => setGpuModel(e.target.value)}
            className="w-full rounded-md px-3 py-2 text-xs font-mono border transition-colors focus:outline-none"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.border,
              color: currentTheme.palette.textPrimary,
            }}
          >
            <option value="H100">NVIDIA H100 SXM5 (80GB / 3.35 TB/s)</option>
            <option value="B200">NVIDIA B200 SXM (192GB / 8.0 TB/s)</option>
            <option value="H200">NVIDIA H200 SXM (141GB / 4.8 TB/s)</option>
            <option value="TPUv5p">Google TPU v5p (95GB / 2.76 TB/s)</option>
          </select>
        </div>

        {/* Tensor Parallelism (TP) */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider opacity-70 flex justify-between">
            <span>Tensor Parallel (TP)</span>
            <span className="font-mono text-emerald-500 font-bold">TP={tpDegree}</span>
          </label>
          <div className="flex gap-1">
            {[1, 2, 4, 8].map((tp) => (
              <button
                key={tp}
                type="button"
                onClick={() => setTpDegree(tp)}
                className={`flex-1 py-1.5 text-xs font-mono rounded border transition-all ${
                  tpDegree === tp 
                    ? 'font-bold text-white shadow-2xs' 
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={tpDegree === tp ? { backgroundColor: currentTheme.palette.accent } : { backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}
              >
                {tp}x
              </button>
            ))}
          </div>
        </div>

        {/* Pipeline Parallelism (PP) */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider opacity-70 flex justify-between">
            <span>Pipeline Parallel (PP)</span>
            <span className="font-mono text-emerald-500 font-bold">PP={ppDegree}</span>
          </label>
          <div className="flex gap-1">
            {[1, 2, 4, 8].map((pp) => (
              <button
                key={pp}
                type="button"
                onClick={() => setPpDegree(pp)}
                className={`flex-1 py-1.5 text-xs font-mono rounded border transition-all ${
                  ppDegree === pp 
                    ? 'font-bold text-white shadow-2xs' 
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={ppDegree === pp ? { backgroundColor: currentTheme.palette.accent } : { backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}
              >
                {pp}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Sliders: Precision, Batch, Context */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Precision Selector */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider opacity-70">
            Quantization Precision
          </label>
          <div className="flex gap-2">
            {(['FP8', 'FP16', 'INT4'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPrecision(p)}
                className={`flex-1 py-1.5 text-xs font-mono rounded border transition-all ${
                  precision === p 
                    ? 'font-bold text-white shadow-2xs' 
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={precision === p ? { backgroundColor: currentTheme.palette.accent } : { backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}
              >
                {p} ({p === 'INT4' ? '4-bit' : p === 'FP8' ? '8-bit' : '16-bit'})
              </button>
            ))}
          </div>
        </div>

        {/* Batch Size Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider opacity-70">
            <span>Concurrent Batch Size</span>
            <span className="font-mono text-emerald-500 font-bold">{batchSize} reqs</span>
          </div>
          <input
            type="range"
            min={1}
            max={128}
            step={1}
            value={batchSize}
            onChange={(e) => setBatchSize(Number(e.target.value))}
            className="w-full accent-black dark:accent-white cursor-pointer"
          />
        </div>

        {/* Context Length Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider opacity-70">
            <span>Context Window</span>
            <span className="font-mono text-emerald-500 font-bold">{contextTokensK}k tokens</span>
          </div>
          <input
            type="range"
            min={4}
            max={128}
            step={4}
            value={contextTokensK}
            onChange={(e) => setContextTokensK(Number(e.target.value))}
            className="w-full accent-black dark:accent-white cursor-pointer"
          />
        </div>
      </div>

      {/* Profiler Output Results Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
        {/* VRAM Memory Allocation Bar */}
        <div 
          className="md:col-span-2 p-4 rounded-xl border space-y-3"
          style={{
            backgroundColor: currentTheme.palette.surfaceRaised,
            borderColor: isOOM ? '#EF4444' : currentTheme.palette.border,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4" style={{ color: isOOM ? '#EF4444' : currentTheme.palette.accent }} />
              <span className="font-bold text-xs uppercase tracking-wider">Per-GPU VRAM Allocation</span>
            </div>
            <span 
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                isOOM ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
              }`}
            >
              {isOOM ? '⚠️ OOM (Out of Memory)' : `${vramUtilizationPct}% Allocated`}
            </span>
          </div>

          <div className="flex justify-between text-xs font-mono">
            <span>Used: <strong>{totalVramUsedPerGpuGb} GB</strong> / {selectedGpu.vramGb} GB</span>
            <span className="opacity-60">Weights: {weightVramPerGpuGb.toFixed(1)}GB | KV: {kvCachePerGpuGb.toFixed(1)}GB</span>
          </div>

          {/* Stacked Memory Progress Bar */}
          <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden flex">
            {/* Weights */}
            <div 
              className="h-full bg-blue-600"
              style={{ width: `${Math.min(100, (weightVramPerGpuGb / selectedGpu.vramGb) * 100)}%` }}
              title={`Model Weights: ${weightVramPerGpuGb.toFixed(1)} GB`}
            />
            {/* KV Cache */}
            <div 
              className="h-full bg-amber-500"
              style={{ width: `${Math.min(100, (kvCachePerGpuGb / selectedGpu.vramGb) * 100)}%` }}
              title={`KV-Cache: ${kvCachePerGpuGb.toFixed(1)} GB`}
            />
            {/* Activations */}
            <div 
              className="h-full bg-purple-500"
              style={{ width: `${Math.min(100, (activationOverheadGb / selectedGpu.vramGb) * 100)}%` }}
              title={`Activations: ${activationOverheadGb.toFixed(1)} GB`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono opacity-80 pt-1">
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-blue-600 inline-block"/><span>Model Weights ({weightVramPerGpuGb.toFixed(1)}G)</span></span>
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block"/><span>KV-Cache ({kvCachePerGpuGb.toFixed(1)}G)</span></span>
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block"/><span>Activations ({activationOverheadGb.toFixed(1)}G)</span></span>
          </div>
        </div>

        {/* Throughput & TTFT Metrics */}
        <div 
          className="p-4 rounded-xl border space-y-2 flex flex-col justify-between"
          style={{
            backgroundColor: currentTheme.palette.surfaceRaised,
            borderColor: currentTheme.palette.border,
          }}
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider opacity-70">
            <span>Cluster Throughput</span>
            <Zap className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono tracking-tight" style={{ color: currentTheme.palette.accent }}>
              {isOOM ? '0' : clusterTotalTokensSec.toLocaleString()}
            </div>
            <p className="text-[11px] opacity-70">Tokens / Sec aggregate</p>
          </div>
          <div className="pt-2 border-t text-[11px] font-mono opacity-80 flex justify-between"
            style={{ borderColor: currentTheme.palette.border }}
          >
            <span>Per-GPU:</span>
            <span className="font-bold">{tokensPerSecPerGpu} tok/s</span>
          </div>
        </div>

        {/* Bottleneck & Roofline Indicator */}
        <div 
          className="p-4 rounded-xl border space-y-2 flex flex-col justify-between"
          style={{
            backgroundColor: currentTheme.palette.surfaceRaised,
            borderColor: currentTheme.palette.border,
          }}
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider opacity-70">
            <span>Roofline Regime</span>
            <Activity className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div>
            <div className={`text-base font-bold font-mono tracking-tight ${isMemoryBound ? 'text-amber-500' : 'text-blue-500'}`}>
              {isMemoryBound ? 'Memory-BW Bound' : 'Compute Bound'}
            </div>
            <p className="text-[11px] opacity-70">
              {isMemoryBound ? 'Bound by HBM3e bandwidth' : 'Optimal tensor core compute'}
            </p>
          </div>
          <div className="pt-2 border-t text-[11px] font-mono opacity-80 flex justify-between"
            style={{ borderColor: currentTheme.palette.border }}
          >
            <span>Est. TTFT:</span>
            <span className="font-bold">{timeToFirstTokenMs} ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
