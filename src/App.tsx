import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { AdaptiveThemeHeaderBar } from './components/AdaptiveThemeHeaderBar';
import { ThemeToastNotice } from './components/ThemeToastNotice';
import { ThemeProvider, useAdaptiveTheme } from './context/ThemeContext';
import { HomeOverviewTab } from './components/HomeOverviewTab';
import { PlatformDesignerTab } from './components/PlatformDesignerTab';
import { ResearchLabTab } from './components/ResearchLabTab';
import { OpenSourceTab } from './components/OpenSourceTab';
import { EngineeringSolverTab } from './components/EngineeringSolverTab';
import { QuantumLabTab } from './components/QuantumLabTab';
import { CodeIDEWorkspace } from './components/CodeIDEWorkspace';
import { AssistantCreator } from './components/AssistantCreator';
import { CommandPalette } from './components/CommandPalette';
import { PerformanceMonitor } from './components/PerformanceMonitor';
import { MouseClickIndicator } from './components/MouseClickIndicator';
import { CognitiveCoreTab } from './components/CognitiveCoreTab';
import { 
  ChevronRight, 
  Home, 
  Layers, 
  Sparkles, 
  Terminal, 
  BookOpen, 
  Atom, 
  Globe, 
  GitPullRequest, 
  Cpu, 
  BrainCircuit,
  Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TAB_ORDER = [
  'home',
  'cognitive',
  'assistant',
  'quantum',
  'research',
  'platform',
  'ide',
  'engineering',
  'opensource',
];

const tabTransitionVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
    scale: 0.995,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
    scale: 0.995,
  }),
};

function MainAppShell({
  activeTab,
  setActiveTab,
  direction,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  direction: number;
}) {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [showInlineThemeBar, setShowInlineThemeBar] = useState(false);
  const { currentTheme, densityMode } = useAdaptiveTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Category sibling mappings for quick non-complex in-domain navigation
  const workspaceDomains: Record<string, { category: string; siblings: Array<{ id: string; label: string; icon: any }> }> = {
    cognitive: {
      category: 'AI & Cognition',
      siblings: [
        { id: 'cognitive', label: 'Cognitive Core', icon: BrainCircuit },
        { id: 'assistant', label: 'Assistant Creator', icon: Sparkles },
      ]
    },
    assistant: {
      category: 'AI & Cognition',
      siblings: [
        { id: 'cognitive', label: 'Cognitive Core', icon: BrainCircuit },
        { id: 'assistant', label: 'Assistant Creator', icon: Sparkles },
      ]
    },
    quantum: {
      category: 'Scientific Labs',
      siblings: [
        { id: 'quantum', label: 'Quantum QPU', icon: Atom },
        { id: 'research', label: 'Research & Peer Review', icon: BookOpen },
        { id: 'platform', label: 'Platform Architecture', icon: Cpu },
      ]
    },
    research: {
      category: 'Scientific Labs',
      siblings: [
        { id: 'quantum', label: 'Quantum QPU', icon: Atom },
        { id: 'research', label: 'Research & Peer Review', icon: BookOpen },
        { id: 'platform', label: 'Platform Architecture', icon: Cpu },
      ]
    },
    platform: {
      category: 'Scientific Labs',
      siblings: [
        { id: 'quantum', label: 'Quantum QPU', icon: Atom },
        { id: 'research', label: 'Research & Peer Review', icon: BookOpen },
        { id: 'platform', label: 'Platform Architecture', icon: Cpu },
      ]
    },
    ide: {
      category: 'Engineering & Dev',
      siblings: [
        { id: 'ide', label: 'Code IDE', icon: Terminal },
        { id: 'engineering', label: 'Global Scale Ops', icon: Globe },
        { id: 'opensource', label: 'Open Source Studio', icon: GitPullRequest },
      ]
    },
    engineering: {
      category: 'Engineering & Dev',
      siblings: [
        { id: 'ide', label: 'Code IDE', icon: Terminal },
        { id: 'engineering', label: 'Global Scale Ops', icon: Globe },
        { id: 'opensource', label: 'Open Source Studio', icon: GitPullRequest },
      ]
    },
    opensource: {
      category: 'Engineering & Dev',
      siblings: [
        { id: 'ide', label: 'Code IDE', icon: Terminal },
        { id: 'engineering', label: 'Global Scale Ops', icon: Globe },
        { id: 'opensource', label: 'Open Source Studio', icon: GitPullRequest },
      ]
    }
  };

  const currentDomain = workspaceDomains[activeTab];

  return (
    <div
      id="root-container"
      className="min-h-screen flex flex-col font-sans selection:bg-black selection:text-white touch-pan-y antialiased transition-colors duration-300 overflow-x-hidden"
      style={{
        backgroundColor: currentTheme.palette.bg,
        backgroundImage: currentTheme.palette.bgGradient || 'none',
        color: currentTheme.palette.textPrimary,
        WebkitOverflowScrolling: 'touch',
      }}
      data-density={densityMode}
    >
      {/* 1. Main Unified Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* 2. Optional Collapsible Theme Bar (hidden by default to eliminate clutter) */}
      {showInlineThemeBar && (
        <AdaptiveThemeHeaderBar initiallyOpen={true} />
      )}

      {/* 3. Sleek, Non-Intrusive Context Bar (Only rendered when inside an inner workspace) */}
      {activeTab !== 'home' && currentDomain && (
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-1 transition-all">
          <div 
            className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-sans shadow-2xs backdrop-blur-sm"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.border,
              color: currentTheme.palette.textSecondary,
            }}
          >
            {/* Left: Breadcrumb trail */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('home')}
                className="flex items-center space-x-1 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Overview</span>
              </button>
              <ChevronRight className="w-3 h-3 opacity-40" />
              <span className="opacity-60 text-[11px]">{currentDomain.category}</span>
              <ChevronRight className="w-3 h-3 opacity-40" />
              <span className="font-bold" style={{ color: currentTheme.palette.accent }}>
                {currentDomain.siblings.find(s => s.id === activeTab)?.label || activeTab}
              </span>
            </div>

            {/* Middle/Right: Quick In-Domain Sibling Switchers (One click to related workspaces!) */}
            <div className="flex items-center space-x-1.5">
              <div className="hidden sm:flex items-center space-x-1 border-r pr-2 mr-1" style={{ borderColor: currentTheme.palette.border }}>
                {currentDomain.siblings.map(sib => {
                  const isActive = sib.id === activeTab;
                  const Icon = sib.icon;
                  return (
                    <button
                      key={sib.id}
                      onClick={() => setActiveTab(sib.id)}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-medium flex items-center space-x-1 transition-all cursor-pointer ${
                        isActive ? 'font-bold shadow-2xs' : 'opacity-65 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: isActive ? currentTheme.palette.accentLight : 'transparent',
                        color: isActive ? currentTheme.palette.accentText : currentTheme.palette.textSecondary,
                      }}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{sib.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Toggle Inline Quick Controls */}
              <button
                onClick={() => setShowInlineThemeBar(!showInlineThemeBar)}
                className={`flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-mono border transition-all cursor-pointer ${
                  showInlineThemeBar ? 'font-bold' : 'opacity-60 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: showInlineThemeBar ? currentTheme.palette.accentLight : 'transparent',
                  borderColor: currentTheme.palette.border,
                  color: showInlineThemeBar ? currentTheme.palette.accentText : currentTheme.palette.textSecondary,
                }}
                title="Toggle inline quick controls bar"
              >
                <Sliders className="w-2.5 h-2.5" />
                <span>Quick Bar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Main Workspace Content View */}
      <main className="flex-1 pb-16 overflow-hidden relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeTab}
            custom={direction}
            variants={tabTransitionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 340, damping: 32, mass: 0.8 },
              opacity: { duration: 0.18, ease: 'easeInOut' },
              scale: { duration: 0.18 },
            }}
            className="w-full h-full"
          >
            {activeTab === 'home' && <HomeOverviewTab setActiveTab={setActiveTab} onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />}
            {activeTab === 'platform' && <PlatformDesignerTab />}
            {activeTab === 'research' && <ResearchLabTab />}
            {activeTab === 'opensource' && <OpenSourceTab />}
            {activeTab === 'engineering' && <EngineeringSolverTab />}
            {activeTab === 'quantum' && <QuantumLabTab />}
            {activeTab === 'ide' && <CodeIDEWorkspace />}
            {activeTab === 'assistant' && <AssistantCreator />}
            {activeTab === 'cognitive' && <CognitiveCoreTab />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        setActiveTab={setActiveTab}
      />

      {/* Subtle Toast Notice for theme adaptations */}
      <ThemeToastNotice />

      {/* Refined Footer */}
      <footer 
        className="border-t py-6 text-center text-xs transition-colors"
        style={{
          backgroundColor: currentTheme.palette.surfaceRaised,
          borderColor: currentTheme.palette.border,
          color: currentTheme.palette.textSecondary,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Gambit Atoms Platform & Research Engine — Powered by Google Gemini 3.1 Pro & Flash</span>
          <span className="font-mono text-[11px] opacity-70">
            {currentTheme.name} • {densityMode.toUpperCase()} Density
          </span>
        </div>
      </footer>

      {/* Performance & Click Telemetry */}
      <PerformanceMonitor />
      <MouseClickIndicator />
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [direction, setDirection] = useState<number>(1);
  const prevTabRef = useRef('home');

  const handleTabChange = (newTab: string) => {
    if (newTab === activeTab) return;
    const prevIdx = TAB_ORDER.indexOf(prevTabRef.current);
    const nextIdx = TAB_ORDER.indexOf(newTab);
    const dir = nextIdx >= (prevIdx === -1 ? 0 : prevIdx) ? 1 : -1;
    setDirection(dir);
    prevTabRef.current = newTab;
    setActiveTab(newTab);
  };

  return (
    <ThemeProvider activeTab={activeTab}>
      <MainAppShell
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        direction={direction}
      />
    </ThemeProvider>
  );
}
