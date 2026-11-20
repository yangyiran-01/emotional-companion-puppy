# PawPal development record

Events recorded on 17 November 2026 and updated on 20 November 2026, Europe/London. This records actual development work, not participant research.

## Stages and authorisation on 17 November

The user approved the design stage and subsequently authorised implementation. Development therefore entered Phase 3. The Figma clickable prototype was blocked by the Starter MCP tool-call quota and was not recorded as completed. Design-stage files and limitations are documented in `design/PHASE2_REVIEW.md`.

The user chose to test Demo first and configure a key later. The default delivery therefore uses Demo without live model calls; the separate AI integration remains available for later configuration. No key was collected or recorded in chat.

## Implementation and revisions

- Initial directory inspection found no existing application or AGENTS.md. Existing design assets were preserved when application files were added.
- React, TypeScript, Vite and Tailwind were combined with one Express backend. The six required modules use functions and components, without extra core features or a database.
- Figma export was unavailable because of the quota, so the same cream, floppy-eared puppy was reconstructed in React SVG. Four states share the body and palette, changing brows, eyes, mouth and paw position. Final visual approval remains with the user.
- English and Chinese emotion rules, limited negation handling, recent-pressure follow-ups and loneliness-based suggestion gating were added. Refusal persists in conversation state; an explicit later request can reopen suggestions.
- Review found that a loneliness follow-up after recent crisis language could lose safety context. Recent unresolved-risk routing was added; an explicit current-safety statement clears the narrow flag. This is not a clinical risk assessment.
- Demo, AI, fixed application feedback and fixed safety guidance have separate source labels. AI errors do not silently switch to Demo.
- The backend validates input, rate-limits requests, disables API caching and does not log chat content. OpenAI requests use `store: false`, with the key kept server-side.
- Browser inspection found welcome content cropped by initial automatic scrolling. New conversations were changed to remain at the top. Switching from desktop to mobile emulation also left the last message partly hidden; resize-related scrolling was added, but that final adjustment still needs browser rechecking.
- Mobile text and input sizing were adjusted for readability. Only Inter's Latin subset is bundled; Chinese uses system fallback fonts.
- Client-state tests cover retained failed messages, retries without duplicate user messages, editing back into the draft and discarding stale replies after a mode change.

## Delivery status at the implementation stage

Phase 3 was implemented; Phase 4 results are in `TEST_RESULTS.md`. Phase 5 user testing and final confirmation remain pending. At this stage, the README and directory were prepared for GitHub, but no remote repository had yet been connected.

Local Git was initialised on `main` before a commit or remote existed. Actual review snapshots were saved later. Dependency download URLs were standardised to the official npm registry while preserving locked versions and integrity values. Checks confirmed that `.env` files are ignored and the empty example configuration can be committed.

Figma prototype connections, the FigJam implementation update, live AI testing and final user acceptance remain outstanding.

## Assignment evidence supplement on 17 November

- Added delivery information based on the teacher's pasted brief. At this stage, no Abstract or Design Rationale was written and no coursework was submitted. The later report request is recorded separately below.
- Added three editable SVG storyboards with ten panels, an HTML viewer, replay inputs and outputs, and a generation script. A fictional student is used. The script calls actual Demo logic and asserts pressure, happiness, loneliness and refusal-persistence behaviour. The puppy reuses the application's SVG.
- Storyboards are labelled interaction-replay illustrations, not screenshots, live AI output or participant research. Accept and Not now are alternative branches; a separate panel shows continued chat after refusal.
- All three SVGs were rendered and checked for layout, text, character and button visibility. The first version had insufficient caption space; the space was increased and the figures rendered again.
- Server-side SVG rendering produced a React warning about multiple text children in `<title>`. A single template string resolved the warning; replay checks, application tests and the build passed afterwards.
- The README was shortened while retaining the eleven requested categories and concrete examples of AI-assisted revisions and checks. Word counting changed from whole-Markdown counting to prose counting, excluding code, commands, URLs and syntax. Two tests verify the counting rules.
- Added an evidence inventory, verified-source inventory and submission checklist. At that point, A1, lecture materials and feedback had not been supplied locally, so generic sources were not presented as course evidence.
- The user initially requested a repository name corresponding to Yoyo project, with `Yoyo-project` proposed as a GitHub-compatible form. PawPal remained the application brand. No guessed remote URL was used.
- Version records use actual snapshots without backdating commits. The first local commit and `demo-evidence-2026-11-17` tag identify a review version, not final acceptance or submission.

## Repository naming on 17 November

The user subsequently requested the English name **Emotional Companion Puppy**, using `emotional-companion-puppy` on GitHub. The README, submission status and GitHub instructions were updated. There was no online repository connected at that moment, so this was not represented as a completed remote rename. PawPal remained the application brand.

## GitHub connection on 17 November

The user supplied `https://github.com/yangyiran-01/emotional-companion-puppy` and authorised the code upload. Remote `main` initially contained only README commit `6ac4c55`; GitHub metadata confirmed public visibility.

Local `origin` was set to that URL, remote history was fetched and merged, and the README add/add conflict was resolved by combining the remote introduction with the complete local running instructions. The remote initial commit was preserved; no force push rewrote history. Repository documentation was updated with the real URL, while Demo, unvalidated AI and pending acceptance remained explicit.

The upload file list and credential-pattern checks excluded `.env`, node_modules, dist, private course materials and browser-session data. Public source and development evidence do not establish hosted deployment or final user acceptance.

## Report preparation after the evidence supplement on 17 November

The user later explicitly requested a Word report, replacing the earlier instruction to leave report prose unwritten. Local Assignment 1 and lecture files were found in the course folder and used for the report. No Canvas access was needed. The English report was saved locally as `PawPal_Assignment_2_Report.docx`, with 181 abstract words and 1,078 main words under its stated counting method, totalling 1,259. The eight rendered pages were inspected. It includes the implementation diagram, three illustrated scenarios, references and code snapshot `57c566d`.

The Word report and private course source files were not added to the public repository. Specific lecturer feedback was not found and was not invented. Report preparation does not establish user acceptance or live AI validation.

## English documentation revision on 20 November

The user requested English repository content. Chinese documentation was translated into English, preserving historical dates, test scope, asset provenance and outstanding work. User-test instructions now use English versions of the demonstration scenarios. README documentation explains that Chinese strings in source and test fixtures support bilingual conversations; executable language rules and replies were preserved.

This revision does not add application features or change the report's identified code snapshot. Verification for this revision is recorded in `TEST_RESULTS.md`.
