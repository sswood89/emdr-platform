'use client';

import type { SUDScore } from '@/types/clinical';

interface SUDScaleProps {
  value: SUDScore | null;
  onChange: (value: SUDScore) => void;
  label?: string;
  disabled?: boolean;
}

function getSUDColor(score: number, selected: boolean): string {
  let base: string;
  if (score <= 2) base = selected ? 'bg-green-500 border-green-400' : 'bg-green-900/40 border-green-700 hover:bg-green-800/60';
  else if (score <= 5) base = selected ? 'bg-yellow-500 border-yellow-400' : 'bg-yellow-900/40 border-yellow-700 hover:bg-yellow-800/60';
  else if (score <= 8) base = selected ? 'bg-orange-500 border-orange-400' : 'bg-orange-900/40 border-orange-700 hover:bg-orange-800/60';
  else base = selected ? 'bg-red-500 border-red-400' : 'bg-red-900/40 border-red-700 hover:bg-red-800/60';

  if (selected) base += ' ring-2 ring-white ring-offset-1 ring-offset-slate-900';
  return base;
}

export function SUDScale({ value, onChange, label = 'SUD Level', disabled = false }: SUDScaleProps) {
  const scores: SUDScore[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-300">{label}</label>
        {value !== null && (
          <span className="text-sm font-bold text-white bg-slate-700 rounded-full px-3 py-0.5">
            {value}
          </span>
        )}
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {scores.map((score) => (
          <button
            key={score}
            type="button"
            disabled={disabled}
            onClick={() => onChange(score)}
            className={`
              w-9 h-9 rounded-lg border text-sm font-bold transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
              ${getSUDColor(score, value === score)}
            `}
            aria-pressed={value === score}
            aria-label={`SUD score ${score}`}
          >
            {score}
          </button>
        ))}
      </div>

      <div className="flex justify-between text-xs text-slate-500">
        <span>0 = No disturbance</span>
        <span>10 = Worst imaginable</span>
      </div>
    </div>
  );
}
