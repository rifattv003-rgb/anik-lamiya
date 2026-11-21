import React from 'react';
import {INK} from './theme';
import {Pt} from './anim';

export type Who = 'anik' | 'brishti' | 'lamia';
export type Emo = 'calm' | 'happy' | 'sad' | 'angry' | 'surprised' | 'nervous' | 'annoyed' | 'think' | 'amazed' | 'determined';
export type {Pt};

const LOOKS = {
  anik: {skin: '#f2c7a0', cloth: '#8fc8f2', hair: '#1f1f1f', sleeve: 0.45},
  brishti: {skin: '#c8946a', cloth: '#f5c93d', hair: '#2b1b17', sleeve: 0.75},
  lamia: {skin: '#eab98f', cloth: '#2f7a52', hair: '#1b1b1b', sleeve: 0.85},
};
// [বাইরের প্রান্তের y, ভেতরের প্রান্তের y]
const BROW: Record<Emo, [number, number]> = {
  calm: [49, 49], happy: [45, 44], sad: [54, 44], angry: [43, 54], surprised: [36, 36],
  nervous: [52, 44], annoyed: [45, 53], think: [48, 42], amazed: [37, 37], determined: [47, 52],
};

const Arm: React.FC<{s: Pt; h: Pt; skin: string; cloth: string; frac: number}> = ({s, h, skin, cloth, frac}) => {
  const mx = s[0] + (h[0] - s[0]) * frac;
  const my = s[1] + (h[1] - s[1]) * frac;
  return (
    <g strokeLinecap="round">
      <line x1={s[0]} y1={s[1]} x2={h[0]} y2={h[1]} stroke={INK} strokeWidth={27} />
      <line x1={s[0]} y1={s[1]} x2={h[0]} y2={h[1]} stroke={skin} strokeWidth={22} />
      <line x1={s[0]} y1={s[1]} x2={mx} y2={my} stroke={INK} strokeWidth={27} />
      <line x1={s[0]} y1={s[1]} x2={mx} y2={my} stroke={cloth} strokeWidth={22} />
      <circle cx={h[0]} cy={h[1]} r={13} fill={skin} stroke={INK} strokeWidth={2.5} />
    </g>
  );
};

export interface CharProps {
  who: Who;
  frame: number;
  emo?: Emo;
  talk?: boolean;
  look?: Pt;
  lh?: Pt;
  rh?: Pt;
  tilt?: number;
  tremble?: number;
  lhProp?: React.ReactNode;
  rhProp?: React.ReactNode;
  sil?: number;
}

export const Character: React.FC<CharProps> = ({
  who, frame, emo = 'calm', talk = false, look = [0, 0.2], lh = [44, 205], rh = [156, 205], tilt = 0, tremble = 0, lhProp, rhProp, sil = 0,
}) => {
  const C = LOOKS[who];
  const seed = who === 'anik' ? 0 : who === 'brishti' ? 37 : 71;
  const tx = tremble ? Math.sin(frame * 2.7) * tremble : 0;
  const ty = Math.sin(frame / 16 + seed) * 3 + (tremble ? Math.cos(frame * 3.3) * tremble : 0);
  const closed = (frame + seed) % 120 < 5;
  const big = emo === 'surprised' || emo === 'amazed';
  const ry = closed ? 1.5 : big ? 15 : 13;
  const [bo, bi] = BROW[emo];
  const lv = (Math.floor(frame / 3) * 7) % 3;
  const dx = Math.max(-1, Math.min(1, look[0])) * 4.5;
  const dy = Math.max(-1, Math.min(1, look[1])) * 5;
  const sweat = emo === 'nervous';
  const blush = emo === 'amazed' || emo === 'happy';

  const mouth = () => {
    const s = {fill: 'none', stroke: INK, strokeWidth: 3, strokeLinecap: 'round' as const};
    if (talk) {
      if (lv === 0) return <path d="M88 101 Q100 107 112 101" {...s} />;
      if (lv === 1) return <ellipse cx={100} cy={103} rx={9} ry={6} fill="#8a2f2f" stroke={INK} strokeWidth={3} />;
      return <ellipse cx={100} cy={105} rx={12} ry={11} fill="#8a2f2f" stroke={INK} strokeWidth={3} />;
    }
    switch (emo) {
      case 'happy': return <path d="M82 96 Q100 118 118 96" {...s} />;
      case 'amazed': return <path d="M84 97 Q100 124 116 97Z" fill="#8a2f2f" stroke={INK} strokeWidth={3} strokeLinejoin="round" />;
      case 'sad': return <path d="M86 108 Q100 96 114 108" {...s} />;
      case 'angry': return <path d="M86 106 Q100 98 114 106" {...s} />;
      case 'surprised': return <ellipse cx={100} cy={104} rx={8} ry={11} fill="#8a2f2f" stroke={INK} strokeWidth={3} />;
      case 'nervous': return <path d="M84 104 Q92 98 100 104 T116 104" {...s} />;
      case 'annoyed': return <path d="M88 105 L112 100" {...s} />;
      case 'think': return <path d="M88 103 Q100 100 112 105" {...s} />;
      case 'determined': return <path d="M88 102 Q100 106 112 102" {...s} />;
      default: return <path d="M88 100 Q100 108 112 100" {...s} />;
    }
  };

  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%" style={sil ? {filter: `brightness(${1 - sil})`} : undefined}>
      <g transform={`translate(${tx} ${ty})`}>
        {/* পেছনের চুল */}
        {who === 'brishti' && <rect x={40} y={30} width={120} height={210} rx={56} fill={C.hair} stroke={INK} strokeWidth={2.5} />}
        {who === 'lamia' && <rect x={142} y={110} width={20} height={130} rx={10} fill={C.hair} stroke={INK} strokeWidth={2.5} transform="rotate(-6 150 110)" />}
        {/* শরীর */}
        <rect x={50} y={122} width={100} height={160} rx={36} fill={C.cloth} stroke={INK} strokeWidth={2.5} />
        {who === 'anik' && (
          <g stroke={INK} strokeWidth={2.5} strokeLinejoin="round">
            <path d="M82 122 L100 146 L82 140Z" fill="#d7ecfa" />
            <path d="M118 122 L100 146 L118 140Z" fill="#d7ecfa" />
            <line x1={100} y1={146} x2={100} y2={260} />
            <circle cx={100} cy={170} r={2.5} fill={INK} />
            <circle cx={100} cy={196} r={2.5} fill={INK} />
          </g>
        )}
        {who === 'lamia' && <polygon points="52,128 84,122 150,238 150,282 114,282 56,166" fill="#f7f7f7" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />}
        <path d="M84 121 L100 146 L116 121Z" fill={C.skin} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
        <rect x={88} y={106} width={24} height={20} fill={C.skin} stroke={INK} strokeWidth={2.5} />
        {/* মাথা */}
        <g transform={`rotate(${tilt} 100 125)`}>
          <circle cx={54} cy={74} r={8} fill={C.skin} stroke={INK} strokeWidth={2.5} />
          <circle cx={146} cy={74} r={8} fill={C.skin} stroke={INK} strokeWidth={2.5} />
          <ellipse cx={100} cy={70} rx={46} ry={50} fill={C.skin} stroke={INK} strokeWidth={2.5} />
          {blush && (
            <g fill="rgba(255,110,110,0.35)">
              <ellipse cx={66} cy={92} rx={9} ry={6} />
              <ellipse cx={134} cy={92} rx={9} ry={6} />
            </g>
          )}
          {/* চোখ */}
          {[80, 120].map((cx) => (
            <g key={cx}>
              <ellipse cx={cx} cy={70} rx={11} ry={ry} fill="#fff" stroke={INK} strokeWidth={2.5} />
              {!closed && <circle cx={cx + dx} cy={70 + dy} r={big ? 4.5 : 6} fill={INK} />}
              {!closed && <circle cx={cx + dx + 2} cy={70 + dy - 2} r={1.8} fill="#fff" />}
            </g>
          ))}
          {/* ভ্রু */}
          <line x1={64} y1={bo} x2={94} y2={bi} stroke={INK} strokeWidth={4} strokeLinecap="round" />
          <line x1={136} y1={bo} x2={106} y2={bi} stroke={INK} strokeWidth={4} strokeLinecap="round" />
          <path d="M98 84 Q101 90 105 87" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
          {mouth()}
          {sweat && <path d={`M146 ${34 + Math.sin(frame / 5) * 2} Q155 48 146 54 Q137 48 146 34Z`} fill="#8fd3ff" stroke={INK} strokeWidth={2} />}
          {/* চুল */}
          {who === 'anik' && (
            <g fill={C.hair} stroke={INK} strokeWidth={2.5} strokeLinejoin="round">
              <path d="M54 66 Q44 12 100 12 Q156 12 146 66 Q136 40 118 44 Q108 30 96 42 Q74 34 54 66Z" />
              <path d="M70 22 L58 2 L86 14Z" />
              <path d="M104 14 L114 -2 L126 18Z" />
            </g>
          )}
          {who === 'brishti' && <path d="M52 70 Q42 10 100 12 Q158 10 148 70 Q130 36 104 42 Q80 40 52 70Z" fill={C.hair} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />}
          {who === 'lamia' && <path d="M52 70 Q44 12 100 12 Q156 12 148 70 Q126 46 100 46 Q72 46 52 70Z" fill={C.hair} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />}
          {who === 'lamia' && (
            <g fill="rgba(255,255,255,0.2)" stroke={INK} strokeWidth={3.5}>
              <circle cx={80} cy={70} r={17} />
              <circle cx={120} cy={70} r={17} />
              <line x1={97} y1={68} x2={103} y2={68} />
              <line x1={63} y1={68} x2={54} y2={66} />
              <line x1={137} y1={68} x2={146} y2={66} />
            </g>
          )}
          {who === 'brishti' && (
            <g fill="#222" stroke={INK} strokeWidth={3}>
              <path d="M54 72 Q54 14 100 14 Q146 14 146 72" fill="none" strokeWidth={6} />
              <rect x={44} y={58} width={15} height={32} rx={7} />
              <rect x={141} y={58} width={15} height={32} rx={7} />
            </g>
          )}
        </g>
        {/* হাত */}
        <Arm s={[60, 150]} h={lh} skin={C.skin} cloth={C.cloth} frac={C.sleeve} />
        <Arm s={[140, 150]} h={rh} skin={C.skin} cloth={C.cloth} frac={C.sleeve} />
        {lhProp && <g transform={`translate(${lh[0]} ${lh[1]})`}>{lhProp}</g>}
        {rhProp && <g transform={`translate(${rh[0]} ${rh[1]})`}>{rhProp}</g>}
      </g>
    </svg>
  );
};
