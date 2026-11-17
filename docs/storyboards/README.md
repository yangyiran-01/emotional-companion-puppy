# Illustrated interaction storyboards

These three scenarios use a fictional student and actual scripted Demo responses. They are **vector illustrations of executable replays**, not browser screenshots, real model outputs, participant observations or evidence of emotional benefit.

| Scenario | Files | What is shown |
| --- | --- | --- |
| Study pressure | [SVG](01-pressure.svg) | Sending pressure, Concerned support, a contextual follow-up; no social card |
| Happy sharing | [SVG](02-happy.svg) | Sending good news, Happy feedback, choosing whether to continue |
| Loneliness | [SVG](03-loneliness.svg) | Support and optional card; alternative Accept and Not now; continued support without another proactive card |

Open [the HTML viewer](index.html) in a browser, or open an SVG directly. The viewer offers SVG downloads and browser print-to-PDF. Its print output has not been verified as a publication-ready PDF; the SVG files are the standalone deliverables.

## Reproduce

```sh
npm ci
npm run evidence:build
```

`scripts/build-storyboards.tsx` imports `server/conversation.ts`, calls Demo mode with synthetic inputs, checks state and suggestion outcomes, and reuses `src/components/Pet.tsx`. No network/model request is needed. Message text and decision feedback are unabridged. Other text is short explanatory captioning, not extra AI dialogue. Local Accept/Not now feedback comes from the returned card, matching the application’s decision flow.

[Replay data](replay-data.json) records input, bounded context, choice and output. Random card identifiers are normalised for reproducible artifacts. [Manifest](manifest.json) records dimensions. All panels reuse the same character geometry; styles are simplified for legibility, so they do not claim pixel identity with the responsive app.

The Happy final panel is a user choice point, not another sent message. In the loneliness board, 2A and 2B are alternative choices from panel 1; they are not sequential decisions in one conversation. Panel 3B follows the refusal branch.

## Report use

Suggested short captions:

- **Figure 1.** Scripted Demo: pressure sharing and a contextual follow-up; Concerned response, no social suggestion.
- **Figure 2.** Scripted Demo: good news produces Happy visual feedback; the user controls whether to continue.
- **Figure 3.** Scripted Demo: optional offline connection, Accept/Not now alternatives and continued support after refusal.

State that the illustrations are synthetic replays. Do not describe them as research results or use dialogue to claim improved wellbeing or offline relationships. Actual app testing follows [the user testing guide](../USER_TESTING.md). User acceptance remains pending.
