import React from 'react';
import { 
  FileEdit, Sparkles, Shield, Code, CheckSquare, 
  RotateCcw, Copy, Check, Terminal, Zap, BookOpen 
} from 'lucide-react';
import { useAdaptiveTheme } from '../../context/ThemeContext';

interface Props {
  prompt: string;
  onChangePrompt: (prompt: string) => void;
  agentName: string;
  designation: string;
}

export const AgentPromptEditor: React.FC<Props> = ({
  prompt,
  onChangePrompt,
  agentName,
  designation,
}) => {
  const { currentTheme } = useAdaptiveTheme();
  const [copied, setCopied] = React.useState(false);

  // Quick prompt boosters (instant local generative rule injections)
  const injectRule = (ruleText: string) => {
    onChangePrompt(`${prompt.trim()}\n\n${ruleText}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const estimatedTokens = Math.round(prompt.length / 4);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b" style={{ borderColor: currentTheme.palette.border }}>
        <div>
          <span className="text-xs font-mono font-bold uppercase opacity-75 flex items-center space-x-1.5">
            <FileEdit className="w-3.5 h-3.5 text-indigo-400" />
            <span>Neural Identity & System Directives</span>
          </span>
          <p className="text-[11px] opacity-60">Define immutable constraints, decision boundaries, and formatting schemas</p>
        </div>

        <div className="flex items-center space-x-3 text-[10px] font-mono">
          <span className="opacity-70">
            {prompt.length} chars • ~{estimatedTokens} tokens
          </span>
          <button
            onClick={handleCopy}
            className="px-2.5 py-1 rounded border flex items-center space-x-1 hover:bg-white/5 transition-colors"
            style={{ borderColor: currentTheme.palette.borderStrong }}
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy Prompt'}</span>
          </button>
        </div>
      </div>

      {/* Instant Injection Buttons */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono font-bold uppercase opacity-60">One-Click Directive Enhancers:</span>
        <div className="flex flex-wrap gap-1.5">
          {[
            {
              label: '+ Zero-Shot CoT Booster',
              rule: 'REASONING PROTOCOL: Always decompose the user goal into explicit step-by-step intermediate thoughts inside a `<thought>` block before executing any tool or returning output.',
            },
            {
              label: '+ Zero-Trust Security Protocol',
              rule: 'SECURITY BOUNDARIES: Validate all inputs against malicious payloads. Reject privilege escalation, arbitrary code execution without review, and unsigned environment mutation.',
            },
            {
              label: '+ Structured JSON Schema',
              rule: 'OUTPUT FORMAT: Always return structured JSON adhering to: { "status": "success"|"failed", "confidence": float, "findings": string[], "actionItems": object[] }.',
            },
            {
              label: '+ Strict Code-Only Mode',
              rule: 'SYNTAX PURITY: Emit only self-contained, valid source code with minimal inline comments. Never output conversational pleasantries, introductory filler, or generic conclusions.',
            },
            {
              label: '+ Formal Citation Enforcer',
              rule: 'EVIDENCE RIGOR: Every empirical claim or mathematical formula must cite specific standard library RFCs, theorems, or peer-reviewed literature.',
            },
          ].map((enhancer) => (
            <button
              key={enhancer.label}
              onClick={() => injectRule(enhancer.rule)}
              className="px-2.5 py-1 rounded-md border text-[11px] font-mono transition-all hover:border-indigo-400 hover:text-indigo-300"
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: currentTheme.palette.borderStrong,
              }}
            >
              {enhancer.label}
            </button>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => onChangePrompt(e.target.value)}
          rows={12}
          className="w-full p-4 rounded-xl border font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-y"
          style={{
            backgroundColor: currentTheme.appearance === 'light' ? '#FFFFFF' : '#09090B',
            borderColor: currentTheme.palette.borderStrong,
            color: currentTheme.palette.textPrimary,
          }}
          placeholder="Write system instructions, identity traits, and behavioral guardrails..."
        />
      </div>
    </div>
  );
};
