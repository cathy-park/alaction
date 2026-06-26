import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ALACTION | 평택 실내 레이저태그",
  description: "평택 실내 레이저태그 알액션 — 팀 배틀, QR 슈팅 리포트, 단체 프로그램. 사이버펑크 감성의 실내 슈팅 액티비티.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@600;700;800;900&family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
