import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Character, Emo, Pt} from './Character';
import {INK} from './theme';
import {FPS} from './timing';
import {prog, lerp, lerp2, easeOut, pop, inWin} from './anim';
import {Bubble, Badge, Pill, Thought} from './Overlays';
import {Icon, PopIcon} from './Icons';

const REST_L: Pt = [44, 205], REST_R: Pt = [156, 205], RAIL_L: Pt = [66, 230], RAIL_R: Pt = [134, 230];
const LW_L: Pt = [62, 196], LW_R: Pt = [138, 196], GRIP_L: Pt = [39, 185], GRIP_R: Pt = [161, 185];
const S = 2.3;

const Pen: React.FC<{rot?: number}> = ({rot = -25}) => (
  <g transform={`rotate(${rot})`}>
    <rect x={-3.5} y={-28} width={7} height={46} rx={3} fill="#2f6fdd" stroke={INK} strokeWidth={2} />
    <path d="M-3.5 18 L0 28 L3.5 18Z" fill="#f2c7a0" stroke={INK} strokeWidth={1.5} />
  </g>
);
const Phone: React.FC = () => (
  <g transform="rotate(12) translate(-10 -26)">
    <rect width={22} height={38} rx={4} fill="#333" stroke={INK} strokeWidth={2} />
    <rect x={3} y={4} width={16} height={28} rx={2} fill="#8fd3ff" />
  </g>
);
const Box: React.FC<{x: number; y: number; children: React.ReactNode}> = ({x, y, children}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 200 * S, height: 260 * S}}>{children}</div>
);

export const StreetWorld: React.FC<{start: number}> = ({start}) => {
  const f = useCurrentFrame() + start;
  const g = f / FPS;

  // ক্যামেরা: শেষ অংশে লামিয়ার ক্লোজ-আপ + ঝাঁকুনি
  const zoom = 1 + 0.45 * easeOut(prog(g, 119.5, 121.2));
  const amp = (inWin(g, [[68.9, 69.7]]) ? 10 : 0) + (inWin(g, [[130.4, 131.0]]) ? 6 : 0);
  const sx = amp ? Math.sin(f * 5) * amp : 0;
  const sy = amp ? Math.cos(f * 6.5) * amp : 0;

  // ---------- অনিক ----------
  let aEmo: Emo = 'calm', aLook: Pt = [0, -0.8], aTilt = 0, aLh: Pt = RAIL_L, aRh: Pt = RAIL_R, aTalk = false;
  const walking = (g >= 41.2 && g < 42.0) || (g >= 42.9 && g < 43.5);
  const adx = 40 * (prog(g, 41.2, 42.0) - prog(g, 42.9, 43.5));
  let ady = walking ? -Math.abs(Math.sin(g * 14)) * 10 : 0;
  if (g >= 43.4 && g < 47.2) { aLook = [1, 0.2]; aTilt = 6; }
  if (g >= 44.5 && g < 49.04) aEmo = 'nervous';
  if (g >= 47.2 && g < 49.04) { aLook = [-0.8, -0.9]; aTilt = -4; }
  if (g >= 49.04 && g < 52.5) { aLook = [0, 0.9]; aEmo = 'happy'; aRh = [134 + 22 * Math.sin(g * 9), 230]; }
  let ay = 0;
  if (g >= 71.7 && g < 76.2) ay = 500 * easeOut(prog(g, 71.7, 72.5));
  else if (g >= 76.2) ay = 500 * (1 - pop(g, 76.2, 0.9));
  if (g >= 71.7 && g < 78.1) { aLh = REST_L; aRh = REST_R; }
  else if (g >= 78.1 && g < 79.1) { const t = easeOut(prog(g, 78.1, 79.1)); aLh = lerp2(REST_L, RAIL_L, t); aRh = lerp2(REST_R, RAIL_R, t); }
  if (g >= 79.5) aLook = [0, -1];
  if (g >= 97.8 && g < 100.4) { aTilt = -8; aEmo = 'happy'; }
  if (inWin(g, [[100.4, 105.84], [106.76, 112.06]])) { aTalk = true; aEmo = 'happy'; aTilt = -6; aLook = [0, -1]; }
  if (g >= 112.06) aEmo = 'happy';

  // ---------- বৃষ্টি ----------
  const bShow = g >= 23.3 && g < 73.4;
  const by = 420 * (1 - pop(g, 23.3, 0.8)) + 420 * easeOut(prog(g, 72.7, 73.3));
  const bLook: Pt = g >= 47.0 && g < 48.5 ? [-1, -0.1] : [0, 0.8];

  // ---------- লামিয়া ----------
  let lEmo: Emo = 'calm', lLook: Pt = [0, 0.4], lLh: Pt = LW_L, lRh: Pt = LW_R, lTilt = 0, lTrem = 0, lTalk = false, lDy = 0;
  const ly = 360 * (1 - pop(g, 31.0, 0.9));
  if (g >= 36.6) { lLook = [0, 1]; lEmo = 'think'; }
  if (g >= 40.7) lEmo = 'calm';
  if (g >= 52.4 && g < 54.12) lLook = [Math.sin(g * 2.2), 1];
  if (g >= 54.12 && g < 57.0) {
    const t = easeOut(prog(g, 54.12, 54.8)) * (1 - easeOut(prog(g, 56.5, 57.0)));
    lRh = lerp2(LW_R, [112, 108], t); lEmo = 'think';
  }
  if (g >= 56.54 && g < 57.9) { lEmo = 'sad'; lDy = 5 * Math.sin(prog(g, 56.54, 57.9) * Math.PI); }
  if (g >= 57.9 && g < 64.5) lEmo = 'think';
  if (g >= 64.5 && g < 66.5) lEmo = 'sad';
  if (g >= 66.5 && g < 67.3) lEmo = 'annoyed';
  if (g >= 67.3 && g < 71.3) lEmo = 'angry';
  if (g >= 68.8 && g < 69.6) {
    const k = Math.sin(prog(g, 68.8, 69.6) * Math.PI);
    lRh = [138 - 40 * k, 196 - 46 * k]; lTrem = 2.5;
  }
  if (g >= 71.3 && g < 84.2) lEmo = 'think';
  if (g >= 84.2 && g < 87.54) { lEmo = 'determined'; lLook = [-0.3, 1]; }
  if (g >= 87.54) {
    const t = easeOut(prog(g, 87.54, 88.3));
    lLh = lerp2(LW_L, GRIP_L, t); lRh = lerp2(LW_R, GRIP_R, t); lEmo = 'determined';
  }
  if (g >= 89.98 && g < 100.4) { lEmo = 'think'; lTilt = -3; }
  if (inWin(g, [[90.64, 95.44], [105.84, 106.5]])) lTalk = true;
  if (g >= 105.84 && g < 110.5) { lEmo = 'think'; lTilt = 6; }
  if (g >= 110.5 && g < 120.5) lEmo = 'surprised';
  if (g >= 112.06 && g < 113.5) lTrem = 1.2;
  if (g >= 115.56 && g < 118.22) lLook = [1, 1];
  if (g >= 118.22 && g < 120.5) lLook = [0, 1];
  if (g >= 120.5) { lEmo = 'amazed'; lLook = [-0.4, 1]; }
  if (g >= 130.9) lLook = [0, 0];
  if (g >= 129.4 && g < 130.2) lTrem = 1.5;
  const penInHand = g < 85.2;
  const bookOpen = g < 86.5;
  const rollT = prog(g, 128.7, 130.9);
  const penX = 770 + 30 * rollT;
  const penY = 700 + 90 * rollT * rollT;
  const penRot = 90 + 540 * rollT;

  const dusk = 0.3 * prog(g, 71.6, 73.5) * (1 - prog(g, 110.5, 113));
  const ring = prog(g, 72.8, 75.2);

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#9fd8ff'}}>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${sx}px,${sy}px) scale(${zoom})`, transformOrigin: '540px 430px'}}>
        {/* ব্যাকগ্রাউন্ড: আকাশ, নিচের বিল্ডিং, দরজা, পুরোনো সোফা */}
        <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#8fd0f5" />
              <stop offset="1" stopColor="#ffe2b5" />
            </linearGradient>
          </defs>
          <rect width={1080} height={1000} fill="url(#sky)" />
          <g fill="#fff" opacity={0.9}>
            <ellipse cx={170 + g * 3} cy={880} rx={110} ry={34} />
            <ellipse cx={250 + g * 3} cy={860} rx={70} ry={30} />
            <ellipse cx={850 - g * 3} cy={925} rx={120} ry={34} />
          </g>
          <rect y={1000} width={1080} height={920} fill="#efdcc3" />
          <rect x={90} y={1040} width={350} height={425} rx={8} fill="#3d4d63" stroke={INK} strokeWidth={5} />
          <rect x={110} y={1060} width={310} height={405} fill="#51657f" />
          <circle cx={400} cy={1260} r={9} fill="#e0b84c" stroke={INK} strokeWidth={2} />
          {/* পুরোনো সোফা */}
          <rect x={600} y={1240} width={420} height={230} rx={40} fill="#a8664a" stroke={INK} strokeWidth={4} />
          <rect x={585} y={1300} width={50} height={170} rx={24} fill="#955a42" stroke={INK} strokeWidth={4} />
          <rect x={985} y={1300} width={50} height={170} rx={24} fill="#955a42" stroke={INK} strokeWidth={4} />
          <rect x={900} y={1290} width={60} height={50} fill="#d0a07c" stroke={INK} strokeWidth={2.5} strokeDasharray="8 6" />
          {ring > 0 && ring < 1 && <circle cx={810} cy={1360} r={60 + ring * 180} fill="none" stroke="#ffd23f" strokeWidth={14} opacity={1 - ring} />}
        </svg>

        {bShow && (
          <Box x={580} y={1000 + by}>
            <Character who="brishti" frame={f} emo="calm" look={bLook} lh={[74, 200]} rh={[128, 170 + Math.sin(g * 2.5) * 3]} rhProp={<Phone />} />
          </Box>
        )}
        <Box x={34 + adx} y={911 + ady + ay}>
          <Character who="anik" frame={f} emo={aEmo} talk={aTalk} look={aLook} tilt={aTilt} lh={aLh} rh={aRh} />
        </Box>

        {/* সামনের প্যারাপেট ও দুই বারান্দার দেয়াল */}
        <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
          {[[0, 528], [552, 1080]].map(([x0, x1]) => (
            <g key={x0}>
              <rect x={x0} y={1465} width={x1 - x0} height={455} fill="#dcc3a6" stroke={INK} strokeWidth={3} />
              <rect x={x0} y={1465} width={x1 - x0} height={36} fill="#8d7a68" stroke={INK} strokeWidth={3} />
            </g>
          ))}
          <rect x={528} y={1000} width={24} height={920} fill="#b58e6a" stroke={INK} strokeWidth={3} />
        </svg>

        {/* লামিয়ার জানালা: ঘর, ডেস্ক, বই, কলম, লামিয়া */}
        <div style={{position: 'absolute', left: 250, top: 130, width: 580, height: 615, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: -250, top: -130, width: 1080, height: 1920}}>
            <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
              <rect x={250} y={130} width={580} height={615} fill="#fff0d2" />
              <rect x={270} y={200} width={130} height={230} fill="#9b6b43" stroke={INK} strokeWidth={3} />
              {[['#e5484d', 215], ['#4a90e2', 275], ['#f5c93d', 335], ['#4caf50', 395]].map(([c, y]) => (
                <rect key={String(y)} x={280} y={Number(y)} width={110} height={44} fill={String(c)} stroke={INK} strokeWidth={2} />
              ))}
              <rect x={700} y={210} width={100} height={130} fill="#cfe8ff" stroke={INK} strokeWidth={3} />
              <rect x={250} y={640} width={580} height={105} fill="#b07a52" stroke={INK} strokeWidth={3} />
              {bookOpen ? (
                <g stroke={INK} strokeWidth={3}>
                  <rect x={600} y={598} width={98} height={70} fill="#fff" />
                  <rect x={698} y={598} width={98} height={70} fill="#fff" />
                  <g stroke="#9aa" strokeWidth={2}>
                    {[612, 628, 644].map((y) => (<g key={y}><line x1={610} y1={y} x2={688} y2={y} /><line x1={708} y1={y} x2={786} y2={y} /></g>))}
                  </g>
                </g>
              ) : (
                <rect x={620} y={628} width={150} height={40} fill="#c0392b" stroke={INK} strokeWidth={3} />
              )}
              {!penInHand && (
                <g transform={`translate(${g >= 128.7 ? penX : 770} ${g >= 128.7 ? penY : 700}) rotate(${penRot})`}>
                  <g transform="scale(0.9)"><Pen rot={0} /></g>
                </g>
              )}
            </svg>
            {g >= 31.0 && (
              <div style={{position: 'absolute', left: 310, top: 198 + ly + lDy, width: 200 * S, height: 260 * S}}>
                <Character who="lamia" frame={f} emo={lEmo} talk={lTalk} look={lLook} tilt={lTilt} tremble={lTrem} lh={lLh} rh={lRh} rhProp={penInHand ? <Pen /> : undefined} />
              </div>
            )}
          </div>
        </div>

        {/* সামনের বিল্ডিং-দেয়াল, জানালার ফ্রেম ও গ্রিল */}
        <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
          <path fillRule="evenodd" d="M0 0H1080V810H0Z M250 130H830V745H250Z" fill="#e2b49b" />
          <g stroke="#cf9d82" strokeWidth={4}>
            {[40, 250, 380, 520, 640, 780].map((y) => (<line key={y} x1={0} y1={y} x2={250} y2={y} />))}
            {[40, 250, 380, 520, 640, 780].map((y) => (<line key={'r' + y} x1={830} y1={y} x2={1080} y2={y} />))}
          </g>
          <rect x={250} y={130} width={580} height={615} fill="none" stroke="#6b4630" strokeWidth={14} />
          <rect x={0} y={796} width={1080} height={14} fill="#c79a82" />
          <g fill="#3b3b45" stroke={INK} strokeWidth={2}>
            {[262, 394, 674, 806].map((x) => (<rect key={x} x={x} y={136} width={12} height={603} />))}
            <rect x={256} y={136} width={568} height={12} />
            <rect x={256} y={727} width={568} height={12} />
          </g>
        </svg>
      </div>

      <div style={{position: 'absolute', inset: 0, background: `rgba(55,40,100,${dusk})`}} />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 58%, rgba(0,0,0,0.22) 100%)'}} />

      {/* পিল-ব্যাজ */}
      <Pill g={g} a={19.6} b={23.0} text="পাশাপাশি দুই বারান্দা" />
      <Pill g={g} a={40.9} b={44.0} text="প্রতিদিন, একই দৃশ্য" />
      <Pill g={g} a={71.9} b={75.0} text="সেই দিনটা" />
      {/* নাম-ব্যাজ */}
      <Badge g={g} a={27.4} b={31.8} x={810} y={960} text="বৃষ্টি" bg="#f5c93d" fg={INK} />
      <Badge g={g} a={35.3} b={39.8} x={540} y={170} text="লামিয়া" bg="#3c9a6a" />
      {/* প্রাসঙ্গিক আইকন */}
      <PopIcon name="note" x={940} y={1010} size={110} g={g} a={28.0} b={30.2} rot={-10} />
      <PopIcon name="note" x={680} y={990} size={100} g={g} a={29.0} b={31.2} rot={12} />
      <PopIcon name="eye" x={800} y={320} size={130} g={g} a={37.2} b={40.4} />
      <PopIcon name="exclaim" x={800} y={300} size={120} g={g} a={69.2} b={70.7} />
      <PopIcon name="heart" x={800} y={270} size={140} g={g} a={125.9} b={129.6} rot={10} />
      {/* লামিয়ার থট বাবল: অনিক → বৃষ্টি (ভুল ধারণা) */}
      <Thought g={g} a={60.0} b={66.1} x={540} y={20} w={640} h={170}>
        <Icon name="eye" size={110} />
        <div style={{position: 'relative', width: 110, height: 110}}>
          <Icon name="heart" size={110} />
          {g >= 65.4 && (
            <div style={{position: 'absolute', left: 0, top: 0, transform: `scale(${pop(g, 65.4, 0.3)})`}}>
              <Icon name="cross" size={110} />
            </div>
          )}
        </div>
      </Thought>
      {/* সংলাপ কলআউট বাবল */}
      <Bubble g={g} a={90.64} b={95.44} x={540} y={24} w={1000} tint="#e8f6ee" text="শুনছেন? আপনার প্রেয়সী তো আজ আসেননি, তবু দাঁড়িয়ে আছেন কেন?" />
      <Bubble g={g} a={100.4} b={105.84} x={540} y={740} w={900} tint="#eaf4ff" tailX={-276} text="চোখ তো দুজনেই তুলি, তবে আমি ভালোবাসায় আর প্রেয়সী সন্দেহে।" />
      <Bubble g={g} a={105.84} b={106.6} x={540} y={24} w={360} tint="#e8f6ee" text="মানে?" />
      <Bubble g={g} a={106.76} b={112.06} x={540} y={700} w={920} tint="#eaf4ff" tailX={-276} text="সন্দেহ বলেই তো প্রেয়সী প্রশ্ন করছে, আর প্রেমিক ভালোবাসার প্রস্তাব।" />
    </div>
  );
};
