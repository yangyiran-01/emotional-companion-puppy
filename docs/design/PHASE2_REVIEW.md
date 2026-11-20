# PawPal Phase 2 design review

Recorded: 17 November 2026, Europe/London.

Historical design-stage status: UI and diagrams created; prototype connections and final checks incomplete; awaiting design review.

This is a design delivery record, not the Assignment 2 report.

**Later implementation note:** the user subsequently authorised Phase 3 development. The historical status below is retained without presenting unfinished prototype connections as completed. See `../DEVELOPMENT_RECORD.md`, `../ARCHITECTURE.md` and `../TEST_RESULTS.md` for the implemented application and remaining work. Final user acceptance is still pending.

## Actual files

- [Editable Figma design](https://www.figma.com/design/bSwc6WMJZDteksbkpXjq9t)
- [Desktop main screen](https://www.figma.com/design/bSwc6WMJZDteksbkpXjq9t?node-id=4-2)
- [Puppy and design foundations](https://www.figma.com/design/bSwc6WMJZDteksbkpXjq9t?node-id=3-332)
- [Mobile loneliness and suggestion screen](https://www.figma.com/design/bSwc6WMJZDteksbkpXjq9t?node-id=4-1394)
- [FigJam interaction flow review version](https://www.figma.com/board/8jYrvRgGJTvzMQ2HRMbE5l)
- [FigJam planned architecture](https://www.figma.com/board/aKVZYwaif4BArPmoKljpjQ)

An earlier flow draft also exists (`FRzpy5UWjoFYiJZnI5hwa7`). Review found that its normal reply path bypassed the safety decision, so the corrected version linked above was created. The draft is not the delivery reference; it was not deleted or falsely described as edited.

## Created content

Figma contains two pages: `01 · UI & Prototype` and `02 · Foundations & Pet`.

Desktop 1440 × 1024 and mobile 390 × 844 each contain these ten screens, twenty in total:

1. Main: default Calm, welcome copy, example prompts, input and AI disclosure.
2. Happy: project completion and positive feedback, happy puppy and congratulations.
3. Concerned: assignment pressure, concerned expression and support.
4. Encouraging: uncertainty about speaking in class and a raised paw.
5. Lonely: loneliness, support, an optional suggestion and Accept / Not now.
6. Accepted: one actionable contact suggestion, explicitly stating that nothing is sent.
7. Declined: respectful feedback without another proactive reminder.
8. Followup: a subsequent assignment-deadline turn.
9. Loading: a preset waiting state.
10. Error: retained message, network error and retry control.

Screens use editable text, vectors, component instances and auto layout rather than whole-page screenshots. Inspected main and suggestion screens contained no full-page raster images.

## Visual specification

| Purpose | Value |
| --- | --- |
| Page background | #FAF5FF |
| Cards | #FFF9FD |
| Soft purple | #A78BFA |
| Blossom pink | #F9A8D4 |
| Primary action | #7C3AED |
| Body text | #40364D |
| Typeface | Inter; body 16/25, mobile messages 14/22 |
| Spacing | 4, 8, 12, 16, 24, 32, 48px |
| Card radius | 20, 28px |
| Buttons | 48px height; Default / Hover / Active / Focus / Disabled / Loading |

Figma variables define colour and layout foundations; text and shadows have local styles. Buttons, inputs, message bubbles and the puppy are reusable components. No fourth core feature was added.

## Puppy provenance and changes

Figma `generate_vector_illustration` generated the original Calm puppy once, using Figma AI credits.

The cream, floppy-eared puppy has a round face, short paws and tail, pink blush and a lavender scarf. The generated vector has separate body, ears, eyes, brows, mouth, tail, scarf and paw layers.

Subsequent AI-assisted Figma scripts copied that source while retaining its body and palette. Happy changes the eyes and smile; Concerned changes brows and eyes; Encouraging adds an upbeat smile and raised paw. Calm retains the relaxed expression. Four unrelated puppy images were not used.

AI-assisted visual inspection checked the original and four states for consistent identity. A completed human visual review was not recorded. Scarf, fur and body shape remain consistent across states.

Breathing, blinking, wagging, nodding and transitions were planned for the web implementation at this stage. The Figma file did not yet contain animation or clickable connections.

## Flow and architecture

The interaction flow covers blank input, context, safety decisions, classification, shared-puppy mapping, reply generation and retry, appropriate social suggestions, acceptance, refusal and continued chat.

The architecture shows six required modules and planned data/control flows. Browser and single-server boundaries are marked; the external model API was planned at this stage.

- **Implemented at Phase 2:** no application modules yet.
- **Simulated:** preset Figma conversations.
- **Planned:** frontend and backend logic, model integration and pet animation.

This planned diagram must not be presented as the final implemented architecture. The current implementation diagram is in `../architecture-current.svg`.

## Checks and corrections performed

- The Figma file, components and screens were created successfully.
- Available fonts were checked and confirmed Inter style names used.
- Four pet states, twelve button variants, four input variants and two message roles were created.
- Inspected desktop/mobile screens contained text, vectors and instances; inspected text used Inter.
- The first foundations preview revealed insufficient horizontal-layout height. It was corrected and the four full puppy states were checked again.
- Control examples changed from text-adaptive width to 160 × 48. That final width change was not screenshot-rechecked. The saved local foundations preview predates it but still shows the puppy and palette.
- Initial mobile suggestion text clipped horizontally. The message component was changed to fill parent width while retaining automatic height.
- Input was moved to the desktop card bottom, and mobile frames set to 390 × 844. The revised desktop main preview was inspected.
- Screenshot requests for final mobile wrapping and dimensions were blocked by quota.
- Both FigJam diagrams were created, and returned SVG previews saved locally. Full-diagram inspection at normal zoom remained incomplete at this stage.

## Blockers and outstanding items at Phase 2

Figma returned: `You've reached the Figma MCP tool call limit on the Starter plan`.

Design writes and screenshots were blocked. Prototype connection attempts were also rejected; no connection was written successfully. The diagram tool could create separate FigJam files, allowing the two diagrams above, but appending to existing diagrams was blocked.

A normal browser login/open attempt did not expose a usable editor, so the file was not edited through the browser. No subscription or payment change was made.

Outstanding items:

- Clickable connections, flow starting points and actual click-through verification.
- Revised mobile wrapping and bottom-input screenshot checks.
- Final control-example width checks.
- Retaining the previous two messages in Followup to make continuity clearer; it currently shows the later turn as a separate state.
- Final inspection of all screens and complete diagrams.

Complete these when quota or an editable Figma environment becomes available. The unconnected design is not described as a clickable prototype.

## Review sequence

1. Inspect the desktop layout, pink/lavender palette and readability.
2. Inspect foundations, puppy identity, four expressions and appeal.
3. Compare Concerned, Happy and Encouraging feedback.
4. Compare Lonely, Accepted and Declined for natural advice and respected refusal.
5. Inspect mobile layout while retaining unverified wrapping flags.
6. Inspect the user flow and architecture labelled Planned.
7. Once connections exist, click through chat, expression changes, acceptance, refusal and retry.

At the historical Phase 2 stopping point, final visual review was not recorded and no React application, backend, key configuration, Git commit or final report had been created. Later progress is recorded in the implementation note above and the development record.
