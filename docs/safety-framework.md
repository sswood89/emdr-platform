# Safety Framework

## Overview

The safety architecture is the most critical subsystem of the EMDR platform. It operates as an always-on monitoring layer that can intervene at any point in a session.

## Crisis Detection (4 Levels)

### Level 1: Keyword Detection
- Real-time regex matching on STT transcript
- Triggers: explicit mentions of suicide, self-harm, specific plans or means
- Response: Immediate session pause, crisis protocol activation, display crisis resources (988 Suicide & Crisis Lifeline)

### Level 2: Semantic Analysis
- Claude-powered contextual analysis of client speech
- Triggers: hopelessness language, expressions of being a burden, farewell-type statements
- Response: Gentle check-in, direct safety questioning, escalation if confirmed

### Level 3: Behavioral Pattern Analysis
- Pattern analysis across the session
- Triggers: sudden disengagement, flat affect after high distress, dissociative indicators
- Response: Increased safety check frequency, grounding activation, flagged for review

### Level 4: Longitudinal Trend Analysis
- Cross-session trend analysis
- Triggers: worsening SUD scores, increasing dissociation, attendance patterns
- Response: Human therapist review, protocol adjustment recommendation

## Dissociation Monitoring

### Verbal Indicators
- Sudden changes in voice quality or volume
- Loss of narrative coherence
- Referring to self in third person
- Reports of feeling disconnected, numb, or "not here"

### Behavioral Indicators
- Extended unresponsive silence (differentiated from reflective silence)
- Sudden topic shifts without apparent connection
- Abrupt changes in speech rate or pattern

### Grounding Protocol
When dissociation is detected:
1. Pause BLS immediately
2. Engage with sensory-focused questions ("Can you feel your feet on the floor?")
3. Do not resume processing until client demonstrates present-moment awareness
4. Log the event for clinical review

## Session Boundaries

- Maximum duration: 90 minutes (configurable)
- Closure protocol initiates at T-15 minutes regardless of processing state
- No new BLS sets allowed in final 15-minute window
- If client is mid-desensitization at boundary, containment techniques are used

## Therapist-in-the-Loop Tiers

### Tier 1: Full Supervision
- Therapist present for entire session via real-time dashboard
- Can intervene at any point (voice takeover, override decisions, terminate)
- Required for: first sessions, high-risk clients, DES-II >= 30

### Tier 2: Asynchronous Review
- Therapist reviews session recordings and AI decisions post-session
- AI operates independently during session
- Safety alerts trigger immediate notification to therapist

### Tier 3: Autonomous with Escalation
- System operates fully independently
- On-call therapist available for escalation when safety thresholds breach
- Requires: established client, low-risk profile, multiple successful sessions

## Regulatory Compliance

- California (eff. Jan 2026): AI must disclose non-human nature; crisis resources required on self-harm detection
- Illinois: Cannot make independent therapeutic decisions without licensed professional oversight
- FDA: Exploring regulatory frameworks; prefers human-in-the-loop
- HIPAA: All PHI encrypted at rest (AES-256) and in transit (TLS 1.3)
- All sessions produce complete audit trails for clinical and legal review
