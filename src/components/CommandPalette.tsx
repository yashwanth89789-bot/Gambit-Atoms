import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, Terminal, FileText, GitPullRequest, Globe, Cpu, ArrowRight, X, Sparkles, BrainCircuit, Keyboard, Atom } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, setActiveTab }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Listen for Ctrl+K or Cmd+K globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Triggered from App or Navbar
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items = [
    {
      id: 'tab-home',
      category: 'Navigation',
      title: 'Home Overview & Dashboard',
      description: 'Return to system overview and live cluster metrics',
      icon: Sparkles,
      action: () => {
        setActiveTab('home');
        onClose();
      },
    },
    {
      id: 'tab-platform',
      category: 'Navigation',
      title: 'Platform Architecture Designer',
      description: 'Design hyper-scale VLA multi-modal systems',
      icon: Cpu,
      action: () => {
        setActiveTab('platform');
        onClose();
      },
    },
    {
      id: 'tab-research',
      category: 'Navigation',
      title: 'Research Paper & Review Lab',
      description: 'Generate academic papers and autonomous peer reviews',
      icon: FileText,
      action: () => {
        setActiveTab('research');
        onClose();
      },
    },
    {
      id: 'tab-opensource',
      category: 'Navigation',
      title: 'Open Source AI Contributor Studio',
      description: 'Contribute patches to vLLM, HuggingFace, PyTorch',
      icon: GitPullRequest,
      action: () => {
        setActiveTab('opensource');
        onClose();
      },
    },
    {
      id: 'tab-engineering',
      category: 'Navigation',
      title: 'Global Scale Engineering Solver',
      description: 'Solve distributed systems & tensor sharding challenges',
      icon: Globe,
      action: () => {
        setActiveTab('engineering');
        onClose();
      },
    },
    {
      id: 'tab-quantum',
      category: 'Navigation',
      title: 'Quantum Computing & QPU Lab',
      description: 'Simulate transmon qubits, Bloch spheres, entanglement, and annealing',
      icon: Atom,
      action: () => {
        setActiveTab('quantum');
        onClose();
      },
    },
    {
      id: 'tab-assistant',
      category: 'Navigation',
      title: 'Assistant Creator',
      description: 'Design and deploy specialized autonomous Gemini agents',
      icon: Sparkles,
      action: () => {
        setActiveTab('assistant');
        onClose();
      },
    },
    {
      id: 'tab-cognitive',
      category: 'Navigation',
      title: 'Cognitive Architecture Engine',
      description: 'Simulate semantic vector memory and executive planning',
      icon: BrainCircuit,
      action: () => {
        setActiveTab('cognitive');
        onClose();
      },
    },
    {
      id: 'tab-ide',
      category: 'Navigation',
      title: 'Collaborative IDE Workspace',
      description: 'Modular architecture with real-time code execution and AI copilot',
      icon: Terminal,
      action: () => {
        setActiveTab('ide');
        onClose();
      },
    },
    {
      id: 'act-solver',
      category: 'Actions',
      title: 'Start Solver',
      description: 'Jump directly to Engineering Solver and initialize spec',
      icon: Globe,
      action: () => {
        setActiveTab('engineering');
        onClose();
      },
    },
    {
      id: 'act-research',
      category: 'Actions',
      title: 'Create Research Draft',
      description: 'Open Research Lab to author a new paper',
      icon: FileText,
      action: () => {
        setActiveTab('research');
        onClose();
      },
    },
    {
      id: 'act-pr',
      category: 'Actions',
      title: 'Generate Open Source PR',
      description: 'Open Contributor Studio to draft automated patches',
      icon: GitPullRequest,
      action: () => {
        setActiveTab('opensource');
        onClose();
      },
    },
    {
      id: 'act-shortcuts',
      category: 'Help & Reference',
      title: 'Code IDE Keyboard Shortcuts Reference (⌘/)',
      description: 'View complete list of keybindings for IDE execution, editor, and AI copilot',
      icon: Keyboard,
      action: () => {
        setActiveTab('ide');
        onClose();
      },
    },
  ];

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-gray-200 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-gray-200 bg-gray-50/70">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search tabs (e.g. Solver, Research, IDE)..."
            className="w-full bg-transparent text-sm text-[#111111] placeholder-gray-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-500">
              No matching commands found for &quot;{query}&quot;.
            </div>
          ) : (
            filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors text-left group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-md bg-gray-100 group-hover:bg-white border border-gray-200 text-black">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#111111] flex items-center space-x-2">
                        <span>{item.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 font-normal">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{item.description}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center space-x-3">
            <span>Navigate with arrows or click</span>
            <span>•</span>
            <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-gray-700 font-mono">ESC</kbd> to close</span>
          </div>
          <div className="font-semibold text-gray-700">Gambit Atoms Command Center</div>
        </div>
      </div>
    </div>
  );
};
