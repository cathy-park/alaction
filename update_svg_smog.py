import re

with open('src/app/globals.css', 'r') as f:
    content = f.read()

# Remove old SVG smoke css
content = re.sub(
    r'/\*\s*── SVG feTurbulence Smoke ──\s*\*/.*?(?=\/\*\s*콘텐츠가 스모그보다 위에 오도록\s*\*\/)',
    '',
    content,
    flags=re.DOTALL
)

# Add new CSS for HeroSvgSmoke
new_css = """
/* ── SVG Path Smoke ── */
.hero-svg-smoke {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;
}

.smoke-svg {
  opacity: 0.7;
}

.svg-smoke-path {
  transform-origin: center bottom;
  will-change: transform;
}

.pink-path {
  animation: svgSmokeSway1 24s ease-in-out infinite alternate;
}
.purple-path {
  animation: svgSmokeSway2 28s ease-in-out infinite alternate-reverse;
}
.blue-path {
  animation: svgSmokeSway3 26s ease-in-out infinite alternate;
}
.pink-path-thin {
  animation: svgSmokeSway2 20s ease-in-out infinite alternate;
}
.blue-path-thin {
  animation: svgSmokeSway1 22s ease-in-out infinite alternate-reverse;
}

@keyframes svgSmokeSway1 {
  0% { transform: translateX(0) scale(1) rotate(0deg); opacity: 0.8; }
  100% { transform: translateX(30px) scale(1.05) rotate(2deg); opacity: 1; }
}
@keyframes svgSmokeSway2 {
  0% { transform: translateX(0) scale(1) rotate(0deg); opacity: 0.8; }
  100% { transform: translateX(-40px) scale(1.1) rotate(-2deg); opacity: 1; }
}
@keyframes svgSmokeSway3 {
  0% { transform: translateX(0) scale(1) rotate(0deg); opacity: 0.8; }
  100% { transform: translateX(35px) scale(1.05) rotate(3deg); opacity: 1; }
}

@media(max-width: 768px) {
  .smoke-svg {
    opacity: 0.35;
    transform: scale(0.85) translateY(15%);
    transform-origin: bottom center;
  }
}

"""

content = content.replace('/* 콘텐츠가 스모그보다 위에 오도록 */', new_css + '/* 콘텐츠가 스모그보다 위에 오도록 */')

with open('src/app/globals.css', 'w') as f:
    f.write(content)

