import React, { useState, useEffect } from 'react';
import { Database, Plus, Trash2, Key, Save } from 'lucide-react';

interface MemoryItem {
  key: string;
  value: string;
  timestamp: number;
}

export const CognitiveMemoryStore: React.FC = () => {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('apex_cognitive_memory');
    if (saved) {
      try {
        setMemories(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse memory', e);
      }
    }
  }, []);

  // Save to local storage
  const saveMemories = (newMemories: MemoryItem[]) => {
    setMemories(newMemories);
    localStorage.setItem('apex_cognitive_memory', JSON.stringify(newMemories));
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;
    
    const newItem: MemoryItem = {
      key: newKey.trim(),
      value: newValue.trim(),
      timestamp: Date.now(),
    };
    
    // Check if key exists, update if so
    const existingIndex = memories.findIndex(m => m.key === newItem.key);
    let updatedMemories;
    if (existingIndex >= 0) {
      updatedMemories = [...memories];
      updatedMemories[existingIndex] = newItem;
    } else {
      updatedMemories = [newItem, ...memories];
    }
    
    saveMemories(updatedMemories);
    setNewKey('');
    setNewValue('');
  };

  const handleDelete = (key: string) => {
    saveMemories(memories.filter(m => m.key !== key));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center space-x-2">
        <Database className="w-4 h-4 text-fuchsia-500" />
        <span>Persistent Cognitive Memory (KV Store)</span>
      </h2>
      
      <form onSubmit={handleAddMemory} className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Key className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="Key (e.g. agent_insight_1)"
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          />
        </div>
        <div className="flex-[2]">
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Value or JSON..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-lg text-sm font-bold tracking-wide transition-colors flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span>Save</span>
        </button>
      </form>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
        {memories.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            Memory bank is empty. Add a key-value pair above.
          </div>
        ) : (
          memories.map((memory) => (
            <div key={memory.key} className="flex items-start justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg group">
              <div className="overflow-hidden pr-4">
                <div className="font-mono text-xs font-bold text-fuchsia-700 mb-1">{memory.key}</div>
                <div className="text-sm text-gray-700 truncate">{memory.value}</div>
                <div className="text-[10px] text-gray-400 mt-1">
                  {new Date(memory.timestamp).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => handleDelete(memory.key)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                title="Delete memory"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
