import type { Turn } from '../../shared/types.ts';
import type { Analysis } from '../logic/emotion.ts';
import { explicitSocialRequest } from '../logic/social.ts';

// Transparent scripted mode. Context-aware templates are not model generation.
export function demoReply(text: string, analysis: Analysis, history: Turn[]): string {
  const { language, emotion, lonely, reason } = analysis;
  const turn = history.filter(m => m.role === 'user').length;
  const zh = language === 'zh';
  if (/不想.*建议|不要.*建议|don't.*suggest|do not.*suggest/i.test(text)) return zh ? '好的，我会尊重你的选择。我们可以先聊聊你现在的感受，你想从哪里说起呢？' : 'Of course. I’ll respect that. We can stay with how things feel for you, without planning a next step. What would you like to share?';
  if (explicitSocialRequest(text)) return zh ? '可以，我们可以一起想一个小小的选择。下面的想法只是供你参考，是否尝试完全由你决定。' : 'We can think about one small option. The idea below is only an invitation — you’re free to take it or leave it.';
  if (lonely) {
    const repeat = history.some(m => m.role === 'user' && /lonely|孤独|孤单|寂寞/i.test(m.content));
    if (repeat) return zh ? '听起来那份孤单还在，尤其安静下来的时候可能更明显。我们可以先待在这份感受里，不急着做什么。现在的孤单对你来说是什么样的呢？' : 'It sounds like that lonely feeling is still there. Quiet moments can make it feel more noticeable. We can stay with how you feel, without rushing to do anything. What is tonight like for you?';
    return zh ? '听起来你最近有些孤单。想念有人陪伴、一起分享日常的感觉，是可以理解的。你愿意说说最近什么时候最有这种感觉吗？' : 'That sounds lonely. Missing someone to share the little parts of your day with can really ache. When has that feeling been strongest lately?';
  }
  if (reason === 'FOLLOWUP_TO_DISTRESS') return zh ? '听起来这件事一直压在你心上。眼前的事情不必一次解决，我们可以先梳理最让你发愁的一部分。现在最难的是哪一步呢？' : 'It sounds like this has been weighing on you. We don’t have to solve it all at once. Which part feels hardest to start right now?';
  if (emotion === 'Concerned') {
    const study = /assign|homework|deadline|exam|project|作业|作業|学习|學習|考试|考試|论文|論文|截止/i.test(text + ' ' + history.filter(m=>m.role==='user').at(-1)?.content);
    if (study) return zh ? '听起来最近的学习任务让你很疲惫。事情一件接着一件，确实容易觉得喘不过气。最近最让你有压力的是哪一项呢？' : 'That sounds like a lot to carry. When the assignments keep coming, it can be hard to catch your breath. What feels heaviest today?';
    return (zh ? ['听起来你真的不好受。你不必急着把情绪整理好，慢慢说也可以。你愿意多说一点发生了什么吗？', '谢谢你继续说给我听。这件事对你有影响是可以理解的，你希望先聊哪一部分呢？'] : ['That sounds difficult. You don’t have to tidy your feelings up before sharing them. Would you like to tell me a little more?', 'I’m listening. It makes sense that this is affecting you. What part would you like to stay with for a moment?'])[turn % 2];
  }
  if (emotion === 'Happy') return zh ? '听起来是个值得开心的时刻呀！你付出的努力有了回响，真替你高兴。最让你自豪的是哪一部分呢？' : 'That sounds like a moment worth enjoying! Your effort has paid off, and it’s lovely to hear your good news. What part are you proudest of?';
  if (emotion === 'Encouraging') return zh ? '想尝试又有点没信心，是很自然的。你不需要一下子做到完美。有没有一个小到让你觉得可以试试的第一步呢？' : 'It makes sense to feel unsure when something matters to you. You don’t need a perfect first try. What’s one small step that might feel manageable?';
  if (/thank|谢谢|謝謝/i.test(text)) return zh ? '不客气。你可以按照自己的节奏继续，也可以先休息一会儿。' : 'You’re welcome. You can keep talking at your own pace, or take a little pause.';
  return (zh ? ['我在听。开心的小事，或是心里有点放不下的事，都可以慢慢分享。今天对你来说是怎样的一天呢？', '谢谢你分享这些。你想继续说下去，还是先聊聊这让你有什么感受呢？', '可以的，我们慢慢来。现在你最想说的一件事是什么呢？'] : ['I’m listening. The little things count, too. What has today been like for you?', 'Thank you for sharing that. Would you like to say more about what happened, or how it felt?', 'We can take our time. What’s on your mind right now?'])[turn % 3];
}
