import { PHASE_DEFINITIONS } from '@/engine/protocol/phases';

export default function ProtocolPage() {
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <a
            href="/"
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors mb-6 inline-block"
          >
            ← Back
          </a>
          <h1 className="text-4xl font-bold text-white">8-Phase EMDR Protocol</h1>
          <p className="mt-2 text-slate-400">
            Francine Shapiro&apos;s evidence-based protocol for adaptive information processing
          </p>
        </div>

        <div className="space-y-4">
          {PHASE_DEFINITIONS.map((phase) => (
            <div
              key={phase.id}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Phase number badge */}
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-bold text-sm">
                  {phase.number}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-lg font-semibold text-white">{phase.name}</h2>
                    {phase.blsUsed && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 text-xs font-medium text-violet-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-violet-400"></span>
                        BLS Active
                      </span>
                    )}
                    <span className="text-xs text-slate-500">{phase.typicalDuration}</span>
                  </div>

                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                    {phase.description}
                  </p>

                  <div className="mt-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                      Required Activities
                    </h3>
                    <ul className="space-y-1">
                      {phase.requiredActivities.map((activity, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                          <span className="text-indigo-500 mt-0.5 flex-shrink-0">›</span>
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
