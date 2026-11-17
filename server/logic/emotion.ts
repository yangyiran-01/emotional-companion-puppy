import type { Emotion, Language, Turn } from '../../shared/types.ts';

export type Analysis = { emotion: Emotion; reason: string; lonely: boolean; crisis: boolean; language: Language };
export const languageOf = (text: string): Language => /[\u3400-\u9fff]/u.test(text) ? 'zh' : 'en';

// Deliberately conservative and explainable; not a diagnosis or a clinical detector.
export function normalizeCues(text: string): string {
  return text.toLowerCase().replace(/[’‘]/g, "'")
    .replace(/\b(?:not|never|no longer) (?:feel(?:ing)? )?(?:lonely|alone|isolated|stressed|anxious|sad|worried|unhappy)\b/g, '')
    .replace(/\b(?:don't|do not) feel (?:lonely|alone|isolated|stressed|anxious|sad|worried)\b/g, '')
    .replace(/\b(?:not|don't feel) (?:at all |really )?happy\b/g, ' unhappy ')
    .replace(/(?:不再|并不|並不|没有感到|沒有感到|不觉得|不覺得|不感到|不)(?:那么|那麼|很|太)?(?:孤独|孤單|孤单|寂寞|焦虑|焦慮|难过|難過|紧张|緊張)/g, '')
    .replace(/(?:不|没|沒)(?:太|怎么|怎麼|那么|那麼|一点也|一點也)?开心/g, ' 难过 ')
    .replace(/(?:一点也|一點也)不开心/g, ' 难过 ')
    .replace(/(?:不再|没有|沒有)(?:很|那么|那麼)?(?:压力|壓力)/g, '');
}

export function crisisSignal(text: string): boolean {
  const t = text.toLowerCase().replace(/[’‘]/g, "'");
  // Explicit negations of intent are removed; other cues in the sentence still count.
  const intent = t.replace(/\b(?:do not|don't|never|would not|wouldn't) (?:want to |plan to |intend to )?(?:kill myself|hurt myself|end my life|die|self[- ]harm)\b/g, '')
    .replace(/(?:我)?(?:不想|不会|不會|不打算|没有想过|沒有想過)(?:再)?(?:自杀|自殺|伤害自己|傷害自己|结束生命|結束生命|去死)/g, '');
  return /\b(?:kill myself|end my life|suicid(?:e|al)|self[- ]harm|hurt myself|want to die|wish i (?:was|were) dead|overdose|can't keep myself safe)\b/.test(intent)
    || /(?:自杀|自殺|自残|自殘|想死|不想活|不想再活|想结束生命|想結束生命|伤害自己|傷害自己|吃了很多药|吃了很多藥)/.test(intent);
}

// Keep a recent explicit risk in view across short follow-ups. A user statement
// of present safety clears this narrow routing flag; it is not a risk assessment.
export function hasUnresolvedSafetyContext(text: string, history: Turn[]): boolean {
  let active = false;
  for (const turn of [...history.filter(m => m.role === 'user'), { role: 'user' as const, content: text }]) {
    if (crisisSignal(turn.content)) active = true;
    else if (/\b(?:i'm|i am) safe (?:now|and)|\bi am not in danger\b|我现在(?:是)?安全|我現在(?:是)?安全|我已经安全|我已經安全/i.test(turn.content.replace(/[’‘]/g, "'"))) active = false;
  }
  return active;
}

export function analyzeMessage(text: string, history: Turn[] = []): Analysis {
  const language = languageOf(text);
  if (crisisSignal(text)) return { emotion: 'Concerned', reason: 'SAFETY_SIGNAL', lonely: false, crisis: true, language };
  const t = normalizeCues(text);
  const lonely = /\b(?:lonely|isolated|no friends|no one to (?:talk|turn) to|haven't (?:seen|met) (?:my |any )?friends|haven't seen anyone|alone all the time|miss (?:my )?friends)\b/.test(t)
    || /(?:孤独|孤單|孤单|寂寞|没有朋友|沒朋友|没有人陪|沒有人陪|没人陪|沒人陪|没有人可以倾诉|好久没(?:有)?(?:见|和).*朋友|好久沒有(?:見|和).*朋友)/.test(t);
  const distressed = /\b(?:stress(?:ed|ful)?|overwhelm(?:ed|ing)?|exhausted|tired|anxious|anxiety|worried|worry|sad|upset|unhappy|cry(?:ing)?|burnt out|burned out|too much|piling up|can't cope|bad day|depressed|passed away|died|lost my job|slept (?:very |so |too )?late|couldn't sleep|can't sleep)\b/.test(t)
    || /(?:压力|壓力|累|疲惫|疲憊|烦恼|煩惱|难过|難過|焦虑|焦慮|崩溃|崩潰|担心|擔心|烦死|煩死|喘不过气|作业太多|作業太多|不开心|不開心)/.test(t);
  if (lonely || distressed) return { emotion: 'Concerned', reason: lonely ? 'LONELINESS_CUE' : 'DISTRESS_CUE', lonely, crisis: false, language };
  const previousUser = history.filter(m => m.role === 'user').at(-1)?.content;
  if (previousUser && /\b(?:homework|assignment|deadline|due|ddl|exam)\b|作业|作業|截止|考试|考試/i.test(t) && analyzeMessage(previousUser).emotion === 'Concerned') {
    return { emotion: 'Concerned', reason: 'FOLLOWUP_TO_DISTRESS', lonely: false, crisis: false, language };
  }
  const uncertain = /\b(?:nervous|scared|afraid|not (?:sure|confident|good enough)|lack confidence|doubt myself|try again|want to try|speak up|don't know (?:where|how) to (?:start|begin)|deadline)\b/.test(t)
    || /(?:没信心|沒信心|不自信|不确定|不確定|害怕|怕.*(?:错|錯)|想试试|想試試|不知道.*开始|不知道.*開始|不敢|缺乏信心)/.test(t);
  if (uncertain) return { emotion: 'Encouraging', reason: 'UNCERTAINTY_OR_SMALL_STEP', lonely: false, crisis: false, language };
  const positive = /\b(?:happy|excited|proud|great news|good news|lovely feedback|passed|got (?:the |a )?(?:job|offer)|finished|celebrat\w*|wonderful|delighted|made it|pleased)\b/.test(t)
    || /(?:开心|開心|高兴|高興|好消息|太棒|很棒|完成了|终于完成|終於完成|通过了|通過了|表扬|表揚|夸奖|誇獎|拿到.*offer|自豪)/.test(t);
  if (positive) return { emotion: 'Happy', reason: 'POSITIVE_CUE', lonely: false, crisis: false, language };
  const last = history.filter(m => m.role === 'user').at(-1)?.content;
  if (last && /^(?:it'?s |the |tomorrow|yes|yeah|还有|還有|就是|明天|是的|尤其)/i.test(t)) {
    const previous = analyzeMessage(last);
    if (previous.emotion === 'Concerned' && !previous.crisis) return { emotion: 'Concerned', reason: 'FOLLOWUP_TO_DISTRESS', lonely: false, crisis: false, language };
  }
  return { emotion: 'Calm', reason: 'AMBIGUOUS_OR_NEUTRAL', lonely: false, crisis: false, language };
}
