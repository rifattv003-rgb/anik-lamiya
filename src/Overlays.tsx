import React from 'react';
import {INK} from './theme';
import {prog, vis, inWin} from './anim';
import {CAPTIONS} from './captions';
import {NO_CAPTION} from './timing';

// স্পিচ কলআউট বাবল (লেজ নিচের দিকে)
export const Bubble: React.FC<{g: number; a: number; b: number; x: number; y: number; w: number; text: string; tint: string; tailX?: number; font?: number}> = ({
  g, a, b, x, y, w, text, tint, tailX = 0, font = 44,
}) => {
  const s = vis(g, a, b, 0.3);
  if (s <= 0.001) return null;
  const tl = `calc(50% + ${tailX}px)`;
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, transform: `scale(${s})`, transformOrigin: `${w / 2 + tailX}px 100%`}}>
      <div style={{boxSizing: 'border-box', width: '100%', background: tint, border: `5px solid ${INK}`, borderRadius: 44, padding: '24px 34px', textAlign: 'center', fontSize: font, fontWeight: 700, lineHeight: 1.35, color: INK, boxShadow: '0 8px 0 rgba(0,0,0,0.15)'}}>
        {text}
      </div>
      <div style={{position: 'absolute', left: `calc(${tl} - 30px)`, bottom: -46, width: 0, height: 0, borderLeft: '30px solid transparent', borderRight: '30px solid transparent', borderTop: `46px solid ${INK}`}} />
      <div style={{position: 'absolute', left: `calc(${tl} - 24px)`, bottom: -36, width: 0, height: 0, borderLeft: '24px solid transparent', borderRight: '24px solid transparent', borderTop: `42px solid ${tint}`}} />
    </div>
  );
};

// থট বাবল (ভেতরে আইকন)
export const Thought: React.FC<{g: number; a: number; b: number; x: number; y: number; w: number; h: number; children: React.ReactNode}> = ({g, a, b, x, y, w, h, children}) => {
  const s = vis(g, a, b, 0.35);
  if (s <= 0.001) return null;
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, height: h, transform: `scale(${s})`, transformOrigin: '50% 100%'}}>
      <div style={{boxSizing: 'border-box', width: '100%', height: '100%', background: '#fff', border: `5px solid ${INK}`, borderRadius: h / 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, boxShadow: '0 8px 0 rgba(0,0,0,0.15)'}}>
        {children}
      </div>
      <div style={{position: 'absolute', left: '50%', bottom: -34, width: 34, height: 34, borderRadius: 17, background: '#fff', border: `5px solid ${INK}`}} />
      <div style={{position: 'absolute', left: 'calc(50% + 14px)', bottom: -62, width: 20, height: 20, borderRadius: 10, background: '#fff', border: `4px solid ${INK}`}} />
    </div>
  );
};

// নাম-ব্যাজ
export const Badge: React.FC<{g: number; a: number; b: number; x: number; y: number; text: string; bg: string; fg?: string}> = ({g, a, b, x, y, text, bg, fg = '#fff'}) => {
  const s = vis(g, a, b, 0.3);
  if (s <= 0.001) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, background: bg, color: fg, border: `4px solid ${INK}`, borderRadius: 999, padding: '8px 38px', fontSize: 48, fontWeight: 700, whiteSpace: 'nowrap', boxShadow: '0 6px 0 rgba(0,0,0,0.18)'}}>
      {text}
    </div>
  );
};

// সিনের লোকেশন/সময়ের ছোট পিল (ওভারলে)
export const Pill: React.FC<{g: number; a: number; b: number; text: string}> = ({g, a, b, text}) => {
  const o = prog(g, a, a + 0.4) * (1 - prog(g, b - 0.4, b));
  if (o <= 0.001) return null;
  return (
    <div style={{position: 'absolute', top: 96, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: o, transform: `translateY(${(1 - o) * -24}px)`}}>
      <div style={{background: 'rgba(34,34,34,0.82)', color: '#fff', borderRadius: 999, padding: '10px 40px', fontSize: 42, fontWeight: 700}}>{text}</div>
    </div>
  );
};

// নিচের ওভারলে ক্যাপশন (কলআউট/কার্ড থাকলে বন্ধ)
export const Captions: React.FC<{g: number}> = ({g}) => {
  if (inWin(g, NO_CAPTION)) return null;
  const c = CAPTIONS.find((k) => g >= k.a && g < k.b);
  if (!c) return null;
  const p = prog(g, c.a, c.a + 0.18);
  const plain = c.t.replace(/\*/g, '');
  const size = Math.min(62, Math.floor(920 / (plain.length * 0.56)));
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 190, display: 'flex', justifyContent: 'center', opacity: p, transform: `translateY(${(1 - p) * 26}px)`}}>
      <div style={{fontSize: size, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', WebkitTextStroke: `10px ${INK}`, paintOrder: 'stroke fill', textShadow: '0 5px 0 rgba(0,0,0,0.25)'}}>
        {c.t.split('*').map((part, i) => (i % 2 ? <span key={i} style={{color: '#ffd23f'}}>{part}</span> : <span key={i}>{part}</span>))}
      </div>
    </div>
  );
};
