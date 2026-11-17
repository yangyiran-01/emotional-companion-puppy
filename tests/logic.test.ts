import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeMessage, crisisSignal } from '../server/logic/emotion.ts';
import { suggestionFor } from '../server/logic/social.ts';
import { handleConversation } from '../server/conversation.ts';
import { extractResponseText, followsBoundaries, generateAiReply, ProviderError } from '../server/ai/openai.ts';
import type { ChatRequest, SocialChoice } from '../shared/types.ts';

const cfg = { model: 'test-model' };
const request = (message: string, socialChoice: SocialChoice = 'available'): ChatRequest => ({ message, history: [], mode: 'demo', socialChoice });
for (const [text, expected] of [
  ['My assignments keep piling up. I’m exhausted.', 'Concerned'],
  ['最近作业太多了，感觉每天都很累。', 'Concerned'],
  ['I finally finished my project and got lovely feedback!', 'Happy'],
  ['今天终于完成了项目，好开心！', 'Happy'],
  ['I want to speak up in class, but I’m scared I’ll get it wrong.', 'Encouraging'],
  ['我没有信心，不敢在课堂上发言。', 'Encouraging'],
  ['I bought some pencils.', 'Calm'],
  ['今天吃了面条。', 'Calm'],
  ['I am not happy.', 'Concerned'],
  ['I am not stressed anymore.', 'Calm'],
  ['我不觉得孤独。', 'Calm'],
  ['I’m happy about the project, but also exhausted and worried.', 'Concerned'],
  ['My dog passed away.', 'Concerned'],
  ['I slept very late because my homework is due today.', 'Concerned'],
] as const) test(`Emotion cue: ${text}`, () => assert.equal(analyzeMessage(text).emotion, expected));

test('Ambiguous follow-up uses the recent stress context', () => {
  const a = analyzeMessage('It’s all due tomorrow.', [{ role: 'user', content: 'I’m exhausted by my assignments.' }]);
  assert.equal(a.emotion, 'Concerned'); assert.equal(a.reason, 'FOLLOWUP_TO_DISTRESS');
});
test('Deadline shorthand remains connected to recent tiredness', () => assert.equal(analyzeMessage('My homework ddl is today.', [{ role: 'user', content: 'I’m so tired today.' }]).emotion, 'Concerned'));
test('Neutral gratitude does not inherit loneliness', () => assert.equal(analyzeMessage('Thank you.', [{ role: 'user', content: 'I feel lonely.' }]).lonely, false));
for (const text of ['I feel lonely.', '最近很孤独，好久没有和朋友见面了。']) test(`Loneliness offers an optional card: ${text}`, async () => {
  const r = await handleConversation(request(text), cfg);
  assert.equal(r.emotion, 'Concerned'); assert.ok(r.suggestion); assert.equal(r.socialChoice, 'offered');
  assert.ok(r.suggestion.nextStep); assert.ok(r.suggestion.declinedFeedback);
});
for (const text of ['I’m stressed about homework.', 'I feel sad today.', 'I am not lonely.', '我不觉得孤独。', 'I enjoy living alone.']) test(`No unnecessary social nudge: ${text}`, async () => assert.equal((await handleConversation(request(text), cfg)).suggestion, null));
for (const choice of ['declined', 'accepted', 'offered'] as const) test(`Does not repeat suggestion after ${choice}`, async () => {
  const r = await handleConversation(request('I still feel lonely.', choice), cfg); assert.equal(r.suggestion, null); assert.equal(r.socialChoice, choice);
});
test('Explicitly asking again restores user control after refusal', async () => {
  const r = await handleConversation(request('Can you suggest a social activity?', 'declined'), cfg); assert.ok(r.suggestion);
});
test('A textual refusal also persists as declined', async () => {
  const r = await handleConversation(request('I am lonely but do not suggest meeting friends.'), cfg); assert.equal(r.suggestion, null); assert.equal(r.socialChoice, 'declined');
});
test('Repeated loneliness after refusal still gets emotional support', async () => {
  const r = await handleConversation(request('I feel lonely.', 'declined'), cfg); assert.match(r.reply, /lonely/); assert.equal(r.suggestion, null);
});
test('Follow-up to loneliness can be considered only before a suggestion', () => {
  const text = 'Yes, it’s been weeks.'; const history = [{ role: 'user' as const, content: 'I feel lonely.' }];
  assert.ok(suggestionFor(text, history, analyzeMessage(text, history), 'available').suggestion);
  assert.equal(suggestionFor(text, history, analyzeMessage(text, history), 'declined').suggestion, null);
});
for (const text of ['I want to kill myself.', '我很孤独，不想活了。']) test(`Safety overrides ordinary social path: ${text}`, async () => {
  let called = false;
  const r = await handleConversation({ ...request(text), mode: 'ai' }, { model: 'test', fetcher: async () => { called = true; throw new Error('Must not call model'); } });
  assert.equal(called, false); assert.equal(r.source, 'safety'); assert.equal(r.emotion, 'Concerned'); assert.equal(r.suggestion, null); assert.match(r.reply, /emergency|急救/);
});
test('Explicit denial of harmful intent is not itself a crisis flag', () => {
  assert.equal(crisisSignal('I don’t want to hurt myself.'), false);
  assert.equal(crisisSignal('我不会伤害自己。'), false);
});
test('Recent unresolved crisis context cannot become an ordinary loneliness card', async () => {
  const r = await handleConversation({ ...request('I feel lonely.'), history: [{ role: 'user', content: 'I want to kill myself.' }] }, cfg);
  assert.equal(r.source, 'safety'); assert.equal(r.suggestion, null);
});
test('A clear statement of present safety clears the narrow context routing flag', async () => {
  const r = await handleConversation({ ...request('I’m safe now, and someone is with me.'), history: [{ role: 'user', content: 'I want to kill myself.' }] }, cfg);
  assert.equal(r.source, 'demo'); assert.equal(r.suggestion, null);
});
test('Demo is honestly labelled and can continue in Chinese context', async () => {
  const r = await handleConversation({ ...request('明天就截止了。'), history: [{ role: 'user', content: '我作业很多，很累。' }] }, cfg);
  assert.equal(r.source, 'demo'); assert.equal(r.emotion, 'Concerned'); assert.match(r.reply, /听起来/);
});
test('Missing real key produces an error, never a demo reply', async () => {
  await assert.rejects(handleConversation({ ...request('hello'), mode: 'ai' }, cfg), (e: unknown) => e instanceof ProviderError && e.code === 'AI_NOT_CONFIGURED');
});
test('Only completed nonempty Responses output is accepted', () => {
  assert.equal(extractResponseText({ status: 'completed', output: [{ content: [{ type: 'output_text', text: ' A warm reply. ' }] }] }), 'A warm reply.');
  assert.throws(() => extractResponseText({ status: 'incomplete', output: [] }));
  assert.throws(() => extractResponseText({ status: 'completed', output: [] }));
});
test('Real API adapter uses server key, bounded context and store:false', async () => {
  let body: Record<string, unknown> = {};
  const reply = await generateAiReply('I’m stressed.', [{ role: 'user', content: 'My exam is tomorrow.' }], analyzeMessage('I’m stressed.'), {
    model: 'test-model', apiKey: 'test-key-not-a-secret', fetcher: async (url, options) => {
      assert.equal(url, 'https://api.openai.com/v1/responses');
      assert.equal((options?.headers as Record<string, string>).Authorization, 'Bearer test-key-not-a-secret');
      body = JSON.parse(options!.body as string);
      return new Response(JSON.stringify({ status: 'completed', output: [{ content: [{ type: 'output_text', text: 'That sounds exhausting. What feels hardest?' }] }] }));
    },
  });
  assert.match(reply, /exhausting/); assert.equal(body.store, false); assert.equal((body.input as unknown[]).length, 2);
  assert.equal((body.input as Array<{ role: string }>).at(-1)?.role, 'user');
});
test('Timeouts and upstream errors are sanitized, with no scripted fallback', async () => {
  const analysis = analyzeMessage('hello');
  await assert.rejects(generateAiReply('hello', [], analysis, { model: 'test', apiKey: 'fake', timeoutMs: 5, fetcher: async (_url, options) => new Promise((_resolve, reject) => { options?.signal?.addEventListener('abort', () => reject(new Error('private provider detail'))); }) }), (e: unknown) => e instanceof ProviderError && e.code === 'AI_TIMEOUT');
  await assert.rejects(generateAiReply('hello', [], analysis, { model: 'test', apiKey: 'fake', fetcher: async () => new Response('private provider detail', { status: 401 }) }), (e: unknown) => e instanceof ProviderError && e.code === 'AI_UNAVAILABLE' && !e.message.includes('private'));
});
test('Pressure and unsolicited offline actions fail the output boundary check', () => {
  assert.equal(followsBoundaries('You only need me.'), false);
  assert.equal(followsBoundaries('You should text your friend.'), false);
  assert.equal(followsBoundaries('你可以找朋友聊聊天。'), false);
  assert.equal(followsBoundaries('That sounds difficult. Would you like to say more?'), true);
});
