import React from 'react';
import Svg, { Defs, LinearGradient, Stop, Rect, Path } from 'react-native-svg';

/**
 * LexiDict brand mark — a rounded indigo→cyan tile with three "text lines"
 * and a left accent bar (recreated from the provided logo.svg as vector so it
 * scales crisply and can be tinted).
 */
export default function Logo({ size = 64, radiusRatio = 0.25 }) {
  const r = size * radiusRatio;
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Defs>
        <LinearGradient id="lexiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#4F46E5" />
          <Stop offset="100%" stopColor="#06B6D4" />
        </LinearGradient>
      </Defs>
      <Rect x="20" y="20" width="160" height="160" rx={r * (200 / size)} fill="url(#lexiGrad)" />
      <Path
        d="M70 70H130V85H70V70ZM70 95H130V110H70V95ZM70 120H110V135H70V120Z"
        fill="white"
      />
      <Path d="M60 60V140H65V60H60Z" fill="rgba(255,255,255,0.6)" />
    </Svg>
  );
}
