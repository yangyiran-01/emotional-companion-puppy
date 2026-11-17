import { chatResponseSchema, type ChatRequest } from '../../shared/types.ts';

export async function sendChat(request: ChatRequest, signal: AbortSignal) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal.addEventListener('abort', abort, { once: true });
  if (signal.aborted) controller.abort();
  const timer = setTimeout(abort, 25_000);
  const start = Date.now();
  try {
    const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request), signal: controller.signal });
    const body = await response.json().catch(() => null);
    if (!response.ok) throw new Error(typeof body?.message === 'string' ? body.message : 'The reply didn’t arrive. Please try again.');
    const parsed = chatResponseSchema.safeParse(body);
    if (!parsed.success) throw new Error('The reply could not be read. Please try again.');
    // Small, documented visual pause in scripted mode so its loading state is visible.
    if (request.mode === 'demo') await new Promise(resolve => setTimeout(resolve, Math.max(0, 450 - (Date.now() - start))));
    if (controller.signal.aborted) throw new DOMException('Request cancelled', 'AbortError');
    return parsed.data;
  } catch (error) {
    if (controller.signal.aborted && !signal.aborted) throw new Error('The reply took too long. Your message is still here; you can retry.');
    if (error instanceof TypeError) throw new Error('PawPal couldn’t reach the server. Check the connection, then retry.');
    throw error;
  } finally { clearTimeout(timer); signal.removeEventListener('abort', abort); }
}
