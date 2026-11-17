import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chatRequestSchema } from '../shared/types.ts';
import { handleConversation } from './conversation.ts';
import { ProviderError, type AiConfig } from './ai/openai.ts';

export function createApp(config: AiConfig) {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet({ contentSecurityPolicy: { directives: { upgradeInsecureRequests: null } } }));
  app.use('/api', (_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  app.get('/api/config', (_req, res) => res.json({ aiConfigured: Boolean(config.apiKey), defaultMode: 'demo' }));
  app.get('/api/health', (_req, res) => res.json({ ok: true }));
  app.use('/api', rateLimit({ windowMs: 60_000, limit: 30, standardHeaders: true, legacyHeaders: false,
    message: { error: 'TOO_MANY_REQUESTS', message: 'A little pause, please. Try again in a minute.' } }));
  app.use('/api', (req, res, next) => {
    const origin = req.get('origin');
    const ownOrigin = `${req.protocol}://${req.get('host')}`;
    if (origin && origin !== ownOrigin && !['http://127.0.0.1:5173', 'http://localhost:5173'].includes(origin)) {
      res.status(403).json({ error: 'ORIGIN_NOT_ALLOWED', message: 'Please use the PawPal application.' }); return;
    }
    if (req.method === 'POST' && !req.is('application/json')) {
      res.status(415).json({ error: 'JSON_REQUIRED', message: 'Expected a JSON request.' }); return;
    }
    next();
  });
  app.use('/api', express.json({ limit: '32kb' }));
  app.post('/api/chat', async (req, res) => {
    const parsed = chatRequestSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'INVALID_INPUT', message: 'Please send a message of 1–1500 characters with valid conversation context.' }); return; }
    try { res.json(await handleConversation(parsed.data, config)); }
    catch (error) {
      const code = error instanceof ProviderError ? error.code : 'REQUEST_FAILED';
      const status = error instanceof ProviderError ? error.status : 500;
      const messages: Record<string,string> = {
        AI_NOT_CONFIGURED: 'AI mode needs a server API key. Choose Demo mode or configure the server.',
        AI_TIMEOUT: 'The AI reply took too long. Your message is still here; you can retry.',
        AI_RATE_LIMIT: 'The AI service is busy or has reached its limit. Please try again later.',
        AI_BOUNDARY_CHECK_FAILED: 'The reply did not meet PawPal’s response boundaries. Please retry or edit your message.',
      };
      // Never log requests, model responses, headers, upstream error bodies or keys.
      res.status(status).json({ error: code, message: messages[code] ?? 'The reply didn’t arrive. Your message is still here; you can retry.' });
    }
  });
  app.use('/api', (_req, res) => res.status(404).json({ error: 'NOT_FOUND', message: 'Unknown API route.' }));
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const dist = path.join(root, 'dist');
  if (existsSync(path.join(dist, 'index.html'))) {
    app.use(express.static(dist));
    app.get('/{*path}', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
  }
  app.use((error: { type?: string; status?: number }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(error.type === 'entity.too.large' ? 413 : 400).json({ error: 'INVALID_REQUEST', message: 'The request could not be read. Please shorten your message and retry.' });
  });
  return app;
}
