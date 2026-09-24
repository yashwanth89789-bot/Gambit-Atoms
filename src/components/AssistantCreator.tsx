import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Brain, Cpu, Zap, Lock, Code2, 
  Play, Save, CheckCircle2, ShieldAlert, Terminal, 
  Send, Activity, Settings2, Database, Globe, 
  Layers, Sliders, FileCode, Check, Trash2, Plus
} from 'lucide-react';
import { useAdaptiveTheme } from '../context/ThemeContext';
import { AgentArchetypeSelector, AGENT_ARCHETYPES, AgentArchetype } from './assistant/AgentArchetypeSelector';
import { AgentCognitiveSliders } from './assistant/AgentCognitiveSliders';
import { AgentToolMatrix, AVAILABLE_TOOLS } from './assistant/AgentToolMatrix';
import { AgentPromptEditor } from './assistant/AgentPromptEditor';
import { AgentSandboxSimulator } from './assistant/AgentSandboxSimulator';
import { AgentExportHub } from './assistant/AgentExportHub';

export interface SavedAgent {
  id: string;
  name: string;
  designation: string;
  archetypeId: string;
  model: string;
  temperature: number;
  topP: number;
  reasoningSteps: number;
  autonomyLevel: 'Supervised' | 'Semi-Autonomous' | 'Full Autonomous';
  confidenceThreshold: number;
  memoryHorizon: 'Short-Term' | 'Hybrid Vector' | 'Infinite Graph';
  selectedTools: string[];
  systemPrompt: string;
  createdAt: string;
}

export const AssistantCreator: React.FC = () => {
  const { currentTheme } = useAdaptiveTheme();

  // Active View Tab
  const [activeTab, setActiveTab] = useState<'forge' | 'simulator' | 'export' | 'roster'>('forge');

  // Agent State
  const [agentName, setAgentName] = useState<string>('Cyber Sentinel');
  const [designation, setDesignation] = useState<string>('AEGIS-9');
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<string>('cyber-sentinel');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.1-pro-preview');
  const [temperature, setTemperature] = useState<number>(0.15);
  const [topP, setTopP] = useState<number>(0.95);
  const [reasoningSteps, setReasoningSteps] = useState<number>(5);
  const [autonomyLevel, setAutonomyLevel] = useState<'Supervised' | 'Semi-Autonomous' | 'Full Autonomous'>('Semi-Autonomous');
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(95);
  const [memoryHorizon, setMemoryHorizon] = useState<'Short-Term' | 'Hybrid Vector' | 'Infinite Graph'>('Hybrid Vector');
  const [selectedTools, setSelectedTools] = useState<string[]>(['fs.read', 'bash.exec', 'crypto.signPayload', 'rag.vectorSearch']);
  const [systemPrompt, setSystemPrompt] = useState<string>(AGENT_ARCHETYPES[0].systemPrompt);

  // Saved Agents Roster (Local Persistence)
  const [savedAgents, setSavedAgents] = useState<SavedAgent[]>(() => {
    try {
      const stored = localStorage.getItem('apex_saved_agents');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'default-1',
        name: 'Cyber Sentinel',
        designation: 'AEGIS-9',
        archetypeId: 'cyber-sentinel',
        model: 'gemini-3.1-pro-preview',
        temperature: 0.15,
        topP: 0.95,
        reasoningSteps: 5,
        autonomyLevel: 'Semi-Autonomous',
        confidenceThreshold: 95,
        memoryHorizon: 'Hybrid Vector',
        selectedTools: ['fs.read', 'bash.exec', 'crypto.signPayload', 'rag.vectorSearch'],
        systemPrompt: AGENT_ARCHETYPES[0].systemPrompt,
        createdAt: new Date().toLocaleDateString(),
      },
    ];
  });

  const [saveToast, setSaveToast] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('apex_saved_agents', JSON.stringify(savedAgents));
  }, [savedAgents]);

  // Handle Archetype Selection
  const handleSelectArchetype = (arch: AgentArchetype) => {
    setSelectedArchetypeId(arch.id);
    setAgentName(arch.name);
    setDesignation(arch.designation);
    setSelectedModel(arch.model);
    setTemperature(arch.temperature);
    setAutonomyLevel(arch.autonomyLevel);
    setSelectedTools(arch.recommendedTools);
    setSystemPrompt(arch.systemPrompt);
  };

  // Tool Toggle Handlers
  const handleToggleTool = (toolId: string) => {
    setSelectedTools(prev =>
      prev.includes(toolId) ? prev.filter(id => id !== toolId) : [...prev, toolId]
    );
  };

  const handleSelectAllTools = () => {
    setSelectedTools(AVAILABLE_TOOLS.map(t => t.id));
  };

  const handleClearAllTools = () => {
    setSelectedTools([]);
  };

  // Save Agent to Roster
  const handleSaveToRoster = () => {
    const newAgent: SavedAgent = {
      id: Math.random().toString(36).substring(2, 9),
      name: agentName,
      designation,
      archetypeId: selectedArchetypeId,
      model: selectedModel,
      temperature,
      topP,
      reasoningSteps,
      autonomyLevel,
      confidenceThreshold,
      memoryHorizon,
      selectedTools,
      systemPrompt,
      createdAt: new Date().toLocaleDateString(),
    };

    setSavedAgents(prev => [newAgent, ...prev.filter(a => a.designation !== designation)]);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleLoadSavedAgent = (agent: SavedAgent) => {
    setAgentName(agent.name);
    setDesignation(agent.designation);
    setSelectedArchetypeId(agent.archetypeId);
    setSelectedModel(agent.model);
    setTemperature(agent.temperature);
    setTopP(agent.topP);
    setReasoningSteps(agent.reasoningSteps);
    setAutonomyLevel(agent.autonomyLevel);
    setConfidenceThreshold(agent.confidenceThreshold);
    setMemoryHorizon(agent.memoryHorizon);
    setSelectedTools(agent.selectedTools);
    setSystemPrompt(agent.systemPrompt);
    setActiveTab('forge');
  };

  const handleDeleteSavedAgent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedAgents(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div 
        className="border rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all"
        style={{
          backgroundColor: currentTheme.palette.surface,
          borderColor: currentTheme.palette.border,
          color: currentTheme.palette.textPrimary,
        }}
      >
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider" style={{ backgroundColor: `${currentTheme.palette.accent}15`, color: currentTheme.palette.accent, borderColor: `${currentTheme.palette.accent}30` }}>
            <Cpu className="w-3.5 h-3.5 animate-pulse" />
            <span>Autonomous Entity Forge • Neural Architect</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Autonomous Agent & Assistant Creator</h1>
          <p className="text-xs sm:text-sm max-w-2xl opacity-75 leading-relaxed">
            Synthesize, constrain, and test specialized cognitive agents. Configure deterministic execution parameters, tool invocation matrices, and zero-trust safety guardrails.
          </p>
        </div>

        {/* Forge Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSaveToRoster}
            className="px-4 py-2.5 rounded-xl text-white font-mono font-bold text-xs flex items-center space-x-2 shadow-sm transition-all hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: currentTheme.palette.accent }}
          >
            {saveToast ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
            <span>{saveToast ? 'Saved to Memory!' : 'Deploy to Roster'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div 
        className="flex items-center space-x-1.5 p-1.5 rounded-xl border overflow-x-auto text-xs font-mono font-bold"
        style={{
          backgroundColor: currentTheme.palette.surface,
          borderColor: currentTheme.palette.border,
        }}
      >
        {[
          { id: 'forge' as const, label: 'Identity & Neural Matrix', icon: Sliders },
          { id: 'simulator' as const, label: 'Sandbox Simulator', icon: Terminal },
          { id: 'export' as const, label: 'Framework Export Hub', icon: FileCode },
          { id: 'roster' as const, label: `Active Roster (${savedAgents.length})`, icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-lg flex items-center space-x-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive ? 'shadow-xs scale-100' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: isActive ? currentTheme.palette.surfaceRaised : 'transparent',
                color: isActive ? currentTheme.palette.accent : currentTheme.palette.textPrimary,
                borderWidth: isActive ? 1 : 0,
                borderColor: isActive ? currentTheme.palette.borderStrong : 'transparent',
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* FORGE TAB */}
      {activeTab === 'forge' && (
        <div className="space-y-8">
          {/* Identity & Designation Card */}
          <div 
            className="border rounded-2xl p-6 shadow-sm space-y-6 transition-all"
            style={{
              backgroundColor: currentTheme.palette.surface,
              borderColor: currentTheme.palette.border,
              color: currentTheme.palette.textPrimary,
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase opacity-75 block">
                  Agent Persona Name
                </label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm font-bold font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  style={{
                    backgroundColor: currentTheme.palette.surfaceRaised,
                    borderColor: currentTheme.palette.borderStrong,
                    color: currentTheme.palette.textPrimary,
                  }}
                  placeholder="e.g. Cyber Defense Sentinel"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase opacity-75 block">
                  System Designation / Codename
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm font-bold font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-indigo-400"
                  style={{
                    backgroundColor: currentTheme.palette.surfaceRaised,
                    borderColor: currentTheme.palette.borderStrong,
                  }}
                  placeholder="e.g. AEGIS-9"
                />
              </div>
            </div>

            {/* Archetype Selector */}
            <AgentArchetypeSelector
              selectedArchetypeId={selectedArchetypeId}
              onSelectArchetype={handleSelectArchetype}
            />
          </div>

          {/* Cognitive Sliders & Parameters */}
          <div 
            className="border rounded-2xl p-6 shadow-sm transition-all"
            style={{
              backgroundColor: currentTheme.palette.surface,
              borderColor: currentTheme.palette.border,
              color: currentTheme.palette.textPrimary,
            }}
          >
            <AgentCognitiveSliders
              selectedModel={selectedModel}
              onChangeModel={setSelectedModel}
              temperature={temperature}
              onChangeTemperature={setTemperature}
              topP={topP}
              onChangeTopP={setTopP}
              reasoningSteps={reasoningSteps}
              onChangeReasoningSteps={setReasoningSteps}
              autonomyLevel={autonomyLevel}
              onChangeAutonomyLevel={setAutonomyLevel}
              confidenceThreshold={confidenceThreshold}
              onChangeConfidenceThreshold={setConfidenceThreshold}
              memoryHorizon={memoryHorizon}
              onChangeMemoryHorizon={setMemoryHorizon}
            />
          </div>

          {/* Tool Matrix */}
          <div 
            className="border rounded-2xl p-6 shadow-sm transition-all"
            style={{
              backgroundColor: currentTheme.palette.surface,
              borderColor: currentTheme.palette.border,
              color: currentTheme.palette.textPrimary,
            }}
          >
            <AgentToolMatrix
              selectedTools={selectedTools}
              onToggleTool={handleToggleTool}
              onSelectAll={handleSelectAllTools}
              onClearAll={handleClearAllTools}
            />
          </div>

          {/* Prompt Editor */}
          <div 
            className="border rounded-2xl p-6 shadow-sm transition-all"
            style={{
              backgroundColor: currentTheme.palette.surface,
              borderColor: currentTheme.palette.border,
              color: currentTheme.palette.textPrimary,
            }}
          >
            <AgentPromptEditor
              prompt={systemPrompt}
              onChangePrompt={setSystemPrompt}
              agentName={agentName}
              designation={designation}
            />
          </div>
        </div>
      )}

      {/* SIMULATOR TAB */}
      {activeTab === 'simulator' && (
        <AgentSandboxSimulator
          agentName={agentName}
          designation={designation}
          model={selectedModel}
          temperature={temperature}
          selectedTools={selectedTools}
          systemPrompt={systemPrompt}
        />
      )}

      {/* EXPORT TAB */}
      {activeTab === 'export' && (
        <AgentExportHub
          agentName={agentName}
          designation={designation}
          model={selectedModel}
          temperature={temperature}
          topP={topP}
          reasoningSteps={reasoningSteps}
          autonomyLevel={autonomyLevel}
          confidenceThreshold={confidenceThreshold}
          memoryHorizon={memoryHorizon}
          selectedTools={selectedTools}
          systemPrompt={systemPrompt}
        />
      )}

      {/* ROSTER TAB */}
      {activeTab === 'roster' && (
        <div 
          className="border rounded-2xl p-6 shadow-sm space-y-6 transition-all"
          style={{
            backgroundColor: currentTheme.palette.surface,
            borderColor: currentTheme.palette.border,
            color: currentTheme.palette.textPrimary,
          }}
        >
          <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: currentTheme.palette.border }}>
            <div>
              <h3 className="font-bold text-base tracking-tight">Active Entity Memory Roster</h3>
              <p className="text-xs opacity-70">Persisted locally in memory for instant switching and deployment</p>
            </div>
            <button
              onClick={() => {
                handleSelectArchetype(AGENT_ARCHETYPES[0]);
                setActiveTab('forge');
              }}
              className="px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center space-x-1.5 hover:bg-white/5 transition-colors"
              style={{ borderColor: currentTheme.palette.borderStrong }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Agent</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedAgents.map((agent) => {
              const isCurrent = agent.designation === designation;
              return (
                <div
                  key={agent.id}
                  onClick={() => handleLoadSavedAgent(agent)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isCurrent ? 'ring-2 border-indigo-400' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: currentTheme.palette.surfaceRaised,
                    borderColor: isCurrent ? currentTheme.palette.accent : currentTheme.palette.borderStrong,
                  }}
                >
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                        {agent.designation}
                      </span>
                      <button
                        onClick={(e) => handleDeleteSavedAgent(agent.id, e)}
                        className="p-1 rounded text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete Agent"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="font-bold text-sm" style={{ color: currentTheme.palette.textPrimary }}>
                      {agent.name}
                    </h4>

                    <p className="text-[11px] opacity-75 font-mono">
                      Model: {agent.model.replace('gemini-', '')} • T={agent.temperature.toFixed(2)}
                    </p>
                  </div>

                  <div className="pt-2 border-t flex items-center justify-between text-[10px] font-mono opacity-60" style={{ borderColor: currentTheme.palette.border }}>
                    <span>{agent.selectedTools.length} Active Tools</span>
                    <span>{agent.createdAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
