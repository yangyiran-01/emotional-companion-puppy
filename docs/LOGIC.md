# Emotion and suggestion logic

This documents code behaviour, not psychological diagnosis or an effectiveness study.

## Requests and conversation state

For each turn, the client sends the current text, at most twelve recent messages, mode and conversation-level suggestion choice to `/api/chat`. Current input is limited to 1–1,500 characters; each context message is limited to 2,500 characters. Both client and server validate the protocol with Zod. Chat exists only in the current tab's memory; refresh, mode changes and new conversations clear it.

## Emotion mapping

`server/logic/emotion.ts` matches English and Chinese cue phrases using explicit rules:

1. Explicit safety cues take priority, selecting Concerned and a separate safety response.
2. A small set of negations is normalised, including equivalents of “not lonely”; “not happy” becomes a distress cue.
3. Loneliness, stress, fatigue and worry select Concerned, including mixed-emotion messages.
4. Assignment, deadline and some follow-up references after recent distress retain Concerned.
5. Uncertainty, reluctance to try or low confidence select Encouraging.
6. Happiness, completing a project or good news select Happy.
7. Other input defaults to Calm.

The returned `emotionReason` identifies the matching rule; raw input is not logged to the console. `useConversation` controls the expression. `Pet.tsx` shares one body across all states: Calm breathes and blinks; Happy wags and gently bounces; Concerned tilts its head and changes its brows; Encouraging raises a paw and nods. A reduced-motion preference disables nonessential animation.

## Suggestion eligibility and choice

`server/logic/social.ts` produces a card only for explicit loneliness, narrowly defined loneliness follow-ups or an explicit request for social advice. Ordinary study stress and general sadness do not qualify. Emotional support is displayed before the optional card.

Conversation choices are `available`, `offered`, `accepted` and `declined`. Offered, accepted and declined states suppress further proactive cards. Not now and textual refusal set `declined`; only an explicit later request reopens suggestions. Accept reveals one small step that the person may choose to take. Both buttons change local state only; neither sends email, messages or external contact requests.

## Safety and failure handling

Explicit self-harm cues override ordinary chat and suggestions. Recent unresolved explicit risk also retains the safety route. Fixed guidance offers support, directs immediate danger to local emergency services or an emergency department, and suggests a trusted person nearby. It does not invent helpline numbers, invoke the ordinary model or display an ordinary social card. An explicit statement of current safety clears the narrow context flag. These rules cannot comprehensively detect crises and may misinterpret quotations, metaphors or negation.

AI mode uses fixed system boundaries and simple output checks for some dependency language and social advice that bypasses the card. These checks can miss inappropriate content or reject acceptable text. Failures return a retryable error rather than presenting scripted text as AI output. The server model timeout is twenty seconds; the client request timeout is twenty-five seconds. Failed user messages are retained for Retry or Edit; retry does not duplicate the user bubble.

## Privacy boundaries

Demo text is processed by the local service. AI mode sends the current message and recent context to OpenAI through the server. `store: false` does not guarantee zero provider retention; see the data-policy link in the README. The application has no chat logs, database, persistent browser storage or analytics. Rate limiting maintains short-lived IP counters. This version runs as a local prototype.

Implementation references: [OpenAI Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create) and [OpenAI data controls](https://developers.openai.com/api/docs/guides/your-data). The general emergency-help directions refer to [NHS help for suicidal thoughts](https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/behaviours/help-for-suicidal-thoughts/). These sources do not establish the effectiveness of this system's safety detection.

## Repository language

Documentation and explanatory text are in English. Chinese literals in source code are bilingual input patterns and reply data; Chinese test fixtures verify that functionality. They are not untranslated repository instructions.
