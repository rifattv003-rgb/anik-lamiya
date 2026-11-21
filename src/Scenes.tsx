import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Character, Pt} from './Character';
import {INK} from './theme';
import {FPS} from './timing';
import {prog, lerp2, easeOut, pop} from './anim';
import {Badge, Pill} from './Overlays';
import {Icon, PopIcon} from './Icons';

// ---------- সিন ১: অনিকের ফাঁকা বারান্দা (০:০০–০:১৯.৫) ----------
export const SceneBalcony: React.FC = () => {
  const f = useCurrentFrame();
  const g = f / FPS;
  const sil = 1 - prog(g, 8.2, 8.8); // শুরুতে ছায়ামূর্তি, "অনিক" নামে প্রকাশ
  const t = easeOut(prog(g, 12.3, 13.2));
  const lh = lerp2([44, 205], [66, 230], t);
  const rh = lerp2([156, 205], [134, 230], t);
  const look: Pt = g >= 17.6 ? [0, -1] : [0, 0.3];
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7ec8f0" />
            <stop offset="0.55" stopColor="#ffd7a8" />
            <stop offset="1" stopColor="#ffb27a" />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#sky1)" />
        <circle cx={770} cy={1190} r={140} fill="#ffe08a" opacity={0.5} />
        <circle cx={770} cy={1190} r={100} fill="#ffe9a8" />
        <g fill="#fff" opacity={0.92}>
          <ellipse cx={200 + g * 6} cy={420} rx={150} ry={44} />
          <ellipse cx={300 + g * 6} cy={395} rx={90} ry={40} />
          <ellipse cx={880 - g * 5} cy={640} rx={140} ry={40} />
        </g>
        <g fill="#c98f8a">
          {[[0, 1260, 130], [140, 1180, 110], [260, 1300, 150], [430, 1230, 100], [600, 1320, 140], [760, 1250, 120], [900, 1290, 180]].map(([x, y, w]) => (
            <rect key={x} x={x} y={y} width={w} height={1470 - y} />
          ))}
        </g>
      </svg>
      <div style={{position: 'absolute', left: 240, top: 750, width: 600, height: 780, opacity: 0.3 + 0.7 * (1 - sil)}}>
        <Character who="anik" frame={f} emo="calm" look={look} lh={lh} rh={rh} sil={sil} />
      </div>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <rect y={1470} width={1080} height={450} fill="#dcc3a6" stroke={INK} strokeWidth={3} />
        <rect y={1470} width={1080} height={40} fill="#8d7a68" stroke={INK} strokeWidth={3} />
      </svg>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 58%, rgba(0,0,0,0.22) 100%)'}} />

      <Pill g={g} a={9.6} b={13.0} text="বিকেল" />
      <Badge g={g} a={8.3} b={12.0} x={540} y={740} text="অনিক" bg="#58a6e8" />
      <PopIcon name="question" x={200} y={520} size={140} g={g} a={0.3} b={7.6} rot={-12} />
      <PopIcon name="question" x={870} y={420} size={170} g={g} a={1.6} b={7.6} rot={10} />
      <PopIcon name="question" x={540} y={300} size={120} g={g} a={3.2} b={7.6} />
      <PopIcon name="chair" x={290} y={1100} size={200} g={g} a={14.6} b={17.6} />
      <PopIcon name="cross" x={290} y={1100} size={160} g={g} a={15.5} b={17.6} />
      <PopIcon name="pot" x={800} y={1100} size={200} g={g} a={15.9} b={17.6} />
      <PopIcon name="cross" x={800} y={1100} size={160} g={g} a={16.9} b={17.6} />
    </div>
  );
};

// ---------- সিন ৫ (শেষাংশ): কোটেশন কার্ড, ক্লিন মোশন গ্রাফিক্স ----------
const Card: React.FC<{g: number; a: number; b: number; icons: React.ReactNode; text: string}> = ({g, a, b, icons, text}) => {
  const s = pop(g, a, 0.5) * (1 - easeOut(prog(g, b - 0.3, b)));
  if (s <= 0.001) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${s})`}}>
      <div style={{position: 'relative', width: 880, boxSizing: 'border-box', padding: '110px 60px 70px', background: '#fffaf0', border: `6px solid ${INK}`, borderRadius: 48, boxShadow: '0 16px 0 rgba(0,0,0,0.15)', textAlign: 'center', fontSize: 64, fontWeight: 700, lineHeight: 1.45, color: INK}}>
        <div style={{position: 'absolute', top: -80, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 30}}>{icons}</div>
        {text.split('*').map((p, i) => (i % 2 ? <span key={i} style={{color: '#e5484d'}}>{p}</span> : <span key={i}>{p}</span>))}
      </div>
    </div>
  );
};

export const QuoteScenes: React.FC<{start: number}> = ({start}) => {
  const f = useCurrentFrame() + start;
  const g = f / FPS;
  return (
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, #fdf0e0 30%, #ecc79c 100%)', overflow: 'hidden'}}>
      {[[160, 300, 70], [900, 520, 50], [220, 1500, 60], [880, 1560, 80], [540, 180, 40]].map(([x, y, r], i) => (
        <div key={i} style={{position: 'absolute', left: x - r, top: y - r + Math.sin(g * 2 + i) * 14, width: r * 2, height: r * 2, borderRadius: r, background: 'rgba(255,255,255,0.45)'}} />
      ))}
      <Card g={g} a={133.0} b={138.7} icons={<><Icon name="eye" size={150} /><Icon name="heart" size={150} /></>}
        text="অন্যের চোখের দিকে দেখে *ভালোবাসার গল্প* ধরে নিলে, নিজের দিকে আসা *ভালোবাসাটাই* চোখে পড়ে না।" />
      <Card g={g} a={138.8} b={150} icons={<Icon name="question" size={160} />}
        text="লামিয়া যদি আগেই *এক প্রশ্ন* করত, তাহলে এতগুলো দিন *অন্যের গল্প* ভেবে কাটাতে হতো না।" />
    </div>
  );
};
