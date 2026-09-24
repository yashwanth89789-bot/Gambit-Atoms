import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { FocusAreaTheme, DensityMode, AdaptiveThemeState } from '../types/theme';
import { FOCUS_AREA_THEMES, DEFAULT_THEME, getThemeForTab } from '../utils/themeThemes';

interface ThemeContextType extends AdaptiveThemeState {
  setAutoAdaptive: (value: boolean) => void;
  setManualTheme: (themeId: string | null) => void;
  setDensityMode: (mode: DensityMode) => void;
  toggleHighContrast: () => void;
  toggleBlueLightFilter: () => void;
  toggleAmbientGlow: () => void;
  resetToAuto: () => void;
  availableThemes: FocusAreaTheme[];
  lastAdaptedNotice: string | null;
  dismissNotice: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ activeTab: string; children: ReactNode }> = ({ activeTab, children }) => {
  const [isAutoAdaptive, setIsAutoAdaptive] = useState<boolean>(true);
  const [manualOverrideThemeId, setManualOverrideThemeId] = useState<string | null>(null);
  const [densityMode, setDensityModeState] = useState<DensityMode>('balanced');
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [isBlueLightFilter, setIsBlueLightFilter] = useState<boolean>(false);
  const [ambientGlow, setAmbientGlow] = useState<boolean>(true);
  const [lastAdaptedNotice, setLastAdaptedNotice] = useState<string | null>(null);

  // Compute active theme based on auto-adaptive or manual override
  const currentTheme = useMemo(() => {
    if (!isAutoAdaptive && manualOverrideThemeId && FOCUS_AREA_THEMES[manualOverrideThemeId]) {
      return FOCUS_AREA_THEMES[manualOverrideThemeId];
    }
    return getThemeForTab(activeTab);
  }, [isAutoAdaptive, manualOverrideThemeId, activeTab]);

  // When activeTab changes in auto-adaptive mode, adapt density and theme
  useEffect(() => {
    if (isAutoAdaptive) {
      const tabTheme = getThemeForTab(activeTab);
      setDensityModeState(tabTheme.recommendedDensity);
      
      const notice = `Adapted to ${tabTheme.focusArea} (${tabTheme.appearance === 'dark' || tabTheme.appearance === 'cyber-dark' ? 'High Contrast Dark' : tabTheme.appearance === 'warm-light' ? 'Calm Editorial Parchment' : 'Balanced Studio'} • ${tabTheme.recommendedDensity.toUpperCase()} Density)`;
      setLastAdaptedNotice(notice);

      const timer = setTimeout(() => {
        setLastAdaptedNotice(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [activeTab, isAutoAdaptive]);

  // Apply CSS custom properties and attributes to root container
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Set dataset attributes for global selectors
    root.setAttribute('data-theme-id', currentTheme.id);
    root.setAttribute('data-theme-appearance', currentTheme.appearance);
    root.setAttribute('data-density', densityMode);
    root.setAttribute('data-high-contrast', isHighContrast ? 'true' : 'false');
    root.setAttribute('data-blue-filter', isBlueLightFilter ? 'true' : 'false');

    // Inject CSS variables
    Object.entries(currentTheme.cssVariables).forEach(([key, value]) => {
      root.style.setProperty(key, String(value));
    });

    // Handle high-contrast overrides
    if (isHighContrast) {
      root.style.setProperty('--app-border', currentTheme.appearance === 'dark' || currentTheme.appearance === 'cyber-dark' ? '#475569' : '#94a3b8');
      root.style.setProperty('--app-border-strong', currentTheme.appearance === 'dark' || currentTheme.appearance === 'cyber-dark' ? '#94a3b8' : '#334155');
    }

    // Set font family
    if (currentTheme.fontVibe === 'mono-code') {
      body.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
    } else {
      body.style.fontFamily = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    }

    // Background transition
    body.style.backgroundColor = currentTheme.palette.bg;
    body.style.color = currentTheme.palette.textPrimary;
    body.style.transition = 'background-color 300ms ease, color 300ms ease';

    return () => {
      // Clean up if needed
    };
  }, [currentTheme, densityMode, isHighContrast, isBlueLightFilter]);

  const setAutoAdaptive = (value: boolean) => {
    setIsAutoAdaptive(value);
    if (value) {
      setManualOverrideThemeId(null);
      const tabTheme = getThemeForTab(activeTab);
      setDensityModeState(tabTheme.recommendedDensity);
      setLastAdaptedNotice(`Auto-Adaptive Mode Activated (${tabTheme.focusArea})`);
    } else {
      setLastAdaptedNotice('Manual Theme Mode Locked');
    }
  };

  const setManualTheme = (themeId: string | null) => {
    if (themeId && FOCUS_AREA_THEMES[themeId]) {
      setIsAutoAdaptive(false);
      setManualOverrideThemeId(themeId);
      setDensityModeState(FOCUS_AREA_THEMES[themeId].recommendedDensity);
      setLastAdaptedNotice(`Manual Theme Selected: ${FOCUS_AREA_THEMES[themeId].name}`);
    } else {
      setIsAutoAdaptive(true);
      setManualOverrideThemeId(null);
      const tabTheme = getThemeForTab(activeTab);
      setDensityModeState(tabTheme.recommendedDensity);
    }
  };

  const setDensityMode = (mode: DensityMode) => {
    setDensityModeState(mode);
    setLastAdaptedNotice(`Density Adjusted: ${mode.toUpperCase()}`);
    setTimeout(() => setLastAdaptedNotice(null), 2500);
  };

  const toggleHighContrast = () => {
    setIsHighContrast(prev => {
      const next = !prev;
      setLastAdaptedNotice(next ? 'High Contrast Mode: ON' : 'High Contrast Mode: OFF');
      return next;
    });
  };

  const toggleBlueLightFilter = () => {
    setIsBlueLightFilter(prev => {
      const next = !prev;
      setLastAdaptedNotice(next ? 'Calm Eye Comfort Filter: ON' : 'Calm Eye Comfort Filter: OFF');
      return next;
    });
  };

  const toggleAmbientGlow = () => {
    setAmbientGlow(prev => !prev);
  };

  const resetToAuto = () => {
    setIsAutoAdaptive(true);
    setManualOverrideThemeId(null);
    setIsHighContrast(false);
    setIsBlueLightFilter(false);
    const tabTheme = getThemeForTab(activeTab);
    setDensityModeState(tabTheme.recommendedDensity);
    setLastAdaptedNotice(`Reset to Auto-Adaptive Focus Mode (${tabTheme.focusArea})`);
  };

  const dismissNotice = () => {
    setLastAdaptedNotice(null);
  };

  const availableThemes = useMemo(() => Object.values(FOCUS_AREA_THEMES), []);

  return (
    <ThemeContext.Provider
      value={{
        isAutoAdaptive,
        activeTab,
        currentTheme,
        densityMode,
        isHighContrast,
        isBlueLightFilter,
        ambientGlow,
        manualOverrideThemeId,
        setAutoAdaptive,
        setManualTheme,
        setDensityMode,
        toggleHighContrast,
        toggleBlueLightFilter,
        toggleAmbientGlow,
        resetToAuto,
        availableThemes,
        lastAdaptedNotice,
        dismissNotice,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useAdaptiveTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAdaptiveTheme must be used within a ThemeProvider');
  }
  return context;
};
