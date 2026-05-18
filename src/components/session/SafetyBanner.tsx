'use client';

import type { SafetyLevel } from '@/types/clinical';

interface SafetyBannerProps {
  level: SafetyLevel;
  message?: string;
}

export function SafetyBanner({ level, message }: SafetyBannerProps) {
  if (level === 'normal') return null;

  const configs = {
    elevated: {
      bg: 'bg-yellow-500/10 border-yellow-500/30',
      icon: '⚠',
      iconColor: 'text-yellow-400',
      textColor: 'text-yellow-300',
      title: 'Elevated Attention',
      defaultMessage: 'Monitoring client response. Check in if processing appears difficult.',
    },
    high: {
      bg: 'bg-orange-500/10 border-orange-500/30',
      icon: '⚠',
      iconColor: 'text-orange-400',
      textColor: 'text-orange-300',
      title: 'High Distress Level',
      defaultMessage:
        'Client may be experiencing significant distress. Consider pausing and offering grounding.',
    },
    critical: {
      bg: 'bg-red-600/10 border-red-500/40',
      icon: '🚨',
      iconColor: 'text-red-400',
      textColor: 'text-red-300',
      title: 'Critical Safety Alert',
      defaultMessage: 'Session paused. Crisis support available: Call or text 988.',
    },
  };

  const config = configs[level];

  return (
    <div
      role="alert"
      className={`rounded-lg border px-4 py-3 flex items-start gap-3 ${config.bg}`}
    >
      <span className={`text-lg flex-shrink-0 ${config.iconColor}`} aria-hidden>
        {config.icon}
      </span>
      <div>
        <p className={`text-sm font-semibold ${config.textColor}`}>{config.title}</p>
        <p className={`text-xs mt-0.5 ${config.textColor} opacity-80`}>
          {message ?? config.defaultMessage}
        </p>
        {level === 'critical' && (
          <a
            href="tel:988"
            className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-red-300 underline underline-offset-2 hover:text-red-200"
          >
            Call or text 988 — Suicide &amp; Crisis Lifeline
          </a>
        )}
      </div>
    </div>
  );
}
