# Emotional Companion Puppy — PawPal

**Prose Word Count: 798**

Count includes headings, list text and table text; excludes this notice, fenced code, inline code, URLs and Markdown syntax. Run `npm run readme:count` to update.

<!-- prose-start -->
## Project Overview

PawPal is a Human–AI Interaction course prototype. It combines supportive chat, four emotional expressions, and optional offline social suggestions. Users can accept or decline suggestions without pressure. The current Demo uses clearly labelled scripted replies; real AI integration awaits testing. PawPal explores emotional companionship while respecting user choice and offline relationships.

## Project Status

**Working Demo; user acceptance pending.** Demo replies are scripted, labelled examples. The OpenAI adapter is implemented; real model validation is pending. Errors never silently switch AI mode to Demo. Expressions are response cues, not diagnoses; PawPal is not professional counselling or an emergency service.

The Figma UI exists. Prototype connections and the implementation update in FigJam are blocked by tool quota. Use the [current architecture](docs/ARCHITECTURE.md), rather than the earlier planned Figma diagram, to inspect the implemented system.

Public repository: [Emotional Companion Puppy](https://github.com/yangyiran-01/emotional-companion-puppy). Source and development evidence are versioned on the main branch. Git history records actual snapshots only. The [submission checklist](docs/SUBMISSION_STATUS.md) distinguishes the review version from a final submitted version.

## Technology Stack

| Technology | Role |
| --- | --- |
| React, TypeScript, Vite, Tailwind CSS | Responsive UI and build |
| SVG, CSS, Lucide, locally bundled Inter | Shared puppy, animation, icons and typography |
| Express, Zod, Helmet, rate limiting | Local server and validated requests |
| OpenAI Responses API | Optional server-side generative replies |
| Node test runner, Testing Library | Logic, HTTP and client state checks |

The configured model defaults to `gpt-4.1-mini`; no real model response has been validated for this version. Demo does not call a model.

Repository documentation is in English. Chinese source strings and test fixtures support bilingual conversations.

## Installation and Running Instructions

Requires Node 22.12 or newer and npm.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173/. Keep the terminal running. The API uses port 3001; both processes bind to localhost. No key is needed for Demo.

For a local production build:

```sh
npm run build
npm start
```

Open http://127.0.0.1:3001/. Keep development dependencies installed because the start command uses `tsx`.

Optional AI configuration:

```sh
cp .env.example .env
```

Set `OPENAI_API_KEY` locally, restart, refresh, then select AI mode. This sends current and recent messages to OpenAI and may incur charges. Mode changes start a fresh conversation. Never commit the key or put it in frontend variables. A configured key is not proof of valid billing or model access.

## Core Features

- Chat supports multiple turns, loading feedback, retry and editing failed messages.
- One cream SVG puppy changes between Calm, Happy, Concerned and Encouraging through explainable English/Chinese rules.
- Loneliness or an explicit social request can produce an optional card. Accept gives a next step; Not now suppresses proactive suggestions for that conversation unless requested again. Neither choice contacts anyone.

## Interaction Scenarios

Use a fresh conversation for each example; test both suggestion branches separately.

| Scenario | Example | Feedback |
| --- | --- | --- |
| Pressure | `My assignments keep piling up. I’m exhausted.` | Concerned; support; no social card |
| Good news | `I finally finished my project — and got lovely feedback!` | Happy; positive reply |
| Loneliness | `I feel lonely. I haven’t seen my friends in weeks.` | Concerned; optional Accept / Not now |

The [illustrated interactions](docs/storyboards/README.md) contain three reproducible vector storyboards and a local HTML viewer. They replay actual Demo logic; they are not screenshots or participant data. Follow the [user test guide](docs/USER_TESTING.md) to try the app.

## Development Record

[Development record](docs/DEVELOPMENT_RECORD.md) documents significant changes, reasons and checks. [Test results](docs/TEST_RESULTS.md) distinguish automated checks from browser observations and remaining verification. [Rules](docs/LOGIC.md) explain emotion and suggestion decisions.

```sh
npm run check
npm run evidence:build
npm run readme:count
```

## AI Assistance

Codex assisted with planning, Figma scripts, code, debugging and documentation. Examples checked or changed:

- Figma generated the Calm puppy concept. Web code reconstructs it as a shared SVG; four expressions were inspected in Chrome. This is not a verified original-vector export.
- Classification suggestions became explicit cue rules. Tests checked negation, mixed emotion, refusal persistence and safety priority; recent safety-context routing was added after review.
- Browser inspection found cropped welcome content. Scrolling was corrected and the desktop page rechecked. The later mobile resize adjustment still needs browser rechecking.
- Storyboard dialogue comes from executable Demo replays with assertions. Layouts are inspected separately; no invented participant feedback is used.

See [asset provenance](docs/ASSET_PROVENANCE.md) for tools and reuse acknowledgements.

## Known Limitations

- Template replies can repeat. Rule-based interpretation can miss sarcasm, complex negation and safety signals. No therapeutic or social-outcome effectiveness is claimed.
- Only twelve recent messages accompany a request. Chat and refusal choices live in tab memory; refresh, reset or mode change clears them. No chat database, browser persistence or analytics is used.
- Demo text is processed locally. AI text goes to OpenAI with `store: false`; [provider retention policies](https://developers.openai.com/api/docs/guides/your-data) still apply.
- Real AI, physical phones, cross-browser accessibility and complete browser offline recovery remain unverified. Current use is a localhost prototype.
- Course lecture mapping, A1 evidence and final user acceptance remain pending. Details are in the submission checklist.

## Figma Design Links

- [Editable UI and four puppy states](https://www.figma.com/design/bSwc6WMJZDteksbkpXjq9t)
- [User interaction flow](https://www.figma.com/board/8jYrvRgGJTvzMQ2HRMbE5l)
- [Phase 2 planned architecture](https://www.figma.com/board/aKVZYwaif4BArPmoKljpjQ) — superseded for implementation purposes by the local diagram.

## Additional Files

- [Storyboards and replay data](docs/storyboards/README.md); [standalone architecture SVG](docs/architecture-current.svg).
- [Evidence inventory](docs/EVIDENCE_MAP.md), [verified source list](docs/REFERENCES.md) and [third-party notices](THIRD_PARTY_NOTICES.md).
- Source: `src`, `server`, `shared`; tests: `tests`; saved design resources: `docs/design`.
- No accompanying ZIP is needed for these repository files. No final Assignment 2 report is included.
