import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      {/* Hero */}
      <div className="text-center max-w-3xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
          </span>
          Phase 1 — Clinical Prototype
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
          EMDR Platform
        </h1>
        <p className="mt-4 text-xl text-slate-400">
          Clinically faithful EMDR therapy powered by AI
        </p>
        <p className="mt-3 text-sm text-slate-500 max-w-xl mx-auto">
          Bilateral stimulation engine · 8-phase protocol · Validated assessments ·
          Real-time safety monitoring
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/session"
            className="rounded-lg bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0d1117]"
          >
            Begin Session
          </Link>
          <Link
            href="/protocol"
            className="rounded-lg border border-slate-600 bg-slate-800/50 px-8 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:border-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-[#0d1117]"
          >
            View Protocol
          </Link>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-4xl w-full">
        <FeatureCard
          icon="◈"
          title="Bilateral Stimulation"
          description="Canvas-based visual BLS with synchronized stereo audio. Configurable speed, shape, color, and path."
        />
        <FeatureCard
          icon="◎"
          title="8-Phase Protocol"
          description="Clinically faithful implementation of Francine Shapiro's EMDR protocol with state-machine precision."
        />
        <FeatureCard
          icon="◆"
          title="Safety Architecture"
          description="Multi-tier safety monitoring: SUD/VOC tracking, crisis detection, session boundaries, and therapist oversight."
        />
      </div>

      {/* Clinical disclaimer */}
      <p className="mt-16 text-xs text-slate-600 max-w-lg text-center">
        This platform is a clinical research prototype. All sessions require licensed therapist
        supervision. Not a standalone treatment tool.
      </p>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition-colors">
      <div className="text-2xl text-indigo-400 mb-3">{icon}</div>
      <h3 className="font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
