'use client';

import { useState, useEffect } from 'react';
import { useSessionStore } from '@/store/sessionStore';
import { PhaseIndicator } from './PhaseIndicator';
import { PhaseContent } from './PhaseContent';
import { SafetyBanner } from './SafetyBanner';
import Link from 'next/link';

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function StartScreen({ onStart }: { onStart: (clientId: string) => void }) {
  const [clientId, setClientId] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = clientId.trim() || `client-${crypto.randomUUID().slice(0, 8)}`;
    onStart(id);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors mb-4 inline-block">
            ← Home
          </Link>
          <h1 className="text-3xl font-bold text-white">Begin EMDR Session</h1>
          <p className="mt-2 text-slate-400 text-sm">
            Start an 8-phase EMDR therapy session
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Client ID
              </label>
              <input
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Enter client ID or leave blank for auto-generated"
                className="w-full rounded-lg bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-600 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-slate-600 mt-1">
                Use an anonymized identifier only — no PHI
              </p>
            </div>

            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3">
              <p className="text-xs text-yellow-300 font-medium mb-1">Clinical Notice</p>
              <p className="text-xs text-slate-400">
                This platform requires licensed therapist supervision. Do not use as a
                standalone treatment tool. All sessions are conducted under full supervision tier.
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Start Session
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function SessionView() {
  const {
    isSessionActive,
    currentPhase,
    safetyStatus,
    sudHistory,
    vocHistory,
    blsSetCount,
    activeTarget,
    sessionStartTime,
    startSession,
    endSession,
    advancePhase,
    recordSUD,
    recordVOC,
    setActiveTarget,
    triggerClosure,
    completeSession,
    setBLSRunning,
  } = useSessionStore();

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isSessionActive || !sessionStartTime) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - sessionStartTime.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isSessionActive, sessionStartTime]);

  // Session time warnings
  useEffect(() => {
    if (!isSessionActive) return;
    const remainingMinutes = 90 - Math.floor(elapsedSeconds / 60);
    if (remainingMinutes === 15) {
      // 15 minute warning — would trigger protocol engine
    }
    if (remainingMinutes <= 0) {
      triggerClosure('Session time limit reached (90 minutes)');
    }
  }, [elapsedSeconds, isSessionActive, triggerClosure]);

  if (!isSessionActive) {
    return <StartScreen onStart={startSession} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117]">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                <span className="text-xs text-green-400 font-medium">Session Active</span>
              </div>
              <span className="text-xs text-slate-600">·</span>
              <span className="text-xs font-mono text-slate-400">{formatElapsed(elapsedSeconds)}</span>
              {elapsedSeconds >= 75 * 60 && (
                <span className="text-xs text-yellow-400 font-medium animate-pulse">
                  ⚠ {90 - Math.floor(elapsedSeconds / 60)}m remaining
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={endSession}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors border border-slate-700 rounded px-2 py-1 hover:border-slate-600"
            >
              End Session
            </button>
          </div>

          {/* Phase indicator */}
          <PhaseIndicator currentPhase={currentPhase} />
        </div>
      </header>

      {/* Safety banner */}
      {safetyStatus !== 'normal' && (
        <div className="max-w-4xl mx-auto w-full px-4 pt-4">
          <SafetyBanner level={safetyStatus} />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <PhaseContent
          phase={currentPhase}
          activeTarget={activeTarget}
          sudHistory={sudHistory}
          vocHistory={vocHistory}
          blsSetCount={blsSetCount}
          processingComplete={false}
          onAdvancePhase={advancePhase}
          onRecordSUD={recordSUD}
          onRecordVOC={recordVOC}
          onSetActiveTarget={setActiveTarget}
          onBLSSetStart={() => setBLSRunning(true)}
          onBLSSetEnd={(d) => {
            setBLSRunning(false);
            useSessionStore.getState().protocolActor?.send({
              type: 'END_BLS_SET',
              durationSeconds: d,
            });
          }}
          onTriggerClosure={triggerClosure}
          onCompleteSession={completeSession}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/30 py-3 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <p className="text-xs text-slate-600">
            EMDR Platform · Phase 1 Prototype · Licensed therapist supervision required
          </p>
          <a
            href="tel:988"
            className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
          >
            Crisis: 988
          </a>
        </div>
      </footer>
    </div>
  );
}
