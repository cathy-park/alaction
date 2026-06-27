'use client';

import { useEffect, useRef } from 'react';

// 초경량 파티클 컴포넌트: shadowBlur 등 무거운 필터를 모두 제거하고 단순 렌더링만 수행
export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let particles: Particle[] = [];
    const particleCount = 30; // 개수 대폭 축소
    
    // Alaction 톤: Pink & Blue (투명도 있음)
    const colors = [
      'rgba(255, 42, 157, 0.4)',
      'rgba(32, 198, 255, 0.4)',
      'rgba(140, 63, 255, 0.4)'
    ];

    class Particle {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;

      constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        // 크기를 작게 제한
        this.radius = Math.random() * 1.5 + 0.5;
        // 이동 속도
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = Math.random() * -0.5 - 0.2; // 위로 천천히 떠오름
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update(w: number, h: number) {
        this.x += this.vx;
        this.y += this.vy;

        // 화면 위로 벗어나면 아래에서 다시 스폰
        if (this.y + this.radius < 0) {
          this.y = h + this.radius;
          this.x = Math.random() * w;
        }
        if (this.x > w + this.radius) this.x = -this.radius;
        if (this.x < -this.radius) this.x = w + this.radius;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    let animationFrameId: number;

    const resize = () => {
      // 해상도를 맞춰주되, 픽셀 비율(DPR)을 너무 높이지 않음 (성능 최적화)
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update(canvas.width, canvas.height);
        p.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
        opacity: 0.8
      }}
    />
  );
}
