/**
 * Event system types for the EMDR Platform.
 * All inter-subsystem communication uses typed events.
 * Events are persisted to an append-only log for audit trails.
 */

import type {
  SUDScore, VOCScore, ProtocolPhase, BLSParameters,
  SafetyLevel, CrisisDetectionLevel, EmotionalState, PatternDetection
} from './clinical';

// ── Base Event ──

export interface BaseEvent {
  id: string;
  sessionId: string;
  timestamp: Date;
  source: EventSource;
}

export type EventSource =
  | 'bls_engine'
  | 'protocol_engine'
  | 'voice_agent'
  | 'assessment_system'
  | 'safety_layer'
  | 'therapist_dashboard'
  | 'client_input';

// ── BLS Events ──

export interface BLSStartEvent extends BaseEvent {
  type: 'bls.start';
  setNumber: number;
  parameters: BLSParameters;
}

export interface BLSStopEvent extends BaseEvent {
  type: 'bls.stop';
  setNumber: number;
  durationSeconds: number;
}

export interface BLSParameterChangeEvent extends BaseEvent {
  type: 'bls.parameter_change';
  parameter: keyof BLSParameters;
  oldValue: unknown;
  newValue: unknown;
  reason: 'user_input' | 'protocol_engine' | 'therapist_override' | 'safety_adjustment';
}

// ── Protocol Events ──

export interface PhaseTransitionEvent extends BaseEvent {
  type: 'protocol.phase_transition';
  fromPhase: ProtocolPhase;
  toPhase: ProtocolPhase;
  reason: string;
}

export interface ProtocolDecisionEvent extends BaseEvent {
  type: 'protocol.decision';
  phase: ProtocolPhase;
  decision: string;
  reasoning: string;
  confidence: number;
}

// ── Voice Events ──

export interface TranscriptEvent extends BaseEvent {
  type: 'voice.transcript';
  text: string;
  speaker: 'client' | 'agent';
  wordTimestamps?: Array<{ word: string; start: number; end: number }>;
  emotionalMarkers?: string[];
}

export interface VoiceResponseEvent extends BaseEvent {
  type: 'voice.response';
  text: string;
  suggestedTone: 'calm' | 'warm' | 'gentle' | 'grounding' | 'encouraging';
  suggestedSpeed: number;
  pauseBefore: number;
}

export interface PatternDetectedEvent extends BaseEvent {
  type: 'voice.pattern_detected';
  pattern: PatternDetection;
}

// ── Assessment Events ──

export interface SUDRecordedEvent extends BaseEvent {
  type: 'assessment.sud_recorded';
  value: SUDScore;
  blsSetNumber: number;
  phase: ProtocolPhase;
}

export interface VOCRecordedEvent extends BaseEvent {
  type: 'assessment.voc_recorded';
  value: VOCScore;
  blsSetNumber: number;
  phase: ProtocolPhase;
}

export interface ScreeningCompletedEvent extends BaseEvent {
  type: 'assessment.screening_completed';
  instrument: 'pcl5' | 'des2' | 'ace' | 'phq9' | 'gad7' | 'bdi2';
  totalScore: number;
  thresholdMet: boolean;
}

// ── Safety Events ──

export interface SafetyAlertEvent extends BaseEvent {
  type: 'safety.alert';
  level: SafetyLevel;
  detectionLevel: CrisisDetectionLevel;
  description: string;
  triggerContent?: string;
  action: 'monitor' | 'check_in' | 'ground' | 'pause' | 'escalate' | 'terminate';
}

export interface DissociationDetectedEvent extends BaseEvent {
  type: 'safety.dissociation_detected';
  indicatorType: 'verbal' | 'behavioral';
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
}

export interface SessionBoundaryEvent extends BaseEvent {
  type: 'safety.session_boundary';
  boundary: 'time_warning' | 'time_limit' | 'forced_closure';
  remainingMinutes: number;
}

export interface TherapistInterventionEvent extends BaseEvent {
  type: 'safety.therapist_intervention';
  interventionType: 'voice_takeover' | 'override_decision' | 'adjust_protocol' | 'terminate_session';
  reason: string;
}

// ── Union Type ──

export type EMDREvent =
  | BLSStartEvent
  | BLSStopEvent
  | BLSParameterChangeEvent
  | PhaseTransitionEvent
  | ProtocolDecisionEvent
  | TranscriptEvent
  | VoiceResponseEvent
  | PatternDetectedEvent
  | SUDRecordedEvent
  | VOCRecordedEvent
  | ScreeningCompletedEvent
  | SafetyAlertEvent
  | DissociationDetectedEvent
  | SessionBoundaryEvent
  | TherapistInterventionEvent;
