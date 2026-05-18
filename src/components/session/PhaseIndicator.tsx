'use client';

import type { ProtocolPhase } from '@/types/clinical';

const PHASES: { id: ProtocolPhase; short: string; label: string }[] = [
  { id: 'history_taking', short: 'Hx', label: 'History' },
  { id: 'preparation', short: 'Prep', label: 'Preparation' },
  { id: 'assessment', short: 'Asmt', label: 'Assessment' },
  { id: 'desensitization', short: 'Desn', label: 'Desensitization' },
  { id: 'installation', short: 'Inst', label: 'Installation' },
  { id: 'body_scan', short: 'Scan', label: 'Body Scan' },
  { id: 'closure', short: 'Clsr', label: 'Closure' },
  { id: 'reevaluation', short: 'Rval', label: 'Reevaluation' },
];

const PHASE_ORDER = PHASES.map((p) => p.id);

interface PhaseIndicatorProps {
  currentPhase: ProtocolPhase;
}

export function PhaseIndicator({ currentPhase }: PhaseIndicatorProps) {
  const currentIndex = PHASE_ORDER.indexOf(currentPhase);

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center min-w-max px-2 py-1">
        {PHASES.map((phase, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;

          return (
            <div key={phase.id} className="flex items-center">
              {/* Phase circle + label */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold border-2 transition-colors
                    ${isCompleted ? 'bg-green-600 border-green-500 text-white' : ''}
                    ${isCurrent ? 'bg-indigo-600 border-indigo-400 text-white ring-2 ring-indigo-400 ring-offset-2 ring-offset-[#0d1117]' : ''}
                    ${isFuture ? 'bg-slate-800 border-slate-700 text-slate-500' : ''}
                  `}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`
                    mt-1 text-[10px] font-medium whitespace-nowrap
                    ${isCurrent ? 'text-indigo-400' : isCompleted ? 'text-green-500' : 'text-slate-600'}
                  `}
                >
                  <span className="sm:hidden">{phase.short}</span>
                  <span className="hidden sm:inline">{phase.label}</span>
                </span>
              </div>

              {/* Connector line */}
              {index < PHASES.length - 1 && (
                <div
                  className={`
                    h-0.5 w-8 sm:w-10 mx-1 rounded transition-colors
                    ${index < currentIndex ? 'bg-green-600' : 'bg-slate-700'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
