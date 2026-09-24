import React, { useState, useEffect } from 'react';
import { 
  Database, Plus, Trash2, Key, Save, Search, 
  Tag, Download, Copy, Check, Sparkles 
} from 'lucide-react';
import { useAdaptiveTheme } from '../../context/ThemeContext';

export interface CognitiveFact {
  id: string;
  key: string;
  value: string;
  category: 'Episodic' | 'Declarative' | 'Procedural' | 'UserPreference';
  confidence: number;
  timestamp: string;
}

export const PersistentCognitiveStore: React.FC = () => {
  const { currentTheme } = useAdaptiveTheme();

  const [facts, setFacts] = useState<CognitiveFact[]>(() => {
    try {
      const stored = localStorage.getItem('apex_cognitive_facts_v2');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: '1',
        key: 'security_posture_default',
        value: 'Zero-Trust Architecture enforced. All payloads require SHA-256 hash digests.',
        category: 'Procedural',
        confidence: 0.99,
        timestamp: new Date().toLocaleDateString(),
      },
      {
        id: '2',
        key: 'qpu_transmon_coherence',
        value: 'Average T2* dephasing time calibrated at 124.8 microseconds (12.4mK fridge base).',
        category: 'Declarative',
        confidence: 0.96,
        timestamp: new Date().toLocaleDateString(),
      },
      {
        id: '3',
        key: 'preferred_inference_mode',
        value: 'Deterministic sampling (Temperature T=0.15) with tree-of-thought verification.',
        category: 'UserPreference',
        confidence: 0.98,
        timestamp: new Date().toLocaleDateString(),
      },
    ];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newCategory, setNewCategory] = useState<CognitiveFact['category']>('Declarative');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem('apex_cognitive_facts_v2', JSON.stringify(facts));
  }, [facts]);

  const handleAddFact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;

    const newFact: CognitiveFact = {
      id: Math.random().toString(36).substring(2, 8),
      key: newKey.trim(),
      value: newValue.trim(),
      category: newCategory,
      confidence: 0.95,
      timestamp: new Date().toLocaleDateString(),
    };

    setFacts(prev => [newFact, ...prev.filter(f => f.key !== newFact.key)]);
    setNewKey('');
    setNewValue('');
  };

  const handleDeleteFact = (id: string) => {
    setFacts(prev => prev.filter(f => f.id !== id));
  };

  const filteredFacts = facts.filter(f =>
    f.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(facts, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="border rounded-2xl p-6 shadow-sm space-y-6 transition-all"
      style={{
        backgroundColor: currentTheme.palette.surface,
        borderColor: currentTheme.palette.border,
        color: currentTheme.palette.textPrimary,
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b" style={{ borderColor: currentTheme.palette.border }}>
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center border"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.borderStrong,
            }}
          >
            <Database className="w-5 h-5 text-fuchsia-500" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-base tracking-tight">Persistent Cognitive Memory Store</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/30">
                Local Vector KV
              </span>
            </div>
            <p className="text-xs opacity-70">Cross-session episodic memories, declarative axioms, and user preference state</p>
          </div>
        </div>

        <button
          onClick={handleExportJSON}
          className="px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center space-x-1.5 hover:bg-white/5 transition-colors"
          style={{ borderColor: currentTheme.palette.borderStrong }}
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied JSON' : 'Export JSON'}</span>
        </button>
      </div>

      {/* Add Fact Form */}
      <form onSubmit={handleAddFact} className="p-4 rounded-xl border space-y-3 font-mono text-xs" style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}>
        <span className="text-[10px] uppercase font-bold opacity-75 block">Assert New Memory Entry</span>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-4">
            <input
              type="text"
              placeholder="Memory Key (e.g. system_axiom_4)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border bg-zinc-900 border-zinc-700 focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border bg-zinc-900 border-zinc-700 focus:outline-none"
            >
              <option value="Declarative">Declarative Fact</option>
              <option value="Episodic">Episodic Trace</option>
              <option value="Procedural">Procedural Rule</option>
              <option value="UserPreference">User Preference</option>
            </select>
          </div>

          <div className="md:col-span-5">
            <input
              type="text"
              placeholder="Memory Content or Axiom Value..."
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border bg-zinc-900 border-zinc-700 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded-lg text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: currentTheme.palette.accent }}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Commit to Memory</span>
        </button>
      </form>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 opacity-50" />
        <input
          type="text"
          placeholder="Filter cognitive memories by key, content, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl border text-xs font-mono focus:outline-none"
          style={{
            backgroundColor: currentTheme.palette.surfaceRaised,
            borderColor: currentTheme.palette.borderStrong,
          }}
        />
      </div>

      {/* Memory List */}
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {filteredFacts.map((fact) => (
          <div
            key={fact.id}
            className="p-3.5 rounded-xl border space-y-1.5 transition-all flex flex-col justify-between"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.border,
            }}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-indigo-400">
                  {fact.key}
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30">
                  {fact.category}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono opacity-50">Conf: {(fact.confidence * 100).toFixed(0)}%</span>
                <button
                  onClick={() => handleDeleteFact(fact.id)}
                  className="p-1 rounded text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Evict Memory"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs opacity-85 leading-relaxed font-mono">
              {fact.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
