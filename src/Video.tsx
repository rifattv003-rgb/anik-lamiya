import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {fontFamily} from './theme';
import {FPS, S2, S3, S4, S5, QUOTE, TOTAL} from './timing';
import {SceneBalcony, QuoteScenes} from './Scenes';
import {StreetWorld} from './World';
import {Captions} from './Overlays';

// সিন বদলের সময় ছোট ফ্ল্যাশ ট্রানজিশন (S4-এ গাঢ়, বাকিগুলোতে সাদা)
const Flashes: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      {[S2, S3, S4, S5, QUOTE].map((b) => (
        <AbsoluteFill key={b} style={{pointerEvents: 'none', background: b === S4 ? '#1b1230' : '#ffffff', opacity: interpolate(f, [b - 4, b, b + 10], [0, 0.9, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      ))}
    </>
  );
};

const GlobalCaptions: React.FC = () => {
  const f = useCurrentFrame();
  return <Captions g={f / FPS} />;
};

export const Video: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#000', fontFamily}}>
    <Audio src={staticFile('voice.mp3')} />
    <Sequence from={0} durationInFrames={S2}><SceneBalcony /></Sequence>
    <Sequence from={S2} durationInFrames={QUOTE - S2}><StreetWorld start={S2} /></Sequence>
    <Sequence from={QUOTE} durationInFrames={TOTAL - QUOTE}><QuoteScenes start={QUOTE} /></Sequence>
    <GlobalCaptions />
    <Flashes />
  </AbsoluteFill>
);
