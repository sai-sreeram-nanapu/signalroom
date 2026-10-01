# Five-minute demonstration

1. **Purpose (20 seconds):** SignalRoom tests messaging with invited people before turning a hunch into campaign copy.
2. **Create (45 seconds):** Set an audience and question, add two variants, save a private draft. Show the optional creative and disclose its public storage scope.
3. **Publish and review (60 seconds):** Publish and copy the link. In a second signed-in browser, choose a variant, score its clarity, and give a reason. Signed-out visitors may read published experiments but cannot respond.
4. **Realtime (30 seconds):** Return to the creator's already-open page without refreshing. Point to the new count and reviewer note.
5. **AI (45 seconds):** Analyze feedback. Explain creator authorization, experiment-scoped input, caller billing, persisted output, and sample limitations.
6. **Tradeoff (60 seconds):** Variants share one experiment record, so publication does not expose partial choices. Copy stays fixed after publication. Explain that all feedback is member-readable in this MVP; a confidential customer product needs tighter experiment-level isolation.
7. **Ownership (30 seconds):** Accurately describe what Codex implemented and what you personally reviewed and verified.

Before an interview, personally run the main flow and practice adding a feedback field, changing the AI output schema, and diagnosing a subscription query. Navigate `src/lib/signalroom.ts`, `src/schemas/signalroom-schema.ts`, `src/actions/index.ts`, and the experiment route without an agent.
