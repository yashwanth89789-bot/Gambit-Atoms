import React, { useState, useEffect } from 'react';
import { Brain, Cpu, Database, Network, Search, PenTool, CheckCircle2 } from 'lucide-react';

interface ChainOfAgentsVisualizerProps {
  isActive: boolean;
}

const AGENT_STEPS = [
  { id: 'search', label: 'Literature Reviewer Agent', icon: Search, desc: 'Querying external knowledge bases...' },
  { id: 'math', label: 'Formal Methods Agent', icon: Cpu, desc: 'Formulating theorems and proofs...' },
  { id: 'data', label: 'Empirical Analyst Agent', icon: Database, desc: 'Running simulated benchmarks...' },
  { id: 'writer', label: 'Academic Writer Agent', icon: PenTool, desc: 'Drafting LaTeX manuscript sections...' },
  { id: 'reviewer', label: 'Adversarial Reviewer Agent', icon: Brain, desc: 'Critiquing and refining arguments...' }
];

export const ChainOfAgentsVisualizer: React.FC<ChainOfAgentsVisualizerProps> = ({ isActive }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  useEffect(() => {
    if (!isActive) {
      setCurrentStepIndex(-1);
      return;
    }
    
    // Simulate progression through the agents
    let step = 0;
    setCurrentStepIndex(0);
    
    const interval = setInterval(() => {
      step++;
      if (step < AGENT_STEPS.length) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);
      }
    }, 1500); // 1.5 seconds per agent step

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive && currentStepIndex === -1) return null;

  return (
    <div className="w-full bg-[#111111] border border-gray-800 rounded-lg p-6 my-8 animate-fadeIn">
      <div className="flex items-center space-x-3 mb-6">
        <Network className="w-5 h-5 text-emerald-400" />
        <h3 className="text-white font-mono font-bold text-sm uppercase tracking-widest">
          Chain-of-Agents Execution Pipeline
        </h3>
      </div>
      
      <div className="flex flex-col space-y-4">
        {AGENT_STEPS.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isPending = index > currentStepIndex;
          
          let statusColor = "text-gray-600 border-gray-800 bg-black/50";
          let iconColor = "text-gray-700";
          
          if (isCompleted) {
            statusColor = "text-emerald-400 border-emerald-900 bg-emerald-950/20";
            iconColor = "text-emerald-500";
          } else if (isCurrent) {
            statusColor = "text-cyan-400 border-cyan-800 bg-cyan-950/30";
            iconColor = "text-cyan-400";
          }

          return (
            <div 
              key={step.id} 
              className={`flex items-center justify-between p-4 rounded-md border transition-all duration-500 ${statusColor}`}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${isCurrent ? 'bg-cyan-900/50 animate-pulse' : 'bg-transparent'}`}>
                  <step.icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div>
                  <h4 className="font-mono text-sm font-bold tracking-wide">{step.label}</h4>
                  <p className="text-[10px] uppercase tracking-widest mt-1 opacity-80">{step.desc}</p>
                </div>
              </div>
              
              <div>
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : isCurrent ? (
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                ) : (
                  <span className="text-[10px] font-mono tracking-widest uppercase opacity-50">Pending</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
