import { useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowUpRight, Check, ChevronDown, Coffee, Heart, Info, Leaf, LoaderCircle, MessageCircle, PawPrint, Plus, RotateCcw, ShieldCheck, Sparkles, Sun, X } from 'lucide-react';
import { MAX_INPUT, type Message, type Mode } from '../shared/types.ts';
import Pet from './components/Pet.tsx';
import { useConversation } from './hooks/useConversation.ts';

const starters = [
  { label: 'A busy day', icon: Leaf, text: 'My assignments keep piling up. I’m exhausted.' },
  { label: 'A little win', icon: Sun, text: 'I finally finished my project — and got lovely feedback!' },
  { label: 'Feeling lonely', icon: Heart, text: 'I’ve felt lonely lately. I haven’t seen my friends in ages.' },
  { label: 'Need courage', icon: Sparkles, text: 'I want to speak up in class, but I’m scared I’ll get it wrong.' },
];
const petCopy = { Calm: 'A softer place to land.', Happy: 'Sharing your joy.', Concerned: 'Taking it gently.', Encouraging: 'One little step.' };
const sourceLabel = { demo: 'Scripted demo', ai: 'AI reply', safety: 'Safety guidance', guidance: 'PawPal guidance' };

function MessageBubble({ message, busy, onDecide }: { message: Message; busy: boolean; onDecide: (id: string, choice: 'accepted' | 'declined') => void }) {
  const user = message.role === 'user';
  return <article className={`message-row ${user ? 'message-row--user' : ''}`} aria-label={user ? 'Your message' : sourceLabel[message.source ?? 'guidance']}>
    {!user && <span className="message-avatar" aria-hidden="true"><PawPrint size={16}/></span>}
    <div className="message-stack">
      <div className={`bubble ${user ? 'bubble--user' : ''} ${message.source === 'safety' ? 'bubble--safety' : ''}`}>
        <div className="bubble-meta"><span>{user ? 'You' : 'PawPal'}</span>{!user && <span className="message-source">{sourceLabel[message.source ?? 'guidance']}</span>}{message.failed && <span className="message-source">Reply failed</span>}</div>
        <p>{message.content}</p>
      </div>
      {message.suggestion && message.decision !== 'closed' && <section className="suggestion-card" aria-label="Optional offline suggestion">
        <div className="suggestion-heading"><span className="suggestion-icon"><Coffee size={18}/></span><div><span className="eyebrow">A SMALL, OPTIONAL STEP</span><h3>{message.suggestion.title}</h3></div></div>
        <p>{message.suggestion.body}</p>
        {message.decision === 'pending' ? <div className="suggestion-actions">
          <button type="button" className="button button-primary" disabled={busy} onClick={() => onDecide(message.suggestion!.id, 'accepted')}><Check size={16}/>Accept</button>
          <button type="button" className="button button-secondary" disabled={busy} onClick={() => onDecide(message.suggestion!.id, 'declined')}>Not now</button>
        </div> : <div className="decision-stamp"><Check size={14}/>{message.decision === 'accepted' ? 'Accepted · your next step is below' : 'Not now · your choice is respected'}</div>}
      </section>}
    </div>
  </article>;
}

export default function App() {
  const chat = useConversation();
  const [config, setConfig] = useState<{ aiConfigured: boolean } | null>(null);
  const [connectionError, setConnectionError] = useState(false);
  const [configRevision, setConfigRevision] = useState(0);
  const [dialog, setDialog] = useState<'about' | 'reset' | null>(null);
  const [modeMenu, setModeMenu] = useState(false);
  const input = useRef<HTMLTextAreaElement>(null);
  const transcript = useRef<HTMLDivElement>(null);
  const modal = useRef<HTMLDialogElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const modeTrigger = useRef<HTMLButtonElement>(null);
  const hasConversation = chat.messages.some(m => m.role === 'user');

  useEffect(() => {
    const controller = new AbortController();
    setConnectionError(false); setConfig(null);
    fetch('/api/config', { signal: controller.signal }).then(async r => {
      if (!r.ok) throw new Error('Configuration unavailable');
      const body = await r.json(); if (typeof body.aiConfigured !== 'boolean') throw new Error('Invalid configuration');
      if (!controller.signal.aborted) setConfig(body);
    }).catch(() => { if (!controller.signal.aborted) setConnectionError(true); });
    return () => controller.abort();
  }, [configRevision]);
  useEffect(() => {
    const node = transcript.current;
    if (node) node.scrollTo({ top: hasConversation ? node.scrollHeight : 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }, [chat.messages, chat.busy, chat.error]);
  useEffect(() => {
    const node = transcript.current;
    if (!node) return;
    const observer = new ResizeObserver(() => { if (hasConversation) node.scrollTop = node.scrollHeight; });
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasConversation]);
  useEffect(() => { if (input.current) { input.current.style.height = 'auto'; input.current.style.height = `${Math.min(input.current.scrollHeight, 112)}px`; } }, [chat.draft]);
  useEffect(() => { if (dialog) modal.current?.showModal(); else modal.current?.close(); }, [dialog]);
  useEffect(() => {
    if (!modeMenu) return;
    const close = (e: PointerEvent) => { if (menu.current && !menu.current.contains(e.target as Node)) setModeMenu(false); };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { setModeMenu(false); modeTrigger.current?.focus(); } };
    document.addEventListener('pointerdown', close); document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', key); };
  }, [modeMenu]);
  const enabled = Boolean(config) && !(chat.mode === 'ai' && !config?.aiConfigured);
  const sendEnabled = enabled && !chat.busy && !chat.failed && Boolean(chat.draft.trim()) && chat.draft.trim().length <= MAX_INPUT;
  const changeMode = (mode: Mode) => { if (mode === 'ai' && !config?.aiConfigured) return; chat.changeMode(mode); setModeMenu(false); modeTrigger.current?.focus(); };
  function openReset() { if (hasConversation) setDialog('reset'); else chat.reset(); }

  return <div className="app-shell">
    <header className="app-header">
      <a href="#" className="brand" onClick={e => { e.preventDefault(); openReset(); }} aria-label="PawPal — start a new conversation">
        <span className="brand-mark"><PawPrint size={25} strokeWidth={1.8}/></span><span><span className="brand-name">PawPal<span className="brand-dot">.</span></span><span className="brand-tagline">Your AI Emotional Companion</span></span>
      </a>
      <nav className="header-actions" aria-label="Conversation controls">
        <div className="mode-switcher" ref={menu}>
          <button className="mode-trigger" ref={modeTrigger} aria-expanded={modeMenu} aria-controls="mode-options" onClick={() => setModeMenu(!modeMenu)} disabled={chat.busy}><span className={`status-dot ${chat.mode === 'ai' ? 'status-dot--ai' : ''}`}/>{chat.mode === 'demo' ? 'Demo mode' : 'AI mode'}<ChevronDown size={14}/></button>
          {modeMenu && <div className="mode-popover" id="mode-options"><p className="eyebrow">HOW PAWPAL REPLIES</p><button className={`mode-option ${chat.mode === 'demo' ? 'is-selected' : ''}`} onClick={() => changeMode('demo')}><span><strong>Demo mode</strong><small>Scripted, no model requests</small></span>{chat.mode === 'demo' && <Check size={17}/>}</button><button className={`mode-option ${chat.mode === 'ai' ? 'is-selected' : ''}`} disabled={!config?.aiConfigured} onClick={() => changeMode('ai')}><span><strong>AI mode</strong><small>{config?.aiConfigured ? 'Real AI · sends recent messages to OpenAI' : 'Needs a server API key'}</small></span>{chat.mode === 'ai' && <Check size={17}/>}</button><p className="popover-note">Switching modes starts a fresh conversation.</p></div>}
        </div>
        <button className="button button-secondary new-chat" aria-label="Start a new conversation" onClick={openReset}><Plus size={17}/><span>New conversation</span></button>
        <button className="icon-button about-button" aria-label="About PawPal, AI and privacy" onClick={() => setDialog('about')}><Info size={20}/></button>
      </nav>
    </header>

    <main className="main-grid">
      <aside className={`companion-card companion-card--${chat.emotion.toLowerCase()}`} aria-label="Your puppy companion">
        <span className="companion-kicker"><span className="tiny-heart"><Heart size={11} fill="currentColor"/></span>Your little companion</span>
        <div className="pet-stage"><div className="pet-halo" aria-hidden="true"/><span className="pet-spark pet-spark--one" aria-hidden="true">✧</span><span className="pet-spark pet-spark--two" aria-hidden="true">✧</span><Pet emotion={chat.emotion}/></div>
        <div className="companion-copy"><h1>{petCopy[chat.emotion]}</h1><div className="emotion-badge" aria-live="polite" aria-atomic="true"><span/>{chat.emotion}</div><p className="companion-description">You choose what to share,<br className="desktop-break"/> and what comes next.</p></div>
        <div className="companion-footer"><span className="little-divider"/><p>A response cue, not a diagnosis.<br/>Your feelings are yours to define.</p><div className="companion-signoff"><Heart size={12}/>At your pace, always.</div></div>
      </aside>

      <section className="chat-card" aria-label="Chat with PawPal">
        <div className="chat-heading"><div><span className="eyebrow">A LITTLE ROOM TO BREATHE</span><h2>A moment to talk</h2></div><span className="session-badge"><ShieldCheck size={13}/>Session only</span></div>
        <div className={`mode-notice ${chat.mode === 'ai' ? 'mode-notice--ai' : ''}`}><span className="notice-symbol">{chat.mode === 'demo' ? <Sparkles size={14}/> : <ShieldCheck size={14}/>}</span><span>{chat.mode === 'demo' ? 'Demo · scripted replies, not AI-generated.' : 'Real AI · recent messages are sent to OpenAI.'}</span><button onClick={() => setDialog('about')}>Details<ArrowUpRight size={12}/></button></div>
        {connectionError && <div className="connection-error" role="alert">PawPal’s server isn’t connected.<button onClick={() => setConfigRevision(v=>v+1)}>Reconnect</button></div>}
        <div className="transcript" ref={transcript} role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions text" tabIndex={0}>
          {!hasConversation && <div className="welcome"><span className="welcome-flower" aria-hidden="true"><Sparkles size={21}/></span><h2>A little space,<br className="mobile-break"/> just for you.</h2><p>Whatever kind of day it’s been,<br/>you can start here.</p></div>}
          {chat.messages.map(message => <MessageBubble key={message.id} message={message} busy={chat.busy} onDecide={chat.decide}/>)}
          {!hasConversation && <div className="starter-section"><p>Not sure where to start?</p><div className="starter-grid">{starters.map(({ label, icon: Icon, text }) => <button key={label} className="starter" onClick={() => chat.send(text)} disabled={!enabled || chat.busy}><Icon size={16} strokeWidth={1.6}/>{label}<ArrowUpRight size={13}/></button>)}</div><span className="starter-footnote">Or simply say what’s on your mind.</span></div>}
          {chat.busy && <div className="typing-indicator" role="status"><span className="message-avatar"><PawPrint size={16}/></span><div><span className="typing-dots"><i/><i/><i/></span><span>{chat.mode === 'demo' ? 'Preparing a demo reply' : 'PawPal is thinking'}</span></div></div>}
          {chat.error && <div className="error-card" role="alert"><strong>The reply didn’t arrive.</strong><p>{chat.error}</p><div><button className="button button-primary" onClick={chat.retry} disabled={chat.busy}><RotateCcw size={15}/>Retry</button><button className="button button-secondary" onClick={() => { chat.editFailed(); requestAnimationFrame(()=>input.current?.focus()); }}>Edit message</button></div><small>No simulated reply has been substituted.</small></div>}
          {chat.notice && <p className="conversation-notice" role="status">{chat.notice}</p>}
        </div>
        <div className="composer-section">
          {chat.choice === 'declined' && <p className="choice-reminder"><Check size={13}/>Your choice is saved for this conversation.</p>}
          <form className={`composer ${chat.busy ? 'composer--busy' : ''}`} onSubmit={e => { e.preventDefault(); if (sendEnabled) chat.send(); }}>
            <label className="sr-only" htmlFor="message">Share what’s on your mind</label>
            <textarea ref={input} id="message" placeholder={chat.failed ? 'Retry or edit your message above…' : 'Share what’s on your mind…'} value={chat.draft} onChange={e => chat.setDraft(e.target.value)} disabled={chat.busy || !enabled || Boolean(chat.failed)} maxLength={MAX_INPUT} rows={1} aria-describedby="composer-hint" onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); if (sendEnabled) chat.send(); } }}/>
            <button type="submit" className="send-button" aria-label={chat.busy ? 'Waiting for reply' : 'Send message'} disabled={!sendEnabled}>{chat.busy ? <LoaderCircle className="spin" size={21}/> : <ArrowUp size={22}/>}</button>
          </form>
          <div className="composer-helper"><span id="composer-hint">{chat.draft.length > 1200 ? `${chat.draft.length} / ${MAX_INPUT} characters` : 'A little or a lot. It’s okay to start small.'}</span><span className="enter-hint">Enter to send <span>↵</span></span></div>
          <p className="ai-disclosure">PawPal is an AI companion, not professional counselling.<button onClick={() => setDialog('about')}>About & privacy</button></p>
        </div>
      </section>
    </main>
    <footer className="page-footer"><span><Heart size={12}/>Your pace. Your choices.</span><span>Real-world connections matter, too.</span></footer>

    <dialog ref={modal} className="modal" onCancel={() => setDialog(null)} onClick={e => { if (e.target === modal.current) setDialog(null); }} aria-labelledby="dialog-title">
      <div className="modal-content"><button className="icon-button modal-close" onClick={() => setDialog(null)} aria-label="Close dialog"><X size={20}/></button>
        {dialog === 'reset' ? <><span className="modal-icon"><MessageCircle size={24}/></span><h2 id="dialog-title">A fresh little start?</h2><p>This clears this tab’s conversation and resets your suggestion choice. It won’t delete data already processed by an AI provider.</p><div className="modal-actions"><button className="button button-primary" onClick={() => { chat.reset(); setDialog(null); }}>Start fresh</button><button className="button button-secondary" onClick={() => setDialog(null)}>Keep talking</button></div></> : <><span className="modal-icon"><PawPrint size={27}/></span><h2 id="dialog-title">A little about PawPal</h2><p>A warm AI puppy for sharing your day. You’re always in control of what you share and whether you take a suggestion.</p><div className="about-section"><h3>Two clearly different modes</h3><p><strong>Demo:</strong> scripted, context-aware examples. No model requests.<br/><strong>AI:</strong> real OpenAI replies, enabled only when a server key is configured. Errors never silently switch modes.</p></div><div className="about-section"><h3>Your conversation stays temporary</h3><p>This app keeps chat in this tab’s memory, not browser storage or a database. Refreshing or starting fresh clears it. In AI mode, your current message and up to 12 recent messages are sent through the server to OpenAI. Requests use <code>store: false</code>; provider retention policies still apply. The app does not log chat content.</p><a href="https://developers.openai.com/api/docs/guides/your-data" target="_blank" rel="noopener noreferrer">OpenAI data controls<ArrowUpRight size={13}/></a></div><div className="about-section"><h3>Support, with healthy boundaries</h3><p>Expressions are simple text-based response cues, not diagnoses. Offline suggestions are optional. “Not now” stops proactive suggestions in this conversation unless you ask again. Nothing is sent to another person.</p></div><p className="about-safety">PawPal is not a therapist or an emergency service. If you are in immediate danger, contact local emergency services or go to the nearest emergency department. Automated safety detection can miss things.</p><button className="button button-primary" onClick={() => setDialog(null)}>Back to our chat<ArrowUpRight size={15}/></button></>}
      </div>
    </dialog>
  </div>;
}
