# SignalRoom redesign decisions

Requested October 1, 2026: completely redesign the UI using UI/UX Pro Max.

Read the upstream skill, generated the recommendations in MASTER.md, and queried the React stack guidance. Treat the generated system as recommendations. Product-specific decisions below define the actual implementation.

- Light B2B research workspace. Use opaque white data and form surfaces for reliable contrast; depth belongs to the marketing product preview, not translucent reading surfaces.
- Blue #2563eb primary with white text; slate #172033 text on #ffffff cards and #f8fafc background; muted text #526176. Teal and amber distinguish chart variants, always with labels and values.
- Self-hosted Plus Jakarta Sans variable font, using the first verified design-system query's SaaS typography recommendation. The regenerated default recommended a serif pairing; the requested replacement of the old editorial direction makes the sans-serif recommendation a better fit here.
- Desktop workspace side rail; existing authenticated account controls preserved. On smaller screens, keep the app's collapsible navigation and remove the decorative rail.
- Landing: centered message, two clear actions, clearly labeled illustrative app preview, three workflow cards, final action.
- Workspace: accurate counts, search and lifecycle filters, experiment cards, actionable empty state, separate illustrative example.
- Editor: numbered sections, visible labels, stable variant inputs, public-image disclosure, current draft summary, optional upload. The decorative progress bars indicate detail/message completion; image upload remains optional.
- Reviewer: large selectable cards, visible pressed states, keyboard-operable clarity choices, retained form values during auth, submission confirmation.
- Results: counts and overall clarity, labeled bars and vote counts, contextual live response announcement. AI: summary, evidence/confusion/disagreement cards, next experiment and sample limitations.
- Shared spacing, semantic tokens, visible focus, 44px principal controls, reflow, reduced-motion support. No auto-rotating content or decorative motion library.

No API, authorization, collection schema, publication semantics, billing or AI model changes are part of this redesign.
