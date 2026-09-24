import React, { useState, useRef, useEffect } from 'react';
import { useAdaptiveTheme } from '../context/ThemeContext';
import { 
  Palette, 
  Sliders, 
  SunMedium, 
  Eye, 
  Sparkles, 
  Minimize2, 
  Maximize2, 
  Grid, 
  RotateCcw, 
  Check, 
  Zap, 
  Layers, 
  X,
  ChevronDown,
  Info
} from 'lucide-react';
import { ThemeInspectorModal } from './ThemeInspectorModal';

interface ThemePreferencesMenuProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLButtonElement | null>;
}

export const ThemePreferencesMenu: React.FC<ThemePreferencesMenuProps> = ({ isOpen, onClose }) => {
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

  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return (
      <ThemeInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
      />
    );
  }

  const densityOptions: Array<{ id: 'compact' | 'balanced' | 'relaxed'; label: string; icon: any }> = [
    { id: 'compact', label: 'Compact', icon: Minimize2 },
    { id: 'balanced', label: 'Balanced', icon: Grid },
    { id: 'relaxed', label: 'Relaxed', icon: Maximize2 },
  ];

  return (
    <>
      <div 
        ref={menuRef}
        className="absolute right-4 top-14 z-50 w-84 sm:w-96 rounded-2xl border shadow-2xl backdrop-blur-xl p-5 space-y-5 animate-fadeIn font-sans text-xs"
        style={{
          backgroundColor: currentTheme.appearance === 'dark' || currentTheme.appearance === 'cyber-dark'
            ? 'rgba(15, 23, 42, 0.96)'
            : 'rgba(255, 255, 255, 0.98)',
          borderColor: currentTheme.palette.borderStrong,
          color: currentTheme.palette.textPrimary,
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: currentTheme.palette.border }}>
          <div className="flex items-center space-x-2">
            <div 
              className="p-1.5 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: currentTheme.palette.accent }}
            >
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">Display & Aesthetics</h3>
              <p className="text-[10px] opacity-60">Personalize adaptive theme and layout density</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Active Status Card */}
        <div 
          className="p-3 rounded-xl border flex items-center justify-between"
          style={{
            backgroundColor: currentTheme.palette.surfaceRaised,
            borderColor: currentTheme.palette.border,
          }}
        >
          <div className="space-y-0.5">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-xs">{currentTheme.name}</span>
              <span 
                className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold"
                style={{
                  backgroundColor: currentTheme.palette.accentLight,
                  color: currentTheme.palette.accentText,
                }}
              >
                {isAutoAdaptive ? 'Auto-Adaptive' : 'Manual'}
              </span>
            </div>
            <p className="text-[10px] opacity-70">{currentTheme.tagline}</p>
          </div>

          <div 
            className="w-5 h-5 rounded-full border-2 shadow-xs"
            style={{
              backgroundColor: currentTheme.palette.accent,
              borderColor: currentTheme.palette.borderStrong,
            }}
          />
        </div>

        {/* Auto Adaptive Mode Toggle */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">Adaptive Mode</span>
            <button
              onClick={() => setAutoAdaptive(!isAutoAdaptive)}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg border text-xs font-medium transition-all ${
                isAutoAdaptive 
                  ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40 font-bold' 
                  : 'opacity-70 hover:opacity-100 border-zinc-600'
              }`}
            >
              <Zap className={`w-3 h-3 ${isAutoAdaptive ? 'fill-current' : ''}`} />
              <span>{isAutoAdaptive ? 'Auto-Sync Active' : 'Manual Mode'}</span>
            </button>
          </div>
          <p className="text-[10px] opacity-60 leading-relaxed">
            {isAutoAdaptive 
              ? 'Automatically calibrates theme palette and UI density when switching workspaces.' 
              : 'Theme is locked manually. Switching workspaces will not alter palette.'}
          </p>
        </div>

        {/* Density Mode */}
        <div className="space-y-2">
          <label className="text-xs font-semibold block">Component Density</label>
          <div 
            className="grid grid-cols-3 gap-1.5 p-1 rounded-xl border"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.border,
            }}
          >
            {densityOptions.map((opt) => {
              const isSelected = densityMode === opt.id;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  onClick={() => setDensityMode(opt.id)}
                  className={`flex items-center justify-center space-x-1.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSelected ? 'font-bold shadow-xs' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: isSelected ? currentTheme.palette.accent : 'transparent',
                    color: isSelected ? '#ffffff' : currentTheme.palette.textSecondary,
                  }}
                >
                  <Icon className="w-3 h-3" />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Display Toggles */}
        <div className="space-y-2">
          <label className="text-xs font-semibold block">Visual Ergonomics</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={toggleBlueLightFilter}
              className={`p-2.5 rounded-xl border flex items-center space-x-2 transition-all ${
                isBlueLightFilter ? 'font-bold' : 'opacity-75 hover:opacity-100'
              }`}
              style={{
                backgroundColor: isBlueLightFilter ? 'rgba(245, 158, 11, 0.15)' : currentTheme.palette.surfaceRaised,
                borderColor: isBlueLightFilter ? '#f59e0b' : currentTheme.palette.border,
                color: isBlueLightFilter ? '#d97706' : currentTheme.palette.textPrimary,
              }}
            >
              <SunMedium className="w-3.5 h-3.5" />
              <div className="text-left">
                <div className="text-[11px] font-bold">Eye Comfort</div>
                <div className="text-[9px] opacity-70">Warm blue filter</div>
              </div>
            </button>

            <button
              onClick={toggleHighContrast}
              className={`p-2.5 rounded-xl border flex items-center space-x-2 transition-all ${
                isHighContrast ? 'font-bold' : 'opacity-75 hover:opacity-100'
              }`}
              style={{
                backgroundColor: isHighContrast ? currentTheme.palette.accentLight : currentTheme.palette.surfaceRaised,
                borderColor: isHighContrast ? currentTheme.palette.accent : currentTheme.palette.border,
                color: isHighContrast ? currentTheme.palette.accentText : currentTheme.palette.textPrimary,
              }}
            >
              <Eye className="w-3.5 h-3.5" />
              <div className="text-left">
                <div className="text-[11px] font-bold">High Contrast</div>
                <div className="text-[9px] opacity-70">Defined edges</div>
              </div>
            </button>
          </div>
        </div>

        {/* Quick Theme Swatches */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold">Theme Presets</label>
            <span className="text-[10px] opacity-60">Click to preview</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {availableThemes.map((theme) => {
              const isActive = currentTheme.id === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    setManualTheme(theme.id);
                  }}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    isActive ? 'ring-2 ring-indigo-400 font-bold' : 'opacity-75 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: theme.palette.surfaceRaised,
                    borderColor: isActive ? theme.palette.accent : theme.palette.border,
                  }}
                >
                  <div className="flex items-center space-x-1.5 mb-1">
                    <div 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: theme.palette.accent }} 
                    />
                    <span className="text-[10px] font-bold truncate">{theme.name.split(' ')[0]}</span>
                  </div>
                  <span className="text-[8px] opacity-60 block truncate">{theme.appearance}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between border-t" style={{ borderColor: currentTheme.palette.border }}>
          <button
            onClick={() => {
              resetToAuto();
              onClose();
            }}
            className="flex items-center space-x-1 text-[11px] opacity-70 hover:opacity-100 transition-opacity"
            title="Reset to default auto adaptive behavior"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Auto</span>
          </button>

          <button
            onClick={() => {
              setIsInspectorOpen(true);
              onClose();
            }}
            className="px-3 py-1.5 rounded-xl text-white font-bold text-xs flex items-center space-x-1.5 transition-all hover:opacity-90"
            style={{ backgroundColor: currentTheme.palette.accent }}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Theme Lab</span>
          </button>
        </div>
      </div>

      <ThemeInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
      />
    </>
  );
};
