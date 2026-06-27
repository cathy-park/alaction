import re

with open('src/app/globals.css', 'r') as f:
    content = f.read()

# Replace the old svg-smoke-path classes with svg-smoke-blob
content = re.sub(
    r'/\*\s*── SVG Path Smoke ──\s*\*/.*?(?=\/\*\s*콘텐츠가 스모그보다 위에 오도록\s*\*\/)',
    '',
    content,
    flags=re.DOTALL
)

new_css = """
/* ── SVG Blob Smoke ── */
.hero-svg-smoke {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;
}

.smoke-svg {
  opacity: 0.85; /* 전체적으로 은은하게 톤다운 */
}

.svg-smoke-blob {
  transform-origin: center center;
  will-change: transform;
}

.pink-blob {
  animation: blobSway1 30s ease-in-out infinite alternate;
}
.purple-blob {
  animation: blobSway2 35s ease-in-out infinite alternate-reverse;
}
.blue-blob {
  animation: blobSway3 40s ease-in-out infinite alternate;
}

/* 움직임을 아주 미세하게 최소화 (깜빡임, 튀는 느낌 제거) */
@keyframes blobSway1 {
  0% { transform: translate3d(0, 0, 0) scale(1) rotate(0deg); }
  100% { transform: translate3d(20px, -15px, 0) scale(1.02) rotate(1deg); }
}
@keyframes blobSway2 {
  0% { transform: translate3d(0, 0, 0) scale(1) rotate(0deg); }
  100% { transform: translate3d(-15px, 15px, 0) scale(1.03) rotate(-1deg); }
}
@keyframes blobSway3 {
  0% { transform: translate3d(0, 0, 0) scale(1) rotate(0deg); }
  100% { transform: translate3d(25px, -10px, 0) scale(1.02) rotate(1deg); }
}

@media(max-width: 768px) {
  .smoke-svg {
    opacity: 0.5; /* 모바일에서는 더 연하게 */
  }
}

"""

content = content.replace('/* 콘텐츠가 스모그보다 위에 오도록 */', new_css + '/* 콘텐츠가 스모그보다 위에 오도록 */')

with open('src/app/globals.css', 'w') as f:
    f.write(content)

