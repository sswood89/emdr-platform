import { create } from 'zustand';
import { createActor } from 'xstate';
import { protocolMachine } from '../engine/protocol/machine';
import type {
  TherapySession,
  ProtocolPhase,
  SUDScore,
  VOCScore,
  SafetyLevel,
  TargetMemory,
} from '../types/clinical';
import type { EMDREvent } from '../types/events';

interface SessionState {
  session: TherapySession | null;
  isSessionActive: boolean;
  currentPhase: ProtocolPhase;
  blsIsRunning: boolean;
  safetyStatus: SafetyLevel;
  events: EMDREvent[];
  protocolActor: ReturnType<typeof createActor<typeof protocolMachine>> | null;
  sudHistory: SUDScore[];
  vocHistory: VOCScore[];
  activeTarget: TargetMemory | null;
  blsSetCount: number;
  sessionStartTime: Date | null;

  startSession: (clientId: string) => void;
  endSession: () => void;
  recordSUD: (value: SUDScore) => void;
  recordVOC: (value: VOCScore) => void;
  advancePhase: (reason?: string) => void;
  setBLSRunning: (running: boolean) => void;
  emitEvent: (event: EMDREvent) => void;
  setActiveTarget: (target: TargetMemory) => void;
  triggerClosure: (reason: string) => void;
  completeSession: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  session: null,
  isSessionActive: false,
  currentPhase: 'history_taking',
  blsIsRunning: false,
  safetyStatus: 'normal',
  events: [],
  protocolActor: null,
  sudHistory: [],
  vocHistory: [],
  activeTarget: null,
  blsSetCount: 0,
  sessionStartTime: null,

  startSession: (clientId: string) => {
    const sessionId = crypto.randomUUID();
    const actor = createActor(protocolMachine, {
      input: { sessionId, clientId },
    });

    actor.subscribe((snapshot) => {
      set({
        currentPhase: snapshot.context.currentPhase,
        blsSetCount: snapshot.context.blsSetCount,
        safetyStatus: snapshot.context.safetyStatus,
        activeTarget: snapshot.context.activeTarget,
      });
    });

    actor.start();

    const session: TherapySession = {
      id: sessionId,
      clientId,
      startTime: new Date(),
      status: 'active',
      currentPhase: 'history_taking',
      supervisionTier: 'full',
      targetMemories: [],
      blsSets: [],
      sudReadings: [],
      vocReadings: [],
      safetyFlags: [],
      maxDurationMinutes: 90,
    };

    set({
      session,
      isSessionActive: true,
      protocolActor: actor,
      currentPhase: 'history_taking',
      sessionStartTime: new Date(),
      sudHistory: [],
      vocHistory: [],
      events: [],
      blsSetCount: 0,
    });
  },

  endSession: () => {
    const { protocolActor } = get();
    protocolActor?.stop();
    set({
      isSessionActive: false,
      session: null,
      protocolActor: null,
      currentPhase: 'history_taking',
      blsIsRunning: false,
      sessionStartTime: null,
    });
  },

  recordSUD: (value: SUDScore) => {
    const { protocolActor } = get();
    protocolActor?.send({ type: 'RECORD_SUD', value });
    set((state) => ({ sudHistory: [...state.sudHistory, value] }));
  },

  recordVOC: (value: VOCScore) => {
    const { protocolActor } = get();
    protocolActor?.send({ type: 'RECORD_VOC', value });
    set((state) => ({ vocHistory: [...state.vocHistory, value] }));
  },

  advancePhase: (reason = 'Phase criteria met') => {
    const { protocolActor } = get();
    protocolActor?.send({ type: 'ADVANCE_PHASE', reason });
  },

  setBLSRunning: (running: boolean) => set({ blsIsRunning: running }),

  emitEvent: (event: EMDREvent) => {
    set((state) => ({ events: [...state.events, event] }));
  },

  setActiveTarget: (target: TargetMemory) => {
    const { protocolActor } = get();
    protocolActor?.send({ type: 'SELECT_TARGET', target });
    set({ activeTarget: target });
  },

  triggerClosure: (reason: string) => {
    const { protocolActor } = get();
    protocolActor?.send({ type: 'FORCE_CLOSURE', reason });
  },

  completeSession: () => {
    const { protocolActor } = get();
    protocolActor?.send({ type: 'COMPLETE_SESSION' });
    set({ isSessionActive: false });
  },
}));
