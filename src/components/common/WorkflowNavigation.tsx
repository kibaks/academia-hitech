import React, { useState } from 'react';
import { UserRole } from '../../types';
import {
  WORKFLOW_TRACKS,
  WorkflowTrack,
  WorkflowStep,
  getWorkflowTrackForRole
} from '../../lib/workflows';
import {
  ChevronRight,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Building2,
  ShieldCheck,
  Globe2,
  CheckCircle2,
  Compass,
  Layers,
  ChevronDown
} from 'lucide-react';

interface WorkflowNavigationProps {
  currentRole: UserRole;
  activeTab: string;
  onNavigate: (tabId: string) => void;
  onSelectRole?: (role: UserRole) => void;
}

export const WorkflowNavigation: React.FC<WorkflowNavigationProps> = ({
  currentRole,
  activeTab,
  onNavigate,
  onSelectRole,
}) => {
  const [selectedTrackId, setSelectedTrackId] = useState<string>(() => {
    return getWorkflowTrackForRole(currentRole).id;
  });
  const [showTrackDropdown, setShowTrackDropdown] = useState(false);

  // Sync track when role changes if not explicitly changed
  const currentTrack =
    WORKFLOW_TRACKS.find((t) => t.id === selectedTrackId) ||
    getWorkflowTrackForRole(currentRole);

  const TrackIcon = currentTrack.icon;

  const trackBadgeColors: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-300',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const stepActiveColors: Record<string, { active: string; idle: string }> = {
    indigo: {
      active: 'bg-indigo-600 text-white shadow-xs',
      idle: 'bg-indigo-50/80 text-indigo-900 hover:bg-indigo-100/70 border-indigo-200/80',
    },
    emerald: {
      active: 'bg-emerald-600 text-white shadow-xs',
      idle: 'bg-emerald-50/80 text-emerald-900 hover:bg-emerald-100/70 border-emerald-200/80',
    },
    blue: {
      active: 'bg-blue-600 text-white shadow-xs',
      idle: 'bg-blue-50/80 text-blue-900 hover:bg-blue-100/70 border-blue-200/80',
    },
    amber: {
      active: 'bg-amber-600 text-white shadow-xs',
      idle: 'bg-amber-50/80 text-amber-900 hover:bg-amber-100/70 border-amber-200/80',
    },
    slate: {
      active: 'bg-slate-900 text-white shadow-xs',
      idle: 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200',
    },
  };

  const activeColor = stepActiveColors[currentTrack.colorScheme] || stepActiveColors.indigo;

  return (
    <div
      id="workflow-navigation-bar"
      className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200/90 py-2.5 px-4 sm:px-6 lg:px-8 transition-all"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Current Workflow Track Selector & Info */}
        <div className="flex items-center gap-2 relative">
          <div className="relative">
            <button
              onClick={() => setShowTrackDropdown(!showTrackDropdown)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                trackBadgeColors[currentTrack.colorScheme]
              }`}
            >
              <TrackIcon className="w-3.5 h-3.5" />
              <span>{currentTrack.shortTitle}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {/* Dropdown to switch between workflows */}
            {showTrackDropdown && (
              <div className="absolute left-0 top-full mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Sélectionner un Workflow</span>
                  <Compass className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <div className="mt-1 space-y-1">
                  {WORKFLOW_TRACKS.map((track) => {
                    const Icon = track.icon;
                    const isCurrent = track.id === currentTrack.id;
                    return (
                      <button
                        key={track.id}
                        onClick={() => {
                          setSelectedTrackId(track.id);
                          setShowTrackDropdown(false);
                          // Auto navigate to the first step of this track
                          if (track.steps[0]) {
                            onNavigate(track.steps[0].tabId);
                          }
                        }}
                        className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all ${
                          isCurrent
                            ? 'bg-indigo-50/80 text-indigo-950 font-bold border border-indigo-200'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                            <span>{track.title}</span>
                            {isCurrent && (
                              <span className="text-[10px] text-indigo-600 font-bold">Actif</span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 font-normal leading-tight line-clamp-1 mt-0.5">
                            {track.subtitle}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="hidden xl:block">
            <span className="text-xs font-semibold text-slate-800">{currentTrack.title}</span>
            <span className="text-slate-400 text-xs mx-1.5">•</span>
            <span className="text-[11px] text-slate-500">{currentTrack.subtitle}</span>
          </div>
        </div>

        {/* Right: Sequential Workflow Steps Flow (Horizontal stepper) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline flex-shrink-0">
            Étapes :
          </span>

          {currentTrack.steps.map((step, idx) => {
            const StepIcon = step.icon;
            const isCurrentTab = activeTab === step.tabId;
            const isLast = idx === currentTrack.steps.length - 1;

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => onNavigate(step.tabId)}
                  title={`${step.stepNumber}. ${step.title} : ${step.description}`}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    isCurrentTab
                      ? activeColor.active
                      : activeColor.idle
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrentTab ? 'bg-white/20 text-white' : 'bg-black/5 text-slate-700'
                  }`}>
                    {step.stepNumber}
                  </span>
                  <StepIcon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{step.label.replace(/^\d+\.\s*/, '')}</span>
                  {step.badge && (
                    <span className={`text-[9px] px-1 py-0.2 rounded font-bold uppercase ${
                      isCurrentTab ? 'bg-white/30 text-white' : 'bg-white text-indigo-700 shadow-2xs'
                    }`}>
                      {step.badge}
                    </span>
                  )}
                </button>

                {!isLast && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
