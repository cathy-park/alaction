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
            {/* baseFrequency를 낮추고 애니메이션을 제거해 깜빡임 방지, 구름 같은 덩어리 생성 */}
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.006" 
              numOctaves="4" 
              seed="15" 
              result="noise" 
            />
            {/* 왜곡 수치를 높여서 불규칙한 덩어리감 형성 */}
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale="200" 
              xChannelSelector="R" 
              yChannelSelector="G" 
              result="displaced" 
            />
            {/* 블러를 강하게 줘서 선명한 경계선을 없앰 */}
            <feGaussianBlur in="displaced" stdDeviation="50" result="blurred" />
          </filter>

          {/* 은은하고 채도를 낮춘 그라데이션 */}
          <radialGradient id="smoke-pink" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(200, 50, 150, 0.35)" />
            <stop offset="50%" stopColor="rgba(200, 50, 150, 0.12)" />
            <stop offset="100%" stopColor="rgba(200, 50, 150, 0)" />
          </radialGradient>

          <radialGradient id="smoke-purple" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(120, 60, 200, 0.3)" />
            <stop offset="50%" stopColor="rgba(120, 60, 200, 0.1)" />
            <stop offset="100%" stopColor="rgba(120, 60, 200, 0)" />
          </radialGradient>

          <radialGradient id="smoke-blue" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(40, 150, 220, 0.25)" />
            <stop offset="50%" stopColor="rgba(40, 150, 220, 0.08)" />
            <stop offset="100%" stopColor="rgba(40, 150, 220, 0)" />
          </radialGradient>
        </defs>

        <g filter="url(#svg-smoke-filter)" style={{ mixBlendMode: 'screen' }}>
          {/* 왼쪽 하단 핑크 헤이즈 */}
          <ellipse 
            className="svg-smoke-blob pink-blob"
            cx="150" cy="950" rx="450" ry="300"
            fill="url(#smoke-pink)"
          />
          
          {/* 인물 뒤쪽(중앙~우측) 퍼플 안개 */}
          <ellipse 
            className="svg-smoke-blob purple-blob"
            cx="700" cy="700" rx="350" ry="450"
            fill="url(#smoke-purple)"
          />

          {/* 하단 중앙~우측 블루 안개 */}
          <ellipse 
            className="svg-smoke-blob blue-blob"
            cx="600" cy="1150" rx="550" ry="300"
            fill="url(#smoke-blue)"
          />
        </g>
      </svg>
    </div>
  );
}
