# EMDR Autonomous Therapy Platform

An AI-powered platform delivering clinically faithful EMDR (Eye Movement Desensitization and Reprocessing) therapy through bilateral stimulation, validated assessments, and adaptive voice-guided sessions.

## What is this?

This platform implements Francine Shapiro's complete 8-Phase EMDR Protocol as an autonomous therapy system. It combines real-time bilateral stimulation (visual, auditory, haptic) with an AI clinical reasoning engine that guides clients through trauma reprocessing.

### Core Capabilities

- **Bilateral Stimulation Engine** — Configurable visual (Canvas API), auditory (Web Audio API), and haptic stimulus with real-time parameter control
- **8-Phase Clinical Protocol** — State machine enforcing the complete EMDR protocol with adaptive AI decision-making within each phase
- **Validated Assessments** — SUD, VOC, PCL-5, DES-II, ACE, PHQ-9, GAD-7 with longitudinal tracking
- **Voice Agent** — Real-time conversational AI (Claude + Deepgram + ElevenLabs) with pattern recognition, adaptive pacing, and therapeutic presence
- **Safety Architecture** — Multi-level crisis detection, dissociation monitoring, session boundaries, and therapist escalation

## Tech Stack

- **Frontend:** Next.js 14+, TypeScript, Tailwind CSS
- **State:** Zustand + XState (protocol state machine)
- **AI Reasoning:** Claude API (Anthropic)
- **Speech-to-Text:** Deepgram Nova-2
- **Text-to-Speech:** ElevenLabs (custom therapeutic voice)
- **Database:** PostgreSQL + TimescaleDB
- **Infrastructure:** Vercel + AWS (HIPAA-eligible)

## Getting Started

```bash
# Clone the repository
git clone https://github.com/sswood89/emdr-platform.git
cd emdr-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your API keys: ANTHROPIC_API_KEY, DEEPGRAM_API_KEY, ELEVENLABS_API_KEY

# Run development server
npm run dev
```

## Project Structure

See [CLAUDE.md](./CLAUDE.md) for the complete architecture specification, file structure, coding standards, and build roadmap.

The `prototype/` directory contains a working interactive prototype of the BLS engine, assessment instruments, and protocol flow.

## Prototype

The `prototype/EMDRPlatformPrototype.jsx` file is a self-contained React component demonstrating:
- Bilateral stimulation with 4 shapes, 3 paths, configurable speed/size/color
- Stereo audio BLS with Web Audio API
- SUD (0–10) and VOC (1–7) interactive scales
- PCL-5 PTSD Checklist (20 items) with real-time scoring
- 8-phase protocol navigation
- Session metrics (timer, set counter, SUD/VOC tracking)

## Build Roadmap

| Phase | Timeline | Deliverable |
|-------|----------|-------------|
| 1 | Weeks 1–4 | BLS engine + protocol state machine + assessments + database |
| 2 | Weeks 5–8 | Voice pipeline + pattern recognition + therapist dashboard |
| 3 | Weeks 9–12 | Safety architecture + crisis detection + compliance |
| 4 | Weeks 13–20 | Production infra + mobile app + beta testing |

## Safety & Ethics

This platform is designed with safety as the highest priority. EMDR therapy can surface intense traumatic material, and the system includes multi-level crisis detection, dissociation monitoring, session time boundaries, and configurable therapist-in-the-loop oversight. See the architecture document for full safety specifications.

## License

Proprietary — All rights reserved.
