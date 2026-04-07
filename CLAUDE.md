# EMDR Autonomous Therapy Platform — Claude Code Project Spec

This file is the primary reference for Claude Code when working on this project. It contains the complete system architecture, coding standards, and implementation guidance.

## Project Overview

An autonomous EMDR (Eye Movement Desensitization and Reprocessing) therapy platform that delivers clinically faithful bilateral stimulation, administers validated psychological assessments, and conducts adaptive voice-guided therapy sessions powered by AI.

**Target:** Web-first (Next.js), mobile expansion planned (React Native)
**AI Stack:** Claude API (clinical reasoning) + Deepgram (STT) + ElevenLabs (TTS)
**Clinical Foundation:** Francine Shapiro's 8-Phase EMDR Protocol / Adaptive Information Processing (AIP) model

---

## Architecture

### 5 Core Subsystems

1. **Bilateral Stimulation Engine** (`src/engine/bls/`)
   - Visual: Canvas API rendering of configurable stimulus (dot/bar/butterfly/star)
   - Auditory: Web Audio API stereo panning tones synced to visual
   - Haptic: Vibration API (mobile only)
   - Parameters: speed (0.3–4.0s/cycle), size (8–80px), color, shape, path (linear/arc/figure-8), background
   - All parameters exposed via WebSocket for real-time control

2. **Clinical Protocol Engine** (`src/engine/protocol/`)
   - Hierarchical state machine (XState) implementing all 8 EMDR phases
   - No phase can be skipped; regression handled gracefully
   - Three-pronged targeting: past memories, present triggers, future templates
   - Claude API serves as adaptive decision layer within each phase
   - Strict guardrails: AI cannot skip phases or override safety thresholds

3. **Assessment & Instrumentation** (`src/assessments/`)
   - Core: SUD (0–10), VOC (1–7)
   - Screening: PCL-5 (20 items, threshold ≥31–33), DES-II (28 items, threshold ≥30), ACE (10 items), PHQ-9 (9 items), GAD-7 (7 items), BDI-II (21 items)
   - All scoring algorithms follow peer-reviewed norms
   - Longitudinal tracking with trend visualization

4. **Voice Agent System** (`src/voice/`)
   - Pipeline: User Speech → Deepgram STT (streaming, <300ms) → Claude API (reasoning) → ElevenLabs TTS (custom therapeutic voice)
   - Pattern recognition: emotional trajectory, cognitive themes, processing loops, avoidance patterns, somatic signals, readiness indicators
   - Adaptive pacing: dynamic pause duration, speech rate modulation (0.8–1.0x during distress), silence as therapeutic tool
   - Prompt architecture: base clinical persona + phase-specific overlays + real-time session context + safety constraints

5. **Safety & Oversight Layer** (`src/safety/`)
   - Crisis detection (4 levels): keyword matching → semantic analysis → behavioral patterns → longitudinal trends
   - Dissociation monitoring: verbal indicators, behavioral indicators, automatic grounding protocol
   - Session boundaries: 90-min max, closure protocol at T-15min, no new BLS sets in final window
   - Therapist-in-the-loop: 3 tiers (full supervision, async review, autonomous with escalation)

### Data Flow

```
User Speech → Deepgram STT → Transcript Event → Claude Reasoning →
  → Protocol Decision Event →
    → BLS Parameter Update
    → Voice Response → ElevenLabs TTS → Audio Output
    → Assessment Trigger
    → Safety Alert
```

All events persisted to append-only event log for audit trails and session replay.

---

## 8-Phase EMDR Protocol

| Phase | Name | Exit Criteria | AI Agent Role |
|-------|------|---------------|---------------|
| 1 | History Taking & Treatment Planning | Complete trauma timeline; client suitable; plan documented | Conversational intake; identify memory clusters; assess stability |
| 2 | Preparation | Client has ≥1 coping strategy; informed consent obtained | Guided relaxation; teach containment; calibrate voice tone |
| 3 | Assessment | Target selected; NC/PC articulated; SUD≥3; VOC rated; body location ID'd | Structured questioning; validate cognitions; record baselines |
| 4 | Desensitization | SUD=0 or ecological; no new disturbing material | Control BLS; track SUD trajectory; detect looping; adjust set duration |
| 5 | Installation | VOC=7; positive cognition feels true | Guide installation; monitor VOC; reinforce with BLS |
| 6 | Body Scan | No residual body disturbance | Guide body awareness; note residual tension |
| 7 | Closure | Client stable; closure exercise done; psychoeducation delivered | Guided relaxation; containment; between-session instructions |
| 8 | Reevaluation | Previous targets resolved; next targets identified | Compare longitudinal data; identify unresolved material |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14+, TypeScript, Tailwind CSS |
| State | Zustand (UI) + XState (protocol FSM) |
| Real-Time | WebRTC (voice), WebSocket (control) |
| Backend | Next.js API Routes + tRPC |
| Database | PostgreSQL + TimescaleDB |
| Auth | Auth.js (NextAuth) + HIPAA-compliant provider |
| AI | Claude API (Anthropic) |
| STT | Deepgram Nova-2 (streaming) |
| TTS | ElevenLabs (custom voice) |
| Infra | Vercel (frontend) + AWS HIPAA-eligible (backend) |
| Monitoring | Datadog + custom clinical dashboards |

---

## Coding Standards

- TypeScript strict mode everywhere
- All clinical data types explicitly defined in `src/types/clinical.ts`
- State machine transitions must have explicit guard conditions
- Every AI prompt must include safety constraint layer
- All assessment scoring functions must have unit tests with known clinical edge cases
- Event types are defined in `src/types/events.ts` — never use untyped events
- PHI data must be encrypted at rest (AES-256) and in transit (TLS 1.3)
- No client data in logs — use anonymized session IDs only

## File Structure

```
emdr-platform/
├── CLAUDE.md                    # This file — project spec for Claude Code
├── README.md                    # Project overview and setup
├── package.json
├── tsconfig.json
├── next.config.js
├── prototype/
│   └── EMDRPlatformPrototype.jsx  # Working UI prototype (React)
├── src/
│   ├── app/                     # Next.js app router pages
│   ├── components/
│   │   ├── bls/                 # BLS visual components (Canvas, controls)
│   │   ├── assessment/          # SUD, VOC, PCL-5, screening UI
│   │   ├── session/             # Session view, metrics, phase navigation
│   │   └── dashboard/           # Dashboard, overview
│   ├── engine/
│   │   ├── bls/                 # BLS engine (visual, audio, haptic)
│   │   └── protocol/            # 8-phase state machine, clinical logic
│   ├── voice/
│   │   ├── stt/                 # Deepgram integration
│   │   ├── tts/                 # ElevenLabs integration
│   │   ├── agent/               # Claude-powered clinical reasoning
│   │   └── prompts/             # Phase-specific prompt templates
│   ├── safety/
│   │   ├── crisis/              # Crisis detection (4 levels)
│   │   ├── dissociation/        # Dissociation monitoring
│   │   ├── boundaries/          # Session time limits, containment
│   │   └── oversight/           # Therapist dashboard, escalation
│   ├── assessments/
│   │   ├── instruments/         # SUD, VOC, PCL-5, DES-II, ACE, PHQ-9, GAD-7
│   │   ├── scoring/             # Scoring algorithms
│   │   └── tracking/            # Longitudinal data & visualization
│   ├── store/                   # Zustand stores
│   ├── types/
│   │   ├── clinical.ts          # Clinical data types
│   │   ├── events.ts            # Event system types
│   │   └── protocol.ts          # Protocol state types
│   ├── lib/
│   │   ├── db/                  # PostgreSQL + TimescaleDB
│   │   ├── auth/                # Auth.js configuration
│   │   └── api/                 # tRPC routers
│   └── utils/
├── tests/
│   ├── engine/                  # Protocol engine tests
│   ├── assessments/             # Scoring algorithm tests
│   ├── safety/                  # Safety system tests
│   └── integration/             # End-to-end session tests
└── docs/
    ├── architecture.md          # Detailed architecture reference
    ├── clinical-protocol.md     # EMDR protocol implementation notes
    ├── safety-framework.md      # Safety system documentation
    └── api-reference.md         # Internal API documentation
```

## Performance Targets

| Metric | Target | Critical Threshold |
|--------|--------|-----------------------|
| Voice response latency (e2e) | <800ms | >2000ms = degraded mode |
| BLS frame rate | 60 FPS | <30 FPS = quality alert |
| STT latency | <300ms | >500ms = fallback STT |
| Session state sync | <100ms | >500ms = reconnection |

## Phased Build Roadmap

**Phase 1 (Weeks 1–4):** BLS engine + text-based protocol flow + assessment forms + database
**Phase 2 (Weeks 5–8):** Voice pipeline (Deepgram + Claude + ElevenLabs) + pattern recognition + therapist dashboard
**Phase 3 (Weeks 9–12):** Safety architecture + crisis detection + dissociation monitoring + compliance
**Phase 4 (Weeks 13–20):** Production infra + React Native mobile + haptic BLS + beta testing

## Regulatory Notes

- California (eff. Jan 2026): Must disclose AI is not human; must provide crisis resources on self-harm detection
- Illinois: Cannot make independent therapeutic decisions without licensed professional oversight
- FDA: Exploring regulatory frameworks; prefers human-in-the-loop
- Design for most restrictive jurisdiction; therapist-in-the-loop is a config toggle, not a feature flag
- All sessions need full audit trails for clinical and legal review
