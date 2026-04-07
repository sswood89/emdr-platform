# Architecture Reference

See [CLAUDE.md](../CLAUDE.md) for the complete architecture specification.

The full architecture document (with detailed tables and formatting) is available as a .docx file in the project deliverables.

## Quick Links

- **Subsystem Map:** 5 core subsystems (BLS Engine, Protocol Engine, Assessment, Voice Agent, Safety Layer)
- **Data Flow:** Event-driven pub/sub architecture with append-only audit log
- **State Machine:** XState-based 8-phase EMDR protocol with strict guard conditions
- **Voice Pipeline:** Deepgram STT -> Claude API -> ElevenLabs TTS
- **Safety Layers:** 4-level crisis detection, dissociation monitoring, session boundaries

## Subsystem Communication

All subsystems communicate through a centralized event bus. Every interaction, voice utterance, physiological signal, and protocol state change is emitted as a typed event (see `src/types/events.ts`).

Subsystems subscribe to relevant event channels and react accordingly. All events are persisted to an append-only event log, enabling full session replay, clinical audit trails, and post-session analysis.

## Key Design Decisions

1. **XState for Protocol:** The 8-phase protocol is modeled as a hierarchical state machine. This makes phase transitions formally verifiable and prevents the AI from skipping safety-critical steps.

2. **Claude for Reasoning:** The Claude API serves as the adaptive decision layer within each protocol phase. It receives session context and generates clinically appropriate responses within strict guardrails.

3. **Event Sourcing:** All session data is stored as an append-only event log. This enables complete audit trails, session replay, and clinical review.

4. **Safety as Always-On Layer:** The safety subsystem monitors all other subsystems continuously and can intervene at any point, including pausing BLS, activating grounding protocols, or escalating to a human therapist.
