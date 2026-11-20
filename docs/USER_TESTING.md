# PawPal user testing and acceptance

Status: awaiting the user's own testing. Expected results below are instructions, not completed user-test results.

## Opening the application and choosing a mode

Development URL: **http://127.0.0.1:5173/**. If the service has stopped, run `npm ci` on first setup, then `npm run dev` in the project directory. Keep the terminal running. If an older test tab has DevTools Offline enabled, open a fresh ordinary tab.

Start in **Demo mode**. The top notice and individual replies should identify scripted output. Real AI is not configured and no live-model testing has been completed. Follow the README to configure `.env` locally later, restart and refresh, then validate AI mode separately.

## Three required scenarios

1. **Study pressure:** start a new conversation and send “My assignments keep piling up. I’m exhausted.” Expect Concerned and a supportive reply, without a social card. Follow with “It’s all due tomorrow.” Check that conversation continues and retains the pressure context.
2. **Good news:** select New conversation (the + control on mobile), confirm Start fresh, and send “I finally finished my project — and got lovely feedback!” Expect Happy, a positive response and a wag or gentle bounce.
3. **Loneliness and suggestions:** in a new conversation, send “I feel lonely. I haven’t seen my friends in weeks.” Expect support, Concerned and an optional card with Accept and Not now. Select Accept: a self-directed next step and Encouraging should appear, without sending anything. Start a separate conversation, repeat the loneliness message and select Not now. Expect respectful feedback. Send “I still feel lonely tonight.” Support should continue without another unsolicited card.

Send “I have no confidence. I’m afraid to speak in class.” to inspect Encouraging. A new conversation defaults to Calm. Check that all four expressions retain the same puppy and that their differences are visible.

## Optional checks

- Whitespace cannot be sent. Enter sends, Shift+Enter inserts a line break, and selecting text with an input method must not accidentally send.
- A waiting state appears while processing, and duplicate sending is disabled.
- Temporarily stop the local API, send a message and inspect the error, retained message, Retry and Edit. Restore the service before retrying. This is a test-process operation, not an edit to real chat records.
- Continue chatting after either suggestion decision. An explicit request such as “Give me some social suggestions” should reopen the card.
- Resize to mobile width and check text, buttons, input and scrolling. Physical-phone keyboard behaviour remains unverified.
- Open About & privacy and inspect the AI disclosure, data flow and counselling limitation. Refresh should clear history.
- If testing safety routing, use fictional fixtures rather than treating the prototype as a crisis service. Expect Safety guidance and no ordinary social card.

## Feedback template

```text
Environment (computer or phone, browser):
Overall UI and pink/lavender style: Pass / Changes needed (describe)
Puppy and four expressions: Pass / Changes needed (describe)
Three scenarios and buttons: Pass / Changes needed (describe)
Naturalness and appropriateness of Demo replies and suggestions:
Other issues or requested changes:
Ready to begin live AI integration testing:
```

Passing Demo testing approves only the Demo stage. Live AI testing, outstanding Figma work and final acceptance still need explicit verification. Developer checks or opening the page do not substitute for the user's final decision.
