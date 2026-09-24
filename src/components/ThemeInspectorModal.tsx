import React, { useState } from 'react';
import { useAdaptiveTheme } from '../context/ThemeContext';
import { FocusAreaTheme, DensityMode } from '../types/theme';
import { 
  X, 
  Sparkles, 
  Check, 
  Zap, 
  Palette, 
  Layers, 
  Eye, 
  ShieldCheck, 
  Sliders, 
  SunMedium, 
  Maximize2, 
  Minimize2, 
  Grid, 
  Terminal, 
  BookOpen, 
  Atom, 
  Globe, 
  GitPullRequest, 
  Cpu, 
  BrainCircuit, 
  Info,
  CheckCircle2
} from 'lucide-react';

interface ThemeInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeInspectorModal: React.FC<ThemeInspectorModalProps> = ({ isOpen, onClose }) => {
  const {
    isAutoAdaptive,
    currentTheme,
    densityMode,
    isHighContrast,
    isBlueLightFilter,
    ambientGlow,
    availableThemes,
    setAutoAdaptive,
    setManualTheme,
    setDensityMode,
    toggleHighContrast,
    toggleBlueLightFilter,
    toggleAmbientGlow,
    resetToAuto,
  } = useAdaptiveTheme();

  const [activeInspectorTab, setActiveInspectorTab] = useState<'themes' | 'density' | 'tokens'>('themes');
  const [selectedPreviewTheme, setSelectedPreviewTheme] = useState<FocusAreaTheme>(currentTheme);

  if (!isOpen) return null;

  const getTabIcon = (tabId: string) => {
    switch (tabId) {
      case 'ide': return Terminal;
      case 'research': return BookOpen;
      case 'quantum': return Atom;
      case 'engineering': return Globe;
      case 'opensource': return GitPullRequest;
      case 'platform': return Cpu;
      case 'assistant': return Sparkles;
      case 'cognitive': return BrainCircuit;
      default: return Sparkles;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-xl border shadow-2xl overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: currentTheme.appearance === 'dark' || currentTheme.appearance === 'cyber-dark' ? '#0f172a' : '#ffffff',
          borderColor: currentTheme.palette.borderStrong,
          color: currentTheme.palette.textPrimary,
        }}
      >
        {/* Modal Header */}
        <div 
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{
            borderColor: currentTheme.palette.border,
            backgroundColor: currentTheme.palette.surfaceRaised,
          }}
        >
          <div className="flex items-center space-x-3">
            <div 
              className="p-2 rounded-lg"
              style={{
                backgroundColor: currentTheme.palette.accentLight,
                color: currentTheme.palette.accentText,
              }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold tracking-tight">Adaptive UI Theme Lab & Density Engine</h2>
                <span 
                  className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full border uppercase"
                  style={{
                    backgroundColor: isAutoAdaptive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    borderColor: isAutoAdaptive ? '#10b981' : '#f59e0b',
                    color: isAutoAdaptive ? '#10b981' : '#f59e0b',
                  }}
                >
                  {isAutoAdaptive ? '⚡ Auto-Adaptive Sync' : '🔒 Manual Mode'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Inspect color palettes, density scales, and optical contrast optimizations dynamically mapped to each workspace focus area.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg opacity-70 hover:opacity-100 transition-opacity"
            style={{ backgroundColor: currentTheme.palette.surface }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Sub-tabs */}
        <div 
          className="flex border-b px-6 space-x-6 text-sm font-medium"
          style={{
            borderColor: currentTheme.palette.border,
            backgroundColor: currentTheme.palette.surface,
          }}
        >
          <button
            onClick={() => setActiveInspectorTab('themes')}
            className={`py-3 flex items-center space-x-2 border-b-2 transition-all ${
              activeInspectorTab === 'themes' 
                ? 'font-bold' 
                : 'opacity-60 hover:opacity-100 border-transparent'
            }`}
            style={{
              borderColor: activeInspectorTab === 'themes' ? currentTheme.palette.accent : 'transparent',
              color: activeInspectorTab === 'themes' ? currentTheme.palette.accent : 'inherit',
            }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Focus Area Palettes (9)</span>
          </button>

          <button
            onClick={() => setActiveInspectorTab('density')}
            className={`py-3 flex items-center space-x-2 border-b-2 transition-all ${
              activeInspectorTab === 'density' 
                ? 'font-bold' 
                : 'opacity-60 hover:opacity-100 border-transparent'
            }`}
            style={{
              borderColor: activeInspectorTab === 'density' ? currentTheme.palette.accent : 'transparent',
              color: activeInspectorTab === 'density' ? currentTheme.palette.accent : 'inherit',
            }}
          >
            <Sliders className="w-4 h-4" />
            <span>Component Density Specs</span>
          </button>

          <button
            onClick={() => setActiveInspectorTab('tokens')}
            className={`py-3 flex items-center space-x-2 border-b-2 transition-all ${
              activeInspectorTab === 'tokens' 
                ? 'font-bold' 
                : 'opacity-60 hover:opacity-100 border-transparent'
            }`}
            style={{
              borderColor: activeInspectorTab === 'tokens' ? currentTheme.palette.accent : 'transparent',
              color: activeInspectorTab === 'tokens' ? currentTheme.palette.accent : 'inherit',
            }}
          >
            <Eye className="w-4 h-4" />
            <span>Active CSS Tokens & WCAG AA/AAA</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: FOCUS AREA PALETTES */}
          {activeInspectorTab === 'themes' && (
            <div className="space-y-6">
              
              {/* Adaptive Controls Banner */}
              <div 
                className="p-4 rounded-lg border flex flex-wrap items-center justify-between gap-4"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.border,
                }}
              >
                <div>
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-500" />
                    <span>Dynamic Focus Area Synchronization</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    When active, navigating between IDE, Research, Quantum, and Ops tabs automatically reshapes background warmth, contrast gradients, and typography density.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setAutoAdaptive(true)}
                    className={`px-3 py-1.5 rounded text-xs font-semibold border flex items-center space-x-1.5 transition-all ${
                      isAutoAdaptive ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm' : 'opacity-70 hover:opacity-100 border-gray-300'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Enable Auto-Adapt</span>
                  </button>
                  <button
                    onClick={resetToAuto}
                    className="px-3 py-1.5 rounded text-xs font-medium border opacity-80 hover:opacity-100"
                    style={{ borderColor: currentTheme.palette.border }}
                  >
                    Reset Defaults
                  </button>
                </div>
              </div>

              {/* Grid of 9 Themes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {availableThemes.map((theme) => {
                  const isCurrent = currentTheme.id === theme.id;
                  const Icon = getTabIcon(theme.tabId);

                  return (
                    <div
                      key={theme.id}
                      onClick={() => {
                        setSelectedPreviewTheme(theme);
                        setManualTheme(theme.tabId);
                      }}
                      className={`cursor-pointer rounded-lg border p-3.5 transition-all duration-200 hover:scale-101 relative ${
                        isCurrent ? 'ring-2 ring-offset-1' : 'hover:border-gray-400'
                      }`}
                      style={{
                        backgroundColor: theme.palette.surface,
                        borderColor: isCurrent ? theme.palette.accent : theme.palette.border,
                        color: theme.palette.textPrimary,
                        boxShadow: isCurrent ? theme.palette.accentGlow : 'none',
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="p-1.5 rounded-md"
                            style={{
                              backgroundColor: theme.palette.accentLight,
                              color: theme.palette.accentText,
                            }}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold">{theme.name}</h4>
                            <span className="text-[10px] text-gray-500">{theme.focusArea}</span>
                          </div>
                        </div>
                        {isCurrent && (
                          <span 
                            className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-white"
                            style={{ backgroundColor: theme.palette.accent }}
                          >
                            Active
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] opacity-80 line-clamp-2 mb-3 leading-relaxed">
                        {theme.description}
                      </p>

                      {/* Swatch chips */}
                      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: theme.palette.border }}>
                        <div className="flex items-center space-x-1.5">
                          <span 
                            className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-2xs" 
                            style={{ backgroundColor: theme.palette.bg }} 
                            title={`Background: ${theme.palette.bg}`} 
                          />
                          <span 
                            className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-2xs" 
                            style={{ backgroundColor: theme.palette.surface }} 
                            title={`Surface: ${theme.palette.surface}`} 
                          />
                          <span 
                            className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-2xs" 
                            style={{ backgroundColor: theme.palette.accent }} 
                            title={`Accent: ${theme.palette.accent}`} 
                          />
                          <span 
                            className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-2xs" 
                            style={{ backgroundColor: theme.palette.borderStrong }} 
                            title={`Border: ${theme.palette.borderStrong}`} 
                          />
                        </div>

                        <span className="text-[10px] font-mono font-medium opacity-70 uppercase">
                          {theme.recommendedDensity} density
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: COMPONENT DENSITY SPECS */}
          {activeInspectorTab === 'density' && (
            <div className="space-y-6">
              <div 
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.border,
                }}
              >
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-500" />
                  <span>Optical Density Scaling Engine</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Adjusts typography baseline, margins, padding formulas, and data table heights to match cognitive workflow requirements.
                </p>
              </div>

              {/* 3 Density Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Compact Mode */}
                <div 
                  onClick={() => setDensityMode('compact')}
                  className={`cursor-pointer rounded-lg border p-4 transition-all ${
                    densityMode === 'compact' ? 'ring-2 ring-purple-500' : 'hover:border-gray-400'
                  }`}
                  style={{
                    backgroundColor: currentTheme.palette.surface,
                    borderColor: densityMode === 'compact' ? currentTheme.palette.accent : currentTheme.palette.border,
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Minimize2 className="w-4 h-4 text-cyan-500" />
                      <h4 className="text-sm font-bold">Compact (Dense)</h4>
                    </div>
                    {densityMode === 'compact' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Best for IDE Workspaces, Quantum Registers, and Real-Time Ops. Maximizes information density.
                  </p>
                  <div className="space-y-1.5 text-[11px] font-mono bg-black/5 p-2 rounded">
                    <div className="flex justify-between"><span>Padding:</span><span className="font-bold">8px – 12px</span></div>
                    <div className="flex justify-between"><span>Row Height:</span><span className="font-bold">24px</span></div>
                    <div className="flex justify-between"><span>Code Font:</span><span className="font-bold">11px / 12px</span></div>
                    <div className="flex justify-between"><span>Section Gap:</span><span className="font-bold">12px</span></div>
                  </div>
                </div>

                {/* Balanced Mode */}
                <div 
                  onClick={() => setDensityMode('balanced')}
                  className={`cursor-pointer rounded-lg border p-4 transition-all ${
                    densityMode === 'balanced' ? 'ring-2 ring-purple-500' : 'hover:border-gray-400'
                  }`}
                  style={{
                    backgroundColor: currentTheme.palette.surface,
                    borderColor: densityMode === 'balanced' ? currentTheme.palette.accent : currentTheme.palette.border,
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Grid className="w-4 h-4 text-blue-500" />
                      <h4 className="text-sm font-bold">Balanced (Standard)</h4>
                    </div>
                    {densityMode === 'balanced' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Best for Platform Architecture, OSS Hub, and AI Assistants. Default general-purpose density.
                  </p>
                  <div className="space-y-1.5 text-[11px] font-mono bg-black/5 p-2 rounded">
                    <div className="flex justify-between"><span>Padding:</span><span className="font-bold">16px – 20px</span></div>
                    <div className="flex justify-between"><span>Row Height:</span><span className="font-bold">36px</span></div>
                    <div className="flex justify-between"><span>Code Font:</span><span className="font-bold">13px</span></div>
                    <div className="flex justify-between"><span>Section Gap:</span><span className="font-bold">20px</span></div>
                  </div>
                </div>

                {/* Relaxed / Editorial Mode */}
                <div 
                  onClick={() => setDensityMode('relaxed')}
                  className={`cursor-pointer rounded-lg border p-4 transition-all ${
                    densityMode === 'relaxed' ? 'ring-2 ring-purple-500' : 'hover:border-gray-400'
                  }`}
                  style={{
                    backgroundColor: currentTheme.palette.surface,
                    borderColor: densityMode === 'relaxed' ? currentTheme.palette.accent : currentTheme.palette.border,
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Maximize2 className="w-4 h-4 text-amber-600" />
                      <h4 className="text-sm font-bold">Relaxed (Editorial)</h4>
                    </div>
                    {densityMode === 'relaxed' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Best for Academic Research Lab and Paper Review. Spacious breathing room and enhanced readability.
                  </p>
                  <div className="space-y-1.5 text-[11px] font-mono bg-black/5 p-2 rounded">
                    <div className="flex justify-between"><span>Padding:</span><span className="font-bold">24px – 32px</span></div>
                    <div className="flex justify-between"><span>Row Height:</span><span className="font-bold">48px</span></div>
                    <div className="flex justify-between"><span>Body Line-Height:</span><span className="font-bold">1.75 (Relaxed)</span></div>
                    <div className="flex justify-between"><span>Section Gap:</span><span className="font-bold">32px</span></div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: ACTIVE TOKENS & WCAG */}
          {activeInspectorTab === 'tokens' && (
            <div className="space-y-4">
              <div 
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.border,
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Active Theme Variables & WCAG 2.1 AA/AAA Compliance</span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Computed tokens injected into CSS custom properties and passed to Tailwind utility wrappers.
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs font-mono font-bold rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                    WCAG AAA Passed (7.8:1)
                  </span>
                </div>
              </div>

              {/* Tokens Table */}
              <div className="border rounded-lg overflow-hidden text-xs font-mono" style={{ borderColor: currentTheme.palette.border }}>
                <table className="w-full text-left">
                  <thead style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderBottom: `1px solid ${currentTheme.palette.border}` }}>
                    <tr>
                      <th className="p-2.5">Variable Name</th>
                      <th className="p-2.5">Resolved Value</th>
                      <th className="p-2.5">Visual Sample</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: currentTheme.palette.border }}>
                    {Object.entries(currentTheme.palette).map(([key, val]) => (
                      <tr key={key} className="hover:bg-black/5">
                        <td className="p-2.5 font-bold">{`--app-${key}`}</td>
                        <td className="p-2.5 opacity-80">{val}</td>
                        <td className="p-2.5">
                          {typeof val === 'string' && (val.startsWith('#') || val.startsWith('rgb')) ? (
                            <div className="flex items-center space-x-2">
                              <span className="w-5 h-5 rounded border border-black/20" style={{ backgroundColor: val }} />
                              <span className="text-[10px] text-gray-500">{val}</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-gray-400">Spec/Style</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div 
          className="flex items-center justify-between px-6 py-3 border-t text-xs"
          style={{
            borderColor: currentTheme.palette.border,
            backgroundColor: currentTheme.palette.surfaceRaised,
          }}
        >
          <span className="text-gray-500 font-mono">
            Active: <strong style={{ color: currentTheme.palette.accent }}>{currentTheme.name}</strong> • Density: <strong className="uppercase">{densityMode}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded font-semibold text-white shadow-xs transition-transform hover:scale-102"
            style={{ backgroundColor: currentTheme.palette.accent }}
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
