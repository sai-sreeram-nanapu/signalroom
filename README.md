# SignalRoom

SignalRoom helps builders and GTM teams compare messages with real people, collect structured feedback, and choose their next experiment.

**Flow:** create a private draft → add 2–4 messages → optionally attach a creative → publish a share link → reviewers sign in, choose a message, rate clarity, and explain why → results update live → the creator runs an evidence-grounded AI synthesis.

[Interactive example](https://signalroom.app.space/demo) · [Live workspace](https://signalroom.app.space/home)

## DeepSpace primitives

- **Auth** identifies creators and reviewers. Creator routes are gated; published links remain readable while signed out.
- **Realtime RecordRoom** persists experiments, feedback, and syntheses in a SQLite Durable Object. Results subscribe over WebSockets rather than polling.
- **R2 files** stores one optional PNG/JPEG/WebP creative through the platform gateway. No storage credential is shipped to browsers.
- **AI** uses the installed SDK's summarization model through `createDeepSpaceAI` and structured AI SDK output. Only the experiment creator can invoke it; the caller's own DeepSpace credits fund the request.
- **Server actions** validate input, ownership, publication transitions, and chosen-message membership before privileged mutations or reads.

## Architecture and boundaries

React/Vite renders the UI; the scaffolded Hono Worker handles auth, actions, files, and WebSocket routing. `src/schemas/signalroom-schema.ts` declares three collections. Variants are embedded JSON in their experiment, keeping draft edits and publication within one record rather than publishing independent child records.

All ordinary client writes to these collections are denied. Verified server actions implement the business rules. Draft experiments are visible only to their creator; published and closed experiments are public. Published copy is fixed so feedback remains tied to the exact message reviewed. Responses have an immutable, user-bound reviewer ID and a database `uniqueOn` constraint over experiment + reviewer. Syntheses are creator-readable and include sample count, limitations, disagreement, and a next test.

The AI action proves experiment ownership **before** querying feedback, scopes the query to that experiment, excludes reviewer identity from the prompt, and saves the structured result. Empty data never invokes a model. Analysis is limited to 200 responses per experiment and 2,200 output tokens.

## Run locally

Requires Node 22.15+, 24, or 26 and npm 11.6+.

```sh
npm ci
npx deepspace auth login
npx deepspace auth whoami
npm run dev
```

This checkout contains the registered app ID. Contributors should use a separate registered app for isolated production data. Local Durable Object data is separate from deployed data. R2 uploads require the production app identity token; verify the full upload path on the deployed app.

## Validate

```sh
npm run validate        # TypeScript + pure data/validation and prerender tests
npm run lint
npm run build
npx deepspace test run --port 5180
npx deepspace test run e2e --port 5180
```

The Playwright suite exercises real app services. Multi-user specs require two reusable local test accounts: inspect `npx deepspace test accounts list --usable` and provision only the shortfall using the CLI's `--password-stdin` option. Credentials stay in DeepSpace's local credential store, outside the repo. Test records have a `__test-` prefix and owner-scoped cleanup available only when local debug routes are enabled.

CI runs build, lint, TypeScript and unit validation with no DeepSpace account credential. Credentialed browser tests and production deployment run locally.

## Deploy

```sh
npx deepspace auth whoami
npm run validate
npm run lint
npm run build
npx deepspace test run e2e --port 5180
git add -A
git commit -m "Prepare SignalRoom release"
git push origin main
npx deepspace status --json
npx deepspace deploy
```

GitHub is the intended source authority. The first deployment must see this repository's GitHub remote; do not run `deepspace push` first. Commit and push the same code that is deployed.

## Deliberate scope and limitations

No payments, scheduled campaigns, notifications, generic chatbot, organizations, or presence avatars. This is a public-feedback MVP, not a confidential multi-tenant product: authenticated members can read feedback records, though reviewer results are not shown in the voting UI. Uploaded app-scope images are public even while a draft is private. Detaching an image does not delete its underlying R2 file. Avoid confidential copy or creatives.

Invited reviewers are a convenience sample. Vote share and clarity describe the respondents; they do not prove statistical significance or represent a market. AI is interpretation, not raw evidence. A response racing with a close request may be accepted if the server validated it immediately before closure; strict transaction-wide lifecycle enforcement is a next iteration.

## Agent contribution and verification

Codex implemented the app, reviewed the installed SDK and official skill, created tests and docs, and ran automated/browser checks. The applicant must personally review and rehearse the submitted code; automated agent verification is not a claim of applicant verification. See `docs/verification.md` for observed results and `docs/submission.md` for an honest submission draft.
