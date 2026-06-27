import re

with open('src/app/globals.css', 'r') as f:
    content = f.read()

# Replace .hero-section
content = re.sub(
    r'\.hero-section\s*\{[^}]*\}',
    r'.hero-section {\n  position: relative;\n  min-height: 100vh;\n  overflow: hidden;\n  isolation: isolate;\n  background: #050508;\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  padding-top: 80px;\n}',
    content,
    count=1
)

# Remove old smog and particles
content = re.sub(r'/\*\s*── Layer: Neon Smog Overlay ──\s*\*/.*?(?=\/\*\s*── Layer 3: 여성 모델 누끼 이미지 ──\s*\*\/)', '', content, flags=re.DOTALL)

# Add new CSS before `.hero-woman-img`
new_css = """
/* 스모그 전체 래퍼 */
.hero-neon-smog {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;
}

/* 공통 스모그 레이어 */
.smog-layer {
  position: absolute;
  pointer-events: none;
  mix-blend-mode: screen;
  will-change: transform, opacity;
}

/* 왼쪽 핑크/퍼플 스모그: 하단에서 위로 올라오는 느낌 */
.smog-left {
  left: -18%;
  bottom: -18%;
  width: 62%;
  height: 72%;
  opacity: 0.9;
  filter: blur(38px) saturate(1.45);
  background:
    radial-gradient(ellipse at 22% 78%, rgba(255, 0, 190, 0.72) 0%, rgba(255, 0, 190, 0.36) 24%, transparent 58%),
    radial-gradient(ellipse at 48% 56%, rgba(157, 64, 255, 0.55) 0%, rgba(157, 64, 255, 0.28) 28%, transparent 62%),
    radial-gradient(ellipse at 36% 32%, rgba(255, 43, 214, 0.28) 0%, transparent 56%);
  transform: rotate(-10deg);
  animation: smogLeftFloat 13s ease-in-out infinite alternate;
}

/* 오른쪽 블루/시안 스모그 */
.smog-right {
  right: -22%;
  bottom: -20%;
  width: 64%;
  height: 70%;
  opacity: 0.88;
  filter: blur(40px) saturate(1.55);
  background:
    radial-gradient(ellipse at 70% 78%, rgba(0, 208, 255, 0.7) 0%, rgba(0, 208, 255, 0.34) 24%, transparent 58%),
    radial-gradient(ellipse at 42% 54%, rgba(41, 92, 255, 0.5) 0%, rgba(41, 92, 255, 0.24) 30%, transparent 62%),
    radial-gradient(ellipse at 78% 35%, rgba(0, 145, 255, 0.26) 0%, transparent 56%);
  transform: rotate(9deg);
  animation: smogRightFloat 15s ease-in-out infinite alternate;
}

/* 인물 뒤쪽 보라/블루 공간감 */
.smog-back {
  right: 13%;
  top: 12%;
  width: 54%;
  height: 68%;
  opacity: 0.42;
  filter: blur(52px) saturate(1.5);
  background:
    radial-gradient(ellipse at 42% 42%, rgba(150, 61, 255, 0.44) 0%, rgba(150, 61, 255, 0.2) 32%, transparent 64%),
    radial-gradient(ellipse at 64% 62%, rgba(0, 176, 255, 0.36) 0%, rgba(0, 176, 255, 0.14) 32%, transparent 66%),
    radial-gradient(ellipse at 24% 70%, rgba(255, 0, 170, 0.24) 0%, transparent 62%);
  animation: smogBackPulse 17s ease-in-out infinite alternate;
}

/* 하단 전체를 받쳐주는 얇은 컬러 haze */
.smog-low {
  left: 4%;
  right: 4%;
  bottom: -24%;
  height: 44%;
  opacity: 0.52;
  filter: blur(42px) saturate(1.35);
  mix-blend-mode: screen;
  background:
    radial-gradient(ellipse at 18% 62%, rgba(255, 0, 170, 0.44) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 60%, rgba(142, 70, 255, 0.28) 0%, transparent 58%),
    radial-gradient(ellipse at 82% 62%, rgba(0, 190, 255, 0.42) 0%, transparent 50%);
  animation: smogLowRise 18s ease-in-out infinite alternate;
}

/* 연기 결 느낌: 하얀 노이즈가 아니라 컬러 입자/결 */
.smog-noise {
  position: absolute;
  left: -10%;
  right: -10%;
  bottom: -12%;
  height: 72%;
  opacity: 0.24;
  z-index: 3;
  pointer-events: none;
  mix-blend-mode: screen;
  filter: blur(12px) contrast(1.2);

  background-image:
    repeating-radial-gradient(
      ellipse at 18% 72%,
      rgba(255, 0, 190, 0.22) 0px,
      rgba(255, 0, 190, 0.08) 3px,
      transparent 12px,
      transparent 28px
    ),
    repeating-radial-gradient(
      ellipse at 78% 70%,
      rgba(0, 190, 255, 0.22) 0px,
      rgba(0, 190, 255, 0.08) 3px,
      transparent 12px,
      transparent 30px
    ),
    radial-gradient(ellipse at 50% 72%, rgba(154, 77, 255, 0.16), transparent 64%);

  mask-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.96) 0%,
    rgba(0, 0, 0, 0.8) 34%,
    rgba(0, 0, 0, 0.34) 68%,
    transparent 100%
  );

  animation: smogNoiseDrift 24s ease-in-out infinite alternate;
}

@keyframes smogLeftFloat {
  0% {
    transform: translate3d(-2%, 5%, 0) rotate(-10deg) scale(1);
    opacity: 0.74;
  }
  100% {
    transform: translate3d(5%, -7%, 0) rotate(-5deg) scale(1.14);
    opacity: 0.95;
  }
}

@keyframes smogRightFloat {
  0% {
    transform: translate3d(3%, 6%, 0) rotate(9deg) scale(1.02);
    opacity: 0.7;
  }
  100% {
    transform: translate3d(-5%, -8%, 0) rotate(4deg) scale(1.16);
    opacity: 0.92;
  }
}

@keyframes smogBackPulse {
  0% {
    transform: translate3d(0, 2%, 0) scale(1);
    opacity: 0.28;
  }
  100% {
    transform: translate3d(-3%, -4%, 0) scale(1.09);
    opacity: 0.46;
  }
}

@keyframes smogLowRise {
  0% {
    transform: translate3d(0, 8%, 0) scaleX(1);
  }
  100% {
    transform: translate3d(0, -7%, 0) scaleX(1.08);
  }
}

@keyframes smogNoiseDrift {
  0% {
    transform: translate3d(-2%, 5%, 0) scale(1);
  }
  100% {
    transform: translate3d(2%, -6%, 0) scale(1.08);
  }
}

/* 콘텐츠가 스모그보다 위에 오도록 */
.hero-content,
.hero-copy,
.hero-title,
.hero-cta,
.hero-nav {
  position: relative;
  z-index: 5;
}

/* 배경 이미지는 스모그보다 아래 */
.hero-bg,
.hero-background,
.hero-image,
.hero-bg-img {
  position: absolute !important;
  z-index: 0 !important;
}

/* 기존 어두운 오버레이가 너무 강하면 스모그가 묻히므로 낮춰야 함 */
.hero-dark-overlay {
  z-index: 1;
  background:
    linear-gradient(
      to bottom,
      rgba(2, 4, 12, 0.18) 0%,
      rgba(2, 4, 12, 0.24) 48%,
      rgba(2, 4, 12, 0.62) 100%
    );
}

@media (max-width: 768px) {
  .smog-left {
    left: -34%;
    bottom: -16%;
    width: 86%;
    height: 56%;
    opacity: 0.62;
    filter: blur(34px) saturate(1.35);
  }

  .smog-right {
    right: -36%;
    bottom: -18%;
    width: 88%;
    height: 56%;
    opacity: 0.58;
    filter: blur(34px) saturate(1.35);
  }

  .smog-back {
    right: -10%;
    top: 20%;
    width: 78%;
    height: 52%;
    opacity: 0.24;
    filter: blur(44px);
  }

  .smog-low {
    bottom: -22%;
    height: 34%;
    opacity: 0.34;
  }

  .smog-noise {
    opacity: 0.16;
    height: 52%;
  }
}

"""

content = content.replace('/* ── Layer 3: 여성 모델 누끼 이미지 ── */', new_css + '/* ── Layer 3: 여성 모델 누끼 이미지 ── */')

# Remove the old overlay
content = re.sub(r'/\* 배경 위 암전 그라데이션 \*/.*?\.hero-section::before\s*\{.*?\}\n', '', content, flags=re.DOTALL)

with open('src/app/globals.css', 'w') as f:
    f.write(content)
