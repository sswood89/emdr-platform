/**
 * Protocol state machine types for the EMDR Platform.
 * Used by XState to model the 8-phase EMDR protocol.
 */

import type { ProtocolPhase, SUDScore, VOCScore, TargetMemory, SafetyLevel } from './clinical';

export interface ProtocolContext {
  sessionId: string;
  clientId: string;
  currentPhase: ProtocolPhase;
  phaseHistory: PhaseRecord[];
  activeTarget: TargetMemory | null;
  allTargets: TargetMemory[];
  blsSetCount: number;
  sessionStartTime: Date;
  sessionMaxMinutes: number;
  safetyStatus: SafetyLevel;
  closureInitiated: boolean;
  processingComplete: boolean;
}

export interface PhaseRecord {
  phase: ProtocolPhase;
  enteredAt: Date;
  exitedAt?: Date;
  exitReason?: string;
  completionStatus: 'completed' | 'incomplete' | 'skipped_safety';
}

export type ProtocolMachineEvent =
  | { type: 'ADVANCE_PHASE'; reason: string }
  | { type: 'REGRESS_PHASE'; targetPhase: ProtocolPhase; reason: string }
  | { type: 'RECORD_SUD'; value: SUDScore }
  | { type: 'RECORD_VOC'; value: VOCScore }
  | { type: 'SELECT_TARGET'; target: TargetMemory }
  | { type: 'START_BLS_SET' }
  | { type: 'END_BLS_SET'; durationSeconds: number }
  | { type: 'SAFETY_ALERT'; level: SafetyLevel }
  | { type: 'FORCE_CLOSURE'; reason: string }
  | { type: 'THERAPIST_OVERRIDE'; action: string; reason: string }
  | { type: 'SESSION_TIME_WARNING'; remainingMinutes: number }
  | { type: 'SESSION_TIME_LIMIT' }
  | { type: 'COMPLETE_SESSION' };

export interface ProtocolGuards {
  canAdvancePhase: (context: ProtocolContext) => boolean;
  canStartBLS: (context: ProtocolContext) => boolean;
  isDesensitizationComplete: (context: ProtocolContext) => boolean;
  isInstallationComplete: (context: ProtocolContext) => boolean;
  isBodyScanClean: (context: ProtocolContext) => boolean;
  isSafetyCompromised: (context: ProtocolContext) => boolean;
  isSessionTimeExpiring: (context: ProtocolContext) => boolean;
}
