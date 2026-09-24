import React, { useState } from 'react';
import { 
  X, Sparkles, Code2, Cpu, ArrowRight, Layers, 
  Terminal, CheckCircle2, Search, Filter, BookOpen 
} from 'lucide-react';
import { useAdaptiveTheme } from '../../context/ThemeContext';
import { IDE_CODE_TEMPLATES, CodeTemplate } from '../../data/ideTemplates';

interface IDETemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: CodeTemplate) => void;
}

export const IDETemplatesModal: React.FC<IDETemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const { currentTheme } = useAdaptiveTheme();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'CUDA & Triton', 'Distributed AI', 'Model Architecture', 'Memory & KV Cache'];

  const filteredTemplates = IDE_CODE_TEMPLATES.filter(t => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                          t.description.toLowerCase().includes(search.toLowerCase()) ||
                          t.hardwareTarget.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-all"
        style={{
          backgroundColor: currentTheme.palette.surface,
          borderColor: currentTheme.palette.border,
          color: currentTheme.palette.textPrimary,
        }}
      >
        {/* Modal Header */}
        <div 
          className="p-5 border-b flex items-center justify-between"
          style={{ borderColor: currentTheme.palette.border }}
        >
          <div className="flex items-center space-x-3">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs"
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: currentTheme.palette.borderStrong,
                color: currentTheme.palette.accent,
              }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg tracking-tight">AI & CUDA Template Library</h3>
              <p className="text-xs opacity-70">Insert production-tested kernels, model blocks, and distributed pipelines.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg opacity-70 hover:opacity-100 transition-colors border"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.border,
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div 
          className="p-4 border-b space-y-3"
          style={{
            backgroundColor: currentTheme.palette.surfaceRaised,
            borderColor: currentTheme.palette.border,
          }}
        >
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                type="text"
                placeholder="Search templates by kernel, hardware, architecture..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs font-mono border focus:outline-none focus:ring-1"
                style={{
                  backgroundColor: currentTheme.palette.surface,
                  borderColor: currentTheme.palette.borderStrong,
                }}
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all border ${
                  selectedCategory === cat ? 'font-bold shadow-2xs' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: selectedCategory === cat ? currentTheme.palette.surface : 'transparent',
                  borderColor: selectedCategory === cat ? currentTheme.palette.accent : currentTheme.palette.border,
                  color: selectedCategory === cat ? currentTheme.palette.accent : currentTheme.palette.textPrimary,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Templates List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {filteredTemplates.length === 0 ? (
            <div className="py-12 text-center text-xs opacity-60 font-mono">
              No matching code templates found for current search criteria.
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="p-4 rounded-xl border transition-all hover:scale-[1.01] cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.border,
                }}
                onClick={() => {
                  onSelectTemplate(template);
                  onClose();
                }}
              >
                <div className="space-y-1.5 flex-1 pr-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm tracking-tight">{template.name}</span>
                    <span 
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border"
                      style={{
                        backgroundColor: currentTheme.palette.surface,
                        borderColor: currentTheme.palette.borderStrong,
                        color: currentTheme.palette.accent,
                      }}
                    >
                      {template.category}
                    </span>
                  </div>
                  <p className="text-xs opacity-80 leading-relaxed">{template.description}</p>
                  <div className="flex items-center space-x-3 text-[11px] font-mono opacity-60 pt-1">
                    <span className="flex items-center space-x-1">
                      <Code2 className="w-3 h-3" />
                      <span>{template.filename}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Cpu className="w-3 h-3 text-purple-400" />
                      <span>{template.hardwareTarget}</span>
                    </span>
                  </div>
                </div>

                <button
                  className="px-3.5 py-2 rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 text-white shadow-2xs group-hover:scale-105 transition-all shrink-0"
                  style={{ backgroundColor: currentTheme.palette.accent }}
                >
                  <span>Load Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
