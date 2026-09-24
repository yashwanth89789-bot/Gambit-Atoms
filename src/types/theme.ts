export type DensityMode = 'compact' | 'balanced' | 'relaxed';
export type ContrastLevel = 'standard' | 'high' | 'ultra';
export type ThemeAppearance = 'dark' | 'light' | 'warm-light' | 'cyber-dark';

export interface ThemePalette {
  bg: string;
  bgGradient?: string;
  bgSubtle: string;
  surface: string;
  surfaceRaised: string;
  surfaceHover: string;
  border: string;
  borderStrong: string;
  borderHighlight: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  accentLight: string;
  accentText: string;
  accentGlow: string;
  badgeBg: string;
  badgeText: string;
  codeBg: string;
  codeText: string;
  headerBg: string;
  sidebarBg?: string;
}

export interface FocusAreaTheme {
  id: string;
  tabId: string;
  name: string;
  focusArea: string;
  tagline: string;
  description: string;
  appearance: ThemeAppearance;
  recommendedDensity: DensityMode;
  fontVibe: 'mono-code' | 'serif-scholar' | 'sans-modern' | 'cyber-tech' | 'clean-slate';
  palette: ThemePalette;
  cssVariables: Record<string, string>;
  densityMetrics: {
    paddingCard: string;
    paddingButton: string;
    gapSection: string;
    fontSizeBody: string;
    fontSizeHeading: string;
    tableRowHeight: string;
    codeFontSize: string;
  };
}

export interface AdaptiveThemeState {
  isAutoAdaptive: boolean;
  activeTab: string;
  currentTheme: FocusAreaTheme;
  densityMode: DensityMode;
  isHighContrast: boolean;
  isBlueLightFilter: boolean;
  ambientGlow: boolean;
  manualOverrideThemeId: string | null;
}
