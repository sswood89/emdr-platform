'use client';

import { useState } from 'react';
import type { PCL5Assessment, PCL5Response } from '@/types/clinical';

const PCL5_ITEMS = [
  'Repeated, disturbing, and unwanted memories of the stressful experience?',
  'Repeated, disturbing dreams of the stressful experience?',
  'Suddenly feeling or acting as if the stressful experience were actually happening again (as if you were actually back there reliving it)?',
  'Feeling very upset when something reminded you of the stressful experience?',
  'Having strong physical reactions when something reminded you of the stressful experience (for example, heart pounding, trouble breathing, sweating)?',
  'Avoiding memories, thoughts, or feelings related to the stressful experience?',
  'Avoiding external reminders of the stressful experience (for example, people, places, conversations, activities, objects, or situations)?',
  'Trouble remembering important parts of the stressful experience?',
  'Having strong negative beliefs about yourself, other people, or the world (for example, having thoughts such as: I am bad, there is something seriously wrong with me, no one can be trusted, the world is completely dangerous)?',
  'Blaming yourself or someone else for the stressful experience or what happened after it?',
  'Having strong negative feelings such as fear, horror, anger, guilt, or shame?',
  'Loss of interest in activities that you used to enjoy?',
  'Feeling distant or cut off from other people?',
  'Trouble experiencing positive feelings (for example, being unable to feel happiness or have loving feelings for people close to you)?',
  'Irritable behavior, angry outbursts, or acting aggressively?',
  'Taking too many risks or doing things that could cause you harm?',
  'Being "superalert" or watchful or on guard?',
  'Feeling jumpy or easily startled?',
  'Having difficulty concentrating?',
  'Trouble falling or staying asleep?',
];

const RESPONSE_LABELS: Record<PCL5Response, string> = {
  0: 'Not at all',
  1: 'A little bit',
  2: 'Moderately',
  3: 'Quite a bit',
  4: 'Extremely',
};

interface PCL5FormProps {
  clientId: string;
  onComplete: (assessment: PCL5Assessment) => void;
}

export function PCL5Form({ clientId, onComplete }: PCL5FormProps) {
  const [responses, setResponses] = useState<(PCL5Response | null)[]>(
    new Array(20).fill(null)
  );

  const allAnswered = responses.every((r) => r !== null);
  const totalScore = responses.reduce<number>(
    (sum, r) => sum + (r ?? 0),
    0
  );

  function setResponse(index: number, value: PCL5Response) {
    setResponses((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function handleSubmit() {
    if (!allAnswered) return;
    const definiteResponses = responses as PCL5Response[];

    const clusterScores = {
      intrusion: definiteResponses.slice(0, 5).reduce<number>((s, v) => s + v, 0),
      avoidance: definiteResponses.slice(5, 7).reduce<number>((s, v) => s + v, 0),
      cognitionMood: definiteResponses.slice(7, 14).reduce<number>((s, v) => s + v, 0),
      arousalReactivity: definiteResponses.slice(14, 20).reduce<number>((s, v) => s + v, 0),
    };

    const assessment: PCL5Assessment = {
      id: crypto.randomUUID(),
      clientId,
      responses: definiteResponses,
      totalScore,
      clusterScores,
      administeredAt: new Date(),
      clinicalThresholdMet: totalScore >= 31,
    };

    onComplete(assessment);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-4">
        <h3 className="font-semibold text-white mb-1">PCL-5 Assessment</h3>
        <p className="text-sm text-slate-400">
          In the past month, how much were you bothered by the following problems?
        </p>
      </div>

      <div className="space-y-5">
        {PCL5_ITEMS.map((item, index) => {
          const clusterLabel =
            index < 5 ? 'Intrusion'
            : index < 7 ? 'Avoidance'
            : index < 14 ? 'Cognition & Mood'
            : 'Arousal & Reactivity';

          const showClusterHeader =
            index === 0 || index === 5 || index === 7 || index === 14;

          return (
            <div key={index}>
              {showClusterHeader && (
                <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-3 pt-1 border-t border-slate-800">
                  {clusterLabel}
                </div>
              )}
              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                <div className="flex items-start gap-3 mb-4">
                  <span className="flex-shrink-0 text-xs font-bold text-slate-500 bg-slate-800 rounded px-1.5 py-0.5 mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-sm text-slate-300 leading-relaxed">{item}</p>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {([0, 1, 2, 3, 4] as PCL5Response[]).map((responseVal) => {
                    const selected = responses[index] === responseVal;
                    return (
                      <button
                        key={responseVal}
                        type="button"
                        onClick={() => setResponse(index, responseVal)}
                        className={`
                          py-2 px-1 rounded-lg border text-xs font-medium transition-all text-center
                          ${selected
                            ? 'bg-indigo-600 border-indigo-500 text-white ring-2 ring-indigo-400 ring-offset-1 ring-offset-slate-900'
                            : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                          }
                        `}
                        aria-pressed={selected}
                      >
                        <span className="block text-xs font-bold mb-0.5">{responseVal}</span>
                        <span className="block text-[10px] leading-tight">
                          {RESPONSE_LABELS[responseVal]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Running total */}
      <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">
            {allAnswered
              ? 'All items completed'
              : `${responses.filter((r) => r !== null).length} / 20 answered`}
          </p>
          {allAnswered && (
            <p className="text-xs text-slate-500 mt-0.5">
              {totalScore >= 31
                ? 'Score meets clinical threshold (≥31)'
                : 'Score below clinical threshold'}
            </p>
          )}
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-white">{totalScore}</span>
          <span className="text-slate-500 text-sm"> / 80</span>
        </div>
      </div>

      <button
        type="button"
        disabled={!allAnswered}
        onClick={handleSubmit}
        className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
      >
        Submit Assessment
      </button>
    </div>
  );
}
