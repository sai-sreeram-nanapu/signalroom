# Submission draft

Live URL: https://signalroom.app.space
Repository: https://github.com/sai-sreeram-nanapu/signalroom

SignalRoom is a small collaborative message-testing app for builders and GTM teams. A creator frames an audience and question, adds two to four message variants, optionally attaches a creative, and publishes a share link. Reviewers sign in, choose the message that resonates most, score its clarity, and explain why. The creator's results update live; a saved AI synthesis identifies evidence, confusion, disagreement, limitations, and one concrete next test.

The app uses DeepSpace auth for identity, realtime records for persistence and live feedback, R2 for optional creatives, and AI for evidence interpretation. Verified server actions enforce creator ownership, lifecycle transitions, message membership, and input limits. The feedback schema binds reviewer identity and enforces one response per reviewer per experiment in the database. The AI action checks experiment ownership before querying responses, and queries only the requested experiment. The requesting creator's own credits fund analysis.

I chose depth in one workflow. Variants are embedded in the experiment record so a publication cannot expose only part of a comparison. Published copy stays fixed, preserving the meaning of collected feedback. Payments, scheduled jobs, external notifications, team administration, and a generic chat pane are deliberately omitted. Authenticated feedback remains member-readable in this MVP; a confidential customer product would need experiment-level collaborator isolation. Uploaded images use public app storage, which is disclosed before upload.

Codex implemented the application, consulted the installed DeepSpace skill and TypeScript APIs, created automated tests, and ran local multi-user and browser checks. The automated local suite verifies creation, draft editing, publication, reviewer submission, live synchronization without refresh, duplicate response rejection, authorization failures, closure, and reload persistence. TypeScript, lint, unit tests, and the production build pass.

Before submitting, review the verification record, personally exercise the deployed flow, and describe only the personal verification you actually completed. Production-specific verification results will be recorded separately in docs/verification.md.
