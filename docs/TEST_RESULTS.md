# PawPal developer test record

Original checks: 17 November 2026, Europe/London. Environment: macOS, Node v23.11.0, npm 10.9.2 and Chrome. No OpenAI key was configured; the user requested Demo testing first. Later documentation checks are dated separately below.

## Commands executed on 17 November

| Check | Actual result |
| --- | --- |
| `npm run check` | Passed: 49 tests, 49 pass, 0 fail, 0 skipped; TypeScript checking and the Vite production build then succeeded |
| `npm audit --registry=https://registry.npmjs.org --json` | Official registry returned zero known vulnerabilities; this was not a comprehensive security audit |
| Git ignore rules | `.env`, `.env.local`, `node_modules` and `dist` are ignored; the empty `.env.example` can be committed |
| Static privacy inspection | No frontend key, persistent storage or HTML injection entry point; the server prints startup status without chat content |
| Local architecture SVG | Rendered and inspected for six modules, status labels and complete layout; the FigJam update remained blocked by the Starter quota |

The build produced two Rollup PURE-annotation warnings from Zod dependency comments. It succeeded after the comments were removed by the bundler; these were not application type errors. The warnings were not described as an entirely warning-free build.

## Automated coverage

- Four expressions in English and Chinese, limited negation and mixed emotion, pressure follow-ups and a Calm fallback for unclear text.
- No social card for ordinary stress; loneliness eligibility; suppression after offered, accepted or declined states; textual refusal and explicit re-request.
- Priority for current or recent unresolved explicit safety cues, bypassing the model and ordinary cards; narrow current-safety statements clear the routing flag.
- Multi-turn Demo context and source labels; unconfigured AI returns an error without silently falling back to Demo.
- Controlled test doubles verify OpenAI HTTP request shape, server-side authorisation, `store: false`, timeouts, incomplete responses and boundary checks. **These are not live OpenAI model tests.**
- HTTP validation of blank, oversized or invalid input and context; JSON format, Origin, rate limits, caching and response headers.
- Client refusal is passed to the next request; Accept calls no external contact endpoint; failures retain the message; retry avoids duplication; Edit restores the draft; new conversations and mode changes discard stale replies.

Debugging note: the first added client retry case failed because of asynchronous React-test flushing. Using async `act` to flush the immediate HTTP failure made both the isolated case and all 49 tests pass. Assertions were not removed or skipped to conceal the failure.

## Browser observations on 17 November

| Item | Observation |
| --- | --- |
| Opening and pink/lavender UI | Ordinary Chrome tab opened successfully; desktop two-column layout, input and identity notice were visible |
| Pressure and multiple turns | English pressure and deadline follow-ups returned Concerned; Chinese pressure received Chinese support; no social card |
| Good news | Happy, positive reply and the same puppy |
| Loneliness | Concerned, followed by an optional Accept / Not now card after support |
| Continuing after Not now | Respectful feedback and Calm; further loneliness did not repeat the card |
| Explicit re-request | An explicit request after refusal could reopen the card |
| Accept | Next step, user control and Nothing is sent were visible; Encouraging |
| Four expressions | Calm, Happy, Concerned and Encouraging were all observed, sharing the cream puppy, floppy ears and scarf |
| Missing key | AI mode was disabled with Needs a server API key |
| New conversation | Confirmation cleared history and restored Calm and the welcome message |
| Mobile emulation | Chrome 390 × 844 checks covered wrapping, compact character card and input; no obvious horizontal overflow; long history could scroll |

## Unverified or requiring rechecking

- Live AI conversation, naturalness, latency, cost and end-to-end model errors have not been validated with a real key.
- The full browser offline test was not completed: DevTools and native-control interaction was unreliable, so no dependable error-UI observation was obtained. The temporary test tab was closed and a fresh normal preview left open. Automated client/API recovery checks are not a substitute for that browser test.
- Latest feedback was clipped after switching viewport sizes. ResizeObserver-based scrolling was added; that final change still needs mobile browser rechecking.
- Physical-phone keyboards, other browsers, screen readers and a formal WCAG audit have not been tested. No complete accessibility conformance is claimed.
- The static UI is English; Chinese input and replies work. Complex negation, metaphor, sarcasm, missed crisis cues and repetitive templates remain limitations.
- Clickable Figma connections and the post-development FigJam update remain blocked by quota. Current code and the local implementation diagram are authoritative.
- User experience testing and final acceptance await the user's own review.

## Assignment evidence checks on 17 November

- `npm run evidence:build` passed: three SVGs, ten panels, an HTML viewer and replay data were generated. Assertions covered pressure, happiness, loneliness and no repeated suggestion after refusal; no model was called.
- All three SVGs passed XML checks and full rendering inspection, without obvious clipping or overlap in text, character or controls. Browser print-to-PDF of the HTML viewer was not verified; the SVGs are the evidence files.
- `npm run readme:check` passed two counting tests and matched the declared prose count. Counting excludes code, commands, URLs and Markdown syntax, while retaining headings, list text and table text.
- After the puppy SVG `<title>` change, `npm run check` again passed all 49 application tests, TypeScript checking and the production build. Dependency warnings remained as described above.
- These materials add development evidence, not another core feature, user acceptance, therapeutic findings or participant research.

## Pre-upload checks on 17 November

- `npm run check` again passed 49 application tests, TypeScript checking and the production build. The dependency annotation warnings remained.
- After merging the remote introduction, `npm run readme:check` passed both counting tests and verified the README count.
- Local documentation links resolved and conflict markers were absent. Tracked files excluded `.env`, dependencies and build output; credential-pattern inspection found no suspected real key.
- Public GitHub metadata confirmed repository visibility and default branch `main`. Remote and local hashes must be checked to verify an upload; source publication is not deployment or final acceptance.

## English documentation checks on 20 November

- Translated the architecture, provenance, development record, GitHub instructions, logic, user-test guide, developer-test record and historical design review into English.
- Scanned tracked text files: Chinese characters remain only in bilingual runtime patterns/replies and test fixtures, not in documentation, interface instructions or explanatory comments. Runtime source files were not changed.
- Local Markdown link checks found no missing file targets. `git diff --check` passed.
- `npm run readme:count` updated the declared prose count to 798. `npm run readme:check` passed both counting tests and verified the declared count.
- This documentation-only revision did not rerun the application suite or browser checks. The 49 application-test results above remain dated 17 November; no new functional validation is claimed.
- The local Word report, its temporary lock file and private course materials are excluded from this documentation update.
