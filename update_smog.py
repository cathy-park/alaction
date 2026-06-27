import re

with open('src/app/globals.css', 'r') as f:
    content = f.read()

# Remove old .hero-neon-smog to .smog-noise
content = re.sub(
    r'/\*\s*스모그 전체 래퍼\s*\*/.*?(?=\/\*\s*콘텐츠가 스모그보다 위에 오도록\s*\*\/)',
    '',
    content,
    flags=re.DOTALL
)

# Remove the media query that was added for smog at the bottom
content = re.sub(
    r'@media\s*\(\s*max-width:\s*768px\s*\)\s*\{\s*\.smog-left.*?\}\s*\}',
    '',
    content,
    flags=re.DOTALL
)

# Add new CSS for HeroNeonSmoke
new_css = """
/* ── SVG feTurbulence Smoke ── */
.hero-neon-smoke {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;
  mix-blend-mode: screen;
}

.hidden-svg {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

.smoke-shape {
  position: absolute;
  filter: url(#fractal-smoke) blur(10px);
  mix-blend-mode: screen;
  will-change: transform, opacity;
  border-radius: 50%;
}

.pink-smoke {
  width: 35vw;
  height: 60vh;
  right: 15%;
  bottom: -20%;
  background: radial-gradient(ellipse at center, rgba(255, 42, 157, 0.4) 0%, transparent 60%);
  animation: smokeFloatUp 18s ease-in-out infinite alternate;
}

.purple-smoke {
  width: 30vw;
  height: 70vh;
  right: 5%;
  bottom: -25%;
  background: radial-gradient(ellipse at center, rgba(140, 63, 255, 0.3) 0%, transparent 60%);
  animation: smokeFloatUp 22s ease-in-out infinite alternate-reverse;
}

.blue-smoke {
  width: 45vw;
  height: 50vh;
  right: -5%;
  bottom: -15%;
  background: radial-gradient(ellipse at center, rgba(32, 198, 255, 0.25) 0%, transparent 65%);
  animation: smokeFloatUp 20s ease-in-out infinite alternate;
}

@keyframes smokeFloatUp {
  0% { transform: translate3d(0, 10%, 0) scale(1) rotate(-5deg); opacity: 0.3; }
  100% { transform: translate3d(-5%, -15%, 0) scale(1.15) rotate(5deg); opacity: 0.6; }
}

@media(max-width: 768px) {
  .pink-smoke { width: 70vw; height: 50vh; right: -10%; opacity: 0.3 !important; }
  .purple-smoke { width: 60vw; height: 60vh; right: -5%; opacity: 0.2 !important; }
  .blue-smoke { width: 80vw; height: 40vh; right: -20%; opacity: 0.2 !important; }
}

"""

content = content.replace('/* 콘텐츠가 스모그보다 위에 오도록 */', new_css + '/* 콘텐츠가 스모그보다 위에 오도록 */')

with open('src/app/globals.css', 'w') as f:
    f.write(content)

