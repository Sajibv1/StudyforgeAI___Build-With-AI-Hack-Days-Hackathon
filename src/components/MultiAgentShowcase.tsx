import React from 'react';
import { AgentStep, AgentType } from '../types';
import { Network, Database, GraduationCap, Palette, Layout, CheckCircle, Clock, AlertCircle, Loader2, Sparkles, Terminal } from 'lucide-react';

interface MultiAgentShowcaseProps {
  steps: AgentStep[];
  isGenerating: boolean;
  onClose?: () => void;
}

const AGENT_METADATA: Record<AgentType, { name: string; role: string; icon: React.FC<{ className?: string }>; color: string; badge: string }> = {
  orchestrator: {
    name: 'Orchestrator',
    role: 'Plans workflow & coordinates multi-agent roadmap',
    icon: Network,
    color: 'from-purple-500 to-indigo-600',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30'
  },
  research: {
    name: 'Research',
    role: 'Gather concepts, verify formulas & references',
    icon: Database,
    color: 'from-blue-500 to-cyan-500',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
  },
  education: {
    name: 'Education',
    role: 'Builds pedagogical sequence & quizzes',
    icon: GraduationCap,
    color: 'from-emerald-500 to-teal-500',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
  },
  visualization: {
    name: 'Visualization',
    role: 'Generates SVG diagrams & timelines',
    icon: Palette,
    color: 'from-amber-500 to-orange-500',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
  },
  designer: {
    name: 'Designer',
    role: 'Produces polished responsive layouts',
    icon: Layout,
    color: 'from-pink-500 to-rose-500',
    badge: 'bg-pink-500/10 text-pink-400 border-pink-500/30'
  },
  reviewer: {
    name: 'Reviewer',
    role: 'Audits readability & final revisions',
    icon: CheckCircle,
    color: 'from-cyan-500 to-blue-600',
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
  }
};

export const MultiAgentShowcase: React.FC<MultiAgentShowcaseProps> = ({
  steps,
  isGenerating
}) => {
  const agentTypes: AgentType[] = ['orchestrator', 'research', 'education', 'visualization', 'designer', 'reviewer'];

  // Calculate completed and active agents
  const completedAgentsCount = agentTypes.filter((type) => {
    const agentSteps = steps.filter((s) => s.agent === type);
    return agentSteps.length > 0 && agentSteps.every((s) => s.status === 'completed');
  }).length;

  const activeAgentsCount = agentTypes.filter((type) => {
    const agentSteps = steps.filter((s) => s.agent === type);
    return agentSteps.some((s) => s.status === 'working');
  }).length;

  // Calculate progress percent accurately
  let progressPercent = 0;
  if (!isGenerating || completedAgentsCount === agentTypes.length) {
    progressPercent = 100;
  } else {
    progressPercent = Math.min(
      99,
      Math.round(((completedAgentsCount + activeAgentsCount * 0.5) / agentTypes.length) * 100)
    );
  }

  return (
    <div className="bg-white border border-slate-200/60 shadow-sm rounded-[24px] p-6 space-y-6 my-6 relative overflow-hidden">
      
      {/* Background Accent glow */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-72 h-72 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header & Overall Status */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-bold tracking-tight text-slate-900">Multi-Agent Collaboration</h3>
            <span className={`flex items-center gap-1.5 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              isGenerating ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isGenerating ? 'bg-indigo-500 animate-pulse' : 'bg-emerald-500'}`}></span>
              {isGenerating ? 'Live Pipeline' : 'Completed'}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Real-time pipeline orchestration: Research, Educational Sequencing, SVG Visualization, Design, & Review.
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full sm:w-56 shrink-0">
          <div className="flex justify-between items-end mb-1.5">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Progress</span>
            <span className="text-[11px] font-bold text-slate-900">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
            <div
              className="bg-slate-900 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {agentTypes.map((type) => {
          const meta = AGENT_METADATA[type];
          const Icon = meta.icon;
          const agentSteps = steps.filter((s) => s.agent === type);
          const isWorking = agentSteps.some((s) => s.status === 'working');
          const isDone = agentSteps.length > 0 && agentSteps.every((s) => s.status === 'completed');

          return (
            <div
              key={type}
              className={`p-4 rounded-[16px] border transition-all duration-300 ${
                isWorking
                  ? 'bg-white border-indigo-200 shadow-[0_0_0_2px_rgba(99,102,241,0.1)]'
                  : isDone
                  ? 'bg-slate-50/80 border-slate-200/60'
                  : 'bg-slate-50/40 border-slate-100 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                  isDone ? 'bg-emerald-100 text-emerald-700' : isWorking ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-500'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                {isWorking ? (
                  <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                ) : isDone ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-300" />
                )}
              </div>

              <h4 className="text-sm font-bold text-slate-900 truncate">{meta.name}</h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">{meta.role}</p>

              <div className="mt-3 pt-3 border-t border-slate-100">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center ${
                  isWorking ? 'bg-indigo-50 text-indigo-700' : isDone ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {isWorking ? 'ACTIVE' : isDone ? 'FINISHED' : 'QUEUED'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Step Log Stream */}
      <div className="bg-[#0A0A0A] rounded-[16px] p-4 h-52 overflow-y-auto font-mono text-[11px] leading-relaxed text-slate-300 border border-slate-800/80">
        <div className="flex items-center justify-between text-slate-400 text-[11px] pb-3 border-b border-slate-800/80 font-sans mb-3 sticky top-0 bg-[#0A0A0A]">
          <span className="flex items-center gap-2 font-bold uppercase tracking-wider text-slate-300">
            <Terminal className="w-4 h-4 text-indigo-400" /> Agent Task Log Stream
          </span>
          <span className="text-[10px] font-mono text-slate-500 px-2 py-0.5 bg-slate-800/50 rounded-full">{steps.length} Log Entries</span>
        </div>

        {steps.length === 0 ? (
          <div className="text-slate-500 py-6 text-center italic">Initializing agent workspace...</div>
        ) : (
          <div className="space-y-1.5">
            {steps.map((step) => {
              return (
                <div key={step.id} className="flex items-start space-x-3 py-1 text-slate-300 hover:bg-slate-800/30 rounded px-2 transition-colors">
                  <span className="text-slate-500 shrink-0 opacity-70">[{step.timestamp}]</span>
                  <span className="font-bold shrink-0 uppercase text-indigo-400 w-24">
                    [{step.agent}]
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-slate-200">{step.title}: </span>
                    <span className="text-slate-400">{step.description}</span>
                    {step.outputSummary && (
                      <div className="text-[11px] text-emerald-400/90 mt-1 pl-3 border-l-2 border-emerald-500/20 py-0.5">
                        ↳ {step.outputSummary}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
