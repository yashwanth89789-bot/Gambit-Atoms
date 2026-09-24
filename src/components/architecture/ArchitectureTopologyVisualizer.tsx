import React, { useState, useEffect } from 'react';
import { PlatformComponent } from '../../types';
import { Activity, Play, Pause, Zap, RefreshCw, Cpu, Layers, ShieldCheck, AlertTriangle, ArrowRight, Gauge, Radio } from 'lucide-react';
import { useAdaptiveTheme } from '../../context/ThemeContext';

interface ArchitectureTopologyVisualizerProps {
  components: PlatformComponent[];
  activeComponentId: string | null;
  onSelectComponent: (id: string) => void;
  systemThroughput: number;
}

export const ArchitectureTopologyVisualizer: React.FC<ArchitectureTopologyVisualizerProps> = ({
  components,
  activeComponentId,
  onSelectComponent,
  systemThroughput,
}) => {
  const { currentTheme, densityMode } = useAdaptiveTheme();
  const [isPlaying, setIsPlaying] = useState(true);
  const [streamSpeed, setStreamSpeed] = useState<number>(1); // 1x, 2x, 0.5x
  const [trafficSpike, setTrafficSpike] = useState(false);
  const [packetCount, setPacketCount] = useState(142850);
  const [selectedNodeData, setSelectedNodeData] = useState<PlatformComponent | null>(
    components[0] || null
  );

  useEffect(() => {
    if (activeComponentId) {
      const found = components.find(c => c.id === activeComponentId);
      if (found) setSelectedNodeData(found);
    }
  }, [activeComponentId, components]);

  // Animated packet stream counter
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const delta = Math.floor((trafficSpike ? 240 : 80) * streamSpeed);
      setPacketCount(prev => prev + delta);
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, trafficSpike, streamSpeed]);

  const handleToggleSpike = () => {
    setTrafficSpike(prev => !prev);
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'ingress': return '#3B82F6'; // Blue
      case 'perception': return '#8B5CF6'; // Purple
      case 'reasoning': return '#10B981'; // Emerald
      case 'kvcache': return '#F59E0B'; // Amber
      case 'guardrails': return '#EC4899'; // Pink
      case 'action': return '#06B6D4'; // Cyan
      default: return currentTheme.palette.accent;
    }
  };

  return (
    <div 
      className="border rounded-xl p-5 md:p-6 transition-all duration-300 shadow-sm space-y-6"
      style={{
        backgroundColor: currentTheme.palette.surface,
        borderColor: currentTheme.palette.border,
        color: currentTheme.palette.textPrimary,
      }}
    >
      {/* Visualizer Top Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b"
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
            <Radio className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm sm:text-base tracking-tight">Live Pipeline Topology & Packet Flow Visualizer</h3>
              <span 
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                  trafficSpike ? 'bg-amber-500/10 text-amber-500 border-amber-500/30 animate-pulse' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                }`}
              >
                {trafficSpike ? '⚡ TRAFFIC SPIKE (+50k TPS)' : '● STEADY STREAM'}
              </span>
            </div>
            <p className="text-xs opacity-70">Interactive distributed node graph with real-time token routing and latency telemetry</p>
          </div>
        </div>

        {/* Playback & Chaos Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Packet Counter */}
          <div 
            className="px-3 py-1.5 rounded-md border font-mono text-xs flex items-center space-x-2"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.border,
            }}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span className="opacity-70">Packets:</span>
            <span className="font-bold">{packetCount.toLocaleString()}</span>
          </div>

          {/* Speed Selector */}
          <div 
            className="flex items-center border rounded-md p-0.5 text-xs font-mono"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.border,
            }}
          >
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setStreamSpeed(s)}
                className={`px-2 py-1 rounded transition-colors ${
                  streamSpeed === s 
                    ? 'font-bold text-white shadow-2xs' 
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={streamSpeed === s ? { backgroundColor: currentTheme.palette.accent } : {}}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-md border text-xs font-bold transition-all"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.borderStrong,
            }}
            title={isPlaying ? 'Pause simulation' : 'Resume simulation'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Spike Injector */}
          <button
            onClick={handleToggleSpike}
            className={`px-3 py-1.5 rounded-md text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center space-x-1.5 border shadow-2xs ${
              trafficSpike ? 'bg-amber-500 text-black border-amber-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{trafficSpike ? 'Reset Load' : 'Inject Spike'}</span>
          </button>
        </div>
      </div>

      {/* Visual Pipeline Interactive Canvas */}
      <div 
        className="relative rounded-xl border p-6 overflow-x-auto min-h-[220px] flex items-center justify-between gap-4 sm:gap-6 shadow-inner transition-colors"
        style={{
          backgroundColor: currentTheme.palette.surfaceRaised,
          borderColor: currentTheme.palette.border,
        }}
      >
        {/* Visual Background Flow Grid Gridlines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#888_1px,transparent_1px)] [background-size:16px_16px]" />

        {components.map((comp, idx) => {
          const isSelected = (selectedNodeData?.id === comp.id) || (activeComponentId === comp.id);
          const categoryColor = getCategoryColor(comp.category);
          const isLast = idx === components.length - 1;

          return (
            <React.Fragment key={comp.id}>
              {/* Node Card */}
              <div
                onClick={() => {
                  setSelectedNodeData(comp);
                  onSelectComponent(comp.id);
                }}
                className={`relative flex-1 min-w-[200px] max-w-[260px] p-4 rounded-xl border-2 transition-all cursor-pointer select-none group ${
                  isSelected 
                    ? 'scale-[1.03] shadow-lg ring-4 ring-offset-1' 
                    : 'hover:scale-[1.01] shadow-xs'
                }`}
                style={{
                  backgroundColor: currentTheme.palette.surface,
                  borderColor: isSelected ? categoryColor : currentTheme.palette.border,
                  boxShadow: isSelected ? `0 8px 24px -6px ${categoryColor}40` : undefined,
                }}
              >
                {/* Stage Index & Category Tag */}
                <div className="flex items-center justify-between mb-2">
                  <span 
                    className="w-6 h-6 rounded-full text-white text-xs font-mono font-bold flex items-center justify-center shadow-xs"
                    style={{ backgroundColor: categoryColor }}
                  >
                    {idx + 1}
                  </span>
                  <span 
                    className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border"
                    style={{
                      backgroundColor: `${categoryColor}15`,
                      color: categoryColor,
                      borderColor: `${categoryColor}40`,
                    }}
                  >
                    {comp.category || comp.type.split(' ')[0]}
                  </span>
                </div>

                {/* Node Title & Specs */}
                <h4 className="font-bold text-xs sm:text-sm tracking-tight mb-1 truncate" title={comp.name}>
                  {comp.name}
                </h4>

                <p className="text-[11px] opacity-70 line-clamp-2 mb-3 leading-relaxed">
                  {comp.description}
                </p>

                {/* Telemetry Metrics Pill */}
                <div 
                  className="grid grid-cols-2 gap-1.5 pt-2 border-t text-[10px] font-mono"
                  style={{ borderColor: currentTheme.palette.border }}
                >
                  <div className="flex flex-col">
                    <span className="opacity-60">LATENCY</span>
                    <span className="font-bold text-emerald-500">{comp.latencyMs || (idx * 2.5 + 2.1).toFixed(1)} ms</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="opacity-60">THROUGHPUT</span>
                    <span className="font-bold">{(comp.throughput || systemThroughput).toLocaleString()}</span>
                  </div>
                </div>

                {/* Active Pulse indicator */}
                {isPlaying && (
                  <span 
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-ping"
                    style={{ backgroundColor: categoryColor }}
                  />
                )}
              </div>

              {/* Connecting Animated Stream Arrow */}
              {!isLast && (
                <div className="flex flex-col items-center justify-center shrink-0 px-1 relative">
                  {/* Connection Line */}
                  <div 
                    className="h-1 w-8 sm:w-12 rounded-full relative overflow-hidden"
                    style={{ backgroundColor: currentTheme.palette.borderStrong }}
                  >
                    {isPlaying && (
                      <div 
                        className="absolute inset-y-0 w-4 rounded-full animate-[pulse_1s_ease-in-out_infinite]"
                        style={{
                          backgroundColor: categoryColor,
                          animationDuration: `${1.2 / streamSpeed}s`,
                          transform: 'translateX(100%)',
                        }}
                      />
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-50 mt-1" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Active Node Detail & Architecture Live Telemetry */}
      {selectedNodeData && (
        <div 
          className="rounded-xl border p-4 md:p-5 transition-all space-y-4"
          style={{
            backgroundColor: currentTheme.palette.surfaceRaised,
            borderColor: currentTheme.palette.border,
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span 
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: getCategoryColor(selectedNodeData.category) }}
              />
              <h4 className="font-bold text-sm tracking-tight">
                Node Inspector: <span style={{ color: currentTheme.palette.accent }}>{selectedNodeData.name}</span>
              </h4>
              <span className="text-xs font-mono opacity-60">({selectedNodeData.type})</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-1.5">
              {selectedNodeData.techStack.map((tech, i) => (
                <span 
                  key={i} 
                  className="px-2 py-0.5 rounded text-[11px] font-mono font-medium border"
                  style={{
                    backgroundColor: currentTheme.palette.surface,
                    borderColor: currentTheme.palette.border,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <p className="text-xs leading-relaxed opacity-85">
            {selectedNodeData.description}
          </p>

          {/* Reference Implementation Code Snippet */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono opacity-70">
              <span>Kernel / Pipeline Implementation:</span>
              <button
                onClick={() => navigator.clipboard.writeText(selectedNodeData.codeSnippet)}
                className="text-xs font-bold hover:underline"
                style={{ color: currentTheme.palette.accent }}
              >
                Copy Snippet
              </button>
            </div>
            <pre 
              className="p-3.5 rounded-lg border text-xs font-mono overflow-x-auto leading-relaxed"
              style={{
                backgroundColor: currentTheme.appearance === 'light' ? '#18181B' : '#09090B',
                borderColor: '#27272A',
                color: '#E4E4E7',
              }}
            >
              <code>{selectedNodeData.codeSnippet}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
