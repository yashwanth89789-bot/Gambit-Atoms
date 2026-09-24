import React, { useState } from 'react';
import { 
  Terminal, Activity, ShieldCheck, Package, Cpu, 
  Trash2, Search, Play, CheckCircle2, AlertTriangle, 
  RefreshCw, Check, ArrowUpRight, Zap, Layers, Sparkles 
} from 'lucide-react';
import { useAdaptiveTheme } from '../../context/ThemeContext';

interface DiagnosticIssue {
  id: string;
  line: number;
  col: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
  rule: string;
  fixAvailable: boolean;
}

interface InstalledPackage {
  name: string;
  version: string;
  description: string;
  status: 'installed' | 'upgradable';
}

interface IDETerminalConsoleProps {
  consoleLogs: Array<{ id: string; timestamp: string; level: 'info' | 'success' | 'warn' | 'error' | 'perf'; text: string }>;
  onClearLogs: () => void;
  isRunning: boolean;
  onRunCode: () => void;
  currentHardware: string;
  activeFileName: string;
  onApplyLintFix?: (rule: string) => void;
}

export const IDETerminalConsole: React.FC<IDETerminalConsoleProps> = ({
  consoleLogs,
  onClearLogs,
  isRunning,
  onRunCode,
  currentHardware,
  activeFileName,
  onApplyLintFix,
}) => {
  const { currentTheme } = useAdaptiveTheme();
  const [activeConsoleTab, setActiveConsoleTab] = useState<'logs' | 'profiler' | 'diagnostics' | 'packages'>('logs');
  const [logFilter, setLogFilter] = useState('');
  const [diagnostics, setDiagnostics] = useState<DiagnosticIssue[]>([
    { id: 'd1', line: 12, col: 5, severity: 'warning', message: 'Avoid creating temporary tensor allocations in the inner training loop to prevent GPU memory spikes.', rule: 'PERF004_TEMP_TENSOR', fixAvailable: true },
    { id: 'd2', line: 28, col: 1, severity: 'info', message: 'Missing docstring and return type annotation in public module interface.', rule: 'TYP002_MISSING_TYPE_HINT', fixAvailable: true },
    { id: 'd3', line: 35, col: 9, severity: 'info', message: 'CUDA tensor stride is not contiguous along dimension 1. Consider calling .contiguous() before kernel launch.', rule: 'CUDA012_STRIDE_ALIGNMENT', fixAvailable: true },
  ]);

  const [packages, setPackages] = useState<InstalledPackage[]>([
    { name: 'torch', version: '2.6.0+cu128', description: 'PyTorch deep learning framework with CUDA 12.8 Hopper support', status: 'installed' },
    { name: 'triton', version: '3.2.0', description: 'OpenAI Triton language and JIT compiler for high-performance GPU kernels', status: 'installed' },
    { name: 'vllm', version: '0.7.3', description: 'High-throughput LLM serving engine with PagedAttention v3', status: 'installed' },
    { name: 'transformers', version: '4.49.0', description: 'State-of-the-art Machine Learning for PyTorch, JAX, and TensorFlow', status: 'upgradable' },
    { name: 'flash-attn', version: '2.7.2', description: 'Fast and memory-efficient exact attention with IO-awareness', status: 'installed' },
    { name: 'numpy', version: '2.2.3', description: 'Fundamental package for scientific computing with Python', status: 'installed' },
  ]);

  const [installingPackage, setInstallingPackage] = useState<string | null>(null);
  const [newPackageInput, setNewPackageInput] = useState('');

  const handleSimulateInstall = (pkgName: string) => {
    if (!pkgName.trim()) return;
    setInstallingPackage(pkgName);
    setTimeout(() => {
      setPackages(prev => [
        { name: pkgName.trim(), version: '1.0.0', description: 'User installed runtime extension module', status: 'installed' },
        ...prev.filter(p => p.name !== pkgName.trim()),
      ]);
      setInstallingPackage(null);
      setNewPackageInput('');
    }, 1000);
  };

  const handleFixDiagnostic = (id: string, rule: string) => {
    setDiagnostics(prev => prev.filter(d => d.id !== id));
    if (onApplyLintFix) {
      onApplyLintFix(rule);
    }
  };

  const filteredLogs = consoleLogs.filter(log => 
    log.text.toLowerCase().includes(logFilter.toLowerCase()) || 
    log.level.toLowerCase().includes(logFilter.toLowerCase())
  );

  return (
    <div 
      className="border rounded-2xl shadow-sm overflow-hidden flex flex-col transition-all duration-300"
      style={{
        backgroundColor: currentTheme.palette.surface,
        borderColor: currentTheme.palette.border,
        color: currentTheme.palette.textPrimary,
      }}
    >
      {/* Console Header & Tab Selector */}
      <div 
        className="px-4 sm:px-6 py-3 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        style={{ borderColor: currentTheme.palette.border }}
      >
        {/* Sub-tabs */}
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveConsoleTab('logs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              activeConsoleTab === 'logs' ? 'shadow-2xs' : 'opacity-60 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeConsoleTab === 'logs' ? currentTheme.palette.surfaceRaised : 'transparent',
              color: activeConsoleTab === 'logs' ? currentTheme.palette.accent : currentTheme.palette.textPrimary,
            }}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Runtime Console</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10 ml-1">
              {consoleLogs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveConsoleTab('profiler')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              activeConsoleTab === 'profiler' ? 'shadow-2xs' : 'opacity-60 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeConsoleTab === 'profiler' ? currentTheme.palette.surfaceRaised : 'transparent',
              color: activeConsoleTab === 'profiler' ? currentTheme.palette.accent : currentTheme.palette.textPrimary,
            }}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>Hardware & VRAM Profiler</span>
          </button>

          <button
            onClick={() => setActiveConsoleTab('diagnostics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              activeConsoleTab === 'diagnostics' ? 'shadow-2xs' : 'opacity-60 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeConsoleTab === 'diagnostics' ? currentTheme.palette.surfaceRaised : 'transparent',
              color: activeConsoleTab === 'diagnostics' ? currentTheme.palette.accent : currentTheme.palette.textPrimary,
            }}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>AST Diagnostics</span>
            {diagnostics.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold ml-1">
                {diagnostics.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveConsoleTab('packages')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              activeConsoleTab === 'packages' ? 'shadow-2xs' : 'opacity-60 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeConsoleTab === 'packages' ? currentTheme.palette.surfaceRaised : 'transparent',
              color: activeConsoleTab === 'packages' ? currentTheme.palette.accent : currentTheme.palette.textPrimary,
            }}
          >
            <Package className="w-3.5 h-3.5 text-purple-400" />
            <span>Package Registry</span>
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-2">
          {activeConsoleTab === 'logs' && (
            <div className="relative flex items-center">
              <Search className="w-3 h-3 absolute left-2.5 opacity-40" />
              <input
                type="text"
                placeholder="Filter logs..."
                value={logFilter}
                onChange={(e) => setLogFilter(e.target.value)}
                className="pl-7 pr-2 py-1 rounded-md text-[11px] font-mono border focus:outline-none w-28 sm:w-36"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.border,
                }}
              />
            </div>
          )}

          {activeConsoleTab === 'logs' && (
            <button
              onClick={onClearLogs}
              className="p-1.5 rounded-md border text-[11px] font-mono opacity-70 hover:opacity-100 transition-colors flex items-center space-x-1"
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: currentTheme.palette.border,
              }}
              title="Clear Console Logs"
            >
              <Trash2 className="w-3 h-3" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}

          <div className="text-[10px] font-mono opacity-60 hidden md:inline-block px-2 py-1 rounded border"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.border,
            }}
          >
            <span>Target: </span>
            <span className="font-bold text-emerald-500">{currentHardware}</span>
          </div>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="p-4 sm:p-5 h-64 overflow-y-auto font-mono text-xs">
        {/* 1. Runtime Console Logs Tab */}
        {activeConsoleTab === 'logs' && (
          <div className="space-y-1.5">
            {filteredLogs.length === 0 ? (
              <div className="py-12 text-center text-xs opacity-50 font-mono">
                No console logs recorded yet. Click "Run Kernel" to execute the active script.
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="flex items-start space-x-2.5 py-1 px-2 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <span className="text-[10px] opacity-40 shrink-0 select-none pt-0.5">{log.timestamp}</span>
                  <span 
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase shrink-0 ${
                      log.level === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                      log.level === 'warn' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                      log.level === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                      log.level === 'perf' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                    }`}
                  >
                    {log.level}
                  </span>
                  <span className="leading-relaxed whitespace-pre-wrap flex-1 opacity-90">{log.text}</span>
                </div>
              ))
            )}
            {isRunning && (
              <div className="flex items-center space-x-2 py-1 px-2 text-emerald-500 animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Executing tensor graph on {currentHardware}...</span>
              </div>
            )}
          </div>
        )}

        {/* 2. Hardware & VRAM Profiler Tab */}
        {activeConsoleTab === 'profiler' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Metric 1: VRAM Allocation */}
              <div 
                className="p-3 rounded-xl border space-y-1.5"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.border,
                }}
              >
                <div className="flex justify-between text-[11px] opacity-70">
                  <span>GPU VRAM Allocated</span>
                  <span className="font-bold text-emerald-500">22.4 / 80 GB (28%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: '28%' }}></div>
                </div>
                <div className="text-[10px] opacity-50">KV Cache: 14.8 GB | Weights: 7.6 GB</div>
              </div>

              {/* Metric 2: Streaming Multiprocessor (SM) Occupancy */}
              <div 
                className="p-3 rounded-xl border space-y-1.5"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.border,
                }}
              >
                <div className="flex justify-between text-[11px] opacity-70">
                  <span>SM Warp Occupancy</span>
                  <span className="font-bold text-blue-500">94.2%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: '94.2%' }}></div>
                </div>
                <div className="text-[10px] opacity-50">132 / 132 SMs active with TMA</div>
              </div>

              {/* Metric 3: Memory Bandwidth Utilization */}
              <div 
                className="p-3 rounded-xl border space-y-1.5"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.border,
                }}
              >
                <div className="flex justify-between text-[11px] opacity-70">
                  <span>HBM3 Bandwidth</span>
                  <span className="font-bold text-purple-400">2.98 TB/s (89%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-purple-500" style={{ width: '89%' }}></div>
                </div>
                <div className="text-[10px] opacity-50">Peak theoretical: 3.35 TB/s</div>
              </div>

              {/* Metric 4: Kernel Latency */}
              <div 
                className="p-3 rounded-xl border space-y-1.5"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.border,
                }}
              >
                <div className="flex justify-between text-[11px] opacity-70">
                  <span>Kernel Execution Time</span>
                  <span className="font-bold text-amber-500">0.142 ms</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-amber-500" style={{ width: '15%' }}></div>
                </div>
                <div className="text-[10px] opacity-50">Zero host-device synchronization stalls</div>
              </div>
            </div>

            {/* Performance Advice Banner */}
            <div 
              className="p-3 rounded-xl border flex items-center justify-between text-xs font-mono"
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: currentTheme.palette.border,
              }}
            >
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Tensor Core occupancy is in the 95th percentile. Async tensor copy (TMA) verified active.</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10">
                OPTIMAL
              </span>
            </div>
          </div>
        )}

        {/* 3. AST Diagnostics Tab */}
        {activeConsoleTab === 'diagnostics' && (
          <div className="space-y-3">
            {diagnostics.length === 0 ? (
              <div className="py-12 text-center text-xs text-emerald-500 font-mono flex flex-col items-center justify-center space-y-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                <span>No static analysis or AST issues detected. Strict type parity passed!</span>
              </div>
            ) : (
              diagnostics.map((issue) => (
                <div 
                  key={issue.id}
                  className="p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                  style={{
                    backgroundColor: currentTheme.palette.surfaceRaised,
                    borderColor: currentTheme.palette.border,
                  }}
                >
                  <div className="space-y-1 flex-1 pr-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                        issue.severity === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                        issue.severity === 'warning' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                        'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                      }`}>
                        {issue.severity}
                      </span>
                      <span className="font-bold opacity-90">{activeFileName} (L{issue.line}:C{issue.col})</span>
                      <span className="text-[10px] opacity-50 font-mono">[{issue.rule}]</span>
                    </div>
                    <p className="text-xs opacity-80">{issue.message}</p>
                  </div>

                  {issue.fixAvailable && (
                    <button
                      onClick={() => handleFixDiagnostic(issue.id, issue.rule)}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 text-white shadow-2xs shrink-0 transition-all hover:scale-105"
                      style={{ backgroundColor: currentTheme.palette.accent }}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Quick Fix</span>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* 4. Package Registry Tab */}
        {activeConsoleTab === 'packages' && (
          <div className="space-y-4">
            {/* Install input */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="pip install <package_name> (e.g. einops, accelerate, bitsandbytes)..."
                value={newPackageInput}
                onChange={(e) => setNewPackageInput(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border text-xs font-mono focus:outline-none"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.border,
                }}
              />
              <button
                onClick={() => handleSimulateInstall(newPackageInput)}
                disabled={installingPackage !== null || !newPackageInput.trim()}
                className="px-4 py-1.5 rounded-lg text-xs font-mono font-bold text-white transition-all disabled:opacity-50 flex items-center space-x-1.5"
                style={{ backgroundColor: currentTheme.palette.accent }}
              >
                {installingPackage ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Installing...</span>
                  </>
                ) : (
                  <>
                    <Package className="w-3.5 h-3.5" />
                    <span>Install Package</span>
                  </>
                )}
              </button>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {packages.map((pkg) => (
                <div 
                  key={pkg.name}
                  className="p-2.5 rounded-lg border flex items-center justify-between transition-colors"
                  style={{
                    backgroundColor: currentTheme.palette.surfaceRaised,
                    borderColor: currentTheme.palette.border,
                  }}
                >
                  <div className="space-y-0.5 truncate pr-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">{pkg.name}</span>
                      <span className="text-[10px] opacity-60 font-mono">v{pkg.version}</span>
                    </div>
                    <p className="text-[11px] opacity-70 truncate">{pkg.description}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
