import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Pet from '../src/components/Pet.tsx';
import { handleConversation } from '../server/conversation.ts';
import type { ChatResponse, Emotion, SocialChoice, Turn } from '../shared/types.ts';

// Replays actual Demo logic; these are labelled vector illustrations, not screenshots.
const output = fileURLToPath(new URL('../docs/storyboards/', import.meta.url));
mkdirSync(output, { recursive: true });
const greeting = 'Hi, I’m PawPal. Want to tell me a little about your day?';
const initial: Turn[] = [{ role: 'assistant', content: greeting }];
const turns: Record<string, unknown>[] = [];
async function replay(id: string, message: string, history = initial, socialChoice: SocialChoice = 'available') {
  const response = await handleConversation({ message, history, socialChoice, mode: 'demo' }, { model: 'not-used-in-demo' });
  assert.equal(response.source, 'demo');
  const clean = response.suggestion ? { ...response, suggestion: { ...response.suggestion, id: `${id}-card` } } : response;
  turns.push({ id, request: { message, history, socialChoice, mode: 'demo' }, response: clean });
  return clean;
}
const stressText = 'My assignments keep piling up. I’m exhausted.';
const stress = await replay('pressure', stressText);
const followText = 'It’s all due tomorrow.';
const follow = await replay('pressure-followup', followText, [...initial, { role:'user', content:stressText }, { role:'assistant', content:stress.reply }]);
const happyText = 'I finally finished my project — and got lovely feedback!';
const happy = await replay('happy', happyText);
const lonelyText = 'I feel lonely. I haven’t seen my friends in weeks.';
const lonely = await replay('loneliness', lonelyText);
assert.ok(lonely.suggestion);
const card = lonely.suggestion;
const stillText = 'I still feel lonely tonight.';
const still = await replay('after-refusal', stillText, [...initial, {role:'user',content:lonelyText}, {role:'assistant',content:lonely.reply}, {role:'assistant',content:card.declinedFeedback}], 'declined');
assert.equal(stress.emotion, 'Concerned'); assert.equal(stress.suggestion, null);
assert.equal(follow.emotion, 'Concerned'); assert.equal(happy.emotion, 'Happy');
assert.equal(lonely.emotion, 'Concerned'); assert.equal(still.suggestion, null); assert.equal(still.socialChoice, 'declined');

type Bubble = { role: 'You' | 'PawPal'; text: string; source?: string };
type Panel = { step: string; title: string; state: Emotion; action: string; feedback: string; bubbles: Bubble[]; card?: boolean; hint?: string };
type Board = { id: string; title: string; subtitle: string; columns: number; panels: Panel[] };
const bubble = (response: ChatResponse): Bubble => ({ role:'PawPal', text:response.reply, source:'Scripted demo' });
const boards: Board[] = [
  { id:'01-pressure', title:'01 · A demanding study day', subtitle:'An illustrative student shares pressure and continues the conversation.', columns:3, panels:[
    {step:'1',title:'Share the pressure',state:'Calm',action:'User types a message and presses Send.',feedback:'Before the reply, the puppy is Calm.',bubbles:[{role:'You',text:stressText}],hint:'The app shows a loading state while waiting.'},
    {step:'2',title:'Receive support',state:stress.emotion,action:'The user reads PawPal’s response.',feedback:'Concerned expression; no offline suggestion.',bubbles:[bubble(stress)]},
    {step:'3',title:'Continue with context',state:follow.emotion,action:'User adds a detail about the deadline.',feedback:'Recent pressure is retained in this follow-up.',bubbles:[{role:'You',text:followText},bubble(follow)]},
  ]},
  { id:'02-happy', title:'02 · A little win worth sharing', subtitle:'The same puppy responds to a positive event with a different expression.', columns:3, panels:[
    {step:'1',title:'Share good news',state:'Calm',action:'User shares the result of their project.',feedback:'A new conversation starts in Calm.',bubbles:[{role:'You',text:happyText}]},
    {step:'2',title:'See a happy response',state:happy.emotion,action:'The user receives a positive response.',feedback:'Happy face; wagging and a small bounce in app.',bubbles:[bubble(happy)]},
    {step:'3',title:'Choose what comes next',state:'Happy',action:'User can continue, pause or start fresh.',feedback:'The input stays available; no external action.',bubbles:[],hint:'No further user message has been sent in this panel.'},
  ]},
  { id:'03-loneliness', title:'03 · Connection, on the user’s terms', subtitle:'One shared starting point; Accept and Not now are alternative branches.', columns:2, panels:[
    {step:'1',title:'Share loneliness',state:lonely.emotion,action:'User sends a loneliness message.',feedback:'Support first, then a clearly optional card.',bubbles:[{role:'You',text:lonelyText},bubble(lonely)],card:true},
    {step:'2A',title:'Accept the invitation',state:'Encouraging',action:'From panel 1, user selects Accept.',feedback:'A small next step; nothing is sent.',bubbles:[{role:'PawPal',text:card.nextStep,source:'PawPal guidance'}],hint:'Accept is a local choice, not a contact operation.'},
    {step:'2B',title:'Choose “Not now”',state:'Calm',action:'Alternatively, user selects Not now in panel 1.',feedback:'Refusal is respected for this conversation.',bubbles:[{role:'PawPal',text:card.declinedFeedback,source:'PawPal guidance'}]},
    {step:'3B',title:'Keep talking after refusal',state:still.emotion,action:'User continues talking about loneliness.',feedback:'Emotional support continues; no new card.',bubbles:[{role:'You',text:stillText},bubble(still)],hint:'Proactive suggestions stay off unless the user asks again.'},
  ]},
];
const esc = (s:string) => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function lines(text:string, width:number, font=16) {
  const limit = Math.floor(width/(font*.55));
  const result:string[] = []; let line='';
  for (const word of text.split(/\s+/u)) {
    if (line && (line+' '+word).length>limit) { result.push(line); line=word; }
    else line += (line?' ':'')+word;
  }
  if (line) result.push(line);
  return result;
}
function textBlock(text:string,x:number,y:number,width:number,klass='body',font=16,lineHeight=23) {
  const wrapped=lines(text,width,font);
  return {svg:`<text x="${x}" y="${y}" class="${klass}">${wrapped.map((line,i)=>`<tspan x="${x}" dy="${i?lineHeight:0}">${esc(line)}</tspan>`).join('')}</text>`,height:wrapped.length*lineHeight};
}
let serial=0;
function puppy(state:Emotion,x:number,y:number,size:number) {
  const prefix=`pet${serial++}`;
  const svg=renderToStaticMarkup(createElement(Pet,{emotion:state})).replace(/_R_[^"\s<>)]*/g, match=>prefix+match);
  return `<g transform="translate(${x},${y}) scale(${size/360})">${svg}</g>`;
}
function panelContent(panel:Panel,width:number) {
  let y=222; let svg='';
  for (const message of panel.bubbles) {
    const inset=message.role==='You'?22:0; const bx=24+inset; const bw=width-48-inset;
    const copy=textBlock(message.text,bx+17,y+53,bw-34);
    const height=copy.height+48;
    svg+=`<rect x="${bx}" y="${y}" width="${bw}" height="${height}" rx="16" fill="${message.role==='You'?'#eee5ff':'#fff'}" stroke="#e8dfef"/><text x="${bx+17}" y="${y+24}" class="meta">${message.role}${message.source?' · '+message.source:''}</text>${copy.svg}`;
    y+=height+16;
  }
  if (panel.card) {
    const title=textBlock(card.title,42,y+31,width-84,'cardTitle',17,24);
    const body=textBlock(card.body,42,y+title.height+55,width-84);
    const buttonY=y+title.height+body.height+70; const height=buttonY-y+62;
    svg+=`<rect x="24" y="${y}" width="${width-48}" height="${height}" rx="18" fill="#f5eafa" stroke="#dcc8ec"/>${title.svg}${body.svg}<rect x="42" y="${buttonY}" width="${(width-100)/2}" height="42" rx="21" fill="#7c3aed"/><text x="${42+(width-100)/4}" y="${buttonY+27}" text-anchor="middle" class="white">Accept</text><rect x="${width/2+8}" y="${buttonY}" width="${(width-100)/2}" height="42" rx="21" fill="#fff9fd" stroke="#cfb8e5"/><text x="${width/2+8+(width-100)/4}" y="${buttonY+27}" text-anchor="middle" class="cardTitle">Not now</text>`;
    y+=height+16;
  }
  if(panel.hint) { const hint=textBlock(panel.hint,26,y+23,width-52,'hint',15,22); svg+=hint.svg;y+=hint.height+24; }
  return {svg,height:y};
}
const styles=`text{font-family:Inter,Arial,sans-serif;fill:#40364d}.boardTitle{font-size:32px;font-weight:700}.subtitle{font-size:17px;fill:#71627e}.step{font-size:16px;font-weight:700;fill:#7c3aed}.panelTitle{font-size:22px;font-weight:700}.body{font-size:16px}.meta{font-size:13px;font-weight:600;fill:#6f5a82}.state{font-size:17px;font-weight:600;fill:#7c3aed}.hint{font-size:15px;fill:#71627e}.cardTitle{font-size:17px;font-weight:600;fill:#70439e}.white{font-size:17px;font-weight:600;fill:white}.caption{font-size:15px;fill:#63536f}`;
const manifest=[];
for (const board of boards) {
  const width=1240,gap=24,margin=36,pw=(width-margin*2-gap*(board.columns-1))/board.columns;
  const contents=board.panels.map(panel=>panelContent(panel,pw));
  const contentH=Math.max(480,...contents.map(c=>c.height));
  const panelH=contentH+228;const rows=Math.ceil(board.panels.length/board.columns); const height=164+rows*(panelH+gap)+72;
  let body=`<rect width="${width}" height="${height}" fill="#faf5ff"/><text x="36" y="49" class="boardTitle">${esc(board.title)}</text><text x="36" y="81" class="subtitle">${esc(board.subtitle)}</text><text x="36" y="116" class="meta">ILLUSTRATED REPLAY · DEMO / SCRIPTED · NOT SCREENSHOTS OR USER RESEARCH</text>`;
  board.panels.forEach((panel,i)=>{
    const x=margin+(i%board.columns)*(pw+gap),y=151+Math.floor(i/board.columns)*(panelH+gap);
    const action=textBlock(panel.action,24,contentH+98,pw-48,'caption',15,22);
    const feedback=textBlock(panel.feedback,24,contentH+110+action.height,pw-48,'caption',15,22);
    assert.ok(contentH+110+action.height+feedback.height<panelH,`Caption overflow: ${board.id}/${panel.step}`);
    body+=`<g transform="translate(${x},${y})"><rect width="${pw}" height="${panelH}" rx="24" fill="#fff9fd" stroke="#dfd2eb"/><text x="24" y="33" class="step">${esc(panel.step)} · USER + SYSTEM</text><text x="24" y="68" class="panelTitle">${esc(panel.title)}</text><rect x="18" y="89" width="${pw-36}" height="113" rx="18" fill="#f4ebfa"/>${puppy(panel.state,27,91,110)}<text x="151" y="131" class="state">${panel.state}</text><text x="151" y="158" class="meta">PawPal · Demo</text>${contents[i].svg}<rect x="24" y="${contentH+15}" width="${pw-48}" height="45" rx="15" fill="#fff" stroke="#e0d2eb"/><text x="40" y="${contentH+43}" class="hint">Share what’s on your mind…</text><path d="M${pw-47} ${contentH+47}v-18m-6 6 6-6 6 6" fill="none" stroke="#a68ac8" stroke-width="2"/><line x1="24" x2="${pw-24}" y1="${contentH+77}" y2="${contentH+77}" stroke="#ede4f2"/>${action.svg}${feedback.svg}</g>`;
  });
  body+=`<text x="36" y="${height-43}" class="meta">PawPal · same SVG character as the app · responses replayed from server/conversation.ts</text><text x="36" y="${height-18}" class="meta">Synthetic example student; no claim about emotional benefit or real-world social outcomes</text>`;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title"><title id="title">${esc(board.title)}</title><style>${styles}</style>${body}</svg>`;
  writeFileSync(path.join(output,board.id+'.svg'),svg);
  manifest.push({id:board.id,title:board.title,file:board.id+'.svg',panels:board.panels.length,width,height});
}
writeFileSync(path.join(output,'replay-data.json'),JSON.stringify({kind:'Synthetic Demo replay, not observed user data',generatedFrom:'server/conversation.ts and src/components/Pet.tsx',turns,localDecisions:{accepted:card.nextStep,declined:card.declinedFeedback}},null,2)+'\n');
writeFileSync(path.join(output,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
writeFileSync(path.join(output,'index.html'),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PawPal · Illustrated interactions</title><style>body{margin:0;font:16px/1.6 system-ui,sans-serif;color:#40364d;background:#faf5ff}main{max-width:1240px;margin:auto;padding:28px}h1{font-size:32px;margin-bottom:8px}nav{display:flex;flex-wrap:wrap;gap:12px}a{color:#6d28d9}nav a,.download{padding:9px 16px;background:#f0e5fc;border-radius:20px;text-decoration:none}section{margin:36px 0}img{width:100%;height:auto;display:block;border-radius:20px}p{max-width:880px}button{font:inherit;color:#fff;background:#7c3aed;border:0;border-radius:18px;padding:9px 18px;cursor:pointer}@media print{nav,.controls{display:none}main{padding:0}section{break-before:page}img{max-height:255mm;object-fit:contain}h2{font-size:16px}}</style><main><h1>PawPal · Illustrated interactions</h1><p>Three synthetic scenarios replay actual Demo logic and reuse the application’s SVG puppy. These are editable vector illustrations, not browser screenshots, real AI responses or evidence from participants.</p><nav>${manifest.map(m=>`<a href="#${m.id}">${esc(m.title)}</a>`).join('')}</nav><p class="controls"><button onclick="window.print()">Print / save as PDF</button> · <a href="replay-data.json">Inspect replay data</a> · <a href="../architecture-current.svg">System architecture</a></p>${manifest.map(m=>`<section id="${m.id}"><h2>${esc(m.title)}</h2><p><a class="download" href="${m.file}" download>Download SVG</a></p><img src="${m.file}" alt="${esc(m.title)}: actions, response expressions, feedback and user choices"></section>`).join('')}<p>For actual use, run PawPal and follow docs/USER_TESTING.md. User acceptance and real AI validation are pending.</p></main></html>`);
console.log(`Built ${boards.length} storyboards / ${boards.reduce((n,b)=>n+b.panels.length,0)} panels. Demo replay assertions passed. No model request was made.`);
