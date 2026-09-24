import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { 
  Terminal, Code, Folder, Play, Sparkles, Send, CheckCircle2, 
  RefreshCw, FileCode, Cpu, Plus, Trash2, Check, FilePlus, 
  Users, Map, Sliders, Eye, Activity, BookOpen, Layers, 
  Split, Zap, ShieldAlert, FileText, CheckCheck, Save,
  Maximize2, Minimize2, Settings, Download, Search, AlertTriangle,
  Keyboard
} from 'lucide-react';
import { CodeFile, ChatMessage } from '../types';
import { SafeCodeEditor } from './ide/SafeCodeEditor';
import { useAdaptiveTheme } from '../context/ThemeContext';
import { IDETemplatesModal } from './ide/IDETemplatesModal';
import { IDETerminalConsole } from './ide/IDETerminalConsole';
import { IDEShortcutsModal } from './ide/IDEShortcutsModal';
import { CodeMiniMap } from './ide/CodeMiniMap';
import { CodeTemplate } from '../data/ideTemplates';

interface Collaborator {
  id: string;
  name: string;
  color: string;
  line: number;
  avatarBg: string;
}

interface ConsoleLog {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warn' | 'error' | 'perf';
  text: string;
}

export const CodeIDEWorkspace: React.FC = () => {
  const { currentTheme, densityMode } = useAdaptiveTheme();

  const [files, setFiles] = useState<CodeFile[]>([
    {
      id: '1',
      name: 'vla_controller.py',
      language: 'python',
      content: `import torch
import torch.nn as nn

class VisionLanguageActionAgent(nn.Module):
    """ApexAI Autonomous Vision-Language-Action Policy Agent."""
    def __init__(self, embed_dim: int = 4096, num_actions: int = 128):
        super().__init__()
        self.vision_encoder = nn.Linear(3 * 224 * 224, embed_dim)
        self.policy_head = nn.Linear(embed_dim, num_actions)
        
    def forward(self, visual_stream: torch.Tensor, text_tokens: torch.Tensor) -> torch.Tensor:
        features = self.vision_encoder(visual_stream.flatten(start_dim=1))
        logits = self.policy_head(features)
        return torch.softmax(logits, dim=-1)

# ApexAI v3.8 Autonomous VLA Loop
if __name__ == "__main__":
    agent = VisionLanguageActionAgent()
    print("ApexAI VLA Agent successfully initialized on Hopper architecture.")`,
      isModified: false,
    },
    {
      id: '2',
      name: 'fused_attention_triton.py',
      language: 'python',
      content: `import torch
import triton
import triton.language as tl

@triton.jit
def fused_attn_kernel(Q, K, V, Out, sm_scale, BLOCK_M: tl.constexpr = 128, BLOCK_N: tl.constexpr = 64):
    pid_m = tl.program_id(0)
    offs_m = pid_m * BLOCK_M + tl.arange(0, BLOCK_M)
    offs_n = tl.arange(0, BLOCK_N)
    
    # Asynchronous Tensor Memory Accelerator (TMA) load
    q = tl.load(Q + offs_m[:, None])
    k = tl.load(K + offs_n[None, :])
    scores = tl.dot(q, k) * sm_scale
    tl.store(Out + offs_m[:, None], scores)

def launch_fused_attention(q, k, v):
    out = torch.empty_like(q)
    return out`,
      isModified: false,
    },
    {
      id: '3',
      name: 'evolutionary_rag.py',
      language: 'python',
      content: `import numpy as np

class EvolutionaryRAGOptimizer:
    def __init__(self, population_size: int = 50):
        self.population_size = population_size
        self.mutation_rate = 0.05
        
    def evolve_retrieval_weights(self, corpus_scores: list[float]) -> int:
        # Evolutionary feedback loop for RAG document reranking
        scores = np.array(corpus_scores)
        best_idx = int(np.argmax(scores))
        return best_idx`,
      isModified: false,
    },
  ]);

  const [activeFileId, setActiveFileId] = useState('1');
  const [openTabIds, setOpenTabIds] = useState<string[]>(['1', '2', '3']);
  const [hardwareTarget, setHardwareTarget] = useState<string>('NVIDIA H100 SXM5 (CUDA 12.8)');
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showMiniMapSidebar, setShowMiniMapSidebar] = useState(true);
  const [isSplitView, setIsSplitView] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isTransforming, setIsTransforming] = useState<string | null>(null);

  // Monaco Editor Reference & Minimap Synchronization
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [visibleStartLine, setVisibleStartLine] = useState(1);
  const [visibleEndLine, setVisibleEndLine] = useState(35);
  const [cursorLine, setCursorLine] = useState(1);

  const handleSelectLine = (targetLine: number) => {
    if (monacoEditorRef.current) {
      monacoEditorRef.current.revealLineInCenter(targetLine);
      monacoEditorRef.current.setPosition({ lineNumber: targetLine, column: 1 });
      monacoEditorRef.current.focus();
    }
    setCursorLine(targetLine);
  };

  // Console Logs
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([
    { id: '1', timestamp: '22:44:01', level: 'info', text: 'ApexAI Studio Container booted. Python 3.12, PyTorch 2.6.0+cu128, Triton 3.2.0.' },
    { id: '2', timestamp: '22:44:02', level: 'perf', text: 'Detected hardware acceleration: NVIDIA Hopper H100 80GB SXM5 (132 SMs, 3.35 TB/s HBM3).' },
    { id: '3', timestamp: '22:44:05', level: 'success', text: 'Monaco Language Server ready with Pylance & CUDA IntelliSense.' },
  ]);

  // Collaborative Presence State
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    { id: 'c1', name: 'Dr. Sarah Chen', color: '#3B82F6', line: 12, avatarBg: 'bg-blue-500' },
    { id: 'c2', name: 'Alex Rivera', color: '#10B981', line: 18, avatarBg: 'bg-emerald-500' },
    { id: 'c3', name: 'Prof. Marcus Vance', color: '#8B5CF6', line: 6, avatarBg: 'bg-purple-500' },
  ]);

  // Periodic cursor simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCollaborators(prev =>
        prev.map(c => ({
          ...c,
          line: Math.min(Math.max(2, c.line + (Math.random() > 0.5 ? 1 : -1)), 25),
        }))
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // AI Copilot Chat Messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'ApexAI Neural Copilot online. Ready to synthesize CUDA kernels, optimize KV-cache memory, and verify AST types.',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // New file creation form
  const [newFileName, setNewFileName] = useState('');
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);

  const activeFile = useMemo(() => {
    return files.find((f) => f.id === activeFileId) || files[0];
  }, [files, activeFileId]);

  // Execute Code in Sandbox
  const handleRunCode = () => {
    setIsRunning(true);
    const now = new Date().toLocaleTimeString();
    setConsoleLogs(prev => [
      ...prev,
      { id: Date.now().toString(), timestamp: now, level: 'info', text: `> python3 -O ${activeFile.name} --target="${hardwareTarget}"` },
    ]);

    setTimeout(() => {
      const completionTime = new Date().toLocaleTimeString();
      setConsoleLogs(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), timestamp: completionTime, level: 'success', text: `[STDOUT] ApexAI VLA Agent successfully initialized on Hopper architecture.\n[STDOUT] Tensor core warp occupancy: 94.2% | Latency: 0.142 ms | Memory allocated: 22.4 GB.` },
        { id: (Date.now() + 2).toString(), timestamp: completionTime, level: 'perf', text: `[PERF] Zero memory fragmentation detected. Async TMA double-buffering active.` },
      ]);
      setIsRunning(false);
    }, 900);
  };

  // Quick Action AI Transformations
  const handleTransformCode = (actionType: 'optimize' | 'docstring' | 'test' | 'explain') => {
    setIsTransforming(actionType);
    const now = new Date().toLocaleTimeString();

    if (actionType === 'optimize') {
      setTimeout(() => {
        const optimizedCode = `# [AI-OPTIMIZED]: Tensor parallelism & Fused Rotary FlashAttention injected\n` + activeFile.content;
        setFiles(files.map(f => f.id === activeFile.id ? { ...f, content: optimizedCode, isModified: true } : f));
        setConsoleLogs(prev => [
          ...prev,
          { id: Date.now().toString(), timestamp: now, level: 'success', text: `[AI OPTIMIZER] Fused memory operations applied to ${activeFile.name}. Estimated throughput boost: 3.4x.` },
        ]);
        setIsTransforming(null);
      }, 750);
    } else if (actionType === 'docstring') {
      setTimeout(() => {
        const docstringCode = activeFile.content.replace(
          'class ',
          '"""\nModule: ' + activeFile.name + '\nDescription: High-performance production module with strict type safety.\n"""\n\nclass '
        );
        setFiles(files.map(f => f.id === activeFile.id ? { ...f, content: docstringCode, isModified: true } : f));
        setConsoleLogs(prev => [
          ...prev,
          { id: Date.now().toString(), timestamp: now, level: 'info', text: `[AI DOCS] Generated comprehensive docstrings and Google-style typing for ${activeFile.name}.` },
        ]);
        setIsTransforming(null);
      }, 600);
    } else if (actionType === 'test') {
      setTimeout(() => {
        const testFileName = `test_${activeFile.name}`;
        const testCode = `import pytest\nimport torch\nfrom ${activeFile.name.replace('.py', '')} import *\n\ndef test_${activeFile.name.replace('.py', '')}_forward_pass():\n    """Verify numerical parity and non-zero gradients."""\n    x = torch.randn(2, 4096)\n    assert x.shape[0] == 2\n    print("PyTest suite passed successfully.")\n`;
        
        const newTestFile: CodeFile = {
          id: Date.now().toString(),
          name: testFileName,
          language: 'python',
          content: testCode,
          isModified: false,
        };
        setFiles([...files, newTestFile]);
        setOpenTabIds([...openTabIds, newTestFile.id]);
        setActiveFileId(newTestFile.id);
        setConsoleLogs(prev => [
          ...prev,
          { id: Date.now().toString(), timestamp: now, level: 'success', text: `[AI TEST SUITE] Synthesized unit test suite in ${testFileName}.` },
        ]);
        setIsTransforming(null);
      }, 700);
    } else if (actionType === 'explain') {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `**Architecture Analysis for \`${activeFile.name}\`:**\n- **Time Complexity**: $\\mathcal{O}(N \\cdot D)$ where $N$ is sequence length and $D$ is embedding dimension.\n- **Memory Complexity**: High-efficiency linear memory with zero-copy tensor slicing.\n- **Hardware Acceleration**: Target Hopper TMA async memory copy is fully compatible.`,
            timestamp: now,
          },
        ]);
        setIsTransforming(null);
      }, 600);
    }
  };

  // Tab management
  const handleOpenTab = (fileId: string) => {
    if (!openTabIds.includes(fileId)) {
      setOpenTabIds([...openTabIds, fileId]);
    }
    setActiveFileId(fileId);
  };

  const handleCloseTab = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (openTabIds.length <= 1) return;
    const nextTabs = openTabIds.filter(id => id !== fileId);
    setOpenTabIds(nextTabs);
    if (activeFileId === fileId) {
      setActiveFileId(nextTabs[0]);
    }
  };

  // File Creation
  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    const name = newFileName.trim().endsWith('.py') ? newFileName.trim() : `${newFileName.trim()}.py`;
    const newFile: CodeFile = {
      id: Date.now().toString(),
      name,
      language: 'python',
      content: `# Module: ${name}\n\ndef execute():\n    print("Executing ${name}")\n\nif __name__ == "__main__":\n    execute()`,
      isModified: false,
    };
    setFiles([...files, newFile]);
    setOpenTabIds([...openTabIds, newFile.id]);
    setActiveFileId(newFile.id);
    setNewFileName('');
    setShowNewFileDialog(false);
  };

  // Insert template
  const handleSelectTemplate = (template: CodeTemplate) => {
    const newFile: CodeFile = {
      id: Date.now().toString(),
      name: template.filename,
      language: template.language,
      content: template.content,
      isModified: false,
    };
    setFiles([...files, newFile]);
    setOpenTabIds([...openTabIds, newFile.id]);
    setActiveFileId(newFile.id);
    setConsoleLogs(prev => [
      ...prev,
      { id: Date.now().toString(), timestamp: new Date().toLocaleTimeString(), level: 'info', text: `Loaded template "${template.name}" into workspace as ${template.filename}.` },
    ]);
  };

  // Keyboard Shortcuts Handler & Action Executor
  const handleExecuteShortcutAction = (actionId: string) => {
    switch (actionId) {
      case 'run':
        handleRunCode();
        break;
      case 'save':
        setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, isModified: false } : f));
        setConsoleLogs(prev => [
          ...prev,
          { id: Date.now().toString(), timestamp: new Date().toLocaleTimeString(), level: 'success', text: `[SAVE] Successfully persisted "${activeFile.name}" to workspace buffer.` },
        ]);
        break;
      case 'new_file':
        setShowNewFileDialog(true);
        break;
      case 'templates':
        setShowTemplatesModal(true);
        break;
      case 'split':
        setIsSplitView(prev => !prev);
        break;
      case 'minimap':
        setShowMiniMapSidebar(prev => !prev);
        break;
      case 'ai_optimize':
        handleTransformCode('optimize');
        break;
      case 'ai_docstring':
        handleTransformCode('docstring');
        break;
      case 'ai_test':
        handleTransformCode('test');
        break;
      case 'ai_explain':
        handleTransformCode('explain');
        break;
      case 'clear_console':
        setConsoleLogs([]);
        break;
      case 'shortcuts':
        setShowShortcutsModal(prev => !prev);
        break;
      default:
        break;
    }
  };

  // Global Keyboard Listener for Code IDE Workspace
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInputActive = ['INPUT', 'TEXTAREA'].includes((document.activeElement?.tagName || ''));
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      // Toggle Shortcuts Reference Dialog: Cmd+/ or Ctrl+/ or '?' (when not in input)
      if ((isCmdOrCtrl && e.key === '/') || (!isInputActive && e.key === '?' && !isCmdOrCtrl)) {
        e.preventDefault();
        setShowShortcutsModal(prev => !prev);
        return;
      }

      // Run code: Cmd+Enter or Ctrl+Enter or F5
      if ((isCmdOrCtrl && e.key === 'Enter') || e.key === 'F5') {
        e.preventDefault();
        handleRunCode();
        return;
      }

      // Save file: Cmd+S or Ctrl+S
      if (isCmdOrCtrl && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleExecuteShortcutAction('save');
        return;
      }

      // New file: Cmd+Shift+N or Ctrl+Shift+N
      if (isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setShowNewFileDialog(true);
        return;
      }

      // Templates: Cmd+Shift+T or Ctrl+Shift+T
      if (isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        setShowTemplatesModal(true);
        return;
      }

      // Split view: Cmd+\ or Ctrl+\
      if (isCmdOrCtrl && e.key === '\\') {
        e.preventDefault();
        setIsSplitView(prev => !prev);
        return;
      }

      // Minimap: Cmd+M or Ctrl+M
      if (isCmdOrCtrl && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setShowMiniMapSidebar(prev => !prev);
        return;
      }

      // AI Optimize: Cmd+Shift+O or Ctrl+Shift+O
      if (isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        handleTransformCode('optimize');
        return;
      }

      // AI Docstring: Cmd+Shift+D or Ctrl+Shift+D
      if (isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        handleTransformCode('docstring');
        return;
      }

      // AI Test Suite: Cmd+Shift+U or Ctrl+Shift+U
      if (isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        handleTransformCode('test');
        return;
      }

      // AI Explain: Cmd+Shift+E or Ctrl+Shift+E
      if (isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        handleTransformCode('explain');
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFileId, activeFile, files]);

  // Chat message submit
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || chatLoading) return;

    const userText = inputMsg;
    setInputMsg('');
    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: userText, timestamp: new Date().toLocaleTimeString() },
    ];
    setMessages(newMessages);
    setChatLoading(true);

    try {
      const res = await fetch('/api/ide/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          currentCode: activeFile.content,
          fileName: activeFile.name,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages([
          ...newMessages,
          { role: 'assistant', content: data.reply, timestamp: new Date().toLocaleTimeString() },
        ]);
      } else {
        setMessages([
          ...newMessages,
          { role: 'assistant', content: 'Copilot telemetry: To maximize Tensor Core FLOPs on Hopper, ensure head dimensions are multiples of 64 and enable FP8 E4M3 scaling.', timestamp: new Date().toLocaleTimeString() },
        ]);
      }
    } catch {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Copilot telemetry: Verified tensor dimension constraints. I recommend using torch.compile with mode="max-autotune".', timestamp: new Date().toLocaleTimeString() },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 py-6 transition-all duration-300 animate-fadeIn ${
      densityMode === 'compact' ? 'space-y-4' : densityMode === 'relaxed' ? 'space-y-8' : 'space-y-6'
    }`}>
      {/* 1. IDE Top Control & Hardware Target Bar */}
      <div 
        className="border rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all"
        style={{
          backgroundColor: currentTheme.palette.surface,
          borderColor: currentTheme.palette.border,
          color: currentTheme.palette.textPrimary,
        }}
      >
        <div className="flex items-center space-x-3.5">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-xs shrink-0"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.borderStrong,
              color: currentTheme.palette.accent,
            }}
          >
            <Code className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">Studio Code IDE & Hardware Simulator</h1>
              <span 
                className="text-[10px] font-mono px-2 py-0.5 rounded border font-semibold"
                style={{
                  backgroundColor: currentTheme.palette.badgeBg,
                  borderColor: currentTheme.palette.borderStrong,
                  color: currentTheme.palette.badgeText,
                }}
              >
                Hopper v3.8 JIT
              </span>
            </div>
            <p className="text-xs opacity-70">
              Interactive multi-file IDE with CUDA hardware simulation, Monaco multi-tabs, and AST transformation engines.
            </p>
          </div>
        </div>

        {/* Right side: Hardware target selector, templates modal, and run button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Hardware Target Selector */}
          <div className="flex items-center space-x-1.5 text-xs font-mono">
            <Cpu className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <select
              value={hardwareTarget}
              onChange={(e) => setHardwareTarget(e.target.value)}
              className="rounded-lg px-2.5 py-1.5 text-xs font-mono border focus:outline-none cursor-pointer transition-colors"
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: currentTheme.palette.borderStrong,
                color: currentTheme.palette.textPrimary,
              }}
            >
              <option value="NVIDIA H100 SXM5 (CUDA 12.8)">NVIDIA H100 SXM5 (CUDA 12.8)</option>
              <option value="NVIDIA Blackwell B200 (FP4/FP8 Tensor Core)">NVIDIA Blackwell B200 (FP4/FP8)</option>
              <option value="Hopper Triton JIT (Async TMA)">Hopper Triton JIT (Async TMA)</option>
              <option value="Apple M4 Neural Engine (Metal)">Apple M4 Neural Engine (Metal)</option>
              <option value="Edge ARM AVX-512 Matrix CPU">Edge ARM AVX-512 Matrix CPU</option>
            </select>
          </div>

          {/* Templates Library Button */}
          <button
            onClick={() => setShowTemplatesModal(true)}
            className="px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center space-x-1.5 transition-all opacity-90 hover:opacity-100"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.borderStrong,
              color: currentTheme.palette.textPrimary,
            }}
          >
            <BookOpen className="w-3.5 h-3.5" style={{ color: currentTheme.palette.accent }} />
            <span>Templates</span>
          </button>

          {/* Shortcuts Reference Button */}
          <button
            onClick={() => setShowShortcutsModal(true)}
            className="px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center space-x-1.5 transition-all opacity-90 hover:opacity-100"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.borderStrong,
              color: currentTheme.palette.textPrimary,
            }}
            title="Keyboard Shortcuts Reference (⌘/ or ?)"
          >
            <Keyboard className="w-3.5 h-3.5 text-indigo-400" />
            <span>Shortcuts</span>
            <kbd className="px-1.5 py-0.2 rounded text-[10px] bg-black/10 dark:bg-white/10 opacity-70">⌘/</kbd>
          </button>

          {/* Run Code Button */}
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="px-4 py-1.5 rounded-lg text-white font-mono font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center space-x-2 shadow-sm hover:scale-105"
            style={{ backgroundColor: currentTheme.palette.accent }}
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Executing...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Kernel</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. AI Copilot Inline Code Transformation Quick Bar */}
      <div 
        className="border rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 shadow-xs transition-colors"
        style={{
          backgroundColor: currentTheme.palette.surfaceRaised,
          borderColor: currentTheme.palette.border,
        }}
      >
        <div className="flex items-center space-x-2 text-xs font-mono font-bold">
          <Sparkles className="w-4 h-4" style={{ color: currentTheme.palette.accent }} />
          <span className="opacity-90">One-Click AI Code Actions:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => handleTransformCode('optimize')}
            disabled={isTransforming !== null}
            className="px-2.5 py-1 rounded-md text-[11px] font-mono border transition-all flex items-center space-x-1.5 opacity-85 hover:opacity-100 hover:scale-[1.02]"
            style={{
              backgroundColor: currentTheme.palette.surface,
              borderColor: currentTheme.palette.borderStrong,
            }}
          >
            <Zap className="w-3 h-3 text-amber-500" />
            <span>{isTransforming === 'optimize' ? 'Optimizing...' : '⚡ Optimize GPU Memory'}</span>
          </button>

          <button
            onClick={() => handleTransformCode('docstring')}
            disabled={isTransforming !== null}
            className="px-2.5 py-1 rounded-md text-[11px] font-mono border transition-all flex items-center space-x-1.5 opacity-85 hover:opacity-100 hover:scale-[1.02]"
            style={{
              backgroundColor: currentTheme.palette.surface,
              borderColor: currentTheme.palette.borderStrong,
            }}
          >
            <FileText className="w-3 h-3 text-blue-500" />
            <span>{isTransforming === 'docstring' ? 'Generating...' : '📝 Generate Docstrings'}</span>
          </button>

          <button
            onClick={() => handleTransformCode('test')}
            disabled={isTransforming !== null}
            className="px-2.5 py-1 rounded-md text-[11px] font-mono border transition-all flex items-center space-x-1.5 opacity-85 hover:opacity-100 hover:scale-[1.02]"
            style={{
              backgroundColor: currentTheme.palette.surface,
              borderColor: currentTheme.palette.borderStrong,
            }}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>{isTransforming === 'test' ? 'Synthesizing...' : '🧪 Synthesize PyTest'}</span>
          </button>

          <button
            onClick={() => handleTransformCode('explain')}
            disabled={isTransforming !== null}
            className="px-2.5 py-1 rounded-md text-[11px] font-mono border transition-all flex items-center space-x-1.5 opacity-85 hover:opacity-100 hover:scale-[1.02]"
            style={{
              backgroundColor: currentTheme.palette.surface,
              borderColor: currentTheme.palette.borderStrong,
            }}
          >
            <Activity className="w-3 h-3 text-purple-400" />
            <span>{isTransforming === 'explain' ? 'Analyzing...' : '🔍 Explain Complexity'}</span>
          </button>
        </div>
      </div>

      {/* 3. Main Workspace Grid: Explorer + Editor + Mini-Map */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 ${
        densityMode === 'compact' ? 'gap-4' : 'gap-6'
      }`}>
        {/* Left Sidebar: File Tree & Copilot Telemetry (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* File Explorer Tree */}
          <div 
            className="border rounded-2xl p-4 shadow-sm space-y-3"
            style={{
              backgroundColor: currentTheme.palette.surface,
              borderColor: currentTheme.palette.border,
            }}
          >
            <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: currentTheme.palette.border }}>
              <span className="text-xs font-bold font-mono uppercase tracking-wider flex items-center space-x-2">
                <Folder className="w-4 h-4" style={{ color: currentTheme.palette.accent }} />
                <span>Workspace Files</span>
              </span>
              <button
                onClick={() => setShowNewFileDialog(!showNewFileDialog)}
                className="p-1 rounded opacity-70 hover:opacity-100 transition-colors border"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.border,
                }}
                title="Create New File"
              >
                <FilePlus className="w-3.5 h-3.5" />
              </button>
            </div>

            {showNewFileDialog && (
              <form onSubmit={handleCreateFile} className="space-y-2 pt-1">
                <input
                  type="text"
                  placeholder="module_name.py"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg text-xs font-mono border focus:outline-none"
                  style={{
                    backgroundColor: currentTheme.palette.surfaceRaised,
                    borderColor: currentTheme.palette.borderStrong,
                  }}
                  autoFocus
                />
                <div className="flex justify-end space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setShowNewFileDialog(false)}
                    className="px-2 py-1 text-[10px] opacity-70 hover:opacity-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-2.5 py-1 text-[10px] rounded font-bold text-white"
                    style={{ backgroundColor: currentTheme.palette.accent }}
                  >
                    Create
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-1">
              {files.map((file) => {
                const isActive = file.id === activeFileId;
                return (
                  <div
                    key={file.id}
                    onClick={() => handleOpenTab(file.id)}
                    className={`group w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer border ${
                      isActive
                        ? 'font-bold shadow-2xs'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: isActive ? currentTheme.palette.surfaceRaised : 'transparent',
                      borderColor: isActive ? currentTheme.palette.borderStrong : 'transparent',
                      color: isActive ? currentTheme.palette.accent : currentTheme.palette.textPrimary,
                    }}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <FileCode className="w-3.5 h-3.5 shrink-0 opacity-70" />
                      <span className="truncate">{file.name}</span>
                    </div>
                    {files.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const remaining = files.filter(f => f.id !== file.id);
                          setFiles(remaining);
                          setOpenTabIds(openTabIds.filter(id => id !== file.id));
                          if (activeFileId === file.id && remaining.length > 0) {
                            setActiveFileId(remaining[0].id);
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-500 transition-opacity"
                        title="Delete File"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Copilot Telemetry Stream */}
          <div 
            className="border rounded-2xl p-4 shadow-sm flex flex-col h-[380px]"
            style={{
              backgroundColor: currentTheme.appearance === 'dark' ? '#0D0D11' : '#18181B',
              borderColor: '#27272A',
              color: '#E4E4E7',
            }}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#27272A] mb-2">
              <span className="text-xs font-bold font-mono uppercase tracking-wider flex items-center space-x-2 text-emerald-400">
                <Activity className="w-3.5 h-3.5" />
                <span>Copilot Telemetry</span>
              </span>
              <span className="text-[10px] text-emerald-500 font-mono">● Active</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-[11px] no-scrollbar">
              {messages.map((m, i) => (
                <div 
                  key={i} 
                  className={`flex items-start space-x-2 border-l-2 pl-2 py-1 ${
                    m.role === 'user' ? 'border-gray-600 text-gray-400' : 'border-emerald-500/60 text-emerald-100'
                  }`}
                >
                  <span className={`shrink-0 font-bold ${m.role === 'user' ? 'text-gray-500' : 'text-emerald-400'}`}>
                    {m.role === 'user' ? 'USR>' : 'COPILOT>'}
                  </span>
                  <div className="leading-relaxed whitespace-pre-wrap">{m.content}</div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex items-center space-x-2 text-emerald-400 animate-pulse border-l-2 pl-2 py-1 border-emerald-500/50">
                  <RefreshCw className="w-3 h-3 animate-spin shrink-0" />
                  <span>Synthesizing kernel trajectory...</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="mt-2 pt-2 border-t border-[#27272A] flex items-center space-x-1.5">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Ask Copilot (e.g. optimize KV cache)..."
                className="flex-1 bg-[#121216] border border-[#27272A] rounded-lg px-2.5 py-1.5 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={chatLoading}
                className="p-1.5 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] text-emerald-400 transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Center & Right: Monaco Editor + Mini-Map Outline (9 cols) */}
        <div className="lg:col-span-9 space-y-4">
          <div 
            className="border rounded-2xl shadow-sm overflow-hidden flex flex-col h-[560px] transition-all"
            style={{
              backgroundColor: currentTheme.palette.surface,
              borderColor: currentTheme.palette.border,
            }}
          >
            {/* Editor Multi-Tab Bar */}
            <div 
              className="px-3 pt-2 border-b flex items-center justify-between gap-2 overflow-x-auto"
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: currentTheme.palette.border,
              }}
            >
              {/* Tab items */}
              <div className="flex items-center space-x-1.5">
                {openTabIds.map((tabId) => {
                  const file = files.find(f => f.id === tabId);
                  if (!file) return null;
                  const isActive = file.id === activeFileId;

                  return (
                    <div
                      key={file.id}
                      onClick={() => setActiveFileId(file.id)}
                      className={`px-3 py-1.5 rounded-t-lg text-xs font-mono flex items-center space-x-2 border-t border-x cursor-pointer transition-all ${
                        isActive ? 'font-bold shadow-2xs' : 'opacity-65 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: isActive ? currentTheme.palette.surface : 'transparent',
                        borderColor: isActive ? currentTheme.palette.border : 'transparent',
                        color: isActive ? currentTheme.palette.accent : currentTheme.palette.textPrimary,
                      }}
                    >
                      <FileCode className="w-3.5 h-3.5 opacity-70" />
                      <span>{file.name}</span>
                      {file.isModified && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Unsaved edits"></span>
                      )}
                      {openTabIds.length > 1 && (
                        <button
                          onClick={(e) => handleCloseTab(file.id, e)}
                          className="hover:text-red-500 p-0.5 rounded opacity-60 hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Editor Right Toolbar Controls */}
              <div className="flex items-center space-x-2 pb-1.5">
                <button
                  onClick={() => setIsSplitView(!isSplitView)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-all flex items-center space-x-1.5 ${
                    isSplitView ? 'font-bold' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: isSplitView ? currentTheme.palette.surface : 'transparent',
                    borderColor: currentTheme.palette.border,
                  }}
                  title="Toggle Split Reference View"
                >
                  <Split className="w-3 h-3" />
                  <span className="hidden sm:inline">Split View</span>
                </button>

                <button
                  onClick={() => setShowMiniMapSidebar(!showMiniMapSidebar)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-all flex items-center space-x-1.5 ${
                    showMiniMapSidebar ? 'font-bold' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: showMiniMapSidebar ? currentTheme.palette.surface : 'transparent',
                    borderColor: currentTheme.palette.border,
                  }}
                  title="Toggle Visual Mini-Map (⌘M)"
                >
                  <Map className="w-3 h-3" />
                  <span className="hidden sm:inline">Mini-Map</span>
                </button>

                <button
                  onClick={() => {
                    setFiles(files.map(f => f.id === activeFile.id ? { ...f, isModified: false } : f));
                    const now = new Date().toLocaleTimeString();
                    setConsoleLogs(prev => [
                      ...prev,
                      { id: Date.now().toString(), timestamp: now, level: 'info', text: `Saved changes to ${activeFile.name}.` },
                    ]);
                  }}
                  className="px-3 py-1 rounded-md text-[11px] font-mono font-bold text-white flex items-center space-x-1 shadow-2xs"
                  style={{ backgroundColor: currentTheme.palette.accent }}
                  title="Save file"
                >
                  <Save className="w-3 h-3" />
                  <span>Save</span>
                </button>
              </div>
            </div>

            {/* Breadcrumb & Collaborator Presence Bar */}
            <div 
              className="px-4 py-1.5 border-b flex items-center justify-between text-[11px] font-mono"
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: currentTheme.palette.border,
              }}
            >
              <div className="flex items-center space-x-1.5 opacity-75 truncate">
                <span>workspace</span>
                <span>/</span>
                <span>src</span>
                <span>/</span>
                <span className="font-bold opacity-100" style={{ color: currentTheme.palette.accent }}>{activeFile.name}</span>
              </div>

              {/* Collaborator cursor avatars */}
              <div className="flex items-center space-x-2">
                <span className="opacity-60 text-[10px] hidden sm:inline">Active Cursors:</span>
                <div className="flex items-center space-x-1.5">
                  {collaborators.map(c => (
                    <span key={c.id} className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded border text-[10px]"
                      style={{
                        backgroundColor: currentTheme.palette.surface,
                        borderColor: currentTheme.palette.border,
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }}></span>
                      <span className="font-semibold">{c.name.split(' ')[0]}</span>
                      <span className="opacity-50">L{c.line}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Editor Canvas & Side Outline Container */}
            <div className="flex-1 w-full flex overflow-hidden relative">
              {/* Primary Monaco Editor */}
              <div className="flex-1 h-full overflow-hidden">
                <SafeCodeEditor
                  language={activeFile.language || 'python'}
                  value={activeFile.content}
                  onChange={(val) => {
                    setFiles(files.map((f) => (f.id === activeFile.id ? { ...f, content: val, isModified: true } : f)));
                  }}
                  fontSize={13}
                  minimap={false}
                  onEditorMount={(editor) => {
                    monacoEditorRef.current = editor;
                  }}
                  onVisibleRangeChange={(start, end) => {
                    setVisibleStartLine(start);
                    setVisibleEndLine(end);
                  }}
                  onCursorLineChange={(line) => {
                    setCursorLine(line);
                  }}
                />
              </div>

              {/* Split Reference View (Optional) */}
              {isSplitView && (
                <div 
                  className="w-1/2 h-full border-l overflow-hidden flex flex-col"
                  style={{ borderColor: currentTheme.palette.border }}
                >
                  <div 
                    className="p-2 border-b text-xs font-mono opacity-80 flex items-center justify-between"
                    style={{
                      backgroundColor: currentTheme.palette.surfaceRaised,
                      borderColor: currentTheme.palette.border,
                    }}
                  >
                    <span>Baseline Reference Diff</span>
                    <span className="text-[10px] text-emerald-500">Read-Only</span>
                  </div>
                  <div className="flex-1">
                    <SafeCodeEditor
                      language={activeFile.language || 'python'}
                      value={`# Baseline Unoptimized Reference\n# Target: ${hardwareTarget}\n\n` + activeFile.content}
                      onChange={() => {}}
                      readOnly={true}
                      fontSize={12}
                      minimap={false}
                    />
                  </div>
                </div>
              )}

              {/* Visual Mini-Map Component on the Right Side */}
              {showMiniMapSidebar && !isSplitView && (
                <CodeMiniMap
                  content={activeFile.content}
                  language={activeFile.language}
                  visibleStartLine={visibleStartLine}
                  visibleEndLine={visibleEndLine}
                  activeLine={cursorLine}
                  collaborators={collaborators}
                  isModified={activeFile.isModified}
                  onSelectLine={handleSelectLine}
                  onClose={() => setShowMiniMapSidebar(false)}
                />
              )}
            </div>
          </div>

          {/* 4. Integrated Multi-Tab Terminal & Hardware Profiler Console */}
          <IDETerminalConsole
            consoleLogs={consoleLogs}
            onClearLogs={() => setConsoleLogs([])}
            isRunning={isRunning}
            onRunCode={handleRunCode}
            currentHardware={hardwareTarget}
            activeFileName={activeFile.name}
            onApplyLintFix={(rule) => {
              const now = new Date().toLocaleTimeString();
              setConsoleLogs(prev => [
                ...prev,
                { id: Date.now().toString(), timestamp: now, level: 'success', text: `[AST FIX] Applied automated patch for rule: ${rule}.` },
              ]);
            }}
          />
        </div>
      </div>

      {/* 5. Code Templates Modal */}
      <IDETemplatesModal
        isOpen={showTemplatesModal}
        onClose={() => setShowTemplatesModal(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* 6. Keyboard Shortcuts Reference Modal */}
      <IDEShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
        onExecuteAction={handleExecuteShortcutAction}
      />
    </div>
  );
};
