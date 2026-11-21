import React from 'react';
import {INK} from './theme';
import {vis} from './anim';

export type IconName = 'question' | 'exclaim' | 'cross' | 'heart' | 'note' | 'chair' | 'pot' | 'eye' | 'sun';

export const Icon: React.FC<{name: IconName; size: number}> = ({name, size}) => {
  const p = {width: size, height: size, viewBox: '0 0 100 100'};
  const st = {stroke: INK, strokeWidth: 4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
  switch (name) {
    case 'question':
      return (
        <svg {...p}>
          <circle cx="50" cy="50" r="44" fill="#ffd23f" {...st} />
          <text x="50" y="73" textAnchor="middle" fontSize="66" fontWeight="700" fill={INK}>?</text>
        </svg>
      );
    case 'exclaim':
      return (
        <svg {...p}>
          <circle cx="50" cy="50" r="44" fill="#ff7a59" {...st} />
          <text x="50" y="74" textAnchor="middle" fontSize="68" fontWeight="700" fill="#fff">!</text>
        </svg>
      );
    case 'cross':
      return (
        <svg {...p} strokeLinecap="round">
          <line x1="18" y1="18" x2="82" y2="82" stroke={INK} strokeWidth="24" />
          <line x1="82" y1="18" x2="18" y2="82" stroke={INK} strokeWidth="24" />
          <line x1="18" y1="18" x2="82" y2="82" stroke="#e5484d" strokeWidth="14" />
          <line x1="82" y1="18" x2="18" y2="82" stroke="#e5484d" strokeWidth="14" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...p}>
          <path d="M50 90 C8 60 0 30 22 16 C36 8 46 16 50 27 C54 16 64 8 78 16 C100 30 92 60 50 90Z" fill="#ff5d7a" {...st} />
        </svg>
      );
    case 'note':
      return (
        <svg {...p}>
          <ellipse cx="34" cy="76" rx="15" ry="11" fill="#7c5cff" {...st} />
          <line x1="48" y1="74" x2="48" y2="20" {...st} strokeWidth={7} />
          <path d="M48 20 Q80 28 74 56" fill="none" {...st} strokeWidth={7} />
        </svg>
      );
    case 'chair':
      return (
        <svg {...p}>
          <rect x="26" y="8" width="14" height="52" rx="4" fill="#c98b4e" {...st} />
          <rect x="26" y="50" width="50" height="13" rx="4" fill="#c98b4e" {...st} />
          <line x1="32" y1="63" x2="30" y2="92" {...st} />
          <line x1="70" y1="63" x2="72" y2="92" {...st} />
        </svg>
      );
    case 'pot':
      return (
        <svg {...p}>
          <path d="M50 58 Q28 40 36 16 Q56 28 50 58Z" fill="#4caf50" {...st} />
          <path d="M50 58 Q72 38 66 12 Q46 26 50 58Z" fill="#66c26a" {...st} />
          <path d="M24 58 L76 58 L66 94 L34 94Z" fill="#d9734e" {...st} />
        </svg>
      );
    case 'eye':
      return (
        <svg {...p}>
          <path d="M5 50 Q50 6 95 50 Q50 94 5 50Z" fill="#fff" {...st} />
          <circle cx="50" cy="50" r="19" fill="#3b6fd8" {...st} />
          <circle cx="50" cy="50" r="8" fill={INK} />
        </svg>
      );
    case 'sun':
      return (
        <svg {...p}>
          <g stroke="#ffb020" strokeWidth="7" strokeLinecap="round">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <line key={a} x1="50" y1="8" x2="50" y2="20" transform={`rotate(${a} 50 50)`} />
            ))}
          </g>
          <circle cx="50" cy="50" r="22" fill="#ffd23f" {...st} />
        </svg>
      );
  }
  return null;
};

export const PopIcon: React.FC<{name: IconName; x: number; y: number; size: number; g: number; a: number; b: number; rot?: number}> = ({
  name, x, y, size, g, a, b, rot = 0,
}) => {
  const s = vis(g, a, b);
  if (s <= 0.001) return null;
  const bob = Math.sin(g * 3 + x) * 10;
  return (
    <div style={{position: 'absolute', left: x - size / 2, top: y - size / 2 + bob, width: size, height: size, transform: `scale(${s}) rotate(${rot}deg)`}}>
      <Icon name={name} size={size} />
    </div>
  );
};
