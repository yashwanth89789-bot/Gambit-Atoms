import React, { useState, useEffect } from 'react';
import { Cpu, Activity, Zap, Clock, ShieldCheck, Minimize2, Maximize2, RefreshCw } from 'lucide-react';

export const PerformanceMonitor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fps, setFps] = useState(60);
  const [renderTimeMs, setRenderTimeMs] = useState(1.4);
  const [memoryUsageMb, setMemoryUsageMb] = useState(48.2);
  const [isSimulatingLoad, setIsSimulatingLoad] = useState(false);

  useEffect(() => {
    // Simulate periodic fluctuation in performance telemetry
    const interval = setInterval(() => {
      setFps(Math.floor(58 + Math.random() * 3));
      setRenderTimeMs(Number((1.2 + Math.random() * 0.8).toFixed(2)));
      setMemoryUsageMb(prev => Number((prev + (Math.random() * 0.4 - 0.2)).toFixed(1)));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleRunBenchmark = () => {
    setIsSimulatingLoad(true);
    setRenderTimeMs(4.8);
    setTimeout(() => {
      setIsSimulatingLoad(false);
      setRenderTimeMs(1.5);
    }, 1200);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-black text-white hover:bg-gray-800 px-3.5 py-2 rounded-full shadow-lg text-xs font-mono font-bold flex items-center space-x-2 transition-all hover:scale-105 border border-gray-700"
          title="Open Performance Monitor"
        >
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>FPS: {fps} | {renderTimeMs}ms</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-2xl p-4 font-mono text-xs text-gray-800 space-y-3 animate-fadeIn">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div className="flex items-center space-x-2 font-bold text-gray-900">
          <Cpu className="w-4 h-4 text-purple-600" />
          <span>React Component Perf & Telemetry</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-black transition-colors"
          title="Minimize"
        >
          <Minimize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-[#F9FAFB] p-2 rounded border border-gray-200">
          <span className="text-[10px] text-gray-500 block">FPS</span>
          <span className="font-bold text-sm text-emerald-600">{fps}</span>
        </div>
        <div className="bg-[#F9FAFB] p-2 rounded border border-gray-200">
          <span className="text-[10px] text-gray-500 block">Render Time</span>
          <span className="font-bold text-sm text-blue-600">{renderTimeMs}ms</span>
        </div>
        <div className="bg-[#F9FAFB] p-2 rounded border border-gray-200">
          <span className="text-[10px] text-gray-500 block">Heap RAM</span>
          <span className="font-bold text-sm text-purple-600">{memoryUsageMb}MB</span>
        </div>
      </div>

      <div className="space-y-1.5 pt-1 text-[11px]">
        <div className="flex justify-between text-gray-600">
          <span>Active DOM Nodes:</span>
          <span className="font-bold text-gray-900">342 elements</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Virtual DOM Diffing:</span>
          <span className="font-bold text-emerald-700">Optimized (0.4ms)</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Sub-Component Cache:</span>
          <span className="font-bold text-blue-700">98.2% Hit Rate</span>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
        <button
          onClick={handleRunBenchmark}
          disabled={isSimulatingLoad}
          className="w-full py-1.5 bg-black hover:bg-gray-800 text-white font-bold text-[11px] rounded transition-all flex items-center justify-center space-x-1.5 shadow-xs disabled:opacity-50"
        >
          {isSimulatingLoad ? (
            <>
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Benchmarking Stress...</span>
            </>
          ) : (
            <>
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Run Stress Benchmark</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
