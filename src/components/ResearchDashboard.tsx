import React, { useState } from 'react';
import { BookOpen, Award, CheckCircle2, Clock, BarChart3, TrendingUp, Users, FileText, ArrowRight, LineChart as LineChartIcon, StickyNote, Plus, Trash2, Sliders, Bell, AlertTriangle, X, Sparkles, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface ResearchDashboardProps {
  onSelectProject: (topic: string, methodology: string, keywords: string) => void;
}

export const ResearchDashboard: React.FC<ResearchDashboardProps> = ({ onSelectProject }) => {
  const [timeRange, setTimeRange] = useState<'6w' | '12w' | 'all'>('6w');
  const [notes, setNotes] = useState<Array<{ id: string; milestone: string; text: string; date: string }>>([
    { id: '1', milestone: 'Week 2', text: 'Initial baseline convergence achieved on VLA model training run.', date: 'Aug 10, 2026' },
    { id: '2', milestone: 'Week 4', text: 'Zero-copy InfiniBand RDMA sharding successfully benchmarked across 1,024 H100 nodes.', date: 'Aug 24, 2026' },
    { id: '3', milestone: 'Week 6', text: 'Submitted final camera-ready manuscript to NeurIPS 2026 review board.', date: 'Sep 07, 2026' },
  ]);
  const [newMilestone, setNewMilestone] = useState('Week 6');
  const [newNoteText, setNewNoteText] = useState('');

  // Threshold alert states
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [minProgressThreshold, setMinProgressThreshold] = useState(50);
  const [minScoreThreshold, setMinScoreThreshold] = useState(9.0);
  const [minHIndexThreshold, setMinHIndexThreshold] = useState(25);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const newNote = {
      id: Date.now().toString(),
      milestone: newMilestone,
      text: newNoteText.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setNotes([newNote, ...notes]);
    setNewNoteText('');
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const historicalProgressData = [
    { week: 'Week 1', vlaModel: 15, zeroCopy: 20, robotics: 40, formalVerif: 10 },
    { week: 'Week 2', vlaModel: 30, zeroCopy: 35, robotics: 60, formalVerif: 20 },
    { week: 'Week 3', vlaModel: 50, zeroCopy: 45, robotics: 75, formalVerif: 25 },
    { week: 'Week 4', vlaModel: 65, zeroCopy: 55, robotics: 85, formalVerif: 30 },
    { week: 'Week 5', vlaModel: 78, zeroCopy: 58, robotics: 95, formalVerif: 35 },
    { week: 'Week 6', vlaModel: 85, zeroCopy: 60, robotics: 100, formalVerif: 40 },
  ];

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);

  const [currentProjects, setCurrentProjects] = useState([
    {
      id: 'proj-1',
      title: 'Autonomous Chain-of-Agents VLA Models with Self-Evolving Reward Functions',
      venue: 'NeurIPS 2026 (Target)',
      status: 'Peer Review',
      progress: 85,
      score: '9.6/10',
      numericScore: 9.6,
      lastUpdated: '2 hours ago',
      topic: 'Autonomous Chain-of-Agents Vision Language-Action Models with Self-Evolving Reward Functions',
      methodology: 'Reinforcement learning from AI feedback (RLAIF) combined with continuous evolutionary neural architecture search.',
      keywords: 'VLA, Chain-of-Agents, Evolutionary Algorithms, Agentic RAG'
    },
    {
      id: 'proj-2',
      title: 'Zero-Copy Paged Attention Sharding for Distributed Cluster H100s',
      venue: 'ICML 2026',
      status: 'Drafting',
      progress: 60,
      score: '8.9/10',
      numericScore: 8.9,
      lastUpdated: '1 day ago',
      topic: 'Zero-Copy Paged Attention Sharding for Distributed Cluster H100s',
      methodology: 'Direct RoCE v2 InfiniBand RDMA memory pooling with dynamic KV-cache eviction policies.',
      keywords: 'Distributed Systems, PagedAttention, H100, RoCE v2'
    },
    {
      id: 'proj-3',
      title: 'Multi-Modal Test-Time Reasoning for Robotic Dexterous Manipulation',
      venue: 'CVPR 2026',
      status: 'Accepted',
      progress: 100,
      score: '9.8/10',
      numericScore: 9.8,
      lastUpdated: '3 days ago',
      topic: 'Multi-Modal Test-Time Reasoning for Robotic Dexterous Manipulation',
      methodology: 'Monte Carlo Tree Search over vision-language action tokens with real-time feedback loops.',
      keywords: 'Robotics, MCTS, Test-Time Compute, Dexterous Manipulation'
    },
    {
      id: 'proj-4',
      title: 'Self-Correcting Code Synthesis via Formal Verification Co-Pilots',
      venue: 'ICSE 2026',
      status: 'In Experimentation',
      progress: 40,
      score: '8.5/10',
      numericScore: 8.5,
      lastUpdated: '5 days ago',
      topic: 'Self-Correcting Code Synthesis via Formal Verification Co-Pilots',
      methodology: 'Combining symbolic execution engines with LLM-generated invariants for automatic bug patching.',
      keywords: 'Formal Verification, Program Synthesis, Automated Debugging'
    }
  ]);

  const handleOptimizeCluster = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setIsOptimized(true);
      setCurrentProjects(prev =>
        prev.map(p =>
          p.id === 'proj-4'
            ? { ...p, progress: 80, score: '9.3/10', numericScore: 9.3, status: 'Peer Review', lastUpdated: 'Just now' }
            : p
        )
      );
    }, 900);
  };

  // Count missed thresholds
  const missedProjectsCount = currentProjects.filter(
    p => p.progress < minProgressThreshold || p.numericScore < minScoreThreshold
  ).length;

  const kpis = [
    {
      title: 'Active Research Projects',
      value: '4',
      change: '+1 this week',
      isPositive: true,
      icon: BookOpen,
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      title: 'Published Pre-Prints',
      value: '18',
      change: '+3 this month',
      isPositive: true,
      icon: FileText,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    },
    {
      title: 'Average Peer Review Score',
      value: '9.4 / 10',
      change: minScoreThreshold > 9.4 ? 'Target missed threshold' : 'Top 2% NeurIPS threshold',
      isPositive: minScoreThreshold <= 9.4,
      icon: Award,
      color: minScoreThreshold > 9.4 ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-purple-600 bg-purple-50 border-purple-200',
      missed: minScoreThreshold > 9.4
    },
    {
      title: 'Citation Impact (H-Index)',
      value: '28',
      change: minHIndexThreshold > 28 ? `Target missed (${minHIndexThreshold})` : '+14% citation velocity',
      isPositive: minHIndexThreshold <= 28,
      icon: TrendingUp,
      color: minHIndexThreshold > 28 ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-amber-600 bg-amber-50 border-amber-200',
      missed: minHIndexThreshold > 28
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Peer Review':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Drafting':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Alert Configuration Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#111111] tracking-tight">Research Lab Performance & Metrics</h2>
          <p className="text-xs text-gray-500 mt-0.5">Real-time KPI tracking, historical trajectories, and automated alert thresholds</p>
        </div>
        <div className="flex items-center space-x-3">
          {missedProjectsCount > 0 && (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>{missedProjectsCount} Project Alert{missedProjectsCount > 1 ? 's' : ''}</span>
            </div>
          )}
          <button
            onClick={() => setIsConfigModalOpen(true)}
            className="px-4 py-2 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-md flex items-center space-x-2 transition-colors shadow-xs"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Configure Alert Thresholds</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-3 relative overflow-hidden">
              {kpi.missed && (
                <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-mono px-2 py-0.5 rounded-bl font-bold">
                  TARGET MISSED
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{kpi.title}</span>
                <div className={`p-2 rounded-md border ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-[#111111] font-mono tracking-tight">{kpi.value}</div>
              <div className={`text-[11px] font-medium flex items-center space-x-1 ${kpi.missed ? 'text-amber-700' : 'text-emerald-700'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${kpi.missed ? 'bg-amber-500' : 'bg-emerald-500 animate-ping'}`}></span>
                <span>{kpi.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Historical Progress Trend Graph */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <LineChartIcon className="w-4 h-4 text-gray-700" />
              <h2 className="text-base font-bold text-[#111111] tracking-tight">Historical Research Progress & Trajectory</h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Tracking percentage milestone completion across active papers over time</p>
          </div>
          <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-md text-xs font-medium">
            <button
              onClick={() => setTimeRange('6w')}
              className={`px-3 py-1 rounded ${timeRange === '6w' ? 'bg-white text-black shadow-xs font-bold' : 'text-gray-600 hover:text-black'}`}
            >
              6 Weeks
            </button>
            <button
              onClick={() => setTimeRange('12w')}
              className={`px-3 py-1 rounded ${timeRange === '12w' ? 'bg-white text-black shadow-xs font-bold' : 'text-gray-600 hover:text-black'}`}
            >
              12 Weeks
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1 rounded ${timeRange === 'all' ? 'bg-white text-black shadow-xs font-bold' : 'text-gray-600 hover:text-black'}`}
            >
              All
            </button>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalProgressData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="week" stroke="#9CA3AF" fontSize={11} tickLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} domain={[0, 100]} unit="%" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111111', borderColor: '#111111', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                formatter={(value) => <span className="text-gray-700 font-medium">{value}</span>}
              />
              <Line type="monotone" dataKey="vlaModel" name="VLA Chain-of-Agents" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="zeroCopy" name="Zero-Copy PagedAttention" stroke="#059669" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="robotics" name="Robotic MCTS Reasoning" stroke="#7C3AED" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="formalVerif" name="Formal Verification Co-Pilot" stroke="#D97706" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Automated Trend Anomaly Analysis Panel */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">Automated Trend & Anomaly Analysis</h3>
            </div>
            <span className="text-[11px] font-mono text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
              Rolling Average Deviation: ±15% threshold
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#F9FAFB] border border-blue-200 rounded-lg p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-800">
                  Week 3 • VLA Chain-of-Agents
                </span>
                <span className="text-[10px] font-bold text-blue-700 font-mono">+20% Acceleration Spike</span>
              </div>
              <p className="text-xs text-gray-700 font-medium leading-relaxed">
                Rapid convergence observed during multi-modal reward function alignment, deviating positively from rolling 3-week average.
              </p>
            </div>

            <div className="bg-[#F9FAFB] border border-purple-200 rounded-lg p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-100 text-purple-800">
                  Week 6 • Robotic MCTS
                </span>
                <span className="text-[10px] font-bold text-purple-700 font-mono">100% Completion Outlier</span>
              </div>
              <p className="text-xs text-gray-700 font-medium leading-relaxed">
                Dexterous manipulation benchmark successfully completed ahead of schedule, marking an optimal milestone outlier.
              </p>
            </div>
          </div>
        </div>

        {/* AI Insights & Velocity Bottleneck Panel */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">AI Velocity & Bottleneck Analysis</h3>
            </div>
            <span className="text-[11px] font-mono text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200 font-semibold">
              ApexAI Copilot Active
            </span>
          </div>

          <div className="bg-gradient-to-r from-purple-50/60 via-blue-50/30 to-white border border-purple-200 rounded-lg p-4 space-y-3">
            <p className="text-xs text-gray-800 leading-relaxed font-medium">
              {isOptimized ? (
                <span>
                  <strong className="text-emerald-700">Cluster Optimization Successful!</strong> Formal Verification Co-Pilot milestone progress has been accelerated to <strong className="text-black">80%</strong> with H100 thread re-allocation. Bottleneck successfully resolved and status updated to Peer Review.
                </span>
              ) : (
                <span>
                  Based on historical telemetry across the 4 active research papers, overall lab velocity is trending <span className="font-bold text-emerald-700">14% above projected NeurIPS/ICML deadlines</span>. The primary accelerator is the <span className="font-bold text-blue-700">VLA Chain-of-Agents</span> model with strong gradient convergence. However, a localized bottleneck is identified in the <span className="font-bold text-amber-700">Formal Verification Co-Pilot</span> track (stagnant at 40% milestone completion due to complex symbolic loop invariants), requiring priority cluster resource allocation.
                </span>
              )}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-purple-100/80">
              <div className="flex items-center space-x-4 text-[11px] font-mono text-gray-600">
                <span>Avg Velocity: <strong className="text-black">+18.2pts / wk</strong></span>
                <span>Bottleneck Risk: <strong className={isOptimized ? "text-emerald-700" : "text-amber-700"}>{isOptimized ? "Resolved (Low)" : "Medium (Formal Verif)"}</strong></span>
              </div>
              <button
                onClick={handleOptimizeCluster}
                disabled={isOptimizing || isOptimized}
                className="px-3.5 py-1.5 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded shadow-xs transition-colors flex items-center space-x-1.5 disabled:opacity-60"
              >
                {isOptimizing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Optimizing Cluster...</span>
                  </>
                ) : isOptimized ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Cluster Optimized</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Optimize Cluster Allocation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Notes Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <StickyNote className="w-4 h-4 text-gray-700" />
              <h2 className="text-base font-bold text-[#111111] tracking-tight">Project Milestone Context & Notes</h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Record textual observations, breakthroughs, and feedback for specific timeline milestones</p>
          </div>
          <div className="text-xs font-mono text-gray-600 bg-gray-50 px-3 py-1.5 rounded border border-gray-200">
            {notes.length} Recorded Note{notes.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Add Note Form */}
        <form onSubmit={handleAddNote} className="bg-[#F9FAFB] border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Add New Milestone Note</div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <select
              value={newMilestone}
              onChange={(e) => setNewMilestone(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded text-xs font-medium focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="Week 1">Week 1 Milestone</option>
              <option value="Week 2">Week 2 Milestone</option>
              <option value="Week 3">Week 3 Milestone</option>
              <option value="Week 4">Week 4 Milestone</option>
              <option value="Week 5">Week 5 Milestone</option>
              <option value="Week 6">Week 6 Milestone</option>
              <option value="General">General Milestone</option>
            </select>
            <input
              type="text"
              placeholder="Enter note context, breakthrough, or checkpoint details..."
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              className="sm:col-span-3 px-3 py-2 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newNoteText.trim()}
              className="px-4 py-2 bg-black hover:bg-gray-800 disabled:opacity-50 text-white font-bold text-xs rounded flex items-center space-x-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save Note</span>
            </button>
          </div>
        </form>

        {/* Notes List */}
        <div className="space-y-3">
          {notes.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs">No milestone notes added yet. Use the form above to add one.</div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-start justify-between gap-4 hover:border-gray-300 transition-all">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-gray-100 border border-gray-200 text-gray-800">
                      {note.milestone}
                    </span>
                    <span className="text-[11px] text-gray-400">{note.date}</span>
                  </div>
                  <p className="text-xs text-gray-800 leading-relaxed font-medium">
                    {note.text}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                  title="Delete Note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Projects Progress Table / Grid */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-base font-bold text-[#111111] tracking-tight">Active Research Pipeline & Progress</h2>
            <p className="text-xs text-gray-500 mt-0.5">Track milestones, simulated review scores, and publication venues</p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono text-gray-600 bg-gray-50 px-3 py-1.5 rounded border border-gray-200">
            <BarChart3 className="w-3.5 h-3.5 text-gray-500" />
            <span>4 Active Manuscripts</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {currentProjects.map((proj) => {
            const isMissed = proj.progress < minProgressThreshold || proj.numericScore < minScoreThreshold;
            return (
              <div 
                key={proj.id}
                className={`border rounded-lg p-5 transition-all space-y-4 group ${isMissed ? 'bg-amber-50/30 border-amber-300' : 'bg-[#F9FAFB] border-gray-200 hover:border-black'}`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(proj.status)}`}>
                        {proj.status}
                      </span>
                      <span className="text-xs font-mono text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                        {proj.venue}
                      </span>
                      <span className="text-[11px] text-gray-400">Updated {proj.lastUpdated}</span>
                      {isMissed && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>Below Threshold Alert</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-[#111111] group-hover:text-black tracking-tight">
                      {proj.title}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="text-right">
                      <div className={`text-xs font-mono font-bold ${proj.numericScore < minScoreThreshold ? 'text-amber-700 font-extrabold' : 'text-gray-900'}`}>
                        Score: {proj.score}
                      </div>
                      <div className="text-[10px] text-gray-500">Peer Review Avg</div>
                    </div>
                    <button
                      onClick={() => onSelectProject(proj.topic, proj.methodology, proj.keywords)}
                      className="px-3.5 py-2 rounded-md bg-black hover:bg-gray-800 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-xs"
                    >
                      <span>Load in Publisher</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-gray-500">Milestone Progress</span>
                    <span className={`font-mono ${proj.progress < minProgressThreshold ? 'text-amber-700 font-bold' : 'text-gray-900'}`}>
                      {proj.progress}% {proj.progress < minProgressThreshold ? `(Target: ${minProgressThreshold}%)` : ''}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${proj.progress < minProgressThreshold ? 'bg-amber-500' : 'bg-black'}`}
                      style={{ width: `${proj.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Configuration Modal */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gray-100 rounded-lg text-black">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Configure Research Metric Thresholds</h3>
                  <p className="text-xs text-gray-500">Set alert triggers for progress milestones and peer review scores</p>
                </div>
              </div>
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-black rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Minimum Milestone Progress (%)</span>
                  <span className="font-mono text-black font-extrabold">{minProgressThreshold}%</span>
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={minProgressThreshold}
                  onChange={(e) => setMinProgressThreshold(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
                <p className="text-[11px] text-gray-500">Projects with completion percentage below this will trigger visual alert banners.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Minimum Peer Review Score Target</span>
                  <span className="font-mono text-black font-extrabold">{minScoreThreshold.toFixed(1)} / 10</span>
                </label>
                <input
                  type="range"
                  min="8.0"
                  max="9.9"
                  step="0.1"
                  value={minScoreThreshold}
                  onChange={(e) => setMinScoreThreshold(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
                <p className="text-[11px] text-gray-500">Simulated review scores falling below this value are flagged as missed targets.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Minimum Target H-Index Impact</span>
                  <span className="font-mono text-black font-extrabold">{minHIndexThreshold}</span>
                </label>
                <input
                  type="range"
                  min="15"
                  max="40"
                  step="1"
                  value={minHIndexThreshold}
                  onChange={(e) => setMinHIndexThreshold(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
                <p className="text-[11px] text-gray-500">Required research citation velocity benchmark for institutional review.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">
                {missedProjectsCount > 0 ? `${missedProjectsCount} active alert(s) detected` : 'All projects meeting targets'}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsConfigModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsConfigModalOpen(false)}
                  className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  Save Thresholds
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

