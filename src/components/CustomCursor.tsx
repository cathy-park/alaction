'use client';

import { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Dot은 즉시 이동
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    };

    const render = () => {
      // Ring은 보간을 통해 스무스하게 쫓아감
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      
      animationFrameId = requestAnimationFrame(render);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // 버튼, 링크 등 인터랙티브 요소에 닿으면 호버 상태 토글
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('hover-target')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    render();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);



  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot">
        <div className="crosshair-v"></div>
        <div className="crosshair-h"></div>
      </div>
      <div ref={ringRef} className={`custom-cursor-ring ${isHovering ? 'hover' : ''}`} />
    </>
  );
}
