import re

with open('src/app/globals.css', 'r') as f:
    content = f.read()

# Replace the old svg-smoke-blob classes with a static version
content = re.sub(
    r'/\*\s*── SVG Blob Smoke ──\s*\*/.*?(?=\/\*\s*콘텐츠가 스모그보다 위에 오도록\s*\*\/)',
    '',
    content,
    flags=re.DOTALL
)

new_css = """
/* ── SVG Blob Smoke (No Flicker) ── */
.hero-svg-smoke {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;
}

.smoke-svg {
  opacity: 0.8;
  will-change: transform;
  /* SVG 전체를 부드럽게 움직이게 하여 내부 필터 재계산(깜빡임) 방지 */
  animation: svgContainerDrift 40s ease-in-out infinite alternate;
  transform-origin: center center;
}

/* 내부 Blob들은 애니메이션 없이 정적으로 유지 */
.svg-smoke-blob {
  /* No animation here to prevent SVG filter flickering */
}

/* 매우 천천히 흐르는 정적인 안개 느낌 */
@keyframes svgContainerDrift {
  0% { transform: scale(1) translate3d(0, 5%, 0) rotate(0deg); }
  100% { transform: scale(1.05) translate3d(-3%, -5%, 0) rotate(1deg); }
}

@media(max-width: 768px) {
  .smoke-svg {
    opacity: 0.5; /* 모바일에서는 더 연하게 */
    /* 모바일에서는 애니메이션 오버라이드하여 사이즈 축소 적용 */
    animation: svgContainerDriftMobile 40s ease-in-out infinite alternate;
  }
}

@keyframes svgContainerDriftMobile {
  0% { transform: scale(0.85) translate3d(0, 10%, 0) rotate(0deg); }
  100% { transform: scale(0.9) translate3d(-2%, 5%, 0) rotate(1deg); }
}

"""

content = content.replace('/* 콘텐츠가 스모그보다 위에 오도록 */', new_css + '/* 콘텐츠가 스모그보다 위에 오도록 */')

with open('src/app/globals.css', 'w') as f:
    f.write(content)

