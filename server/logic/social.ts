import { randomUUID } from 'node:crypto';
import type { SocialChoice, Suggestion, Turn } from '../../shared/types.ts';
import type { Analysis } from './emotion.ts';

export function explicitSocialRequest(text: string): boolean {
  return /(?:suggest|give me|help me (?:find|plan)).{0,35}(?:social|meet people|make friends|reconnect)|how (?:can|do) i (?:meet people|make friends|reconnect)|(?:想要|给我|給我|帮我|幫我).{0,15}(?:社交建议|社交建議|交朋友|联系朋友|聯繫朋友)|怎么(?:交朋友|认识新朋友)|怎麼交朋友/i.test(text);
}
export function declinesSocialInText(text: string): boolean {
  return /(?:don't|do not|stop|no more).{0,25}(?:suggest|social|meet|contact)|(?:不想|不要|别|別|不需要).{0,12}(?:社交|联系朋友|聯繫朋友|建议|建議|见朋友|見朋友)/i.test(text);
}
export function suggestionFor(text: string, history: Turn[], analysis: Analysis, choice: SocialChoice): { suggestion: Suggestion | null; choice: SocialChoice } {
  if (declinesSocialInText(text)) return { suggestion: null, choice: 'declined' };
  if (analysis.crisis) return { suggestion: null, choice };
  const requested = explicitSocialRequest(text);
  if (choice !== 'available' && !requested) return { suggestion: null, choice };
  const lastUser = history.filter(m => m.role === 'user').at(-1)?.content ?? '';
  const followup = /^(?:yes|yeah|it'?s been|weeks|months|是的|已经|已經|好几周|好幾周)/i.test(text.trim()) && /lonely|孤独|孤单|寂寞/i.test(lastUser);
  if (!analysis.lonely && !followup && !requested) return { suggestion: null, choice };
  // Never turn "I'm not lonely" or "I feel better now" into a suggestion from history.
  if (/not lonely|不孤独|不孤单|不寂寞|feel better now|好多了/i.test(text)) return { suggestion: null, choice };
  const zh = analysis.language === 'zh';
  return { choice: 'offered', suggestion: {
    id: randomUUID(),
    title: zh ? '如果你愿意，一点小小的联系' : 'A little connection, if you’d like',
    body: zh ? '和熟悉的人散散步，或喝杯咖啡。也可以暂时不做，一切按照你的节奏来。' : 'A short walk or a coffee with someone familiar. Only if it feels right — there’s no hurry.',
    nextStep: zh ? '选一位让你感到自在的人。你可以自己发一句：“这周有空一起散散步或喝杯咖啡吗？” 不会自动发送任何内容，是否联系、何时联系，都由你决定。' : 'Pick one person you feel comfortable with. You could write: “Fancy a short walk or coffee this week?” Nothing is sent. You decide whether and when.',
    declinedFeedback: zh ? '当然可以，按照你的节奏来。我们可以继续聊；在这次对话中，除非你主动提出，我不会再建议线下社交。' : 'Of course. Your pace. We can keep talking. I won’t suggest another catch-up in this conversation unless you ask.',
  } };
}
