import { useEffect, useRef, useState } from 'react';
import { MAX_CONTEXT, MAX_INPUT, type Emotion, type Message, type Mode, type SocialChoice, type Suggestion, type Turn } from '../../shared/types.ts';
import { sendChat } from '../services/api.ts';

const greeting = (): Message => ({ id: crypto.randomUUID(), role: 'assistant', content: 'Hi, I’m PawPal. Want to tell me a little about your day?', source: 'guidance' });
type Failed = { userId: string; text: string; history: Turn[]; choice: SocialChoice; mode: Mode };

export function useConversation() {
  const [messages, setMessages] = useState<Message[]>([greeting()]);
  const [emotion, setEmotion] = useState<Emotion>('Calm');
  const [mode, setMode] = useState<Mode>('demo');
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [failed, setFailed] = useState<Failed | null>(null);
  const [choice, setChoice] = useState<SocialChoice>('available');
  const [notice, setNotice] = useState('');
  const controller = useRef<AbortController | null>(null);
  const revision = useRef(0);
  const requestLock = useRef(false);
  const modeRef = useRef<Mode>('demo');
  const choiceRef = useRef<SocialChoice>('available');
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  useEffect(() => () => { revision.current++; controller.current?.abort(); }, []);

  function reset(nextMode: Mode = modeRef.current) {
    revision.current++; controller.current?.abort(); requestLock.current = false;
    setMessages([greeting()]); setEmotion('Calm'); setDraft(''); setError(''); setFailed(null); setBusy(false);
    choiceRef.current = 'available'; setChoice('available'); modeRef.current = nextMode; setMode(nextMode);
    setNotice('A fresh conversation. The previous conversation has been cleared from this tab.');
  }

  async function perform(attempt: Failed) {
    if (requestLock.current) return;
    requestLock.current = true;
    const token = ++revision.current;
    controller.current?.abort(); const active = new AbortController(); controller.current = active;
    setBusy(true); setError(''); setFailed(null);
    setMessages(m => m.map(x => x.id === attempt.userId ? { ...x, failed: false } : x));
    try {
      const result = await sendChat({ message: attempt.text, history: attempt.history, mode: attempt.mode, socialChoice: attempt.choice }, active.signal);
      if (token !== revision.current) return;
      choiceRef.current = result.socialChoice; setChoice(result.socialChoice); setEmotion(result.emotion);
      setMessages(m => [...m.map(x => (result.source === 'safety' || result.socialChoice === 'declined') && x.decision === 'pending' ? { ...x, decision: 'closed' as const } : x), {
        id: crypto.randomUUID(), role: 'assistant', content: result.reply, source: result.source,
        ...(result.suggestion ? { suggestion: result.suggestion, decision: 'pending' as const } : {}),
      }]);
    } catch (err) {
      if (token !== revision.current || active.signal.aborted) return;
      setError(err instanceof Error ? err.message : 'The reply didn’t arrive. Please retry.'); setFailed(attempt);
      setMessages(m => m.map(x => x.id === attempt.userId ? { ...x, failed: true } : x));
    } finally { if (token === revision.current) { requestLock.current = false; setBusy(false); } }
  }

  function send(value: string = draft) {
    const text = value.trim();
    if (!text || text.length > MAX_INPUT || requestLock.current || failed) return;
    const userId = crypto.randomUUID();
    const history = messagesRef.current.filter(m => !m.failed).slice(-MAX_CONTEXT).map(({ role, content }) => ({ role, content }));
    setMessages(m => [...m, { id: userId, role: 'user', content: text }]); setDraft(''); setNotice('');
    void perform({ userId, text, history, choice: choiceRef.current, mode: modeRef.current });
  }
  function retry() { if (failed) void perform({ ...failed, choice: choiceRef.current }); }
  function editFailed() {
    if (!failed) return;
    setMessages(m => m.filter(x => x.id !== failed.userId)); setDraft(failed.text); setFailed(null); setError('');
  }
  function decide(id: string, decision: 'accepted' | 'declined') {
    if (requestLock.current) return;
    const current = messagesRef.current.find(m => m.suggestion?.id === id && m.decision === 'pending');
    if (!current?.suggestion) return;
    const suggestion: Suggestion = current.suggestion;
    choiceRef.current = decision; setChoice(decision); setEmotion(decision === 'accepted' ? 'Encouraging' : 'Calm');
    const feedback: Message = { id: crypto.randomUUID(), role: 'assistant', source: 'guidance', content: decision === 'accepted' ? suggestion.nextStep : suggestion.declinedFeedback };
    setMessages(m => [...m.map(x => x.suggestion?.id === id ? { ...x, decision } : x), feedback]); setNotice('');
  }
  return { messages, emotion, mode, draft, setDraft, busy, error, failed, choice, notice, send, retry, editFailed, decide,
    reset: () => reset(), changeMode: (next: Mode) => { if (next !== modeRef.current) reset(next); } };
}
