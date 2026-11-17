import { z } from 'zod';

export const MAX_INPUT = 1500;
export const MAX_CONTEXT = 12;
export const emotionSchema = z.enum(['Calm', 'Happy', 'Concerned', 'Encouraging']);
export type Emotion = z.infer<typeof emotionSchema>;
export const choiceSchema = z.enum(['available', 'offered', 'accepted', 'declined']);
export type SocialChoice = z.infer<typeof choiceSchema>;
export type Mode = 'demo' | 'ai';
export type Language = 'en' | 'zh';
export type Turn = { role: 'user' | 'assistant'; content: string };
export const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(MAX_INPUT),
  history: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().max(2500) }).strict()).max(MAX_CONTEXT),
  mode: z.enum(['demo', 'ai']),
  socialChoice: choiceSchema,
}).strict();
export type ChatRequest = z.infer<typeof chatRequestSchema>;
export const suggestionSchema = z.object({
  id: z.string(), title: z.string(), body: z.string(),
  nextStep: z.string(), declinedFeedback: z.string(),
});
export type Suggestion = z.infer<typeof suggestionSchema>;
export const chatResponseSchema = z.object({
  reply: z.string().min(1), emotion: emotionSchema, emotionReason: z.string(),
  source: z.enum(['demo', 'ai', 'safety']),
  suggestion: suggestionSchema.nullable(), socialChoice: choiceSchema,
});
export type ChatResponse = z.infer<typeof chatResponseSchema>;
export type Message = Turn & {
  id: string;
  source?: ChatResponse['source'] | 'guidance';
  failed?: boolean;
  suggestion?: Suggestion;
  decision?: 'pending' | 'accepted' | 'declined' | 'closed';
};
