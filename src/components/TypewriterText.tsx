'use client';

import { useState, useEffect } from 'react';

export default function TypewriterText({ text, delay = 50, pause = 3000 }: { text: string; delay?: number; pause?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let i = 0;
    
    const typeWriter = () => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        timeoutId = setTimeout(typeWriter, delay);
      } else {
        // 타이핑 종료 시 pause 대기 후 처음부터 다시 시작
        timeoutId = setTimeout(() => {
          setDisplayedText('');
          i = 0;
          typeWriter();
        }, pause);
      }
    };
    
    typeWriter();
    
    return () => clearTimeout(timeoutId);
  }, [text, delay, pause]);

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
      {/* 영역이 타이핑 중에도 고정되도록 숨김 텍스트 렌더링 */}
      <span style={{ visibility: 'hidden' }}>{text}</span>
      {/* 실제 보이는 타이핑 텍스트 */}
      <span style={{ position: 'absolute', left: 0, top: 0 }}>
        {displayedText}
        <span className="typewriter-cursor">|</span>
      </span>
    </div>
  );
}
