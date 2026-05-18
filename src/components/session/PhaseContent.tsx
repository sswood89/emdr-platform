'use client';

import { useState } from 'react';
import type { ProtocolPhase, SUDScore, VOCScore, TargetMemory } from '@/types/clinical';
import { SUDScale } from '@/components/assessment/SUDScale';
import { VOCScale } from '@/components/assessment/VOCScale';
import { BLSCanvas } from '@/components/bls/BLSCanvas';

interface PhaseContentProps {
  phase: ProtocolPhase;
  activeTarget: TargetMemory | null;
  sudHistory: SUDScore[];
  vocHistory: VOCScore[];
  blsSetCount: number;
  processingComplete: boolean;
  onAdvancePhase: (reason?: string) => void;
  onRecordSUD: (value: SUDScore) => void;
  onRecordVOC: (value: VOCScore) => void;
  onSetActiveTarget: (target: TargetMemory) => void;
  onBLSSetStart: () => void;
  onBLSSetEnd: (durationSeconds: number) => void;
  onTriggerClosure: (reason: string) => void;
  onCompleteSession: () => void;
}

// ── History Taking ──────────────────────────────────────────────────────────

function HistoryTakingContent({ onAdvance }: { onAdvance: () => void }) {
  const [complaint, setComplaint] = useState('');
  const [traumaHistory, setTraumaHistory] = useState('');
  const [symptoms, setSymptoms] = useState('');

  const canContinue = complaint.trim().length > 0 && traumaHistory.trim().length > 0;

  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-slate-800/40 border border-slate-700 p-4">
        <h3 className="font-semibold text-white mb-1">Phase 1: History Taking & Treatment Planning</h3>
        <p className="text-sm text-slate-400">
          Gather a comprehensive trauma history, identify target memories, and assess client
          readiness for EMDR processing.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Chief Complaint <span className="text-red-400">*</span>
          </label>
          <textarea
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            rows={3}
            placeholder="What brings the client in today? What are their primary concerns?"
            className="w-full rounded-lg bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-600 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Trauma History <span className="text-red-400">*</span>
          </label>
          <textarea
            value={traumaHistory}
            onChange={(e) => setTraumaHistory(e.target.value)}
            rows={4}
            placeholder="Describe relevant trauma history, including approximate dates, nature of events, and current impact..."
            className="w-full rounded-lg bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-600 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Current Symptoms
          </label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={3}
            placeholder="Current PTSD symptoms, anxiety, depression, dissociation, sleep disturbance..."
            className="w-full rounded-lg bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-600 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>
      </div>

      <button
        type="button"
        disabled={!canContinue}
        onClick={onAdvance}
        className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue to Preparation →
      </button>
    </div>
  );
}

// ── Preparation ─────────────────────────────────────────────────────────────

function PreparationContent({ onAdvance }: { onAdvance: () => void }) {
  const [safePlaceConfirmed, setSafePlaceConfirmed] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  const steps = [
    'Explain EMDR process — bilateral stimulation, what the client will experience',
    'Guide the client through a Safe Place visualization (real or imagined, completely safe)',
    'Teach the Container exercise — a mental container for disturbing material',
    'Practice calm/deep breathing together',
    'Establish a stop signal — the client can pause or stop at any time',
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-slate-800/40 border border-slate-700 p-4">
        <h3 className="font-semibold text-white mb-1">Phase 2: Preparation</h3>
        <p className="text-sm text-slate-400">
          Build therapeutic rapport, explain the EMDR process, and teach self-regulation
          techniques before processing begins.
        </p>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-300">Required Activities</h4>
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg bg-slate-900/50 border border-slate-800 p-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold flex items-center justify-center">
              {i + 1}
            </div>
            <p className="text-sm text-slate-300">{step}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4 space-y-3">
        <h4 className="text-sm font-semibold text-indigo-300">Safe Place Exercise</h4>
        <p className="text-sm text-slate-400 leading-relaxed">
          &ldquo;I&apos;d like you to imagine a place — real or imaginary — where you feel completely
          safe and calm. It can be anywhere. Take a moment to picture it clearly. Notice what
          you see, hear, and feel there. Give it a name if you&apos;d like.&rdquo;
        </p>
        <p className="text-sm text-slate-400 leading-relaxed">
          &ldquo;When you&apos;re ready, hold that image and notice how your body feels. This is your
          safe place, and you can return to it at any time during our work together.&rdquo;
        </p>
      </div>

      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={safePlaceConfirmed}
            onChange={(e) => setSafePlaceConfirmed(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-slate-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
          />
          <span className="text-sm text-slate-300">
            Client has established and confirmed a working Safe Place
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consentGiven}
            onChange={(e) => setConsentGiven(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-slate-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
          />
          <span className="text-sm text-slate-300">
            Informed consent obtained — client understands and agrees to EMDR processing
          </span>
        </label>
      </div>

      <button
        type="button"
        disabled={!safePlaceConfirmed || !consentGiven}
        onClick={onAdvance}
        className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue to Assessment →
      </button>
    </div>
  );
}

// ── Assessment ───────────────────────────────────────────────────────────────

function AssessmentContent({
  onAdvance,
  onRecordSUD,
  onRecordVOC,
  onSetActiveTarget,
}: {
  onAdvance: () => void;
  onRecordSUD: (v: SUDScore) => void;
  onRecordVOC: (v: VOCScore) => void;
  onSetActiveTarget: (t: TargetMemory) => void;
}) {
  const [description, setDescription] = useState('');
  const [nc, setNc] = useState('');
  const [pc, setPc] = useState('');
  const [emotions, setEmotions] = useState('');
  const [bodyLocation, setBodyLocation] = useState('');
  const [sud, setSud] = useState<SUDScore | null>(null);
  const [voc, setVoc] = useState<VOCScore | null>(null);

  const canContinue =
    description.trim() && nc.trim() && pc.trim() && bodyLocation.trim() &&
    sud !== null && voc !== null && sud >= 1;

  function handleContinue() {
    if (!canContinue || sud === null || voc === null) return;

    const target: TargetMemory = {
      id: crypto.randomUUID(),
      description,
      negativeCognition: nc,
      positiveCognition: pc,
      emotions: emotions.split(',').map((e) => e.trim()).filter(Boolean),
      bodyLocation,
      baselineSUD: sud,
      baselineVOC: voc,
      currentSUD: sud,
      currentVOC: voc,
      resolved: false,
      createdAt: new Date(),
    };

    onSetActiveTarget(target);
    onRecordSUD(sud);
    onRecordVOC(voc);
    onAdvance();
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-slate-800/40 border border-slate-700 p-4">
        <h3 className="font-semibold text-white mb-1">Phase 3: Assessment</h3>
        <p className="text-sm text-slate-400">
          Select the target memory and establish baseline measurements for processing.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Target Memory — Worst Part <span className="text-red-400">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Describe the specific memory and its most disturbing aspect..."
            className="w-full rounded-lg bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-600 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Negative Cognition (NC) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={nc}
              onChange={(e) => setNc(e.target.value)}
              placeholder='e.g. "I am not safe"'
              className="w-full rounded-lg bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-600 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-slate-600 mt-1">Must be an &ldquo;I am...&rdquo; statement</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Positive Cognition (PC) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={pc}
              onChange={(e) => setPc(e.target.value)}
              placeholder='e.g. "I am safe now"'
              className="w-full rounded-lg bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-600 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Emotions
            </label>
            <input
              type="text"
              value={emotions}
              onChange={(e) => setEmotions(e.target.value)}
              placeholder="Fear, shame, guilt (comma separated)"
              className="w-full rounded-lg bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-600 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Body Location <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={bodyLocation}
              onChange={(e) => setBodyLocation(e.target.value)}
              placeholder="e.g. Chest tightness, stomach"
              className="w-full rounded-lg bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-600 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <SUDScale
            value={sud}
            onChange={(v) => setSud(v)}
            label="Baseline SUD — How disturbing right now?"
          />
          {sud !== null && sud < 1 && (
            <p className="text-xs text-yellow-400 mt-2">
              SUD must be at least 1 to proceed with processing.
            </p>
          )}
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <VOCScale
            value={voc}
            onChange={(v) => setVoc(v)}
            label={`VOC — How true does "${pc || 'the positive cognition'}" feel?`}
          />
        </div>
      </div>

      <button
        type="button"
        disabled={!canContinue}
        onClick={handleContinue}
        className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Begin Desensitization →
      </button>
    </div>
  );
}

// ── Desensitization ──────────────────────────────────────────────────────────

function DesensitizationContent({
  activeTarget,
  sudHistory,
  blsSetCount,
  onAdvance,
  onRecordSUD,
  onBLSSetStart,
  onBLSSetEnd,
}: {
  activeTarget: TargetMemory | null;
  sudHistory: SUDScore[];
  blsSetCount: number;
  onAdvance: () => void;
  onRecordSUD: (v: SUDScore) => void;
  onBLSSetStart: () => void;
  onBLSSetEnd: (d: number) => void;
}) {
  const [setNotes, setSetNotes] = useState<string[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [currentSUD, setCurrentSUD] = useState<SUDScore | null>(
    sudHistory.length > 0 ? sudHistory[sudHistory.length - 1] : null
  );
  const [sudChecked, setSudChecked] = useState(false);

  const latestSUD = sudHistory.length > 0 ? sudHistory[sudHistory.length - 1] : null;
  const canAdvance = latestSUD !== null && latestSUD <= 1;

  function handleSetEnd(duration: number) {
    onBLSSetEnd(duration);
    if (currentNote.trim()) {
      setSetNotes((prev) => [...prev, `Set ${blsSetCount + 1}: ${currentNote}`]);
      setCurrentNote('');
    }
    setSudChecked(false);
  }

  function handleSUDRecord() {
    if (currentSUD === null) return;
    onRecordSUD(currentSUD);
    setSudChecked(true);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-slate-800/40 border border-slate-700 p-4">
        <h3 className="font-semibold text-white mb-1">Phase 4: Desensitization</h3>
        {activeTarget && (
          <p className="text-sm text-slate-400">
            Target: <span className="text-slate-300">{activeTarget.description}</span>
            {' '}·{' '}NC:{' '}
            <span className="text-slate-300 italic">&ldquo;{activeTarget.negativeCognition}&rdquo;</span>
          </p>
        )}
      </div>

      {/* Instruction */}
      <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4 text-sm text-slate-300 leading-relaxed">
        <p className="font-medium text-indigo-300 mb-1">Starting instruction:</p>
        <p className="italic">
          &ldquo;Bring up that image, notice the negative belief, notice where you feel it in your body,
          and follow the light.&rdquo;
        </p>
        <p className="mt-2 text-slate-400 text-xs">
          After each set: &ldquo;Take a breath. Let it go. What do you notice now?&rdquo;
        </p>
      </div>

      {/* BLS Canvas */}
      <BLSCanvas onSetStart={onBLSSetStart} onSetEnd={handleSetEnd} />

      {/* Set counter */}
      <div className="flex items-center gap-4 text-sm">
        <div className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2">
          <span className="text-slate-500 text-xs">Sets completed</span>
          <div className="text-xl font-bold text-white">{blsSetCount}</div>
        </div>
        {latestSUD !== null && (
          <div className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2">
            <span className="text-slate-500 text-xs">Latest SUD</span>
            <div className="text-xl font-bold text-white">{latestSUD}</div>
          </div>
        )}
        {sudHistory.length >= 2 && (
          <div className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2">
            <span className="text-slate-500 text-xs">Trajectory</span>
            <div className="text-lg font-bold text-white">
              {sudHistory[0]} → {latestSUD}
              {latestSUD! < sudHistory[0] ? (
                <span className="text-green-400 ml-1 text-sm">↓</span>
              ) : latestSUD! > sudHistory[0] ? (
                <span className="text-red-400 ml-1 text-sm">↑</span>
              ) : (
                <span className="text-slate-400 ml-1 text-sm">→</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Post-set notes */}
      {blsSetCount > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            After-set response (what did client notice?)
          </label>
          <textarea
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            rows={2}
            placeholder="Client reported..."
            className="w-full rounded-lg bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-600 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>
      )}

      {/* SUD check */}
      {blsSetCount > 0 && blsSetCount % 3 === 0 && !sudChecked && (
        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4 space-y-3">
          <p className="text-sm text-yellow-300 font-medium">
            Time to check SUD (every 3 sets)
          </p>
          <SUDScale
            value={currentSUD}
            onChange={setCurrentSUD}
            label="SUD check — Return to original memory"
          />
          <button
            type="button"
            disabled={currentSUD === null}
            onClick={handleSUDRecord}
            className="w-full rounded-lg bg-yellow-600/30 border border-yellow-500/30 px-4 py-2 text-sm font-medium text-yellow-300 hover:bg-yellow-600/40 transition-colors disabled:opacity-50"
          >
            Record SUD
          </button>
        </div>
      )}

      {/* Previous set notes */}
      {setNotes.length > 0 && (
        <div className="space-y-1">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Session Notes</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {setNotes.map((note, i) => (
              <p key={i} className="text-xs text-slate-500 bg-slate-900/50 rounded px-2 py-1">
                {note}
              </p>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        disabled={!canAdvance}
        onClick={onAdvance}
        className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {canAdvance
          ? 'Proceed to Installation (SUD ≤ 1) →'
          : `Continue Processing (Current SUD: ${latestSUD ?? '?'})`}
      </button>
    </div>
  );
}

// ── Installation ─────────────────────────────────────────────────────────────

function InstallationContent({
  activeTarget,
  vocHistory,
  blsSetCount,
  onAdvance,
  onRecordVOC,
  onBLSSetStart,
  onBLSSetEnd,
}: {
  activeTarget: TargetMemory | null;
  vocHistory: VOCScore[];
  blsSetCount: number;
  onAdvance: () => void;
  onRecordVOC: (v: VOCScore) => void;
  onBLSSetStart: () => void;
  onBLSSetEnd: (d: number) => void;
}) {
  const [currentVOC, setCurrentVOC] = useState<VOCScore | null>(null);
  const latestVOC = vocHistory.length > 0 ? vocHistory[vocHistory.length - 1] : null;
  const canAdvance = latestVOC === 7;

  function handleSetEnd(duration: number) {
    onBLSSetEnd(duration);
    if (currentVOC !== null) {
      onRecordVOC(currentVOC);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-slate-800/40 border border-slate-700 p-4">
        <h3 className="font-semibold text-white mb-1">Phase 5: Installation</h3>
        {activeTarget && (
          <p className="text-sm text-slate-400">
            Installing: <span className="text-slate-300 italic">&ldquo;{activeTarget.positiveCognition}&rdquo;</span>
          </p>
        )}
      </div>

      <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4 text-sm text-slate-300">
        <p className="font-medium text-indigo-300 mb-1">Instruction:</p>
        <p className="italic leading-relaxed">
          &ldquo;Hold the original memory together with{' '}
          {activeTarget ? `"${activeTarget.positiveCognition}"` : 'the positive cognition'} and
          follow the light.&rdquo;
        </p>
      </div>

      <BLSCanvas onSetStart={onBLSSetStart} onSetEnd={handleSetEnd} />

      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 space-y-3">
        <VOCScale
          value={currentVOC}
          onChange={setCurrentVOC}
          label={`VOC check — How true does "${activeTarget?.positiveCognition ?? 'the PC'}" feel now?`}
        />
        {latestVOC !== null && (
          <p className="text-xs text-slate-500">
            Last recorded VOC: {latestVOC} / 7
          </p>
        )}
      </div>

      <button
        type="button"
        disabled={!canAdvance}
        onClick={onAdvance}
        className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {canAdvance ? 'Proceed to Body Scan (VOC = 7) →' : `Continue Installation (Current VOC: ${latestVOC ?? '?'})`}
      </button>
    </div>
  );
}

// ── Body Scan ─────────────────────────────────────────────────────────────────

function BodyScanContent({
  activeTarget,
  onAdvance,
  onBLSSetStart,
  onBLSSetEnd,
}: {
  activeTarget: TargetMemory | null;
  onAdvance: () => void;
  onBLSSetStart: () => void;
  onBLSSetEnd: (d: number) => void;
}) {
  const [scanClean, setScanClean] = useState(false);
  const [residuals, setResiduals] = useState('');

  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-slate-800/40 border border-slate-700 p-4">
        <h3 className="font-semibold text-white mb-1">Phase 6: Body Scan</h3>
        <p className="text-sm text-slate-400">
          Scan the body for any residual tension or disturbance related to the target.
        </p>
      </div>

      <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4 text-sm text-slate-300 space-y-2 leading-relaxed">
        <p className="font-medium text-indigo-300">Instruction:</p>
        <p className="italic">
          &ldquo;Close your eyes and bring up the original memory together with{' '}
          {activeTarget ? `"${activeTarget.positiveCognition}"` : 'the positive cognition'}.
          Now scan your body from head to toe. Notice any tension, tightness, or unusual sensation.&rdquo;
        </p>
        <p className="text-slate-400 text-xs">
          Check: head, jaw, throat, chest, stomach, shoulders, hands, legs
        </p>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-300">
          Residual sensations noted (if any)
        </label>
        <textarea
          value={residuals}
          onChange={(e) => setResiduals(e.target.value)}
          rows={2}
          placeholder="Describe any remaining body sensations..."
          className="w-full rounded-lg bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-600 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      {residuals.trim() && (
        <div className="space-y-2">
          <p className="text-sm text-slate-400">Apply BLS to residual sensation:</p>
          <BLSCanvas onSetStart={onBLSSetStart} onSetEnd={onBLSSetEnd} />
        </div>
      )}

      <label className="flex items-start gap-3 cursor-pointer rounded-lg border border-green-500/20 bg-green-500/5 p-4">
        <input
          type="checkbox"
          checked={scanClean}
          onChange={(e) => setScanClean(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-slate-600 text-green-600 focus:ring-green-500 focus:ring-offset-slate-900"
        />
        <div>
          <p className="text-sm font-medium text-green-300">Body scan is clean</p>
          <p className="text-xs text-slate-400 mt-0.5">
            No residual tension or disturbance detected — target is fully processed
          </p>
        </div>
      </label>

      <button
        type="button"
        disabled={!scanClean}
        onClick={onAdvance}
        className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Proceed to Closure →
      </button>
    </div>
  );
}

// ── Closure ───────────────────────────────────────────────────────────────────

function ClosureContent({
  processingComplete,
  onAdvance,
  onCompleteSession,
}: {
  processingComplete: boolean;
  onAdvance: () => void;
  onCompleteSession: () => void;
}) {
  const [closureComplete, setClosureComplete] = useState(false);

  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-slate-800/40 border border-slate-700 p-4">
        <h3 className="font-semibold text-white mb-1">Phase 7: Closure</h3>
        <div className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2.5 py-1 mt-1 ${processingComplete ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
          {processingComplete ? '✓ Processing Complete' : '⏸ Incomplete Processing'}
        </div>
      </div>

      {processingComplete ? (
        <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4 space-y-3">
          <h4 className="text-sm font-semibold text-green-300">Processing was complete</h4>
          <p className="text-sm text-slate-400 leading-relaxed italic">
            &ldquo;You did excellent work today. Between now and next session, you may notice new
            thoughts, memories, or dreams. That&apos;s normal — your brain is continuing to process.
            Just notice them and jot them down if you&apos;d like. Remember your safe place and
            breathing if you need them.&rdquo;
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4 space-y-3">
          <h4 className="text-sm font-semibold text-yellow-300">Processing was incomplete</h4>
          <p className="text-sm text-slate-400 leading-relaxed italic">
            &ldquo;We&apos;re going to pause here for today. The processing isn&apos;t finished, and
            that&apos;s completely normal. Let&apos;s use the container exercise to safely store any
            remaining material.&rdquo;
          </p>
          <p className="text-sm text-slate-400 leading-relaxed italic">
            &ldquo;Imagine placing any remaining disturbing material into your container. Lock it up.
            It will be there when we come back to it. Then, let&apos;s go to your safe place.&rdquo;
          </p>
        </div>
      )}

      <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
        <h4 className="text-sm font-semibold text-indigo-300 mb-2">Safe Place Reminder</h4>
        <p className="text-sm text-slate-400 leading-relaxed italic">
          &ldquo;Take a moment to visit your safe place. Notice how it feels to be there.
          You can return here any time you need calm.&rdquo;
        </p>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={closureComplete}
          onChange={(e) => setClosureComplete(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-slate-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
        />
        <span className="text-sm text-slate-300">
          Client is stable and grounded — closure exercises complete
        </span>
      </label>

      <div className="flex gap-3">
        <button
          type="button"
          disabled={!closureComplete}
          onClick={onAdvance}
          className="flex-1 rounded-lg bg-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Proceed to Reevaluation
        </button>
        <button
          type="button"
          disabled={!closureComplete}
          onClick={onCompleteSession}
          className="flex-1 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          End Session
        </button>
      </div>
    </div>
  );
}

// ── Reevaluation ──────────────────────────────────────────────────────────────

function ReevaluationContent({
  activeTarget,
  onAdvance,
  onRecordSUD,
  onRecordVOC,
  onCompleteSession,
}: {
  activeTarget: TargetMemory | null;
  onAdvance: () => void;
  onRecordSUD: (v: SUDScore) => void;
  onRecordVOC: (v: VOCScore) => void;
  onCompleteSession: () => void;
}) {
  const [sud, setSud] = useState<SUDScore | null>(null);
  const [voc, setVoc] = useState<VOCScore | null>(null);
  const [betweenSessionNotes, setBetweenSessionNotes] = useState('');
  const [checked, setChecked] = useState(false);

  function handleCheck() {
    if (sud !== null) onRecordSUD(sud);
    if (voc !== null) onRecordVOC(voc);
    setChecked(true);
  }

  const targetResolved = sud !== null && voc !== null && sud <= 1 && voc >= 6;

  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-slate-800/40 border border-slate-700 p-4">
        <h3 className="font-semibold text-white mb-1">Phase 8: Reevaluation</h3>
        <p className="text-sm text-slate-400">
          Review previously processed targets, verify resolution, and plan next steps.
        </p>
      </div>

      {activeTarget && (
        <div className="rounded-lg border border-slate-700 p-4 space-y-1">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Previous Target</h4>
          <p className="text-sm text-slate-300">{activeTarget.description}</p>
          <p className="text-xs text-slate-500">
            Baseline SUD: {activeTarget.baselineSUD} · Baseline VOC: {activeTarget.baselineVOC}
          </p>
        </div>
      )}

      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-300">
          Between-session experiences
        </label>
        <textarea
          value={betweenSessionNotes}
          onChange={(e) => setBetweenSessionNotes(e.target.value)}
          rows={3}
          placeholder="Dreams, memories, thoughts, new material that emerged between sessions..."
          className="w-full rounded-lg bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-600 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
        <SUDScale
          value={sud}
          onChange={setSud}
          label="Current SUD — Return to previous target"
        />
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
        <VOCScale
          value={voc}
          onChange={setVoc}
          label="Current VOC — How true does the PC feel now?"
        />
      </div>

      {!checked && (
        <button
          type="button"
          disabled={sud === null || voc === null}
          onClick={handleCheck}
          className="w-full rounded-lg bg-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Record Reevaluation Scores
        </button>
      )}

      {checked && (
        <div className={`rounded-lg border p-4 ${targetResolved ? 'border-green-500/20 bg-green-500/5' : 'border-yellow-500/20 bg-yellow-500/5'}`}>
          <p className={`text-sm font-semibold ${targetResolved ? 'text-green-300' : 'text-yellow-300'}`}>
            {targetResolved
              ? 'Target appears resolved — SUD ≤ 1 and VOC ≥ 6'
              : 'Target may need additional processing — SUD or VOC not yet at target'}
          </p>
        </div>
      )}

      {checked && (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onAdvance}
            className="flex-1 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            Continue to Assessment
          </button>
          <button
            type="button"
            onClick={onCompleteSession}
            className="flex-1 rounded-lg bg-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-600 transition-colors"
          >
            Complete Treatment
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main PhaseContent dispatcher ─────────────────────────────────────────────

export function PhaseContent({
  phase,
  activeTarget,
  sudHistory,
  vocHistory,
  blsSetCount,
  processingComplete,
  onAdvancePhase,
  onRecordSUD,
  onRecordVOC,
  onSetActiveTarget,
  onBLSSetStart,
  onBLSSetEnd,
  onCompleteSession,
}: PhaseContentProps) {
  switch (phase) {
    case 'history_taking':
      return <HistoryTakingContent onAdvance={onAdvancePhase} />;

    case 'preparation':
      return <PreparationContent onAdvance={onAdvancePhase} />;

    case 'assessment':
      return (
        <AssessmentContent
          onAdvance={onAdvancePhase}
          onRecordSUD={onRecordSUD}
          onRecordVOC={onRecordVOC}
          onSetActiveTarget={onSetActiveTarget}
        />
      );

    case 'desensitization':
      return (
        <DesensitizationContent
          activeTarget={activeTarget}
          sudHistory={sudHistory}
          blsSetCount={blsSetCount}
          onAdvance={onAdvancePhase}
          onRecordSUD={onRecordSUD}
          onBLSSetStart={onBLSSetStart}
          onBLSSetEnd={onBLSSetEnd}
        />
      );

    case 'installation':
      return (
        <InstallationContent
          activeTarget={activeTarget}
          vocHistory={vocHistory}
          blsSetCount={blsSetCount}
          onAdvance={onAdvancePhase}
          onRecordVOC={onRecordVOC}
          onBLSSetStart={onBLSSetStart}
          onBLSSetEnd={onBLSSetEnd}
        />
      );

    case 'body_scan':
      return (
        <BodyScanContent
          activeTarget={activeTarget}
          onAdvance={onAdvancePhase}
          onBLSSetStart={onBLSSetStart}
          onBLSSetEnd={onBLSSetEnd}
        />
      );

    case 'closure':
      return (
        <ClosureContent
          processingComplete={processingComplete}
          onAdvance={onAdvancePhase}
          onCompleteSession={onCompleteSession}
        />
      );

    case 'reevaluation':
      return (
        <ReevaluationContent
          activeTarget={activeTarget}
          onAdvance={onAdvancePhase}
          onRecordSUD={onRecordSUD}
          onRecordVOC={onRecordVOC}
          onCompleteSession={onCompleteSession}
        />
      );

    default:
      return (
        <div className="text-center text-slate-500 py-10">Unknown phase</div>
      );
  }
}
