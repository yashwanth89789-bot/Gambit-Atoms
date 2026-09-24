import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Cpu, 
  BookOpen, 
  GitPullRequest, 
  Globe, 
  Terminal, 
  Atom, 
  BrainCircuit, 
  Search, 
  Sliders, 
  ChevronDown, 
  LayoutGrid, 
  Home, 
  X,
  Palette,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useAdaptiveTheme } from '../context/ThemeContext';
import { ThemePreferencesMenu } from './ThemePreferencesMenu';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCommandPalette: () => void;
}

interface NavModule {
  id: string;
  label: string;
  shortDesc: string;
  icon: any;
  badge?: string;
}

interface NavCategory {
  id: string;
  label: string;
  icon: any;
  modules: NavModule[];
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenCommandPalette }) => {
  const { currentTheme, isAutoAdaptive, densityMode } = useAdaptiveTheme();
  
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isAllModulesOpen, setIsAllModulesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Logical Categorized Navigation Model
  const categories: NavCategory[] = [
    {
      id: 'ai',
      label: 'AI & Cognition',
      icon: BrainCircuit,
      modules: [
        {
          id: 'cognitive',
          label: 'Cognitive Architecture Engine',
          shortDesc: 'APEX Cognitive OS, Learning Engine & Neuro-Symbolic Graph',
          icon: BrainCircuit,
          badge: 'APEX Core'
        },
        {
          id: 'assistant',
          label: 'Assistant Creator',
          shortDesc: 'Design, constrain & deploy autonomous Gemini agents',
          icon: Sparkles,
          badge: 'Agents'
        }
      ]
    },
    {
      id: 'science',
      label: 'Scientific Labs',
      icon: Atom,
      modules: [
        {
          id: 'quantum',
          label: 'Quantum Computing & QPU Lab',
          shortDesc: 'Transmon qubits, Bloch spheres & quantum annealing',
          icon: Atom,
          badge: '12.4 mK QPU'
        },
        {
          id: 'research',
          label: 'Research & Peer Review Lab',
          shortDesc: 'Autonomous academic paper generator & peer review',
          icon: BookOpen,
          badge: 'Academic'
        },
        {
          id: 'platform',
          label: 'Platform Architecture Designer',
          shortDesc: 'Hyper-scale VLA pipelines, tensor sharding & RLAIF',
          icon: Cpu,
          badge: 'Architecture'
        }
      ]
    },
    {
      id: 'dev',
      label: 'Engineering & Code',
      icon: Terminal,
      modules: [
        {
          id: 'ide',
          label: 'Collaborative IDE Workspace',
          shortDesc: 'Interactive code editor, PyTorch sandbox & AI copilot',
          icon: Terminal,
          badge: 'IDE'
        },
        {
          id: 'engineering',
          label: 'Global Scale Ops Solver',
          shortDesc: 'Distributed systems, InfiniBand fabric & KV swapping',
          icon: Globe,
          badge: 'Infra'
        },
        {
          id: 'opensource',
          label: 'Open Source AI Contributor',
          shortDesc: 'Automated PRs for vLLM, HuggingFace & kernel benchmarks',
          icon: GitPullRequest,
          badge: 'OSS Sync'
        }
      ]
    }
  ];

  // Helper to find category of active tab
  const activeCategory = categories.find(c => c.modules.some(m => m.id === activeTab));
  const activeModule = categories.flatMap(c => c.modules).find(m => m.id === activeTab);

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setOpenDropdown(null);
    setIsAllModulesOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header 
      className="sticky top-0 z-40 transition-all duration-300 border-b backdrop-blur-xl"
      style={{
        backgroundColor: currentTheme.palette.headerBg,
        borderColor: currentTheme.palette.border,
        color: currentTheme.palette.textPrimary,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-200 ${
          densityMode === 'compact' ? 'h-13' : densityMode === 'relaxed' ? 'h-16' : 'h-14'
        }`}>
          
          {/* Brand & Active Workspace Pill */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleSelectTab('home')}
              className="flex items-center space-x-2.5 text-left group transition-all"
            >
              <div 
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform"
                style={{ backgroundColor: currentTheme.palette.accent }}
              >
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold tracking-tight text-sm sm:text-base">
                    Gambit Atoms
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping hidden sm:inline-block" />
                </div>
                <p className="text-[10px] opacity-60 font-mono -mt-0.5 hidden sm:block">
                  {currentTheme.focusArea}
                </p>
              </div>
            </button>

            {/* Separator and Active Tool Indicator (Shows clean context without noise) */}
            {activeTab !== 'home' && activeModule && (
              <div className="hidden md:flex items-center space-x-1.5 pl-3 border-l" style={{ borderColor: currentTheme.palette.border }}>
                <span className="text-[11px] opacity-50 font-mono">/</span>
                <span 
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium flex items-center space-x-1 border"
                  style={{
                    backgroundColor: currentTheme.palette.surfaceRaised,
                    borderColor: currentTheme.palette.border,
                    color: currentTheme.palette.accent,
                  }}
                >
                  <activeModule.icon className="w-3 h-3" />
                  <span className="font-bold">{activeModule.label.split(' ')[0]} {activeModule.label.split(' ')[1] || ''}</span>
                </span>
              </div>
            )}
          </div>

          {/* Desktop Streamlined Navigation: 4 Primary Domains Instead of 9 Jammed Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 font-medium text-xs">
            {/* 1. Overview */}
            <button
              onClick={() => handleSelectTab('home')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                activeTab === 'home'
                  ? 'font-bold shadow-xs'
                  : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
              style={{
                backgroundColor: activeTab === 'home' ? currentTheme.palette.surfaceRaised : 'transparent',
                color: activeTab === 'home' ? currentTheme.palette.accent : currentTheme.palette.textSecondary,
                borderColor: activeTab === 'home' ? currentTheme.palette.border : 'transparent',
              }}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            {/* 2. Categorized Workspace Dropdowns */}
            {categories.map((cat) => {
              const isCategoryActive = activeCategory?.id === cat.id;
              const isDropdownOpen = openDropdown === cat.id;
              const Icon = cat.icon;

              return (
                <div key={cat.id} className="relative">
                  <button
                    onClick={() => setOpenDropdown(isDropdownOpen ? null : cat.id)}
                    className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer ${
                      isCategoryActive
                        ? 'font-bold'
                        : 'opacity-75 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                    style={{
                      backgroundColor: isCategoryActive ? currentTheme.palette.surfaceRaised : 'transparent',
                      color: isCategoryActive ? currentTheme.palette.accent : currentTheme.palette.textSecondary,
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                    <ChevronDown className={`w-3 h-3 opacity-60 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Clean Flyout Menu */}
                  {isDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setOpenDropdown(null)}
                      />
                      <div 
                        className="absolute left-0 mt-2 z-50 w-72 rounded-2xl border shadow-2xl p-2 space-y-1 backdrop-blur-xl animate-fadeIn"
                        style={{
                          backgroundColor: currentTheme.appearance === 'dark' || currentTheme.appearance === 'cyber-dark'
                            ? 'rgba(15, 23, 42, 0.97)'
                            : 'rgba(255, 255, 255, 0.98)',
                          borderColor: currentTheme.palette.borderStrong,
                        }}
                      >
                        <div className="px-3 py-1.5 text-[10px] font-mono uppercase font-bold opacity-50 border-b" style={{ borderColor: currentTheme.palette.border }}>
                          {cat.label}
                        </div>
                        {cat.modules.map((mod) => {
                          const isModActive = activeTab === mod.id;
                          const ModIcon = mod.icon;
                          return (
                            <button
                              key={mod.id}
                              onClick={() => handleSelectTab(mod.id)}
                              className={`w-full text-left p-2.5 rounded-xl flex items-start space-x-3 transition-all ${
                                isModActive ? 'font-bold' : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-80 hover:opacity-100'
                              }`}
                              style={{
                                backgroundColor: isModActive ? currentTheme.palette.surfaceRaised : 'transparent',
                                color: isModActive ? currentTheme.palette.accent : currentTheme.palette.textPrimary,
                              }}
                            >
                              <div 
                                className="p-2 rounded-lg mt-0.5"
                                style={{
                                  backgroundColor: isModActive ? currentTheme.palette.accentLight : currentTheme.palette.surface,
                                  color: isModActive ? currentTheme.palette.accentText : currentTheme.palette.textSecondary,
                                }}
                              >
                                <ModIcon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold truncate">{mod.label}</span>
                                  {mod.badge && (
                                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/10 dark:bg-white/10 opacity-70">
                                      {mod.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] opacity-60 leading-snug mt-0.5 line-clamp-1">{mod.shortDesc}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            {/* All Modules Catalog Quick Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsAllModulesOpen(!isAllModulesOpen)}
                className={`p-1.5 rounded-lg opacity-70 hover:opacity-100 transition-all ${isAllModulesOpen ? 'bg-black/10 dark:bg-white/10' : ''}`}
                title="View All 8 Modules Catalog"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>

              {/* All Modules Dropdown Grid */}
              {isAllModulesOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsAllModulesOpen(false)} />
                  <div 
                    className="absolute right-0 mt-2 z-50 w-96 rounded-2xl border shadow-2xl p-4 space-y-3 backdrop-blur-xl animate-fadeIn"
                    style={{
                      backgroundColor: currentTheme.appearance === 'dark' || currentTheme.appearance === 'cyber-dark'
                        ? 'rgba(15, 23, 42, 0.98)'
                        : 'rgba(255, 255, 255, 0.99)',
                      borderColor: currentTheme.palette.borderStrong,
                    }}
                  >
                    <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: currentTheme.palette.border }}>
                      <span className="text-xs font-bold font-mono uppercase opacity-75">All System Modules</span>
                      <span className="text-[10px] opacity-50">8 Active Systems</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {categories.flatMap(c => c.modules).map((mod) => {
                        const isModActive = activeTab === mod.id;
                        const ModIcon = mod.icon;
                        return (
                          <button
                            key={mod.id}
                            onClick={() => handleSelectTab(mod.id)}
                            className={`p-2.5 rounded-xl border text-left flex items-center space-x-2.5 transition-all ${
                              isModActive ? 'ring-2 font-bold' : 'opacity-80 hover:opacity-100'
                            }`}
                            style={{
                              backgroundColor: isModActive ? currentTheme.palette.surfaceRaised : currentTheme.palette.surface,
                              borderColor: isModActive ? currentTheme.palette.accent : currentTheme.palette.border,
                              color: isModActive ? currentTheme.palette.accent : currentTheme.palette.textPrimary,
                            }}
                          >
                            <ModIcon className="w-4 h-4 shrink-0" />
                            <div className="min-w-0">
                              <div className="text-[11px] font-semibold truncate">{mod.label}</div>
                              <div className="text-[9px] opacity-60 font-mono truncate">{mod.badge}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Right Action Tools: Search & Consolidated Theme Popover */}
          <div className="flex items-center space-x-2">

            {/* Quick README Studio Access */}
            <button
              onClick={() => handleSelectTab('opensource')}
              className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono font-semibold transition-all cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/10"
              style={{
                backgroundColor: activeTab === 'opensource' ? 'rgba(16, 185, 129, 0.15)' : currentTheme.palette.surfaceRaised,
                borderColor: activeTab === 'opensource' ? 'rgba(16, 185, 129, 0.4)' : currentTheme.palette.border,
                color: activeTab === 'opensource' ? '#10B981' : currentTheme.palette.textPrimary,
              }}
              title="GitHub README Studio & Publisher"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">README.md</span>
            </button>
            
            {/* Quick Command Palette Search */}
            <button
              onClick={onOpenCommandPalette}
              className="flex items-center space-x-2 text-xs px-3 py-1.5 rounded-xl border transition-all font-mono hover:scale-102 cursor-pointer shadow-2xs"
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: currentTheme.palette.border,
                color: currentTheme.palette.textSecondary,
              }}
              title="Search and jump across all modules (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search...</span>
              <kbd 
                className="px-1.5 py-0.5 rounded text-[10px] font-semibold border shadow-2xs"
                style={{
                  backgroundColor: currentTheme.palette.surface,
                  borderColor: currentTheme.palette.borderStrong,
                  color: currentTheme.palette.textPrimary,
                }}
              >
                Ctrl+K
              </kbd>
            </button>

            {/* Appearance & Themes Consolidated Button (Tucks preferences away cleanly) */}
            <div className="relative">
              <button
                onClick={() => setIsPreferencesOpen(!isPreferencesOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all shadow-2xs hover:scale-102 cursor-pointer"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.border,
                  color: currentTheme.palette.textPrimary,
                }}
                title="Theme, Density & Ergonomics Settings"
              >
                <Palette className="w-3.5 h-3.5" style={{ color: currentTheme.palette.accent }} />
                <span className="hidden md:inline font-mono text-[11px]">{currentTheme.name.split(' ')[0]}</span>
                <Sliders className="w-3 h-3 opacity-60" />
              </button>

              {/* Preferences Menu Popover */}
              <ThemePreferencesMenu 
                isOpen={isPreferencesOpen}
                onClose={() => setIsPreferencesOpen(false)}
              />
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border text-xs opacity-80 hover:opacity-100"
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: currentTheme.palette.border,
              }}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Clean, categorized, no overflow clutter) */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden border-t p-4 space-y-4 max-h-[80vh] overflow-y-auto"
          style={{
            backgroundColor: currentTheme.palette.surfaceRaised,
            borderColor: currentTheme.palette.border,
          }}
        >
          <button
            onClick={() => handleSelectTab('home')}
            className={`w-full p-2.5 rounded-xl text-left font-bold text-xs flex items-center space-x-2 ${
              activeTab === 'home' ? 'bg-indigo-600 text-white' : 'border'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Overview & Dashboard</span>
          </button>

          {categories.map((cat) => (
            <div key={cat.id} className="space-y-1.5 pt-2">
              <span className="text-[10px] font-mono uppercase font-bold opacity-50 block px-1">
                {cat.label}
              </span>
              <div className="grid grid-cols-1 gap-1">
                {cat.modules.map((mod) => {
                  const isModActive = activeTab === mod.id;
                  const ModIcon = mod.icon;
                  return (
                    <button
                      key={mod.id}
                      onClick={() => handleSelectTab(mod.id)}
                      className={`w-full p-2 rounded-xl text-left text-xs flex items-center justify-between ${
                        isModActive ? 'bg-indigo-600 text-white font-bold' : 'hover:bg-black/5 dark:hover:bg-white/5 border'
                      }`}
                      style={{ borderColor: currentTheme.palette.border }}
                    >
                      <div className="flex items-center space-x-2">
                        <ModIcon className="w-3.5 h-3.5" />
                        <span>{mod.label}</span>
                      </div>
                      {mod.badge && <span className="text-[9px] opacity-70 font-mono">{mod.badge}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
};
