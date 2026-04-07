/**
 * Core clinical data types for the EMDR Platform.
 * All clinical data flowing through the system must use these types.
 */

// ── Assessment Scales ──

/** Subjective Units of Disturbance (0-10) */
export type SUDScore = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/** Validity of Cognition (1-7) */
export type VOCScore = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** PCL-5 item response (0-4) */
export type PCL5Response = 0 | 1 | 2 | 3 | 4;

/** DES-II item response (0-100, typically in increments of 10) */
export type DESResponse = number;

export interface SUDReading {
  value: SUDScore;
  timestamp: Date;
  blsSetNumber: number;
  phase: ProtocolPhase;
  notes?: string;
}

export interface VOCReading {
  value: VOCScore;
  timestamp: Date;
  blsSetNumber: number;
  phase: ProtocolPhase;
  notes?: string;
}

export interface PCL5Assessment {
  id: string;
  clientId: string;
  responses: PCL5Response[];
  totalScore: number;
  clusterScores: {
    intrusion: number;      // Items 1-5
    avoidance: number;      // Items 6-7
    cognitionMood: number;  // Items 8-14
    arousalReactivity: number; // Items 15-20
  };
  administeredAt: Date;
  clinicalThresholdMet: boolean; // >= 31-33
}

// ── EMDR Protocol Types ──

export type ProtocolPhase =
  | 'history_taking'
  | 'preparation'
  | 'assessment'
  | 'desensitization'
  | 'installation'
  | 'body_scan'
  | 'closure'
  | 'reevaluation';

export interface TargetMemory {
  id: string;
  description: string;
  negativeCognition: string;
  positiveCognition: string;
  emotions: string[];
  bodyLocation: string;
  baselineSUD: SUDScore;
  baselineVOC: VOCScore;
  currentSUD: SUDScore;
  currentVOC: VOCScore;
  resolved: boolean;
  createdAt: Date;
}

export interface BLSParameters {
  speed: number;
  size: number;
  color: string;
  shape: 'circle' | 'diamond' | 'butterfly' | 'star';
  path: 'linear' | 'arc' | 'figure8';
  background: string;
  audioEnabled: boolean;
  audioTone: 'sine' | 'square' | 'click' | 'nature';
  audioVolume: number;
}

export interface BLSSet {
  id: string;
  setNumber: number;
  startTime: Date;
  endTime?: Date;
  durationSeconds: number;
  parameters: BLSParameters;
  preSUD?: SUDScore;
  postSUD?: SUDScore;
}

// ── Session Types ──

export type SessionStatus = 'active' | 'paused' | 'completed' | 'terminated' | 'escalated';

export type SupervisionTier = 'full' | 'async' | 'autonomous';

export interface TherapySession {
  id: string;
  clientId: string;
  startTime: Date;
  endTime?: Date;
  status: SessionStatus;
  currentPhase: ProtocolPhase;
  supervisionTier: SupervisionTier;
  targetMemories: TargetMemory[];
  blsSets: BLSSet[];
  sudReadings: SUDReading[];
  vocReadings: VOCReading[];
  safetyFlags: SafetyFlag[];
  maxDurationMinutes: number;
}

// ── Safety Types ──

export type SafetyLevel = 'normal' | 'elevated' | 'high' | 'critical';

export type CrisisDetectionLevel = 'keyword' | 'semantic' | 'behavioral' | 'longitudinal';

export interface SafetyFlag {
  id: string;
  level: SafetyLevel;
  detectionLevel: CrisisDetectionLevel;
  description: string;
  timestamp: Date;
  resolved: boolean;
  action: 'monitor' | 'check_in' | 'ground' | 'pause' | 'escalate' | 'terminate';
}

export interface DissociationIndicator {
  type: 'verbal' | 'behavioral';
  description: string;
  timestamp: Date;
  severity: 'mild' | 'moderate' | 'severe';
}

// ── Voice Agent Types ──

export type EmotionalState =
  | 'calm'
  | 'mildDistress'
  | 'moderateDistress'
  | 'highDistress'
  | 'flooding'
  | 'numb'
  | 'dissociated'
  | 'processing'
  | 'resolving'
  | 'integrated';

export interface PatternDetection {
  domain: 'emotional' | 'cognitive' | 'processing' | 'avoidance' | 'somatic' | 'readiness';
  pattern: string;
  confidence: number;
  suggestedResponse: string;
  timestamp: Date;
}

export interface VoiceAgentContext {
  currentPhase: ProtocolPhase;
  sessionHistory: string;
  emotionalState: EmotionalState;
  sudTrajectory: SUDScore[];
  vocTrajectory: VOCScore[];
  activeTarget: TargetMemory | null;
  safetyStatus: SafetyLevel;
  detectedPatterns: PatternDetection[];
  blsSetCount: number;
  sessionElapsedMinutes: number;
}

// ── Client Profile ──

export interface ClientProfile {
  id: string;
  createdAt: Date;
  screeningResults: {
    pcl5?: PCL5Assessment;
    desII?: { totalScore: number; significantDissociation: boolean };
    ace?: { score: number };
    phq9?: { score: number; severity: string };
    gad7?: { score: number; severity: string };
  };
  sessions: TherapySession[];
  targetMemories: TargetMemory[];
  treatmentPlan: {
    goals: string[];
    prioritizedTargets: string[];
    supervisionTier: SupervisionTier;
    notes: string;
  };
}
