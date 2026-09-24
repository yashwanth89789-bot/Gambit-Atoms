import React, { useState } from 'react';
import { 
  Network, Database, Share2, Plus, Trash2, 
  Sparkles, Search, Check, Layers, Compass 
} from 'lucide-react';
import { useAdaptiveTheme } from '../../context/ThemeContext';

export interface KnowledgeNode {
  id: string;
  label: string;
  category: 'Entity' | 'Concept' | 'Protocol' | 'Hardware';
  color: string;
  x: number;
  y: number;
}

export interface KnowledgeEdge {
  from: string;
  to: string;
  relation: string;
}

export const SymbolicKnowledgeGraph: React.FC = () => {
  const { currentTheme } = useAdaptiveTheme();

  // Mode: Graph vs 2D Vector Space
  const [viewMode, setViewMode] = useState<'graph' | 'vector_space'>('graph');

  // Nodes
  const [nodes, setNodes] = useState<KnowledgeNode[]>([
    { id: '1', label: 'Autonomous Agent', category: 'Entity', color: '#8B5CF6', x: 80, y: 70 },
    { id: '2', label: 'Zero-Trust Protocol', category: 'Protocol', color: '#EF4444', x: 220, y: 60 },
    { id: '3', label: 'Least Privilege', category: 'Concept', color: '#F59E0B', x: 280, y: 150 },
    { id: '4', label: 'Quantum QPU Core', category: 'Hardware', color: '#10B981', x: 70, y: 180 },
    { id: '5', label: 'Surface Code QEC', category: 'Protocol', color: '#06B6D4', x: 180, y: 220 },
    { id: '6', label: 'Vector RAG Index', category: 'Concept', color: '#3B82F6', x: 170, y: 130 },
  ]);

  // Edges (Triples)
  const [edges, setEdges] = useState<KnowledgeEdge[]>([
    { from: '1', to: '2', relation: 'enforces' },
    { from: '2', to: '3', relation: 'implements' },
    { from: '1', to: '6', relation: 'queries' },
    { from: '1', to: '4', relation: 'dispatches' },
    { from: '4', to: '5', relation: 'stabilizes' },
    { from: '6', to: '2', relation: 'audits' },
  ]);

  // Selected Node for Detail
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);

  // Form for adding new triple
  const [newSubj, setNewSubj] = useState('');
  const [newPred, setNewPred] = useState('connects');
  const [newObj, setNewObj] = useState('');

  // Vector Space 2D Embedding Points
  const vectorClusters = [
    { id: 'v1', text: 'Zero-Trust Architecture', cluster: 'Cyber Defense', x: 45, y: 35, color: '#EF4444' },
    { id: 'v2', text: 'CVE Patch Automation', cluster: 'Cyber Defense', x: 60, y: 40, color: '#EF4444' },
    { id: 'v3', text: 'Cryptographic Signing', cluster: 'Cyber Defense', x: 50, y: 55, color: '#EF4444' },

    { id: 'v4', text: 'Bloch Sphere Simulation', cluster: 'Quantum QPU', x: 180, y: 50, color: '#10B981' },
    { id: 'v5', text: 'Fault-Tolerant Surface Code', cluster: 'Quantum QPU', x: 200, y: 70, color: '#10B981' },
    { id: 'v6', text: 'Ising Hamiltonian Annealing', cluster: 'Quantum QPU', x: 175, y: 85, color: '#10B981' },

    { id: 'v7', text: 'Multi-Agent DAG Swarm', cluster: 'Autonomous Agent', x: 120, y: 170, color: '#8B5CF6' },
    { id: 'v8', text: 'Chain-of-Thought Reasoning', cluster: 'Autonomous Agent', x: 140, y: 190, color: '#8B5CF6' },
    { id: 'v9', text: 'Tool Execution Matrix', cluster: 'Autonomous Agent', x: 110, y: 210, color: '#8B5CF6' },
  ];

  const [selectedVectorPair, setSelectedVectorPair] = useState<string[]>(['v1', 'v2']);

  const handleAddTriple = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubj.trim() || !newObj.trim()) return;

    let sNode = nodes.find(n => n.label.toLowerCase() === newSubj.toLowerCase());
    let oNode = nodes.find(n => n.label.toLowerCase() === newObj.toLowerCase());

    const updatedNodes = [...nodes];

    if (!sNode) {
      sNode = {
        id: Math.random().toString(36).substring(2, 7),
        label: newSubj.trim(),
        category: 'Entity',
        color: '#8B5CF6',
        x: Math.floor(Math.random() * 200) + 50,
        y: Math.floor(Math.random() * 150) + 40,
      };
      updatedNodes.push(sNode);
    }

    if (!oNode) {
      oNode = {
        id: Math.random().toString(36).substring(2, 7),
        label: newObj.trim(),
        category: 'Concept',
        color: '#3B82F6',
        x: Math.floor(Math.random() * 200) + 50,
        y: Math.floor(Math.random() * 150) + 40,
      };
      updatedNodes.push(oNode);
    }

    setNodes(updatedNodes);
    setEdges(prev => [...prev, { from: sNode!.id, to: oNode!.id, relation: newPred.trim() }]);

    setNewSubj('');
    setNewObj('');
  };

  // Calculate Cosine Similarity in 2D space
  const getCosineSimilarity = () => {
    if (selectedVectorPair.length !== 2) return 0.95;
    const p1 = vectorClusters.find(v => v.id === selectedVectorPair[0]);
    const p2 = vectorClusters.find(v => v.id === selectedVectorPair[1]);
    if (!p1 || !p2) return 0.95;

    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    // Convert Euclidean distance on canvas to simulated high-dim cosine similarity
    const sim = Math.max(0.2, 1.0 - (dist / 300));
    return parseFloat(sim.toFixed(3));
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
            <Share2 className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-base tracking-tight">Declarative Knowledge Graph & Vector Space</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                Neuro-Symbolic Memory
              </span>
            </div>
            <p className="text-xs opacity-70">Traverse symbolic entity triples and inspect high-dimensional semantic vector cluster projections</p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center space-x-1.5 p-1 rounded-lg border text-xs font-mono font-semibold" style={{ borderColor: currentTheme.palette.borderStrong }}>
          <button
            onClick={() => setViewMode('graph')}
            className={`px-3 py-1 rounded transition-all ${
              viewMode === 'graph' ? 'bg-indigo-600 text-white font-bold' : 'opacity-70 hover:opacity-100'
            }`}
          >
            Symbolic Graph
          </button>
          <button
            onClick={() => setViewMode('vector_space')}
            className={`px-3 py-1 rounded transition-all ${
              viewMode === 'vector_space' ? 'bg-indigo-600 text-white font-bold' : 'opacity-70 hover:opacity-100'
            }`}
          >
            Vector Embeddings (2D)
          </button>
        </div>
      </div>

      {viewMode === 'graph' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: 2D Graph Canvas (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 rounded-xl border relative" style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}>
            <svg width="340" height="280" viewBox="0 0 340 280" className="overflow-visible select-none">
              {/* Draw Edges */}
              {edges.map((e, idx) => {
                const s = nodes.find(n => n.id === e.from);
                const t = nodes.find(n => n.id === e.to);
                if (!s || !t) return null;

                const mx = (s.x + t.x) / 2;
                const my = (s.y + t.y) / 2;

                return (
                  <g key={idx}>
                    <line 
                      x1={s.x} 
                      y1={s.y} 
                      x2={t.x} 
                      y2={t.y} 
                      stroke="#6B7280" 
                      strokeWidth="1.5" 
                      strokeDasharray="2 2"
                      opacity="0.6"
                    />
                    {/* Relation label text */}
                    <rect x={mx - 22} y={my - 7} width="44" height="14" rx="3" fill="#18181B" opacity="0.85" />
                    <text x={mx} y={my + 3} fill="#A1A1AA" fontSize="8" textAnchor="middle" fontFamily="monospace">
                      {e.relation}
                    </text>
                  </g>
                );
              })}

              {/* Draw Nodes */}
              {nodes.map(n => {
                const isSelected = selectedNode?.id === n.id;
                return (
                  <g key={n.id} className="cursor-pointer" onClick={() => setSelectedNode(n)}>
                    <circle 
                      cx={n.x} 
                      cy={n.y} 
                      r="16" 
                      fill={n.color} 
                      stroke={isSelected ? '#FFFFFF' : '#27272A'} 
                      strokeWidth={isSelected ? 3 : 1.5}
                      className="drop-shadow-md hover:scale-110 transition-transform"
                    />
                    <text x={n.x} y={n.y + 26} fill="#E4E4E7" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      {n.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="mt-2 text-center text-xs opacity-75 font-mono">
              Click any node to inspect semantic triples and graph connectivity.
            </div>
          </div>

          {/* Right Column: Node Inspector & Add Triple Form (5 cols) */}
          <div className="lg:col-span-5 space-y-4 font-mono text-xs">
            {/* Selected Node Details */}
            {selectedNode ? (
              <div className="p-3.5 rounded-xl border space-y-2" style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-indigo-400">{selectedNode.label}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded border" style={{ borderColor: selectedNode.color, color: selectedNode.color }}>
                    {selectedNode.category}
                  </span>
                </div>
                <div className="text-[11px] opacity-80 space-y-1">
                  <div><strong>Connected Triples:</strong></div>
                  {edges.filter(e => e.from === selectedNode.id || e.to === selectedNode.id).map((e, i) => {
                    const fromN = nodes.find(n => n.id === e.from)?.label;
                    const toN = nodes.find(n => n.id === e.to)?.label;
                    return (
                      <div key={i} className="text-zinc-400">
                        • ({fromN}) --[<span className="text-amber-400">{e.relation}</span>]--&gt; ({toN})
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg border text-center opacity-60" style={{ borderColor: currentTheme.palette.border }}>
                Select an entity node on the canvas to view its relational triples.
              </div>
            )}

            {/* Add Semantic Triple Form */}
            <form onSubmit={handleAddTriple} className="p-3.5 rounded-xl border space-y-2.5" style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}>
              <span className="text-[10px] uppercase font-bold opacity-75 block">Add Knowledge Triple (Subject - Predicate - Object)</span>
              
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Subject"
                  value={newSubj}
                  onChange={(e) => setNewSubj(e.target.value)}
                  className="px-2 py-1.5 rounded border text-xs bg-zinc-900 border-zinc-700 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Predicate"
                  value={newPred}
                  onChange={(e) => setNewPred(e.target.value)}
                  className="px-2 py-1.5 rounded border text-xs bg-zinc-900 border-zinc-700 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Object"
                  value={newObj}
                  onChange={(e) => setNewObj(e.target.value)}
                  className="px-2 py-1.5 rounded border text-xs bg-zinc-900 border-zinc-700 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-1.5 rounded-lg text-white font-bold text-xs flex items-center justify-center space-x-1 shadow-sm transition-all hover:opacity-90"
                style={{ backgroundColor: currentTheme.palette.accent }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Assert Symbolic Triple</span>
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Vector Space 2D Embeddings View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Vector Scatter Plot */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 rounded-xl border relative" style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}>
            <svg width="340" height="280" viewBox="0 0 280 260" className="overflow-visible select-none">
              {/* Grid axes */}
              <line x1="30" y1="130" x2="250" y2="130" stroke="#374151" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="140" y1="20" x2="140" y2="240" stroke="#374151" strokeWidth="1" strokeDasharray="2 2" />

              {/* Vector Points */}
              {vectorClusters.map(p => {
                const isSelected = selectedVectorPair.includes(p.id);
                return (
                  <g 
                    key={p.id} 
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedVectorPair(prev => {
                        if (prev.includes(p.id)) return prev;
                        return [prev[1] || p.id, p.id];
                      });
                    }}
                  >
                    <circle 
                      cx={p.x} 
                      cy={p.y} 
                      r="9" 
                      fill={p.color} 
                      stroke={isSelected ? '#FFFFFF' : '#18181B'} 
                      strokeWidth={isSelected ? 2.5 : 1}
                      className="drop-shadow-sm hover:scale-125 transition-transform"
                    />
                    <text x={p.x} y={p.y + 16} fill="#A1A1AA" fontSize="8" textAnchor="middle" fontFamily="monospace">
                      {p.text}
                    </text>
                  </g>
                );
              })}

              {/* Line between selected vector pair */}
              {selectedVectorPair.length === 2 && (() => {
                const p1 = vectorClusters.find(v => v.id === selectedVectorPair[0]);
                const p2 = vectorClusters.find(v => v.id === selectedVectorPair[1]);
                if (!p1 || !p2) return null;
                return (
                  <line 
                    x1={p1.x} 
                    y1={p1.y} 
                    x2={p2.x} 
                    y2={p2.y} 
                    stroke="#F59E0B" 
                    strokeWidth="2" 
                    strokeDasharray="3 3"
                    className="animate-pulse"
                  />
                );
              })()}
            </svg>

            <div className="mt-2 text-center text-xs opacity-75 font-mono">
              Click two points to calculate their semantic Cosine Similarity metric.
            </div>
          </div>

          {/* Metric Box */}
          <div className="lg:col-span-5 space-y-4 font-mono text-xs">
            <div className="p-4 rounded-xl border space-y-3" style={{ backgroundColor: currentTheme.palette.surfaceRaised, borderColor: currentTheme.palette.border }}>
              <span className="font-bold flex items-center space-x-1.5">
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Cosine Distance Matrix</span>
              </span>

              <div className="p-3 rounded-lg border text-center space-y-1" style={{ backgroundColor: currentTheme.palette.surface, borderColor: currentTheme.palette.border }}>
                <span className="text-[10px] opacity-60 block">Semantic Cosine Similarity cos(θ)</span>
                <span className="text-2xl font-bold text-amber-400">
                  {getCosineSimilarity()}
                </span>
                <span className="text-[10px] opacity-50 block">High Semantic Proximity (&gt; 0.85)</span>
              </div>

              <div className="space-y-1.5 text-[11px] opacity-80">
                <div className="flex justify-between">
                  <span className="opacity-60">Vector 1:</span>
                  <span className="font-bold text-indigo-300 truncate max-w-[150px]">
                    {vectorClusters.find(v => v.id === selectedVectorPair[0])?.text || 'Point A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Vector 2:</span>
                  <span className="font-bold text-emerald-300 truncate max-w-[150px]">
                    {vectorClusters.find(v => v.id === selectedVectorPair[1])?.text || 'Point B'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
