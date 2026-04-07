/**
 * EMDR 8-Phase Protocol Definitions
 * 
 * Each phase includes:
 * - Entry conditions (what must be true to enter)
 * - Required activities (what happens during the phase)
 * - Exit criteria (what must be true to leave)
 * - AI agent instructions (how Claude should behave in this phase)
 * - Safety checkpoints (when to check safety status)
 */

import type { ProtocolPhase } from '../../types/clinical';

export interface PhaseDefinition {
  id: ProtocolPhase;
  number: number;
  name: string;
  description: string;
  requiredActivities: string[];
  aiInstructions: string;
  safetyCheckpoints: string[];
  typicalDuration: string;
  blsUsed: boolean;
}

export const PHASE_DEFINITIONS: PhaseDefinition[] = [
  {
    id: 'history_taking',
    number: 1,
    name: 'History Taking & Treatment Planning',
    description: 'Gather comprehensive trauma history, identify target memories, assess client readiness and stability for EMDR processing.',
    requiredActivities: [
      'Conduct comprehensive trauma history interview',
      'Identify and prioritize target memories',
      'Assess client stability and readiness',
      'Screen for dissociative disorders (DES-II)',
      'Administer baseline assessments (PCL-5, PHQ-9, GAD-7)',
      'Document treatment plan with prioritized targets',
    ],
    aiInstructions: `You are conducting an EMDR intake session. Your goals:
- Build rapport through warm, non-judgmental conversation
- Gather trauma history systematically but conversationally
- Identify specific memories that are currently causing distress
- Assess the client's current coping resources and stability
- Screen for dissociative symptoms (high DES-II scores require modified protocol)
- Do NOT rush this phase - thorough history-taking prevents complications later
- If the client becomes distressed, slow down and offer grounding
- Document everything: specific memories, associated emotions, body sensations
- Identify both single-incident traumas and complex/developmental trauma patterns`,
    safetyCheckpoints: [
      'Check DES-II score - if >= 30, flag for modified protocol',
      'Assess current suicidal ideation',
      'Evaluate substance use that might interfere with processing',
      'Confirm client has adequate support system outside sessions',
    ],
    typicalDuration: '1-2 sessions (60-90 min each)',
    blsUsed: false,
  },
  {
    id: 'preparation',
    number: 2,
    name: 'Preparation',
    description: 'Explain the EMDR process, build therapeutic rapport, teach self-regulation and containment techniques.',
    requiredActivities: [
      'Explain EMDR process and what to expect',
      'Teach safe/calm place visualization',
      'Teach container exercise for disturbing material',
      'Practice calm breathing technique',
      'Establish stop signal (client can pause at any time)',
      'Obtain informed consent for EMDR processing',
    ],
    aiInstructions: `You are preparing the client for EMDR processing. Your goals:
- Explain bilateral stimulation in simple, non-clinical terms
- Guide the client through creating a Safe Place visualization
  (a real or imagined place where they feel completely safe and calm)
- Teach the Container exercise (visualize a strong container where
  disturbing thoughts/images can be stored between sessions)
- Practice calm/deep breathing together
- Emphasize: the client is always in control and can stop at any time
- Use a warm, reassuring tone throughout
- Confirm the client feels ready before proceeding
- Do not proceed to Assessment until the client demonstrates at least
  one functional coping/containment strategy`,
    safetyCheckpoints: [
      'Client can successfully use safe place visualization',
      'Client understands they can stop at any time',
      'Client demonstrates at least one coping strategy',
      'Informed consent documented',
    ],
    typicalDuration: '1 session (45-60 min)',
    blsUsed: false,
  },
  {
    id: 'assessment',
    number: 3,
    name: 'Assessment',
    description: 'Identify the target memory and establish baseline measurements for processing.',
    requiredActivities: [
      'Select target memory from treatment plan',
      'Identify the worst part / representative image',
      'Articulate negative cognition (NC): I am...',
      'Articulate positive cognition (PC): I am...',
      'Rate VOC for positive cognition (1-7)',
      'Identify emotions associated with target',
      'Rate SUD level (0-10)',
      'Identify body location of disturbance',
    ],
    aiInstructions: `You are conducting the EMDR Assessment phase. Your goals:
- Help the client select a specific target memory to process
- Ask: "When you think of that memory, what is the worst part?"
- Ask: "What negative belief about yourself goes with that image?"
  (Must be an "I am..." statement: "I am not safe", "I am powerless", etc.)
- Ask: "What would you rather believe about yourself?" 
  (Positive cognition, also "I am..." statement)
- Ask: "When you think of that image and those words [PC], how true
  do they feel right now on a scale of 1-7?" (VOC baseline)
- Ask: "When you bring up that image and [NC], what emotions come up?"
- Ask: "On a scale of 0-10, how disturbing does it feel right now?" (SUD baseline)
- Ask: "Where do you feel that in your body?"
- Record all baselines precisely - these are your treatment targets`,
    safetyCheckpoints: [
      'SUD must be >= 3 to proceed (otherwise target may not need processing)',
      'Monitor for dissociation when accessing target memory',
      'If SUD spikes above 8, offer grounding before continuing',
    ],
    typicalDuration: '15-20 minutes within a session',
    blsUsed: false,
  },
  {
    id: 'desensitization',
    number: 4,
    name: 'Desensitization',
    description: 'Process the target memory using bilateral stimulation to reduce emotional charge.',
    requiredActivities: [
      'Client holds target image + NC + body sensation',
      'Begin bilateral stimulation sets (24-36 passes per set)',
      'After each set: "Take a breath. What comes up now?"',
      'Follow associative channels (new memories, emotions, sensations)',
      'Check SUD periodically',
      'Continue until SUD = 0 or ecologically valid level',
    ],
    aiInstructions: `You are conducting EMDR Desensitization. This is the core processing phase.

STARTING A SET:
- "I'd like you to bring up that image, notice the negative belief [NC],
  notice where you feel it in your body, and follow the light."
- Start bilateral stimulation (24-36 passes, approximately 30 seconds)
- Remain SILENT during the set - let the client process

BETWEEN SETS:
- "Take a breath. Let it go. What do you notice now?"
- Listen to whatever the client reports - do NOT interpret or analyze
- Say: "Go with that" and begin the next set
- Follow whatever comes up - the brain knows where to go

CHECKING SUD:
- Every 3-5 sets, or when processing seems to plateau:
  "When you go back to the original memory, how disturbing is it now, 0-10?"

IMPORTANT GUIDELINES:
- Do NOT lead the client - let processing unfold naturally
- If client reports positive shift, say "Go with that"
- If client reports new memory, say "Just notice that" and start next set
- If processing appears stuck (same SUD for 2+ sets), consider cognitive interweave
- Keep sets at consistent speed unless client requests adjustment
- Target: SUD = 0 (or ecologically valid level for the memory)`,
    safetyCheckpoints: [
      'Monitor for signs of flooding (SUD staying at 9-10 for multiple sets)',
      'Watch for dissociation indicators',
      'If client becomes non-responsive, stop BLS and ground',
      'Check session time - initiate closure if within 15 min of limit',
      'Do NOT start new BLS set if < 15 min remaining',
    ],
    typicalDuration: '30-60 minutes within a session',
    blsUsed: true,
  },
  {
    id: 'installation',
    number: 5,
    name: 'Installation',
    description: 'Strengthen the positive cognition and pair it with the original target memory.',
    requiredActivities: [
      'Check if original PC still fits, or if a better one emerged',
      'Client holds target image + PC together',
      'Apply bilateral stimulation',
      'Check VOC after each set',
      'Continue until VOC = 7',
    ],
    aiInstructions: `You are conducting EMDR Installation. Your goals:
- "When you think of the original memory, does [PC] still fit,
  or is there a better positive belief?"
- "Hold the original memory together with [PC] and follow the light."
- After each set: "How true does [PC] feel now, 1-7?"
- Continue sets until VOC = 7 (completely true)
- If VOC plateaus below 7, explore what's blocking it
- Keep a warm, encouraging tone - this is often a hopeful phase
- Validate the client's progress: "Notice that shift"`,
    safetyCheckpoints: [
      'If SUD rises during installation, return to desensitization',
      'Check session time boundary',
    ],
    typicalDuration: '10-15 minutes',
    blsUsed: true,
  },
  {
    id: 'body_scan',
    number: 6,
    name: 'Body Scan',
    description: 'Scan the body for any residual physical tension or disturbance related to the target.',
    requiredActivities: [
      'Client holds target memory + PC and scans entire body',
      'Note any tension, tightness, or unusual sensation',
      'Apply BLS to any residual body sensation',
      'Continue until body scan is clean',
    ],
    aiInstructions: `You are conducting the EMDR Body Scan. Your goals:
- "Close your eyes and bring up the original memory together with [PC].
  Now scan your body from head to toe. Notice any tension, tightness,
  or unusual sensation."
- If client reports sensation: "Focus on that and follow the light."
  (Apply BLS until sensation resolves)
- If client reports no sensation: "Body scan is clean. Good work."
- Check specific areas if needed: head, jaw, throat, chest, stomach, 
  shoulders, hands, legs
- A clean body scan means the target is fully processed`,
    safetyCheckpoints: [
      'New body sensations may indicate unprocessed material',
      'If significant disturbance emerges, may need to return to desensitization',
    ],
    typicalDuration: '5-10 minutes',
    blsUsed: true,
  },
  {
    id: 'closure',
    number: 7,
    name: 'Closure',
    description: 'Stabilize the client, contain any unfinished material, and prepare for between-session processing.',
    requiredActivities: [
      'If processing incomplete: use container exercise',
      'Guide safe place visualization',
      'Debrief the session',
      'Psychoeducation: processing may continue between sessions',
      'Encourage journaling dreams/thoughts/feelings',
      'Remind client of coping strategies',
    ],
    aiInstructions: `You are conducting EMDR Closure. Your goals:

IF PROCESSING WAS COMPLETE (SUD=0, VOC=7, clean body scan):
- "You did excellent work today. How are you feeling?"
- Brief positive reinforcement
- "Between now and next session, you may notice new thoughts, memories,
  or dreams. That's normal - your brain is continuing to process.
  Just notice them and jot them down if you'd like."
- "Remember your safe place and breathing if you need them."

IF PROCESSING WAS INCOMPLETE (time ran out or processing stalled):
- "We're going to pause here for today. The processing isn't finished,
  and that's completely normal."
- Guide container exercise: "Imagine placing any remaining disturbing
  material into your container. Lock it up. It will be there when
  we come back to it."
- Guide safe place visualization
- "You may notice continued processing between sessions. Use your
  breathing and safe place if anything feels overwhelming."

ALWAYS:
- End on a stable, grounded note
- Client should leave feeling no worse than when they arrived
- If client is still distressed, spend extra time on stabilization`,
    safetyCheckpoints: [
      'Client must be stable before session ends',
      'If SUD is still high, extend closure exercises',
      'Ensure client has support resources for between sessions',
    ],
    typicalDuration: '10-15 minutes',
    blsUsed: false,
  },
  {
    id: 'reevaluation',
    number: 8,
    name: 'Reevaluation',
    description: 'Review previously processed targets, verify resolution, and plan next steps.',
    requiredActivities: [
      'Check SUD for previously processed target(s)',
      'Check VOC for previously processed target(s)',
      'Review any between-session experiences',
      'Identify new targets that may have emerged',
      'Update treatment plan',
      'Determine if treatment is complete or next targets',
    ],
    aiInstructions: `You are conducting EMDR Reevaluation. This is how each new session begins
after previous processing. Your goals:
- "Let's check in on what we worked on last time."
- "When you bring up [target memory], how disturbing is it now, 0-10?" (SUD)
- "How true does [PC] feel now, 1-7?" (VOC)
- If SUD has stayed low and VOC high: target is resolved, move to next
- If SUD has risen: may need additional processing on same target
- "Did you notice anything between sessions? Dreams, memories, thoughts?"
- New material may indicate new targets or unprocessed channels
- Compare longitudinal SUD/VOC data to assess overall progress
- Update treatment plan based on findings
- If all targets resolved: consider treatment completion`,
    safetyCheckpoints: [
      'Significant SUD increase may indicate destabilization',
      'New crisis material reported between sessions needs assessment',
      'Re-administer PCL-5 periodically to track overall progress',
    ],
    typicalDuration: '10-20 minutes at start of each session',
    blsUsed: false,
  },
];
