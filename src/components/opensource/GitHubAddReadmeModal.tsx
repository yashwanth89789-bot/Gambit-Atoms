import React, { useState } from 'react';
import { 
  BookOpen, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  X, 
  Sparkles, 
  FileText, 
  GitBranch, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Code2
} from 'lucide-react';
import { useAdaptiveTheme } from '../../context/ThemeContext';

interface GitHubAddReadmeModalProps {
  isOpen: boolean;
  onClose: () => void;
  markdown: string;
  repoName: string;
}

export const GitHubAddReadmeModal: React.FC<GitHubAddReadmeModalProps> = ({
  isOpen,
  onClose,
  markdown,
  repoName,
}) => {
  const { currentTheme } = useAdaptiveTheme();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'guide' | 'preview' | 'raw'>('guide');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'README.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const lineCount = markdown.split('\n').length;
  const wordCount = markdown.split(/\s+/).filter(Boolean).length;
  const byteSizeKb = (new Blob([markdown]).size / 1024).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-4xl max-h-[90vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden animate-scaleUp"
        style={{
          backgroundColor: currentTheme.palette.surface,
          borderColor: currentTheme.palette.border,
          color: currentTheme.palette.textPrimary,
        }}
      >
        {/* Header */}
        <div 
          className="p-5 border-b flex items-center justify-between gap-4"
          style={{
            backgroundColor: currentTheme.palette.surfaceRaised,
            borderColor: currentTheme.palette.border,
          }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold tracking-tight">Add README to GitHub Repository</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                  Ready to Commit
                </span>
              </div>
              <p className="text-xs opacity-70 mt-0.5">
                Target: <span className="font-mono font-bold text-emerald-400">{repoName}</span> • {lineCount} lines • {wordCount} words ({byteSizeKb} KB)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Quick Action: Copy */}
            <button
              onClick={handleCopy}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                copied 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>

            {/* Quick Action: Download */}
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg border text-xs font-mono font-medium flex items-center space-x-1.5 transition-colors opacity-80 hover:opacity-100 cursor-pointer"
              style={{
                backgroundColor: currentTheme.palette.surface,
                borderColor: currentTheme.palette.border,
              }}
              title="Download README.md file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download .md</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border transition-colors opacity-60 hover:opacity-100 cursor-pointer ml-1"
              style={{
                backgroundColor: currentTheme.palette.surface,
                borderColor: currentTheme.palette.border,
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div 
          className="px-5 py-2 border-b flex items-center space-x-2 text-xs font-mono"
          style={{
            backgroundColor: currentTheme.palette.surface,
            borderColor: currentTheme.palette.border,
          }}
        >
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'guide' 
                ? 'font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            🚀 3-Step GitHub Guide
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'raw' 
                ? 'font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            📄 Raw Markdown Code
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'guide' ? (
            <div className="space-y-6">
              {/* Visual Card Replicating User's Exact Screenshot */}
              <div className="border rounded-xl p-5 bg-zinc-950 text-zinc-200 shadow-inner relative overflow-hidden">
                <div className="absolute top-2 right-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  GitHub Web Interface Match
                </div>
                
                {/* GitHub Mock Header */}
                <div className="border-b border-zinc-800 pb-3 mb-5 flex items-center space-x-2 text-xs text-zinc-400 font-sans">
                  <BookOpen className="w-4 h-4 text-zinc-400" />
                  <span className="font-semibold text-zinc-200">README</span>
                </div>

                {/* Center Content Matching User Screenshot */}
                <div className="py-6 px-4 text-center space-y-3 max-w-md mx-auto">
                  <div className="w-12 h-12 mx-auto rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white tracking-tight">Add a README</h4>
                  <p className="text-xs text-zinc-400">
                    Help people interested in this repository understand your project.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={handleCopy}
                      className="px-5 py-2 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center space-x-2"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? 'Copied to Clipboard!' : 'Copy Formatted README.md'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3 Step Walkthrough */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Step 1 */}
                <div 
                  className="p-4 rounded-xl border space-y-2 relative"
                  style={{
                    backgroundColor: currentTheme.palette.surfaceRaised,
                    borderColor: currentTheme.palette.border,
                  }}
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center font-mono">
                    1
                  </div>
                  <h5 className="text-sm font-bold">Copy README</h5>
                  <p className="text-xs opacity-70 leading-relaxed">
                    Click the <b>"Copy Markdown"</b> button above. The entire formatted markdown with badges, architecture, and quickstart is copied to your clipboard.
                  </p>
                  <button
                    onClick={handleCopy}
                    className="w-full mt-2 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all hover:border-emerald-500 text-emerald-400 flex items-center justify-center space-x-1.5 cursor-pointer"
                    style={{ backgroundColor: currentTheme.palette.surface, borderColor: currentTheme.palette.border }}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Click to Copy'}</span>
                  </button>
                </div>

                {/* Step 2 */}
                <div 
                  className="p-4 rounded-xl border space-y-2"
                  style={{
                    backgroundColor: currentTheme.palette.surfaceRaised,
                    borderColor: currentTheme.palette.border,
                  }}
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center font-mono">
                    2
                  </div>
                  <h5 className="text-sm font-bold">Click "Add a README"</h5>
                  <p className="text-xs opacity-70 leading-relaxed">
                    In your GitHub browser tab (matching your screenshot), click the green <b>"Add a README"</b> button. GitHub will open the text editor for <code>README.md</code>.
                  </p>
                  <div className="pt-2 text-[11px] font-mono opacity-60 flex items-center space-x-1">
                    <Terminal className="w-3 h-3" />
                    <span>File name: README.md</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div 
                  className="p-4 rounded-xl border space-y-2"
                  style={{
                    backgroundColor: currentTheme.palette.surfaceRaised,
                    borderColor: currentTheme.palette.border,
                  }}
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center font-mono">
                    3
                  </div>
                  <h5 className="text-sm font-bold">Paste & Commit</h5>
                  <p className="text-xs opacity-70 leading-relaxed">
                    Paste the text (<kbd className="px-1.5 py-0.5 rounded bg-black/20 font-mono text-[10px]">Ctrl+V</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-black/20 font-mono text-[10px]">Cmd+V</kbd>) into the GitHub editor. Scroll down and click <b>"Commit changes..."</b>!
                  </p>
                  <div className="pt-2 text-[11px] text-emerald-400 font-mono flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Your repo now has a world-class README</span>
                  </div>
                </div>
              </div>

              {/* Pro-Tips & Badges included */}
              <div 
                className="p-4 rounded-xl border space-y-2 text-xs"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.border,
                }}
              >
                <div className="flex items-center space-x-2 font-bold text-emerald-400 font-mono">
                  <ShieldCheck className="w-4 h-4" />
                  <span>What is included in this README?</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px] opacity-80">
                  <div className="flex items-center space-x-1.5">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>React 19 & Vite 6 Badges</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>TypeScript 5.8 Spec</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>ASCII System Topology</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Quickstart CLI Guides</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Serving Benchmarks</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Production Checklist</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>BibTeX Academic Citation</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Apache 2.0 License Block</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono opacity-70">
                <span>Displaying formatted markdown source</span>
                <span>{lineCount} lines</span>
              </div>
              <textarea
                readOnly
                value={markdown}
                className="w-full h-96 p-4 rounded-xl font-mono text-xs leading-relaxed border focus:outline-none resize-none"
                style={{
                  backgroundColor: currentTheme.appearance === 'light' ? '#F4F4F5' : '#09090B',
                  borderColor: currentTheme.palette.border,
                  color: currentTheme.appearance === 'light' ? '#18181B' : '#FAFAFA',
                }}
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div 
          className="p-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs font-mono"
          style={{
            backgroundColor: currentTheme.palette.surfaceRaised,
            borderColor: currentTheme.palette.border,
          }}
        >
          <div className="flex items-center space-x-2 text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>Formatted for optimal rendering on GitHub markdown engine</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-lg border transition-colors opacity-80 hover:opacity-100 cursor-pointer"
              style={{
                backgroundColor: currentTheme.palette.surface,
                borderColor: currentTheme.palette.border,
              }}
            >
              Download README.md
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-xs cursor-pointer flex items-center space-x-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Markdown & Go to GitHub'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
