'use client';
import React from 'react';

export default function HeroNeonSmoke() {
  return (
    <div className="hero-neon-smoke" aria-hidden="true">
      {/* SVG filter for fractal noise smoke */}
      <svg width="0" height="0" className="hidden-svg">
        <defs>
          <filter id="fractal-smoke" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.015" 
              numOctaves="4" 
              seed="1" 
              result="noise"
            />
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale="60" 
              xChannelSelector="R" 
              yChannelSelector="G" 
            />
          </filter>
        </defs>
      </svg>

      {/* Smoke Layers applied with SVG filter */}
      <div className="smoke-shape pink-smoke" />
      <div className="smoke-shape purple-smoke" />
      <div className="smoke-shape blue-smoke" />
    </div>
  );
}
