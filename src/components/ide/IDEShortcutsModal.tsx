import React, { useState, useMemo, useEffect } from 'react';
import { 
  Keyboard, Search, X, Command, Sparkles, 
  Terminal, Play, Split, Layers, FileCode, 
  Zap, BookOpen, Compass, Check, Sliders
} from 'lucide-react';
import { useAdaptiveTheme } from '../../context/ThemeContext';

export interface ShortcutItem {
  id: string;
  name: string;
  description: string;
  category: 'Execution' | 'File & Tabs' | 'Editor Layout' | 'AI Copilot' | 'Global Navigation';
  macKeys: string[];
  winKeys: string[];
  actionId?: string;
}

export const IDE_SHORTCUTS: ShortcutItem[] = [
  // Execution
  {
    id: 'run-code',
    name: 'Run Code in Sandbox',
    description: 'Execute the active script against selected hardware acceleration target (H100/A100).',
    category: 'Execution',
    macKeys: ['⌘', 'Enter'],
    winKeys: ['Ctrl', 'Enter'],
    actionId: 'run',
  },
  {
    id: 'run-f5',
    name: 'Quick Debug & Run',
    description: 'Alternative instant debug run execution.',
    category: 'Execution',
    macKeys: ['F5'],
    winKeys: ['F5'],
    actionId: 'run',
  },
  {
    id: 'clear-terminal',
    name: 'Clear Terminal Output',
    description: 'Flush stdout/stderr logs in the interactive terminal console.',
    category: 'Execution',
    macKeys: ['⌘', 'K'],
    winKeys: ['Ctrl', 'L'],
    actionId: 'clear_console',
  },

  // File & Tabs
  {
    id: 'save-file',
    name: 'Save Active File',
    description: 'Persist code changes and mark modified buffer as clean.',
    category: 'File & Tabs',
    macKeys: ['⌘', 'S'],
    winKeys: ['Ctrl', 'S'],
    actionId: 'save',
  },
  {
    id: 'new-file',
    name: 'Create New File',
    description: 'Open file creation dialog to spawn a Python/CUDA/Triton/TypeScript module.',
    category: 'File & Tabs',
    macKeys: ['⌘', 'Shift', 'N'],
    winKeys: ['Ctrl', 'Shift', 'N'],
    actionId: 'new_file',
  },
  {
    id: 'template-library',
    name: 'Browse Templates & Presets',
    description: 'Open verified production architecture templates (VLA, FlashAttention, RAG).',
    category: 'File & Tabs',
    macKeys: ['⌘', 'Shift', 'T'],
    winKeys: ['Ctrl', 'Shift', 'T'],
    actionId: 'templates',
  },
  {
    id: 'close-tab',
    name: 'Close Active Editor Tab',
    description: 'Close the current file buffer tab.',
    category: 'File & Tabs',
    macKeys: ['⌘', 'W'],
    winKeys: ['Ctrl', 'W'],
    actionId: 'close_tab',
  },

  // Editor Layout
  {
    id: 'split-view',
    name: 'Toggle Split-View Editor',
    description: 'Divide Monaco editor into dual side-by-side comparative panes.',
    category: 'Editor Layout',
    macKeys: ['⌘', '\\'],
    winKeys: ['Ctrl', '\\'],
    actionId: 'split',
  },
  {
    id: 'toggle-minimap',
    name: 'Toggle Architecture Minimap',
    description: 'Show or hide the visual AST code minimap and collaborator radar.',
    category: 'Editor Layout',
    macKeys: ['⌘', 'M'],
    winKeys: ['Ctrl', 'M'],
    actionId: 'minimap',
  },
  {
    id: 'toggle-terminal',
    name: 'Toggle Terminal Console',
    description: 'Expand or collapse the bottom hardware output terminal drawer.',
    category: 'Editor Layout',
    macKeys: ['⌘', '`'],
    winKeys: ['Ctrl', '`'],
    actionId: 'terminal',
  },

  // AI Copilot
  {
    id: 'ai-optimize',
    name: 'AI Kernel Optimization',
    description: 'Inject fused FlashAttention, tensor parallelism, and async TMA memory copy.',
    category: 'AI Copilot',
    macKeys: ['⌘', 'Shift', 'O'],
    winKeys: ['Ctrl', 'Shift', 'O'],
    actionId: 'ai_optimize',
  },
  {
    id: 'ai-docstring',
    name: 'AI Generate Docstrings & Types',
    description: 'Synthesize Google/NumPy docstrings and strict Python type annotations.',
    category: 'AI Copilot',
    macKeys: ['⌘', 'Shift', 'D'],
    winKeys: ['Ctrl', 'Shift', 'D'],
    actionId: 'ai_docstring',
  },
  {
    id: 'ai-test-suite',
    name: 'AI Synthesize PyTest Suite',
    description: 'Generate unit tests verifying tensor shape invariants and numerical gradient flow.',
    category: 'AI Copilot',
    macKeys: ['⌘', 'Shift', 'U'],
    winKeys: ['Ctrl', 'Shift', 'U'],
    actionId: 'ai_test',
  },
  {
    id: 'ai-explain',
    name: 'AI Architecture Analysis',
    description: 'Request formal asymptotic time/memory complexity breakdown in Copilot chat.',
    category: 'AI Copilot',
    macKeys: ['⌘', 'Shift', 'E'],
    winKeys: ['Ctrl', 'Shift', 'E'],
    actionId: 'ai_explain',
  },

  // Global Navigation
  {
    id: 'command-palette',
    name: 'Global Command Palette',
    description: 'Open omni-search palette to navigate workspaces, switch models, and run commands.',
    category: 'Global Navigation',
    macKeys: ['⌘', 'K'],
    winKeys: ['Ctrl', 'K'],
    actionId: 'command_palette',
  },
  {
    id: 'shortcuts-modal',
    name: 'Open Keyboard Shortcuts Reference',
    description: 'Display this interactive keyboard shortcut reference sheet.',
    category: 'Global Navigation',
    macKeys: ['⌘', '/'],
    winKeys: ['Ctrl', '/'],
    actionId: 'shortcuts',
  },
  {
    id: 'escape-modal',
    name: 'Close Dialog / Cancel',
    description: 'Dismiss any active modal or context overlay.',
    category: 'Global Navigation',
    macKeys: ['Esc'],
    winKeys: ['Esc'],
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onExecuteAction?: (actionId: string) => void;
}

export const IDEShortcutsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onExecuteAction,
}) => {
  const { currentTheme } = useAdaptiveTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [osMode, setOsMode] = useState<'mac' | 'win'>(() => {
    return typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? 'mac' : 'win';
  });

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const categories = useMemo(() => {
    return ['All', 'Execution', 'File & Tabs', 'Editor Layout', 'AI Copilot', 'Global Navigation'];
  }, []);

  const filteredShortcuts = useMemo(() => {
    return IDE_SHORTCUTS.filter(s => {
      const matchCat = selectedCategory === 'All' || s.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch = 
        s.name.toLowerCase().includes(q) || 
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.macKeys.join(' ').toLowerCase().includes(q) ||
        s.winKeys.join(' ').toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-all"
        style={{
          backgroundColor: currentTheme.palette.surface,
          borderColor: currentTheme.palette.border,
          color: currentTheme.palette.textPrimary,
        }}
      >
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: currentTheme.palette.border }}>
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center border"
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: currentTheme.palette.borderStrong,
              }}
            >
              <Keyboard className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base tracking-tight">Code IDE Keyboard Shortcuts Reference</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                  {filteredShortcuts.length} Shortcuts
                </span>
              </div>
              <p className="text-xs opacity-70">Boost productivity with keybindings for editor, sandbox, and AI copilots</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* OS Selector */}
            <div className="flex items-center p-1 rounded-lg border text-xs font-mono" style={{ borderColor: currentTheme.palette.borderStrong }}>
              <button
                onClick={() => setOsMode('mac')}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                  osMode === 'mac' ? 'bg-indigo-600 text-white font-bold' : 'opacity-60 hover:opacity-100'
                }`}
              >
                macOS (⌘)
              </button>
              <button
                onClick={() => setOsMode('win')}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                  osMode === 'win' ? 'bg-indigo-600 text-white font-bold' : 'opacity-60 hover:opacity-100'
                }`}
              >
                Win / Linux (Ctrl)
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-white/5 transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 border-b space-y-3" style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}>
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 opacity-50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shortcut by command name, key, or category (e.g. 'run', 'split', 'optimize')..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{
                backgroundColor: currentTheme.palette.surface,
                borderColor: currentTheme.palette.borderStrong,
                color: currentTheme.palette.textPrimary,
              }}
              autoFocus
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500 shadow-xs' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  style={!isSelected ? {
                    backgroundColor: currentTheme.palette.surface,
                    borderColor: currentTheme.palette.borderStrong,
                  } : {}}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Shortcuts List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {filteredShortcuts.length === 0 ? (
            <div className="text-center py-12 opacity-60 font-mono text-xs space-y-2">
              <Keyboard className="w-8 h-8 mx-auto opacity-40" />
              <p>No keyboard shortcuts matching "{searchQuery}" in {selectedCategory}.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5">
              {filteredShortcuts.map((shortcut) => {
                const keys = osMode === 'mac' ? shortcut.macKeys : shortcut.winKeys;

                return (
                  <div
                    key={shortcut.id}
                    className="p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-indigo-500/60"
                    style={{
                      backgroundColor: currentTheme.palette.surfaceRaised,
                      borderColor: currentTheme.palette.border,
                    }}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs" style={{ color: currentTheme.palette.textPrimary }}>
                          {shortcut.name}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">
                          {shortcut.category}
                        </span>
                      </div>
                      <p className="text-[11px] opacity-75 font-sans leading-relaxed" style={{ color: currentTheme.palette.textSecondary }}>
                        {shortcut.description}
                      </p>
                    </div>

                    {/* Key Combination Badges */}
                    <div className="flex items-center space-x-1.5 shrink-0">
                      {keys.map((k, idx) => (
                        <React.Fragment key={idx}>
                          <kbd 
                            className="px-2.5 py-1 rounded-lg border font-mono font-bold text-xs shadow-xs min-w-[28px] text-center"
                            style={{
                              backgroundColor: currentTheme.appearance === 'light' ? '#F4F4F5' : '#18181B',
                              borderColor: currentTheme.palette.borderStrong,
                              color: currentTheme.palette.accent,
                            }}
                          >
                            {k}
                          </kbd>
                          {idx < keys.length - 1 && (
                            <span className="text-[10px] opacity-40 font-mono">+</span>
                          )}
                        </React.Fragment>
                      ))}

                      {shortcut.actionId && onExecuteAction && (
                        <button
                          onClick={() => {
                            onExecuteAction(shortcut.actionId!);
                            onClose();
                          }}
                          className="ml-2 px-2 py-1 rounded text-[10px] font-mono opacity-0 group-hover:opacity-100 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 transition-all cursor-pointer"
                        >
                          Run
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="p-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-[11px] opacity-75" style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}>
          <div className="flex items-center space-x-2">
            <span>Tip: Press <kbd className="px-1.5 py-0.5 rounded border bg-zinc-800 border-zinc-700">?</kbd> or <kbd className="px-1.5 py-0.5 rounded border bg-zinc-800 border-zinc-700">⌘ /</kbd> from anywhere in the IDE to toggle this reference.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border text-xs font-bold hover:bg-white/5 transition-colors cursor-pointer self-end sm:self-auto"
            style={{ borderColor: currentTheme.palette.borderStrong }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
