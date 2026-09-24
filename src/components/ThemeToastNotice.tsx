import React from 'react';
import { useAdaptiveTheme } from '../context/ThemeContext';
import { Sparkles, X, Sliders, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ThemeToastNotice: React.FC = () => {
  const { lastAdaptedNotice, dismissNotice, currentTheme, densityMode } = useAdaptiveTheme();

  return (
    <AnimatePresence>
      {lastAdaptedNotice && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed top-16 right-6 z-50 max-w-md pointer-events-auto"
        >
          <div 
            className="flex items-center space-x-3 px-4 py-2.5 rounded-lg border shadow-xl backdrop-blur-md transition-all font-sans text-xs"
            style={{
              backgroundColor: currentTheme.appearance === 'dark' || currentTheme.appearance === 'cyber-dark' 
                ? 'rgba(15, 23, 42, 0.92)' 
                : currentTheme.appearance === 'warm-light'
                ? 'rgba(254, 252, 248, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
              borderColor: currentTheme.palette.borderStrong,
              color: currentTheme.palette.textPrimary,
              boxShadow: currentTheme.palette.accentGlow || '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div 
              className="p-1.5 rounded-md flex-shrink-0"
              style={{
                backgroundColor: currentTheme.palette.accentLight,
                color: currentTheme.palette.accentText,
              }}
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            </div>

            <div className="flex-1 pr-2">
              <div className="flex items-center space-x-2">
                <span className="font-bold tracking-tight">Adaptive UI Theme</span>
                <span 
                  className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase font-bold"
                  style={{
                    backgroundColor: currentTheme.palette.accent,
                    color: '#ffffff',
                  }}
                >
                  {densityMode}
                </span>
              </div>
              <p className="text-[11px] opacity-80 mt-0.5 leading-snug">
                {lastAdaptedNotice}
              </p>
            </div>

            <button
              onClick={dismissNotice}
              className="p-1 rounded opacity-60 hover:opacity-100 transition-opacity"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
