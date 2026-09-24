import React, { useState, useEffect } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { RefreshCw, Code2, AlertCircle } from 'lucide-react';
import { useAdaptiveTheme } from '../../context/ThemeContext';

// Configure monaco-editor to use locally bundled package instead of external CDN
loader.config({ monaco });

// Configure safe local MonacoEnvironment workers to eliminate cross-origin importScripts NetworkErrors
if (typeof window !== 'undefined') {
  (window as any).MonacoEnvironment = {
    getWorker(_moduleId: any, _label: string) {
      const blob = new Blob([
        `self.onmessage = function () {};`
      ], { type: 'application/javascript' });
      return new Worker(URL.createObjectURL(blob));
    }
  };
}

interface SafeCodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  fontSize?: number;
  minimap?: boolean;
  onEditorMount?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  onVisibleRangeChange?: (startLine: number, endLine: number) => void;
  onCursorLineChange?: (line: number) => void;
}

export const SafeCodeEditor: React.FC<SafeCodeEditorProps> = ({
  language,
  value,
  onChange,
  readOnly = false,
  fontSize = 13,
  minimap = true,
  onEditorMount,
  onVisibleRangeChange,
  onCursorLineChange,
}) => {
  const { currentTheme } = useAdaptiveTheme();
  const [hasMonacoError, setHasMonacoError] = useState(false);

  return (
    <div className="w-full h-full relative overflow-hidden">
      {!hasMonacoError ? (
        <Editor
          height="100%"
          language={language || 'python'}
          theme={currentTheme.appearance === 'dark' ? 'vs-dark' : 'light'}
          value={value}
          onChange={(val) => onChange(val || '')}
          loading={
            <div 
              className="w-full h-full flex items-center justify-center space-x-2 text-xs font-mono"
              style={{
                backgroundColor: currentTheme.palette.surface,
                color: currentTheme.palette.textPrimary,
              }}
            >
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" />
              <span>Loading Monaco Kernel Editor...</span>
            </div>
          }
          options={{
            readOnly,
            fontSize,
            minimap: { enabled: minimap },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            fontFamily: 'JetBrains Mono, Menlo, Monaco, Courier New, monospace',
            padding: { top: 12 },
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            smoothScrolling: true,
          }}
          onMount={(editor, _monaco) => {
            onEditorMount?.(editor);
            
            // Listen to scroll events to report visible line ranges
            editor.onDidScrollChange(() => {
              const ranges = editor.getVisibleRanges();
              if (ranges && ranges.length > 0) {
                onVisibleRangeChange?.(ranges[0].startLineNumber, ranges[0].endLineNumber);
              }
            });

            // Listen to cursor movement
            editor.onDidChangeCursorPosition((e) => {
              onCursorLineChange?.(e.position.lineNumber);
            });
          }}
        />
      ) : (
        /* Resilient Fallback Editor */
        <div 
          className="w-full h-full flex flex-col font-mono text-xs overflow-hidden"
          style={{
            backgroundColor: currentTheme.appearance === 'dark' ? '#1E1E1E' : '#FFFFFF',
            color: currentTheme.palette.textPrimary,
          }}
        >
          <div className="px-3 py-1.5 border-b flex items-center justify-between text-[11px] opacity-75"
            style={{ borderColor: currentTheme.palette.border }}
          >
            <span className="flex items-center space-x-1.5">
              <Code2 className="w-3.5 h-3.5 text-amber-500" />
              <span>Standard Code Editor Mode</span>
            </span>
            <span>{language.toUpperCase()}</span>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Line numbers column */}
            <div 
              className="py-3 px-2 select-none text-right opacity-40 border-r text-[12px] overflow-hidden"
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: currentTheme.palette.border,
                minWidth: '42px',
              }}
            >
              {value.split('\n').map((_, idx) => (
                <div key={idx} className="leading-5">{idx + 1}</div>
              ))}
            </div>

            {/* Editable Textarea */}
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              readOnly={readOnly}
              spellCheck={false}
              className="flex-1 p-3 bg-transparent resize-none focus:outline-none leading-5 font-mono text-[13px]"
              style={{
                color: currentTheme.palette.textPrimary,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
