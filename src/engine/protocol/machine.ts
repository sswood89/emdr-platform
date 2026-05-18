import { createMachine, assign } from 'xstate';
import type { ProtocolContext, ProtocolMachineEvent } from '../../types/protocol';
import type { ProtocolPhase } from '../../types/clinical';

export const protocolMachine = createMachine({
  id: 'emdr_protocol',
  types: {} as { context: ProtocolContext; events: ProtocolMachineEvent },
  initial: 'history_taking',
  context: ({ input }: { input?: Partial<ProtocolContext> }) => ({
    sessionId: input?.sessionId ?? '',
    clientId: input?.clientId ?? '',
    currentPhase: 'history_taking' as ProtocolPhase,
    phaseHistory: [],
    activeTarget: null,
    allTargets: [],
    blsSetCount: 0,
    sessionStartTime: new Date(),
    sessionMaxMinutes: 90,
    safetyStatus: 'normal' as const,
    closureInitiated: false,
    processingComplete: false,
  }),
  states: {
    history_taking: {
      on: {
        ADVANCE_PHASE: {
          target: 'preparation',
          actions: assign(({ context, event }) => ({
            currentPhase: 'preparation' as ProtocolPhase,
            phaseHistory: [
              ...context.phaseHistory,
              {
                phase: context.currentPhase,
                enteredAt: new Date(),
                exitedAt: new Date(),
                exitReason: event.reason,
                completionStatus: 'completed' as const,
              },
            ],
          })),
        },
        FORCE_CLOSURE: { target: 'closure' },
        SAFETY_ALERT: {
          actions: assign({ safetyStatus: ({ event }) => event.level }),
        },
      },
    },
    preparation: {
      on: {
        ADVANCE_PHASE: {
          target: 'assessment',
          actions: assign(({ context, event }) => ({
            currentPhase: 'assessment' as ProtocolPhase,
            phaseHistory: [
              ...context.phaseHistory,
              {
                phase: context.currentPhase,
                enteredAt: new Date(),
                exitedAt: new Date(),
                exitReason: event.reason,
                completionStatus: 'completed' as const,
              },
            ],
          })),
        },
        REGRESS_PHASE: {
          target: 'history_taking',
          actions: assign({ currentPhase: 'history_taking' as ProtocolPhase }),
        },
        FORCE_CLOSURE: { target: 'closure' },
        SAFETY_ALERT: {
          actions: assign({ safetyStatus: ({ event }) => event.level }),
        },
      },
    },
    assessment: {
      on: {
        ADVANCE_PHASE: {
          target: 'desensitization',
          actions: assign(({ context, event }) => ({
            currentPhase: 'desensitization' as ProtocolPhase,
            phaseHistory: [
              ...context.phaseHistory,
              {
                phase: context.currentPhase,
                enteredAt: new Date(),
                exitedAt: new Date(),
                exitReason: event.reason,
                completionStatus: 'completed' as const,
              },
            ],
          })),
        },
        SELECT_TARGET: {
          actions: assign({ activeTarget: ({ event }) => event.target }),
        },
        RECORD_SUD: {},
        RECORD_VOC: {},
        FORCE_CLOSURE: { target: 'closure' },
        SAFETY_ALERT: {
          actions: assign({ safetyStatus: ({ event }) => event.level }),
        },
      },
    },
    desensitization: {
      on: {
        ADVANCE_PHASE: {
          target: 'installation',
          actions: assign(({ context, event }) => ({
            currentPhase: 'installation' as ProtocolPhase,
            phaseHistory: [
              ...context.phaseHistory,
              {
                phase: context.currentPhase,
                enteredAt: new Date(),
                exitedAt: new Date(),
                exitReason: event.reason,
                completionStatus: 'completed' as const,
              },
            ],
          })),
        },
        START_BLS_SET: {},
        END_BLS_SET: {
          actions: assign({
            blsSetCount: ({ context }) => context.blsSetCount + 1,
          }),
        },
        RECORD_SUD: {},
        FORCE_CLOSURE: { target: 'closure' },
        SAFETY_ALERT: {
          actions: assign({ safetyStatus: ({ event }) => event.level }),
        },
        SESSION_TIME_LIMIT: { target: 'closure' },
      },
    },
    installation: {
      on: {
        ADVANCE_PHASE: {
          target: 'body_scan',
          actions: assign(({ context, event }) => ({
            currentPhase: 'body_scan' as ProtocolPhase,
            phaseHistory: [
              ...context.phaseHistory,
              {
                phase: context.currentPhase,
                enteredAt: new Date(),
                exitedAt: new Date(),
                exitReason: event.reason,
                completionStatus: 'completed' as const,
              },
            ],
          })),
        },
        END_BLS_SET: {
          actions: assign({
            blsSetCount: ({ context }) => context.blsSetCount + 1,
          }),
        },
        RECORD_VOC: {},
        FORCE_CLOSURE: { target: 'closure' },
        SAFETY_ALERT: {
          actions: assign({ safetyStatus: ({ event }) => event.level }),
        },
      },
    },
    body_scan: {
      on: {
        ADVANCE_PHASE: {
          target: 'closure',
          actions: assign(({ context, event }) => ({
            currentPhase: 'closure' as ProtocolPhase,
            processingComplete: true,
            phaseHistory: [
              ...context.phaseHistory,
              {
                phase: context.currentPhase,
                enteredAt: new Date(),
                exitedAt: new Date(),
                exitReason: event.reason,
                completionStatus: 'completed' as const,
              },
            ],
          })),
        },
        END_BLS_SET: {
          actions: assign({
            blsSetCount: ({ context }) => context.blsSetCount + 1,
          }),
        },
        FORCE_CLOSURE: { target: 'closure' },
        SAFETY_ALERT: {
          actions: assign({ safetyStatus: ({ event }) => event.level }),
        },
      },
    },
    closure: {
      entry: assign({
        closureInitiated: true,
        currentPhase: 'closure' as ProtocolPhase,
      }),
      on: {
        ADVANCE_PHASE: {
          target: 'reevaluation',
          actions: assign(({ context, event }) => ({
            currentPhase: 'reevaluation' as ProtocolPhase,
            phaseHistory: [
              ...context.phaseHistory,
              {
                phase: 'closure' as ProtocolPhase,
                enteredAt: new Date(),
                exitedAt: new Date(),
                exitReason: event.reason,
                completionStatus: 'completed' as const,
              },
            ],
          })),
        },
        COMPLETE_SESSION: { target: 'completed' },
      },
    },
    reevaluation: {
      entry: assign({ currentPhase: 'reevaluation' as ProtocolPhase }),
      on: {
        ADVANCE_PHASE: { target: 'assessment' },
        COMPLETE_SESSION: { target: 'completed' },
        RECORD_SUD: {},
        RECORD_VOC: {},
      },
    },
    completed: {
      type: 'final',
    },
  },
  on: {
    THERAPIST_OVERRIDE: {
      actions: assign({ safetyStatus: 'elevated' as const }),
    },
    SESSION_TIME_WARNING: {},
  },
});
