'use client';
import React from 'react';

export default function HeroSvgSmoke() {
  return (
    <div className="hero-svg-smoke" aria-hidden="true">
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 1000 1000" 
        preserveAspectRatio="xMidYMax slice" 
        className="smoke-svg"
      >
        <defs>
          <filter id="svg-smoke-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.012" 
              numOctaves="4" 
              seed="7" 
              result="noise" 
            />
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale="90" 
              xChannelSelector="R" 
              yChannelSelector="G" 
              result="displaced" 
            />
            <feGaussianBlur in="displaced" stdDeviation="20" result="blurred" />
          </filter>

          <linearGradient id="smoke-pink" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 42, 157, 0.45)" />
            <stop offset="60%" stopColor="rgba(255, 42, 157, 0.15)" />
            <stop offset="100%" stopColor="rgba(255, 42, 157, 0)" />
          </linearGradient>

          <linearGradient id="smoke-purple" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="rgba(140, 63, 255, 0.35)" />
            <stop offset="50%" stopColor="rgba(140, 63, 255, 0.1)" />
            <stop offset="100%" stopColor="rgba(140, 63, 255, 0)" />
          </linearGradient>

          <linearGradient id="smoke-blue" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="rgba(32, 198, 255, 0.35)" />
            <stop offset="65%" stopColor="rgba(32, 198, 255, 0.15)" />
            <stop offset="100%" stopColor="rgba(32, 198, 255, 0)" />
          </linearGradient>
        </defs>

        <g filter="url(#svg-smoke-filter)" style={{ mixBlendMode: 'screen' }}>
          {/* 좌측 핑크 연기 결 */}
          <path 
            className="svg-smoke-path pink-path"
            d="M -100,1100 Q 150,700 250,500 T 350,100" 
            stroke="url(#smoke-pink)" 
            strokeWidth="160" 
            fill="none" 
            strokeLinecap="round" 
          />
          {/* 인물 뒤쪽 퍼플/보라 연기 결 */}
          <path 
            className="svg-smoke-path purple-path"
            d="M 400,1200 Q 550,700 700,500 T 600,-50" 
            stroke="url(#smoke-purple)" 
            strokeWidth="240" 
            fill="none" 
            strokeLinecap="round" 
          />
          {/* 우측 하단 블루 연기 결 */}
          <path 
            className="svg-smoke-path blue-path"
            d="M 800,1100 Q 1000,750 900,450 T 1100,50" 
            stroke="url(#smoke-blue)" 
            strokeWidth="200" 
            fill="none" 
            strokeLinecap="round" 
          />
          {/* 보조: 얇은 연기 결 */}
          <path 
            className="svg-smoke-path pink-path-thin"
            d="M 100,1100 Q 300,600 200,300" 
            stroke="url(#smoke-pink)" 
            strokeWidth="80" 
            fill="none" 
            strokeLinecap="round" 
          />
          <path 
            className="svg-smoke-path blue-path-thin"
            d="M 900,1200 Q 750,700 850,200" 
            stroke="url(#smoke-blue)" 
            strokeWidth="100" 
            fill="none" 
            strokeLinecap="round" 
          />
        </g>
      </svg>
    </div>
  );
}
