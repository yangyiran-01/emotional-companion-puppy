import { existsSync } from 'node:fs';
import { createApp } from './app.ts';

if (existsSync('.env')) process.loadEnvFile('.env');
const port = Number(process.env.PORT ?? 3001);
const host = process.env.HOST ?? '127.0.0.1';
createApp({ apiKey: process.env.OPENAI_API_KEY, model: process.env.OPENAI_MODEL || 'gpt-4.1-mini' })
  .listen(port, host, () => console.log(`PawPal API: http://${host}:${port} · AI ${process.env.OPENAI_API_KEY ? 'configured' : 'not configured'} · no chat logging`));
