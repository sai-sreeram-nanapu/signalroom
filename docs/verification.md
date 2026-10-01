# Verification record

Checked by Codex on October 1, 2026. This records agent-run verification, not personal applicant verification.

- TypeScript: passed.
- ESLint: passed.
- Vitest: 5 tests passed, covering static prerender, input limits, raw metrics, identity-free model input, and app-scoped creative keys.
- Local real-service Playwright: 13 tests passed, covering the main flow, private draft visibility, owner authorization, invalid scores and variant IDs, database duplicate rejection, closure, signed-out pages, and persistence.
- Two separate authenticated browser contexts: reviewer feedback reached the creator's already-open view without reload.
- Desktop landing (1440 × 1000) and mobile example (390 × 844): visually reviewed.
- Production build: passed, including static landing prerender.
- Credential-pattern scan: no matching private keys or provider tokens in application source, tests, or docs. DeepSpace credential stores, .dev.vars, build output, and test state are gitignored.

Production verification:

- Live app: https://signalroom.app.space; GitHub: https://github.com/sai-sreeram-nanapu/signalroom.
- Implementation commit `ed26f66` deployed as release `rel_01M3WF6NPZ3QQK55BH2NZQE29Q`; DeepSpace confirmed both edge serving and data plane.
- Deployed Playwright browser check: 1 passed. Verified signed-out published access, authenticated prior-response persistence, real R2 upload, saving and reloading the image, publication, second-user submission, creator live response count without reload, signed-out image rendering, and nonowner AI rejection.
- Real AI synthesis completed for two explicitly illustrative feedback responses. The stored analysis included sample limitations; two fresh authenticated subscriptions retrieved the same synthesis record without calling the model again.
- Fixed two production-discovered creative-key issues: uploaded keys carry an app namespace, and reads must retain that namespace. Unit coverage checks relative input, canonical full keys, cross-app rejection, and traversal rejection.
- Production contains clearly labeled demo/test records. These are functional verification data, not customer research or applicant personal verification.

The committed tests run locally against real services. The production browser check was a separate credentialed scratch fixture and is not run by credential-free GitHub CI. See the repository Actions tab for CI results.
