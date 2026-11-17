import type { ChatRequest, ChatResponse } from '../shared/types.ts';
import { analyzeMessage, hasUnresolvedSafetyContext } from './logic/emotion.ts';
import { suggestionFor } from './logic/social.ts';
import { demoReply } from './ai/demo.ts';
import { generateAiReply, type AiConfig } from './ai/openai.ts';

export async function handleConversation(request: ChatRequest, config: AiConfig): Promise<ChatResponse> {
  const analysis = analyzeMessage(request.message, request.history);
  if (hasUnresolvedSafetyContext(request.message, request.history)) return {
    reply: analysis.language === 'zh'
      ? '听到你正在承受这些，我很关心你现在的安全。如果你可能马上伤害自己或已处于危险中，请立即联系当地急救服务，或前往最近的急诊。如果可以，请远离可能伤害自己的物品，并请身边信任的人陪着你。我是 AI，无法提供紧急救助。你现在安全吗？'
      : 'I’m sorry you’re hurting, and I’m concerned about your safety. If you might act on this or are in immediate danger, contact local emergency services now or go to the nearest emergency department. If you can, move away from anything you could use to hurt yourself and ask someone you trust to stay with you. I’m AI and can’t provide emergency help. Are you safe right now?',
    emotion: 'Concerned', emotionReason: analysis.crisis ? analysis.reason : 'RECENT_UNRESOLVED_SAFETY_CONTEXT', source: 'safety', suggestion: null, socialChoice: request.socialChoice,
  };
  const social = suggestionFor(request.message, request.history, analysis, request.socialChoice);
  const reply = request.mode === 'ai'
    ? await generateAiReply(request.message, request.history, analysis, config)
    : demoReply(request.message, analysis, request.history);
  return { reply, emotion: analysis.emotion, emotionReason: analysis.reason,
    source: request.mode, suggestion: social.suggestion, socialChoice: social.choice };
}
