import React, { useState } from 'react';
import { useAdaptiveTheme } from '../context/ThemeContext';
import { 
  Sparkles, 
  Sliders, 
  Eye, 
  SunMedium, 
  Moon, 
  Zap, 
  Maximize2, 
  Minimize2, 
  Layers, 
  Check, 
  RotateCcw, 
  Info,
  ShieldCheck,
  Palette,
  Columns,
  Grid,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { ThemeInspectorModal } from './ThemeInspectorModal';

interface AdaptiveThemeHeaderBarProps {
  onOpenInspector?: () => void;
  initiallyOpen?: boolean;
}

export const AdaptiveThemeHeaderBar: React.FC<AdaptiveThemeHeaderBarProps> = ({ initiallyOpen = false }) => {
  const {
    isAutoAdaptive,
    currentTheme,
    densityMode,
    isHighContrast,
    isBlueLightFilter,
    ambientGlow,
    setAutoAdaptive,
    setDensityMode,
    toggleHighContrast,
    toggleBlueLightFilter,
    toggleAmbientGlow,
    resetToAuto,
  } = useAdaptiveTheme();

  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  const densityOptions: Array<{ id: 'compact' | 'balanced' | 'relaxed'; label: string; icon: any }> = [
    { id: 'compact', label: 'Compact', icon: Minimize2 },
    { id: 'balanced', label: 'Balanced', icon: Grid },
    { id: 'relaxed', label: 'Relaxed', icon: Maximize2 },
  ];

  if (!isOpen) {
    return (
      <ThemeInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
      />
    );
  }

  return (
    <>
      <div 
        className="w-full transition-all duration-300 border-b backdrop-blur-md animate-fadeIn text-xs"
        style={{
          backgroundColor: currentTheme.appearance === 'dark' || currentTheme.appearance === 'cyber-dark' 
            ? 'rgba(15, 23, 42, 0.85)' 
            : currentTheme.appearance === 'warm-light'
            ? 'rgba(244, 237, 226, 0.90)'
            : 'rgba(255, 255, 255, 0.90)',
          borderColor: currentTheme.palette.border,
          color: currentTheme.palette.textPrimary,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* Left: Active Adaptive Status Badge */}
            <div className="flex items-center space-x-2">
              <div 
                className="flex items-center space-x-2 px-2.5 py-1 rounded-md border font-mono text-[11px]"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.borderStrong,
                }}
              >
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: currentTheme.palette.accent }}
                />
                <span className="opacity-70">{isAutoAdaptive ? 'Adaptive Focus:' : 'Manual Lock:'}</span>
                <span 
                  className="font-bold px-1.5 py-0.2 rounded text-[10px]"
                  style={{
                    backgroundColor: currentTheme.palette.accentLight,
                    color: currentTheme.palette.accentText,
                  }}
                >
                  {currentTheme.name}
                </span>
              </div>
            </div>

            {/* Right: Controls Strip */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Density Controls */}
              <div 
                className="flex items-center p-0.5 rounded-md border font-mono text-[10px]"
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
                      className={`flex items-center space-x-1 px-2 py-0.5 rounded transition-all ${
                        isSelected ? 'font-bold shadow-2xs' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: isSelected ? currentTheme.palette.accent : 'transparent',
                        color: isSelected ? '#ffffff' : currentTheme.palette.textSecondary,
                      }}
                    >
                      <Icon className="w-2.5 h-2.5" />
                      <span className="capitalize">{opt.id}</span>
                    </button>
                  );
                })}
              </div>

              {/* Auto-Adapt Toggle */}
              <button
                onClick={() => setAutoAdaptive(!isAutoAdaptive)}
                className="flex items-center space-x-1 px-2 py-1 rounded text-[11px] font-medium border transition-colors cursor-pointer"
                style={{
                  backgroundColor: isAutoAdaptive ? currentTheme.palette.accentLight : currentTheme.palette.surfaceRaised,
                  borderColor: isAutoAdaptive ? currentTheme.palette.accent : currentTheme.palette.border,
                  color: isAutoAdaptive ? currentTheme.palette.accentText : currentTheme.palette.textSecondary,
                }}
              >
                <Zap className={`w-3 h-3 ${isAutoAdaptive ? 'fill-current' : ''}`} />
                <span className="font-mono text-[10px]">{isAutoAdaptive ? 'Auto-Sync' : 'Manual'}</span>
              </button>

              {/* Comfort Warmth Toggle */}
              <button
                onClick={toggleBlueLightFilter}
                className="flex items-center space-x-1 px-2 py-1 rounded text-[11px] font-medium border transition-colors cursor-pointer"
                style={{
                  backgroundColor: isBlueLightFilter ? 'rgba(245, 158, 11, 0.2)' : currentTheme.palette.surfaceRaised,
                  borderColor: isBlueLightFilter ? '#f59e0b' : currentTheme.palette.border,
                  color: isBlueLightFilter ? '#d97706' : currentTheme.palette.textSecondary,
                }}
              >
                <SunMedium className="w-3 h-3" />
                <span className="text-[10px]">Comfort</span>
              </button>

              {/* Contrast Toggle */}
              <button
                onClick={toggleHighContrast}
                className="flex items-center space-x-1 px-2 py-1 rounded text-[11px] font-medium border transition-colors cursor-pointer"
                style={{
                  backgroundColor: isHighContrast ? currentTheme.palette.accentLight : currentTheme.palette.surfaceRaised,
                  borderColor: isHighContrast ? currentTheme.palette.accent : currentTheme.palette.border,
                  color: isHighContrast ? currentTheme.palette.accentText : currentTheme.palette.textSecondary,
                }}
              >
                <Eye className="w-3 h-3" />
                <span className="text-[10px]">Contrast</span>
              </button>

              {/* Theme Lab Button */}
              <button
                onClick={() => setIsInspectorOpen(true)}
                className="flex items-center space-x-1 px-2 py-1 rounded text-[11px] font-semibold text-white transition-all cursor-pointer"
                style={{ backgroundColor: currentTheme.palette.accent }}
              >
                <Palette className="w-3 h-3" />
                <span>Lab</span>
              </button>

              {/* Close / Collapse Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded opacity-60 hover:opacity-100 transition-opacity ml-1"
                title="Hide quick controls bar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </div>

      <ThemeInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
      />
    </>
  );
};
