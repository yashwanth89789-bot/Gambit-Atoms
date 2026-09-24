import React, { useState } from 'react';
import { Database, UploadCloud, Search, CheckCircle2, RefreshCw, Network, ChevronRight, FileText, Hexagon, Eye } from 'lucide-react';

interface RAGNode {
  id: string;
  content: string;
  score: number;
}

export const RAGDashboard: React.FC = () => {
  const [sourceText, setSourceText] = useState('');
  const [isIndexing, setIsIndexing] = useState(false);
  const [isIndexed, setIsIndexed] = useState(false);
  
  const [query, setQuery] = useState('');
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [retrievedNodes, setRetrievedNodes] = useState<RAGNode[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'retrieve'>('upload');

  const handleIndex = () => {
    if (!sourceText.trim()) return;
    setIsIndexing(true);
    setTimeout(() => {
      setIsIndexing(false);
      setIsIndexed(true);
      setActiveTab('retrieve');
    }, 2000);
  };

  const handleRetrieve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !isIndexed) return;
    
    setIsRetrieving(true);
    setRetrievedNodes([]);

    setTimeout(() => {
      const words = sourceText.split(/\s+/);
      const chunks: RAGNode[] = [];
      const numChunks = Math.min(4, Math.max(1, Math.floor(words.length / 10)));
      
      for (let i = 0; i < numChunks; i++) {
        const start = Math.floor(Math.random() * Math.max(1, words.length - 15));
        const snippet = words.slice(start, start + 15).join(' ');
        chunks.push({
          id: `node-${Math.random().toString(36).substring(2, 8)}`,
          content: snippet + (start + 15 < words.length ? '...' : ''),
          score: 0.75 + (Math.random() * 0.24)
        });
      }
      
      setRetrievedNodes(chunks.sort((a, b) => b.score - a.score));
      setIsRetrieving(false);
    }, 1500);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="border-b border-gray-200 p-4 bg-gray-50 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center space-x-2">
          <Network className="w-4 h-4 text-emerald-600" />
          <span>Retrieval-Augmented Generation</span>
        </h2>
        <div className="flex bg-gray-200/50 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
              activeTab === 'upload' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Index Data
          </button>
          <button
            onClick={() => setActiveTab('retrieve')}
            disabled={!isIndexed}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
              !isIndexed ? 'opacity-50 cursor-not-allowed' : activeTab === 'retrieve' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Retrieve Context
          </button>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {activeTab === 'upload' ? (
          <div className="flex-1 flex flex-col space-y-4 animate-fadeIn h-full">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Source Documentation Ingestion</label>
              {isIndexed && <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> Vectorized</span>}
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Paste raw documentation, API specs, or knowledge base articles here for vectorization..."
                className="w-full h-full bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
              
              <div className="w-full h-full bg-[#111111] border border-gray-800 rounded-lg p-4 overflow-y-auto font-mono text-xs text-gray-300 shadow-inner flex flex-col">
                <div className="flex items-center space-x-2 border-b border-gray-800 pb-2 mb-2 text-gray-500 uppercase tracking-widest text-[10px] font-bold shrink-0">
                  <FileText className="w-3 h-3" />
                  <span>Document Preview Pane</span>
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar">
                  {sourceText.trim() ? (
                    <div className="whitespace-pre-wrap break-words leading-relaxed">{sourceText}</div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-2">
                      <Eye className="w-6 h-6 opacity-50" />
                      <span>Awaiting source data stream...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleIndex}
              disabled={isIndexing || !sourceText.trim()}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold tracking-widest uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shrink-0"
            >
              {isIndexing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Embeddings...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Vectorize & Index</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col space-y-6 animate-fadeIn">
            <form onSubmit={handleRetrieve} className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Agent Semantic Query</label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., What are the deployment constraints?"
                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isRetrieving || !query.trim()}
                  className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {isRetrieving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                  <span>Retrieve</span>
                </button>
              </div>
            </form>

            <div className="flex-1 flex flex-col">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center space-x-2">
                <Hexagon className="w-3.5 h-3.5" />
                <span>Retrieved Context Nodes</span>
              </h3>
              
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-y-auto space-y-3">
                {isRetrieving ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-3 text-emerald-600">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    <span className="text-xs font-mono uppercase tracking-widest">Traversing Vector Space...</span>
                  </div>
                ) : retrievedNodes.length > 0 ? (
                  retrievedNodes.map((node, idx) => (
                    <div key={node.id} className="bg-white border border-emerald-100 rounded-md p-3 shadow-sm animate-fadeIn" style={{ animationDelay: `${idx * 150}ms` }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center">
                          <FileText className="w-3 h-3 mr-1" />
                          {node.id}
                        </span>
                        <span className="text-[10px] font-mono text-gray-500">
                          Sim Score: {(node.score).toFixed(4)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed font-mono border-l-2 border-emerald-300 pl-3 py-1">
                        {node.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
                    <Database className="w-8 h-8 opacity-50" />
                    <span className="text-xs font-mono uppercase tracking-widest">No context retrieved yet</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
