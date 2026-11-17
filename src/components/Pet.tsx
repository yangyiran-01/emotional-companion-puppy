import { useId } from 'react';
import type { Emotion } from '../../shared/types.ts';

// Original code-native reconstruction of the approved cream puppy. All states
// share the same body, ears, palette and scarf; only expression and pose change.
export default function Pet({ emotion }: { emotion: Emotion }) {
  const id = useId().replaceAll(':', '');
  const happy = emotion === 'Happy';
  const concerned = emotion === 'Concerned';
  const encouraging = emotion === 'Encouraging';
  return <svg className={`puppy puppy--${emotion.toLowerCase()}`} viewBox="0 0 360 360" width="360" height="360" role="img" aria-labelledby={`${id}-title`}>
    <title id={`${id}-title`}>{`PawPal, a cream puppy with a lavender scarf, looking ${emotion.toLowerCase()}`}</title>
    <defs>
      <linearGradient id={`${id}-fur`} x1="0" y1="0" x2="0.6" y2="1"><stop stopColor="#FFFDF7"/><stop offset="1" stopColor="#F5EAD8"/></linearGradient>
      <linearGradient id={`${id}-ear`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#E8D0AB"/><stop offset="1" stopColor="#D7B88D"/></linearGradient>
      <linearGradient id={`${id}-scarf`} x1="0" y1="0" x2="0.8" y2="1"><stop stopColor="#C6B1EA"/><stop offset="1" stopColor="#AA8FD5"/></linearGradient>
    </defs>
    <ellipse cx="180" cy="333" rx="109" ry="12" fill="#BFA9D3" opacity=".12"/>
    <g className="puppy-breathe">
      <g className="puppy-tail"><path d="M255 279c26 10 42-1 48-24 3-11 13-13 18-4 10 23-10 53-37 58l-29-5z" fill="#E9D6B7"/><path d="M304 255c3-11 13-13 18-4 3 8 1 16-3 22-6-1-12-6-15-10z" fill="#FFF9EF"/></g>
      <path d="M124 207c-19 26-26 51-22 82 3 26 24 40 78 39s79-12 80-41c2-32-7-60-26-81z" fill={`url(#${id}-fur)`}/>
      <path d="M145 239c-8 13-12 32-9 52 9 12 73 13 88-1 3-18-3-39-11-52z" fill="#FFFAF1"/>
      <g className="puppy-head">
        <path d="M98 66C75 42 53 55 42 87c-10 30-17 81-7 105 7 19 26 23 42 11l28-65z" fill={`url(#${id}-ear)`}/>
        <path d="M92 70C74 56 60 70 51 99c-8 28-13 72-8 89 3 11 10 15 19 12 8-4 15-17 18-40z" fill="#ECD8B7"/>
        <path d="M262 66c23-24 45-11 56 21 10 30 17 81 7 105-7 19-26 23-42 11l-28-65z" fill={`url(#${id}-ear)`}/>
        <path d="M268 70c18-14 32 0 41 29 8 28 13 72 8 89-3 11-10 15-19 12-8-4-15-17-18-40z" fill="#ECD8B7"/>
        <path d="M78 144c-2-40 20-78 57-91 8-11 16-18 26-16 8-14 19-17 28-7 11-2 21 4 24 13 39 7 64 45 68 82 3 19 10 44 3 60-11 27-51 48-102 48-46 0-88-17-104-42-8-13-2-32 0-47z" fill="#EEE0C8"/>
        <path d="M80 139c0-38 19-72 57-84 9-13 15-18 25-17 8-14 19-15 27-6 10-3 20 4 23 12 36 7 60 39 64 77 1 20 11 42 4 60-12 28-54 45-99 45-44 0-84-16-98-39-8-15-3-30-3-48z" fill="#FFF9EF"/>
        <path d="M115 89c16-21 37-31 58-33 7-14 19-12 22-2 13-5 24-1 30 7-40-1-72 12-110 28z" fill="#FFFFFF" opacity=".95"/>
        <ellipse cx="111" cy="176" rx="17" ry="9" fill="#F1BAC0" opacity=".85"/><ellipse cx="249" cy="176" rx="17" ry="9" fill="#F1BAC0" opacity=".85"/>
        <ellipse cx="180" cy="184" rx="33" ry="23" fill="#FFFDF8"/>
        <g className={happy ? 'puppy-eyes puppy-eyes--smile' : 'puppy-eyes'} fill="#594657" stroke="#594657" strokeLinecap="round">
          {happy || encouraging ? <path d="M124 147q8-13 16 0" fill="none" strokeWidth="4.5"/> : <><ellipse cx="132" cy="146" rx="9" ry="13" stroke="none"/><ellipse cx="130" cy="141" rx="2.8" ry="3.5" fill="#FFFDF8" stroke="none"/></>}
          {happy ? <path d="M220 147q8-13 16 0" fill="none" strokeWidth="4.5"/> : <><ellipse cx="228" cy="146" rx="9" ry="13" stroke="none"/><ellipse cx="226" cy="141" rx="2.8" ry="3.5" fill="#FFFDF8" stroke="none"/></>}
        </g>
        <g fill="none" stroke={concerned ? '#C3A680' : '#D8C1A0'} strokeWidth="4" strokeLinecap="round">
          {concerned ? <><path d="M121 124q8 0 18-7"/><path d="M220 117q9 7 18 7"/></> : <><path d="M121 119q8-5 17-1"/><path d="M222 118q8-4 16 1"/></>}
        </g>
        <path d="M169 168c2-6 20-6 22 0 2 5-6 11-11 11s-13-6-11-11z" fill="#594657"/><ellipse cx="178" cy="167" rx="5" ry="1.8" fill="#9D7B8F"/>
        <g stroke="#594657" strokeWidth="3" fill="none" strokeLinecap="round">
          {happy ? <><path d="M168 184q12 23 24 0" fill="#79536B"/><path d="M175 193q5-3 10 0" stroke="#F0A8BA" strokeWidth="5"/></> : concerned ? <path d="M171 190q9 4 18 0"/> : encouraging ? <path d="M169 185q11 14 23 0"/> : <><path d="M180 179v6m-12 0q5 8 12 0 7 8 12 0"/></>}
        </g>
      </g>
      <path d="M124 219c34 18 76 18 112-1l-12 23-43 42-45-43z" fill={`url(#${id}-scarf)`}/>
      <path d="M126 220c34 14 77 17 109-1l-7 12c-30 15-67 12-96-1z" fill="#AA90CB"/><path d="M145 241c23 8 43 8 66-1l-30 32z" fill="#D4C3EE"/>
      <path d="M228 224c6-8 16-8 20-3 5 6 1 12-7 13l-14-3z" fill="#B89FD9"/>
      <path d="M110 265c-11 7-16 29-12 49 3 15 38 17 46 7 5-8-2-33-8-44" fill="#FFF9EF" stroke="#EAD9BE" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M108 306v9m11-8v10m12-12 1 10" stroke="#E2CEAE" strokeWidth="2" strokeLinecap="round"/>
      {!encouraging && <><path d="M250 265c11 7 16 29 12 49-3 15-38 17-46 7-5-8 2-33 8-44" fill="#FFF9EF" stroke="#EAD9BE" strokeWidth="2.5" strokeLinecap="round"/><path d="M252 306v9m-11-8v10m-12-12-1 10" stroke="#E2CEAE" strokeWidth="2" strokeLinecap="round"/></>}
      {encouraging && <g className="puppy-paw"><path d="M231 285c25-6 54-29 58-49 5-20-6-31-17-23-3-14-18-13-22 2-11-9-23 1-19 13 4 16-4 31-14 43" fill="#FFF9EF" stroke="#EAD9BE" strokeWidth="2.5" strokeLinecap="round"/><ellipse cx="261" cy="237" rx="9" ry="11" fill="#F0B7C5"/><circle cx="246" cy="225" r="4" fill="#F0B7C5"/><circle cx="260" cy="218" r="4" fill="#F0B7C5"/><circle cx="275" cy="225" r="4" fill="#F0B7C5"/></g>}
    </g>
  </svg>;
}
