import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { 
  Map, Eye, Search, Layers, Activity, ChevronUp, ChevronDown, 
  Hash, Code2, Sparkles, Filter, Users, AlertCircle, Check, 
  Maximize2, ZoomIn, ZoomOut, ArrowUp, ArrowDown
} from 'lucide-react';
import { useAdaptiveTheme } from '../../context/ThemeContext';

export interface CollaboratorMarker {
  id: string;
  name: string;
  color: string;
  line: number;
}

export interface CodeMiniMapProps {
  content: string;
  language?: string;
  visibleStartLine?: number;
  visibleEndLine?: number;
  activeLine?: number;
  collaborators?: CollaboratorMarker[];
  isModified?: boolean;
  onSelectLine: (lineNumber: number) => void;
  onClose?: () => void;
}

type MiniMapViewMode = 'minimap' | 'outline' | 'heatmap';
type MiniMapScale = 'auto' | 'compact' | 'normal';

interface LineAnalysis {
  lineNumber: number;
  rawText: string;
  trimmedText: string;
  indentLevel: number;
  length: number;
  lineType: 'class' | 'function' | 'decorator' | 'import' | 'comment' | 'return' | 'string' | 'blank' | 'code';
  color: string;
  hasTodoOrFixme: boolean;
  hasCollaborator?: CollaboratorMarker;
  matchesSearch: boolean;
}

export const CodeMiniMap: React.FC<CodeMiniMapProps> = ({
  content,
  language = 'python',
  visibleStartLine = 1,
  visibleEndLine = 35,
  activeLine = 1,
  collaborators = [],
  isModified = false,
  onSelectLine,
  onClose,
}) => {
  const { currentTheme } = useAdaptiveTheme();
  const [viewMode, setViewMode] = useState<MiniMapViewMode>('minimap');
  const [scaleMode, setScaleMode] = useState<MiniMapScale>('auto');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [highlightFilter, setHighlightFilter] = useState<'all' | 'symbols' | 'collaborators'>('all');
  
  // Hover preview state
  const [hoveredLine, setHoveredLine] = useState<LineAnalysis | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ y: number }>({ y: 0 });

  // Dragging viewport slider
  const [isDraggingViewport, setIsDraggingViewport] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Parse lines and build syntax & structural analysis
  const lines = useMemo(() => content.split('\n'), [content]);
  const totalLines = Math.max(lines.length, 1);

  const analyzedLines: LineAnalysis[] = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return lines.map((rawText, idx) => {
      const lineNumber = idx + 1;
      const trimmed = rawText.trim();
      const leadingSpaces = rawText.match(/^\s*/)?.[0].length || 0;
      const indentLevel = Math.min(Math.floor(leadingSpaces / 4), 6);

      let lineType: LineAnalysis['lineType'] = 'code';
      let color = '#94A3B8'; // default text

      if (trimmed.length === 0) {
        lineType = 'blank';
        color = 'transparent';
      } else if (trimmed.startsWith('#') || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
        lineType = 'comment';
        color = '#64748B'; // slate
      } else if (trimmed.startsWith('class ')) {
        lineType = 'class';
        color = '#A855F7'; // purple
      } else if (trimmed.startsWith('def ') || trimmed.startsWith('async def ') || trimmed.startsWith('function ')) {
        lineType = 'function';
        color = '#38BDF8'; // sky blue
      } else if (trimmed.startsWith('@')) {
        lineType = 'decorator';
        color = '#F59E0B'; // amber
      } else if (trimmed.startsWith('import ') || trimmed.startsWith('from ')) {
        lineType = 'import';
        color = '#818CF8'; // indigo
      } else if (trimmed.startsWith('return') || trimmed.startsWith('yield') || trimmed.startsWith('raise')) {
        lineType = 'return';
        color = '#FB7185'; // rose
      } else if (trimmed.startsWith('"""') || trimmed.startsWith("'''") || trimmed.startsWith('"') || trimmed.startsWith("'")) {
        lineType = 'string';
        color = '#34D399'; // emerald
      }

      const hasTodoOrFixme = /TODO|FIXME|NOTE|BUG|HACK/i.test(trimmed);
      const collaborator = collaborators.find(c => c.line === lineNumber);
      const matchesSearch = q.length > 0 && rawText.toLowerCase().includes(q);

      return {
        lineNumber,
        rawText,
        trimmedText: trimmed,
        indentLevel,
        length: Math.min(rawText.length, 80),
        lineType,
        color,
        hasTodoOrFixme,
        hasCollaborator: collaborator,
        matchesSearch,
      };
    });
  }, [lines, collaborators, searchQuery]);

  // Extract structural AST symbols for the outline tab
  const astSymbols = useMemo(() => {
    return analyzedLines.filter(l => 
      l.lineType === 'class' || 
      l.lineType === 'function' || 
      l.lineType === 'decorator'
    );
  }, [analyzedLines]);

  // Compute complexity and distribution stats for the heatmap tab
  const stats = useMemo(() => {
    let classes = 0;
    let functions = 0;
    let imports = 0;
    let comments = 0;
    let maxLen = 0;
    let totalLen = 0;

    analyzedLines.forEach(l => {
      if (l.lineType === 'class') classes++;
      if (l.lineType === 'function') functions++;
      if (l.lineType === 'import') imports++;
      if (l.lineType === 'comment') comments++;
      if (l.length > maxLen) maxLen = l.length;
      totalLen += l.length;
    });

    const avgLen = totalLines > 0 ? Math.round(totalLen / totalLines) : 0;
    return { classes, functions, imports, comments, maxLen, avgLen };
  }, [analyzedLines, totalLines]);

  // Line height scaling based on scale mode and container height
  const lineHeightPx = useMemo(() => {
    if (scaleMode === 'compact') return 2;
    if (scaleMode === 'normal') return 4;
    // Auto-fit mode: calculate line height so all lines comfortably fit in ~420px viewport
    if (totalLines <= 40) return 6;
    if (totalLines <= 80) return 4;
    if (totalLines <= 150) return 2.5;
    if (totalLines <= 300) return 1.8;
    return 1.2;
  }, [scaleMode, totalLines]);

  // Viewport calculation in percentage / pixels
  const viewportStartPct = useMemo(() => {
    return Math.max(0, Math.min(100, ((visibleStartLine - 1) / totalLines) * 100));
  }, [visibleStartLine, totalLines]);

  const viewportHeightPct = useMemo(() => {
    const span = Math.max(visibleEndLine - visibleStartLine + 1, 5);
    return Math.max(8, Math.min(100, (span / totalLines) * 100));
  }, [visibleStartLine, visibleEndLine, totalLines]);

  // Handle clicking on minimap track to jump to line
  const handleTrackClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const ratio = Math.max(0, Math.min(1, clickY / rect.height));
    const targetLine = Math.max(1, Math.min(totalLines, Math.round(ratio * totalLines)));
    onSelectLine(targetLine);
  }, [totalLines, onSelectLine]);

  // Handle dragging viewport rectangle
  const handleViewportMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDraggingViewport(true);
  };

  useEffect(() => {
    if (!isDraggingViewport) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;
      const ratio = Math.max(0, Math.min(1, relativeY / rect.height));
      const targetLine = Math.max(1, Math.min(totalLines, Math.round(ratio * totalLines)));
      onSelectLine(targetLine);
    };

    const handleMouseUp = () => {
      setIsDraggingViewport(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingViewport, totalLines, onSelectLine]);

  return (
    <div 
      ref={containerRef}
      className="w-64 border-l flex flex-col h-full text-xs select-none shrink-0 relative transition-all duration-200"
      style={{
        backgroundColor: currentTheme.palette.surfaceRaised,
        borderColor: currentTheme.palette.border,
        color: currentTheme.palette.textPrimary,
      }}
    >
      {/* 1. Header Toolbar */}
      <div 
        className="p-2.5 border-b flex items-center justify-between gap-1.5"
        style={{ borderColor: currentTheme.palette.border }}
      >
        <div className="flex items-center space-x-1.5 min-w-0">
          <Map className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.palette.accent }} />
          <span className="font-bold text-[11px] font-mono tracking-tight truncate">Mini-Map</span>
          <span 
            className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold"
            style={{
              backgroundColor: currentTheme.appearance === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
              color: currentTheme.palette.textSecondary,
            }}
          >
            {totalLines}L
          </span>
        </div>

        {/* View Mode Pills */}
        <div className="flex items-center space-x-1 p-0.5 rounded border text-[10px] font-mono shrink-0"
          style={{
            backgroundColor: currentTheme.palette.surface,
            borderColor: currentTheme.palette.borderStrong,
          }}
        >
          <button
            onClick={() => setViewMode('minimap')}
            className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
              viewMode === 'minimap' ? 'font-bold' : 'opacity-60 hover:opacity-100'
            }`}
            style={viewMode === 'minimap' ? {
              backgroundColor: currentTheme.palette.accent,
              color: '#FFFFFF',
            } : {}}
            title="Visual Mini-Map"
          >
            Map
          </button>
          <button
            onClick={() => setViewMode('outline')}
            className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
              viewMode === 'outline' ? 'font-bold' : 'opacity-60 hover:opacity-100'
            }`}
            style={viewMode === 'outline' ? {
              backgroundColor: currentTheme.palette.accent,
              color: '#FFFFFF',
            } : {}}
            title="Structural AST Symbols"
          >
            AST
          </button>
          <button
            onClick={() => setViewMode('heatmap')}
            className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
              viewMode === 'heatmap' ? 'font-bold' : 'opacity-60 hover:opacity-100'
            }`}
            style={viewMode === 'heatmap' ? {
              backgroundColor: currentTheme.palette.accent,
              color: '#FFFFFF',
            } : {}}
            title="Density & Telemetry Heatmap"
          >
            Radar
          </button>
        </div>

        {/* Search & Scale controls */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-1 rounded transition-colors cursor-pointer ${
              showSearch ? 'text-indigo-400 bg-indigo-500/10' : 'opacity-60 hover:opacity-100'
            }`}
            title="Search lines on minimap"
          >
            <Search className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Optional Search Bar */}
      {showSearch && (
        <div 
          className="p-2 border-b flex items-center space-x-1.5 animate-fadeIn"
          style={{
            backgroundColor: currentTheme.palette.surface,
            borderColor: currentTheme.palette.border,
          }}
        >
          <Search className="w-3 h-3 opacity-40 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tokens to highlight..."
            className="w-full bg-transparent text-[11px] font-mono focus:outline-none placeholder:opacity-40"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[10px] opacity-60 hover:opacity-100 px-1 font-mono"
            >
              ×
            </button>
          )}
        </div>
      )}

      {/* 2. Main Content Body according to View Mode */}
      {viewMode === 'minimap' && (
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Quick Filter Bar */}
          <div className="px-2.5 py-1 border-b flex items-center justify-between text-[10px] font-mono opacity-70"
            style={{ borderColor: currentTheme.palette.border }}
          >
            <div className="flex items-center space-x-2">
              <span className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block"></span>
                <span>Class</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 inline-block"></span>
                <span>Def</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"></span>
                <span>@</span>
              </span>
            </div>

            {/* Scale mode selector */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setScaleMode(scaleMode === 'auto' ? 'normal' : scaleMode === 'normal' ? 'compact' : 'auto')}
                className="hover:opacity-100 opacity-60 font-mono text-[9px] px-1 py-0.5 rounded border border-transparent hover:border-black/10 dark:hover:border-white/10"
                title="Toggle density scale (Auto / Normal / Compact)"
              >
                {scaleMode.toUpperCase()}
              </button>
            </div>
          </div>

          {/* Minimap Track & Visual Bars Canvas */}
          <div 
            ref={trackRef}
            onClick={handleTrackClick}
            className="flex-1 overflow-y-auto overflow-x-hidden p-2 relative cursor-pointer select-none group"
            style={{
              backgroundColor: currentTheme.appearance === 'dark' ? '#121214' : '#F9FAFB',
            }}
          >
            {/* Viewport Window Indicator */}
            <div
              onMouseDown={handleViewportMouseDown}
              className={`absolute left-0 right-0 border-y rounded-xs pointer-events-auto transition-all cursor-grab active:cursor-grabbing ${
                isDraggingViewport ? 'ring-2 ring-indigo-400/50' : ''
              }`}
              style={{
                top: `${viewportStartPct}%`,
                height: `${viewportHeightPct}%`,
                backgroundColor: currentTheme.appearance === 'dark' 
                  ? 'rgba(99, 102, 241, 0.15)' 
                  : 'rgba(99, 102, 241, 0.12)',
                borderColor: currentTheme.palette.accent,
                boxShadow: '0 0 12px rgba(99, 102, 241, 0.25)',
                zIndex: 10,
              }}
            >
              <div className="absolute right-1 top-1 px-1 py-0.2 rounded text-[8px] font-mono font-bold bg-indigo-600 text-white shadow-xs opacity-75">
                L{visibleStartLine}-{visibleEndLine}
              </div>
            </div>

            {/* Lines Representation */}
            <div className="space-y-[1px] w-full relative z-0">
              {analyzedLines.map((line) => {
                const isCurrentActive = line.lineNumber === activeLine;
                const isInsideViewport = line.lineNumber >= visibleStartLine && line.lineNumber <= visibleEndLine;
                const barWidth = Math.max(6, Math.min(100, (line.length / 70) * 100));
                const indentMargin = line.indentLevel * 8;

                return (
                  <div
                    key={line.lineNumber}
                    onMouseEnter={(e) => {
                      const rect = trackRef.current?.getBoundingClientRect();
                      if (rect) {
                        setHoverPosition({ y: Math.max(10, Math.min(rect.height - 70, e.clientY - rect.top)) });
                        setHoveredLine(line);
                      }
                    }}
                    onMouseLeave={() => setHoveredLine(null)}
                    className={`relative flex items-center transition-opacity hover:opacity-100 ${
                      isInsideViewport ? 'opacity-90' : 'opacity-40 hover:opacity-80'
                    }`}
                    style={{
                      height: `${lineHeightPx}px`,
                    }}
                  >
                    {/* Left Modification / Diagnostic Stripe */}
                    {isModified && (
                      <div className="w-0.5 h-full mr-1 rounded-full bg-amber-400 shrink-0" />
                    )}

                    {/* Active Line Indicator Dot */}
                    {isCurrentActive && (
                      <div 
                        className="absolute -left-1 w-1.5 h-1.5 rounded-full ring-2 ring-indigo-400"
                        style={{ backgroundColor: currentTheme.palette.accent }}
                      />
                    )}

                    {/* Collaborator Presence Beacon */}
                    {line.hasCollaborator && (
                      <div 
                        className="absolute right-0 w-2 h-2 rounded-full ring-1 ring-white/20 animate-pulse"
                        style={{ backgroundColor: line.hasCollaborator.color }}
                        title={`${line.hasCollaborator.name} editing on L${line.lineNumber}`}
                      />
                    )}

                    {/* Line Pixel Bar */}
                    {line.lineType !== 'blank' ? (
                      <div
                        className={`rounded-[1px] transition-all ${
                          line.matchesSearch ? 'ring-1 ring-yellow-400 brightness-150' : ''
                        }`}
                        style={{
                          marginLeft: `${indentMargin}px`,
                          width: `${barWidth}%`,
                          height: `${Math.max(1, lineHeightPx - 0.5)}px`,
                          backgroundColor: line.matchesSearch 
                            ? '#EAB308' 
                            : line.lineType === 'class'
                            ? '#C084FC'
                            : line.lineType === 'function'
                            ? '#38BDF8'
                            : line.lineType === 'decorator'
                            ? '#FBBF24'
                            : line.lineType === 'comment'
                            ? currentTheme.appearance === 'dark' ? '#475569' : '#94A3B8'
                            : line.color,
                        }}
                      />
                    ) : (
                      <div style={{ height: `${lineHeightPx}px` }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Hovered Line Floating Preview Tooltip */}
            {hoveredLine && (
              <div
                className="absolute left-2 right-2 rounded-lg p-2 border shadow-xl backdrop-blur-md pointer-events-none z-30 animate-fadeIn"
                style={{
                  top: `${hoverPosition.y}px`,
                  backgroundColor: currentTheme.appearance === 'dark' ? 'rgba(24, 24, 27, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                  borderColor: currentTheme.palette.borderStrong,
                  color: currentTheme.palette.textPrimary,
                }}
              >
                <div className="flex items-center justify-between pb-1 border-b text-[10px] font-mono"
                  style={{ borderColor: currentTheme.palette.border }}
                >
                  <span className="font-bold flex items-center space-x-1">
                    <Hash className="w-2.5 h-2.5 opacity-60" />
                    <span>Line {hoveredLine.lineNumber}</span>
                  </span>
                  <span 
                    className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase"
                    style={{
                      backgroundColor: hoveredLine.lineType === 'class' ? 'rgba(192, 132, 252, 0.2)' :
                                       hoveredLine.lineType === 'function' ? 'rgba(56, 189, 248, 0.2)' :
                                       hoveredLine.lineType === 'decorator' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(0,0,0,0.05)',
                      color: hoveredLine.color,
                    }}
                  >
                    {hoveredLine.lineType}
                  </span>
                </div>
                <div className="mt-1 font-mono text-[10px] truncate opacity-90">
                  {hoveredLine.trimmedText || '<blank line>'}
                </div>
                {hoveredLine.hasCollaborator && (
                  <div className="mt-1 text-[9px] font-mono flex items-center space-x-1"
                    style={{ color: hoveredLine.hasCollaborator.color }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: hoveredLine.hasCollaborator.color }}></span>
                    <span>{hoveredLine.hasCollaborator.name} active here</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Mode: Outline (AST Symbols) */}
      {viewMode === 'outline' && (
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 font-mono text-[11px]">
          <div className="pb-1.5 border-b flex items-center justify-between opacity-70"
            style={{ borderColor: currentTheme.palette.border }}
          >
            <span>{astSymbols.length} Identified Symbols</span>
            <span className="text-[10px]">Click to jump</span>
          </div>

          {astSymbols.length === 0 ? (
            <div className="text-center py-8 opacity-50 space-y-1">
              <Code2 className="w-5 h-5 mx-auto opacity-40" />
              <p className="text-[10px]">No classes or functions detected in this file.</p>
            </div>
          ) : (
            astSymbols.map((sym) => {
              const isClass = sym.lineType === 'class';
              const isDef = sym.lineType === 'function';
              const isDec = sym.lineType === 'decorator';
              const isActive = sym.lineNumber >= visibleStartLine && sym.lineNumber <= visibleEndLine;

              return (
                <div
                  key={sym.lineNumber}
                  onClick={() => onSelectLine(sym.lineNumber)}
                  className={`p-1.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01] ${
                    isActive ? 'border-indigo-500/50 shadow-2xs font-semibold' : 'border-transparent hover:border-black/10 dark:hover:border-white/10'
                  }`}
                  style={{
                    backgroundColor: isActive ? currentTheme.palette.surface : 'transparent',
                  }}
                >
                  <div className="flex items-center space-x-1.5 truncate">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                      isClass ? 'bg-purple-400' : isDef ? 'bg-sky-400' : 'bg-amber-400'
                    }`} />
                    <span className={`truncate ${
                      isClass ? 'text-purple-400 font-bold' : isDef ? 'text-sky-400' : 'text-amber-400'
                    }`}>
                      {sym.trimmedText}
                    </span>
                  </div>
                  <span className="opacity-40 text-[10px] shrink-0 ml-1">L{sym.lineNumber}</span>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* View Mode: Heatmap & Metrics Radar */}
      {viewMode === 'heatmap' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-3 font-mono text-xs">
          <div className="pb-1.5 border-b flex items-center justify-between opacity-70"
            style={{ borderColor: currentTheme.palette.border }}
          >
            <span className="font-bold">File Density Radar</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>

          {/* Density breakdown cards */}
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-2 rounded-lg border" style={{ backgroundColor: currentTheme.palette.surface, borderColor: currentTheme.palette.border }}>
              <div className="opacity-60">Classes</div>
              <div className="text-sm font-bold text-purple-400">{stats.classes}</div>
            </div>
            <div className="p-2 rounded-lg border" style={{ backgroundColor: currentTheme.palette.surface, borderColor: currentTheme.palette.border }}>
              <div className="opacity-60">Functions</div>
              <div className="text-sm font-bold text-sky-400">{stats.functions}</div>
            </div>
            <div className="p-2 rounded-lg border" style={{ backgroundColor: currentTheme.palette.surface, borderColor: currentTheme.palette.border }}>
              <div className="opacity-60">Imports</div>
              <div className="text-sm font-bold text-indigo-400">{stats.imports}</div>
            </div>
            <div className="p-2 rounded-lg border" style={{ backgroundColor: currentTheme.palette.surface, borderColor: currentTheme.palette.border }}>
              <div className="opacity-60">Comments</div>
              <div className="text-sm font-bold text-slate-400">{stats.comments}</div>
            </div>
          </div>

          {/* Line Length & Complexity Bar */}
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between opacity-70">
              <span>Avg Line Length</span>
              <span className="font-bold">{stats.avgLen} chars</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden bg-black/10 dark:bg-white/10">
              <div 
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${Math.min(100, (stats.avgLen / 80) * 100)}%` }}
              />
            </div>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between opacity-70">
              <span>Max Line Width</span>
              <span className="font-bold">{stats.maxLen} chars</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden bg-black/10 dark:bg-white/10">
              <div 
                className={`h-full rounded-full ${stats.maxLen > 100 ? 'bg-amber-500' : 'bg-blue-500'}`}
                style={{ width: `${Math.min(100, (stats.maxLen / 120) * 100)}%` }}
              />
            </div>
          </div>

          {/* Collaborator distribution */}
          {collaborators.length > 0 && (
            <div className="space-y-2 pt-2 border-t" style={{ borderColor: currentTheme.palette.border }}>
              <div className="text-[10px] font-bold opacity-70 flex items-center space-x-1.5">
                <Users className="w-3 h-3 text-purple-400" />
                <span>Collaborator Presence</span>
              </div>
              <div className="space-y-1">
                {collaborators.map(c => (
                  <div 
                    key={c.id} 
                    onClick={() => onSelectLine(c.line)}
                    className="flex items-center justify-between p-1.5 rounded border hover:border-indigo-500/40 cursor-pointer text-[10px]"
                    style={{ backgroundColor: currentTheme.palette.surface, borderColor: currentTheme.palette.border }}
                  >
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="font-semibold">{c.name}</span>
                    </div>
                    <span className="font-mono opacity-60">L{c.line}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Footer Navigation Bar */}
      <div 
        className="p-2 border-t flex items-center justify-between text-[10px] font-mono opacity-75"
        style={{
          backgroundColor: currentTheme.palette.surfaceRaised,
          borderColor: currentTheme.palette.border,
        }}
      >
        <span className="truncate">
          L{visibleStartLine}–L{visibleEndLine} of {totalLines}
        </span>
        <div className="flex items-center space-x-1 shrink-0">
          <button
            onClick={() => onSelectLine(1)}
            className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Jump to Top (L1)"
          >
            <ArrowUp className="w-3 h-3" />
          </button>
          <button
            onClick={() => onSelectLine(totalLines)}
            className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title={`Jump to Bottom (L${totalLines})`}
          >
            <ArrowDown className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
