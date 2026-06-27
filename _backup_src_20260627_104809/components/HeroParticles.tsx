'use client';
import React, { useEffect, useRef } from 'react';

export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // 파티클 클래스 정의
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      life: number;
      maxLife: number;
      color: string;
      opacity: number;

      constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 50; // 하단에서 살짝 아래에서 시작
        this.size = Math.random() * 2.5 + 0.5; // 크기
        this.speedX = (Math.random() - 0.5) * 0.4; // 좌우 살랑거림
        this.speedY = -(Math.random() * 1.5 + 0.2); // 위로 상승
        this.maxLife = Math.random() * 200 + 100;
        this.life = this.maxLife;
        this.opacity = 0;
        
        // 핑크/퍼플/블루 톤 색상 랜덤 선택
        const colors = [
          'rgba(255, 42, 157, OPACITY)',  // Pink
          'rgba(140, 63, 255, OPACITY)',  // Purple
          'rgba(32, 198, 255, OPACITY)',  // Blue
          'rgba(255, 255, 255, OPACITY)'  // White (가끔)
        ];
        // 80% 확률로 네온 컬러, 20% 확률로 흰색 불티
        this.color = Math.random() > 0.8 ? colors[3] : colors[Math.floor(Math.random() * 3)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;

        // Fade in (처음) & Fade out (끝)
        if (this.maxLife - this.life < 30) {
          this.opacity = (this.maxLife - this.life) / 30;
        } else if (this.life < 60) {
          this.opacity = this.life / 60;
        } else {
          this.opacity = 1;
        }
        
        // 불규칙한 좌우 흔들림 추가 (노이즈)
        this.speedX += (Math.random() - 0.5) * 0.05;
        if (this.speedX > 1) this.speedX = 1;
        if (this.speedX < -1) this.speedX = -1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace('OPACITY', (this.opacity * 0.8).toString());
        // 글로우 효과 (성능을 위해 제한적으로 적용하거나 생략 가능. 여기서는 은은하게 적용)
        ctx.shadowBlur = this.size * 2;
        ctx.shadowColor = this.color.replace('OPACITY', '1');
        ctx.fill();
        ctx.closePath();
      }
    }

    const resize = () => {
      // 레티나 디스플레이 대응
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    const init = () => {
      resize();
      particles = [];
      // 초기 파티클 수 (모바일은 적게, PC는 많게)
      const isMobile = window.innerWidth <= 768;
      const numParticles = isMobile ? 30 : 60;
      for (let i = 0; i < numParticles; i++) {
        const p = new Particle(window.innerWidth, window.innerHeight);
        p.y = Math.random() * window.innerHeight; // 초기에 전체에 흩뿌리기
        particles.push(p);
      }
    };

    const animate = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // 잔상 효과 (은은한 궤적)
      ctx.clearRect(0, 0, width, height);
      // 글로우 합성을 위해
      ctx.globalCompositeOperation = 'screen';

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);

        // 파티클이 수명을 다하거나 화면 밖으로 나가면 재생성
        if (particles[i].life <= 0 || particles[i].y < -50 || particles[i].x < -50 || particles[i].x > width + 50) {
          particles[i] = new Particle(width, height);
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    init();
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
        zIndex: 3, // 배경보다 위, 텍스트보다 아래 (스모그 바로 위)
        pointerEvents: 'none'
      }}
      aria-hidden="true"
    />
  );
}
