import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { handleConversation } from '../server/conversation.ts';
import type { ChatRequest } from '../shared/types.ts';

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });
Object.defineProperties(globalThis, {
  window: { value: dom.window, configurable: true },
  document: { value: dom.window.document, configurable: true },
  navigator: { value: dom.window.navigator, configurable: true },
  HTMLElement: { value: dom.window.HTMLElement, configurable: true },
  MutationObserver: { value: dom.window.MutationObserver, configurable: true },
  IS_REACT_ACT_ENVIRONMENT: { value: true, configurable: true, writable: true },
});
const { renderHook, act, waitFor, cleanup } = await import('@testing-library/react');
const { useConversation } = await import('../src/hooks/useConversation.ts');
const originalFetch = globalThis.fetch;
after(() => { cleanup(); globalThis.fetch = originalFetch; dom.window.close(); });
function apiStub(requests: ChatRequest[]) {
  globalThis.fetch = async (_url, init) => {
    const body = JSON.parse(init!.body as string) as ChatRequest; requests.push(body);
    return Response.json(await handleConversation(body, { model: 'test' }));
  };
}

test('Client honours Not now across subsequent conversation and labels replies', async () => {
  const requests: ChatRequest[] = []; apiStub(requests);
  const { result, unmount } = renderHook(() => useConversation());
  try {
    act(() => result.current.send('I feel lonely.'));
    await waitFor(() => assert.equal(result.current.busy, false), { timeout: 2000 });
    const card = result.current.messages.find(m=>m.suggestion)!;
    assert.equal(card.source, 'demo'); assert.equal(result.current.emotion, 'Concerned');
    act(() => result.current.decide(card.suggestion!.id, 'declined'));
    assert.equal(result.current.choice, 'declined'); assert.equal(result.current.emotion, 'Calm');
    assert.equal(requests.length, 1, 'Decline performs no external operation');
    act(() => result.current.send('I still feel lonely tonight.'));
    await waitFor(() => assert.equal(result.current.busy, false), { timeout: 2000 });
    assert.equal(requests[1].socialChoice, 'declined');
    assert.equal(result.current.messages.filter(m=>m.decision==='pending').length, 0);
    assert.equal(result.current.messages.at(-1)?.source, 'demo');
  } finally { unmount(); }
});
test('Accept gives a next step without contacting anyone', async () => {
  const requests: ChatRequest[] = []; apiStub(requests);
  const { result, unmount } = renderHook(() => useConversation());
  try {
    act(() => result.current.send('I feel lonely.'));
    await waitFor(() => assert.equal(result.current.busy, false), { timeout: 2000 });
    const card = result.current.messages.find(m=>m.suggestion)!;
    act(() => result.current.decide(card.suggestion!.id, 'accepted'));
    assert.equal(result.current.emotion, 'Encouraging'); assert.equal(result.current.choice, 'accepted');
    assert.equal(requests.length, 1); assert.match(result.current.messages.at(-1)!.content, /Nothing is sent/);
  } finally { unmount(); }
});
test('Failed request is retained and retry does not duplicate the user message', async () => {
  let calls = 0;
  globalThis.fetch = async (_url, init) => {
    calls++;
    if (calls===1) return Response.json({ message: 'Temporary connection problem.' }, { status: 503 });
    return Response.json(await handleConversation(JSON.parse(init!.body as string), { model: 'test' }));
  };
  const { result, unmount } = renderHook(() => useConversation());
  try {
    // Flush the immediately rejected HTTP response inside React's async act.
    await act(async () => { result.current.send('My assignments are exhausting.'); });
    assert.ok(result.current.failed);
    assert.equal(result.current.messages.filter(m=>m.role==='user').length, 1);
    assert.equal(result.current.messages.at(-1)?.failed, true); assert.match(result.current.error, /connection/);
    act(() => result.current.retry());
    await waitFor(() => assert.equal(result.current.busy, false), { timeout: 2000 });
    assert.equal(calls, 2); assert.equal(result.current.messages.filter(m=>m.role==='user').length, 1);
    assert.equal(result.current.error, ''); assert.equal(result.current.messages.at(-1)?.source, 'demo');
  } finally { unmount(); }
});
test('Edit restores a failed draft and whitespace cannot be sent', async () => {
  globalThis.fetch = async () => { throw new TypeError('Network disconnected'); };
  const { result, unmount } = renderHook(() => useConversation());
  try {
    act(() => result.current.send('   ')); assert.equal(result.current.messages.length,1);
    act(() => result.current.send('A message to keep.'));
    await waitFor(() => assert.ok(result.current.failed));
    act(() => result.current.editFailed());
    assert.equal(result.current.draft,'A message to keep.'); assert.equal(result.current.failed,null); assert.equal(result.current.messages.length,1);
  } finally { unmount(); }
});
test('A new conversation cancels stale replies and resets session choices', async () => {
  let resolveReply!: (response: Response)=>void;
  globalThis.fetch = async () => new Promise<Response>(resolve=>{resolveReply=resolve;});
  const { result, unmount } = renderHook(() => useConversation());
  try {
    act(() => result.current.send('A message before reset.')); assert.equal(result.current.busy,true);
    act(() => result.current.changeMode('ai')); assert.equal(result.current.mode,'ai'); assert.equal(result.current.messages.length,1);
    await act(async()=>{ resolveReply(Response.json({ reply:'A stale reply', emotion:'Happy', emotionReason:'POSITIVE_CUE', source:'demo', suggestion:null, socialChoice:'available' })); await new Promise(resolve=>setTimeout(resolve,500)); });
    assert.equal(result.current.messages.length,1); assert.equal(result.current.emotion,'Calm'); assert.equal(result.current.busy,false); assert.equal(result.current.choice,'available');
  } finally { unmount(); }
});
