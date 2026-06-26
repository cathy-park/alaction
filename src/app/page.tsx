// @ts-nocheck
'use client';

import { useEffect, useRef } from 'react';

// SVG Icons (line style)
const IconTarget = () => <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const IconHome = () => <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H15.75V15h-7.5v6.75H3.75A.75.75 0 013 21V9.75z"/></svg>;
const IconQR = () => <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path strokeLinecap="round" d="M14 14h.01M18 14h.01M14 18h.01M18 18h.01M21 14v0M14 21v0"/></svg>;
const IconUsers = () => <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20H7m10 0a3 3 0 003-3v-1a7 7 0 00-14 0v1a3 3 0 003 3m10 0V18m-10 2V18M12 12a4 4 0 100-8 4 4 0 000 8z"/></svg>;
const IconSwords = () => <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.5 14.5L20 9m0 0V4h-5m5 5l-5.5 5.5M9.5 9.5L4 15m0 0v5h5m-5-5l5.5-5.5M9.5 14.5l5 5"/></svg>;
const IconSearch = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/></svg>;
const IconCalendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18"/></svg>;
const IconPhone = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5.5A2.5 2.5 0 015.5 3h.5a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 00-1 1v1a13 13 0 0011 11h1a1 1 0 001-1v-.5a1 1 0 011-1h3a1 1 0 011 1v.5A2.5 2.5 0 0118.5 21C9.94 21 3 14.06 3 5.5z"/></svg>;
const IconMap = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 12 6 12s6-6.75 6-12c0-3.314-2.686-6-6-6zm0 8a2 2 0 110-4 2 2 0 010 4z"/></svg>;
const IconInstagram = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>;
const IconYoutube = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M10 9l5 3-5 3V9z" fill="currentColor" stroke="none"/></svg>;
const IconBlog = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="3"/><path strokeLinecap="round" d="M7 8h10M7 12h7M7 16h5"/></svg>;

export default function Page() {
  useEffect(() => {
    
        /* ─── NAV scroll class ─── */
        const nav = document.getElementById('nav');
        window.addEventListener('scroll',()=>{
          nav?.classList.toggle('scrolled', window.scrollY > 80);
        },{passive:true});
    
        /* ─── Hero parallax ─── */
        /* ─── Hero parallax ─── */
        const heroBg = document.getElementById('heroBg');
        const particles = document.getElementById('particles');
        
        window.addEventListener('scroll',()=>{
          const y = window.scrollY;
          if (heroBg) heroBg.style.transform = `translateY(${y * 0.35}px)`;
          if (particles) particles.style.transform = `translateY(${y * 0.25}px)`;
        },{passive:true});
    
        /* ─── Mouse parallax on hero ─── */
        const hero = document.querySelector('.hero-section');
        hero?.addEventListener('mousemove',(e: any)=>{
          const {clientX,clientY} = e;
          const {innerWidth,innerHeight} = window;
          const dx = (clientX/innerWidth - 0.5)*14;
          const dy = (clientY/innerHeight - 0.5)*8;
          
          if (heroBg) heroBg.style.transform = `translate(${dx}px,${dy}px) translateY(${window.scrollY*0.35}px)`;
          if (particles) particles.style.transform = `translate(${dx*2}px,${dy*2}px) translateY(${window.scrollY*0.25}px)`;
        });
    
        /* ─── Intersection Observer fade-in ─── */
        const animEls = document.querySelectorAll('.anim-fadein, .anim-scale');
        const io = new IntersectionObserver((entries)=>{
          entries.forEach(e=>{
            if(e.isIntersecting){
              e.target.classList.add('visible');
              io.unobserve(e.target);
            }
          });
        },{threshold:0.12, rootMargin:'0px 0px -40px 0px'});
        animEls.forEach(el=>io.observe(el));
    
        /* ─── Counter animation ─── */
        function animateCounter(el, target, duration=1600){
          let start = null;
          const step = (ts)=>{
            if(!start) start = ts;
            const p = Math.min((ts-start)/duration,1);
            const ease = 1-Math.pow(1-p,3);
            el.textContent = Math.round(ease*target).toLocaleString();
            if(p<1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
        const counterEls = document.querySelectorAll('[data-target]');
        const counterIO = new IntersectionObserver((entries)=>{
          entries.forEach(e=>{
            if(e.isIntersecting){
              animateCounter(e.target, parseInt(e.target.dataset.target));
              counterIO.unobserve(e.target);
            }
          });
        },{threshold:0.5});
        counterEls.forEach(el=>counterIO.observe(el));
    
        /* ─── Gallery lightbox ─── */
        const galleryImages = ['/1.jpeg','/2.jpeg','/3.jpeg','/4.jpeg','/5.jpeg','/6.jpeg','/7.jpeg','/8.jpeg'];
        const lightbox = document.getElementById('lightbox');
        const lbImg = document.getElementById('lbImg');
        const lbClose = document.getElementById('lbClose');
        const lbPrev = document.getElementById('lbPrev');
        const lbNext = document.getElementById('lbNext');
        let currentIdx = 0;
    
        document.querySelectorAll('.gallery-item').forEach(item=>{
          item.addEventListener('click',()=>{
            currentIdx = parseInt(item.dataset.idx);
            if (lbImg) lbImg.src = galleryImages[currentIdx];
            lightbox?.classList.add('open');
            document.body.style.overflow='hidden';
          });
        });
        function closeLightbox(){ lightbox?.classList.remove('open'); document.body.style.overflow=''; }
        function navigateLb(dir){
          currentIdx = (currentIdx + dir + galleryImages.length) % galleryImages.length;
          lbImg.style.opacity='0';
          setTimeout(()=>{ if (lbImg) lbImg.src=galleryImages[currentIdx]; lbImg.style.opacity='1'; },150);
        }
        lbClose?.addEventListener('click', closeLightbox);
        lbPrev?.addEventListener('click', ()=>navigateLb(-1));
        lbNext?.addEventListener('click', ()=>navigateLb(1));
        lightbox.addEventListener('click',(e: any)=>{ if(e.target===lightbox) closeLightbox(); });
        document.addEventListener('keydown',(e: any)=>{
          if(!lightbox?.classList.contains('open')) return;
          if(e.key==='Escape') closeLightbox();
          if(e.key==='ArrowLeft') navigateLb(-1);
          if(e.key==='ArrowRight') navigateLb(1);
        });
        lbImg.style.transition='opacity .15s';
  }, []);

  return (
    <>
      {/* ─── NAV ─── */}
  <header className="nav" id="nav">
    <div className="wrap">
      <div className="nav-inner">
        <a className="brand" href="#">
          <img src="/logo.png" alt="Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          <span>R.ACTION</span>
        </a>
        <nav className="nav-links">
          <a href="#features">게임 특징</a>
          <a href="#reviews">후기</a>
          <a href="#gallery">매장 사진</a>
          <a href="#program">프로그램</a>
          <a href="#report">QR 리포트</a>
        </nav>
        <a className="nav-cta" href="https://talk.naver.com/profile/w4cqwe" target="_blank" rel="noopener noreferrer">예약 문의</a>
      </div>
    </div>
  </header>
  <main>
    {/* ─── HERO ─── */}
    <section className="hero-section">
      {/* Layer 1: PC용 단일 배경, 모바일용 원경 배경 */}
      <img id="heroBg" className="hero-bg-img pc-only" src="/hero.png" alt="알액션 레이저 아레나" />
      <img className="hero-bg-img mobile-only" src="/hero_bg.png" alt="알액션 배경" />
      
      {/* Layer 2: 순수 CSS 연기 파티클 + 부유하는 불티 (Option A) */}
      <div id="particles" className="css-smoke-wrap" aria-hidden="true">
        <div className="smoke-particle p1" />
        <div className="smoke-particle p2" />
        <div className="smoke-particle p3" />
        <div className="smoke-particle p4" />
        <div className="spark-particle s1" />
        <div className="spark-particle s2" />
        <div className="spark-particle s3" />
        <div className="spark-particle s4" />
        <div className="spark-particle s5" />
      </div>
      <img className="hero-woman-img mobile-only" src="/hero_woman.png" alt="알액션" />

      {/* Layer 3: Scanline (Option D) & Vignette Pulse (Option E) */}
      <div className="hero-scanline" aria-hidden="true" />
      <div className="hero-vignette" aria-hidden="true" />

      {/* Layer 3: 텍스트/버튼 */}
      <div className="wrap hero-content">
        <div className="hero-badge">
          <i className="spark" />
          NOW OPEN · 평택 실내 레이저태그
        </div>
        <h1>
          ENTER THE<br />
          <span className="line2">ARENA</span>
        </h1>
        <p className="hero-sub">
          실내 레이저 슈팅으로 경험하는 팀 배틀. 날씨 상관없이 최고 강도의 액티비티를 즐기고,<br />QR 리포트로 내 플레이 기록을 확인하세요.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="https://m.booking.naver.com/booking/12/bizes/766721/items/4624099?area=pll&lang=ko&service-target=map-pc&startDateTime=2026-06-26T00%3A00%3A00%2B09%3A00&theme=place" target="_blank" rel="noopener noreferrer">
            <span>지금 예약하기</span>
          </a>
          <a className="btn btn-ghost" href="#features">게임 특징 보기</a>
        </div>
      </div>
      <div className="hero-scroll-hint">
        <span>SCROLL</span>
        <div className="scroll-line" />
      </div>
    </section>
    {/* ─── MARQUEE ─── */}
    <div className="marquee-wrap" aria-hidden="true">
      <div className="marquee-track">
        <span>INDOOR LASER TAG <i>✦</i></span>
        <span>TEAM BATTLE <i>✦</i></span>
        <span>QR REPORT <i>✦</i></span>
        <span>PYEONGTAEK <i>✦</i></span>
        <span>GROUP PROGRAM <i>✦</i></span>
        <span>CYBER ARENA <i>✦</i></span>
        <span>SHOOT TO WIN <i>✦</i></span>
        <span>INDOOR LASER TAG <i>✦</i></span>
        <span>TEAM BATTLE <i>✦</i></span>
        <span>QR REPORT <i>✦</i></span>
        <span>PYEONGTAEK <i>✦</i></span>
        <span>GROUP PROGRAM <i>✦</i></span>
        <span>CYBER ARENA <i>✦</i></span>
        <span>SHOOT TO WIN <i>✦</i></span>
      </div>
    </div>
    {/* ─── FEATURES / BENTO ─── */}
    <section id="features">
      <div className="wrap">
        <div className="features-head">
          <div>
            <div className="section-label anim-fadein">Why Alaction</div>
            <h2 className="section-title anim-fadein delay-1">게임의 몰입감과<br />기록의 재미</h2>
          </div>
          <p className="section-desc anim-fadein delay-2">레이저 장비와 센서를 활용한 안전한 실내 슈팅 액티비티. 처음 방문한 고객도 안내 후 즉시 참여 가능하며, 게임 후 QR 리포트로 결과를 확인할 수 있습니다.</p>
        </div>
        <div className="bento-grid">
          {/* Big feature: Easy to play */}
          <article className="bento-card accent-pink col-5 row-4 anim-fadein">
            <div className="card-num">01</div>
            <div className="card-icon"><IconTarget /></div>
            <h3>초보자도 즉시<br />바로 플레이</h3>
            <p>복잡한 조작 없이 안전 안내와 기본 규칙 확인 후 바로 몰입. 모든 연령대가 함께 즐길 수 있습니다.</p>
            <div className="stat-row">
              <div className="stat-item">
                <b>5<span style={{fontSize: 20, color: 'var(--pink)'}}>분</span></b>
                <span>브리핑 시간</span>
              </div>
              <div className="stat-item">
                <b>전<span style={{fontSize: 20, color: 'var(--pink)'}}>연령</span></b>
                <span>참여 가능</span>
              </div>
            </div>
          </article>
          {/* Indoor no weather */}
          <article className="bento-card col-4 row-2 anim-fadein delay-1">
            <div className="card-num">02</div>
            <div className="card-icon"><IconHome /></div>
            <h3>날씨 영향 없는<br />실내 액티비티</h3>
            <p>계절·날씨에 관계없이 안정적인 일정 운영.</p>
          </article>
          {/* QR Report */}
          <article className="bento-card accent-blue col-3 row-2 anim-fadein delay-2">
            <div className="card-num">03</div>
            <div className="card-icon"><IconQR /></div>
            <h3>QR 슈팅<br />리포트</h3>
            <p>랭킹·점수·정확도를 모바일에서 즉시 확인.</p>
          </article>
          {/* Group */}
          <article className="bento-card accent-purple col-7 row-2 anim-fadein delay-1">
            <div className="card-num">04</div>
            <div className="card-icon"><IconUsers /></div>
            <h3>팀빌딩 &amp; 단체 프로그램에 최적화</h3>
            <p>워크샵, 회식, 청소년 활동, 생일파티까지. 짧은 시간 안에 자연스러운 협업과 경쟁을 경험하세요.</p>
          </article>
          {/* Strategy */}
          <article className="bento-card col-6 row-2 anim-fadein delay-2">
            <div className="card-num">05</div>
            <div className="card-icon"><IconSwords /></div>
            <h3>전략과 협업을<br />동시에 경험</h3>
            <p>팀전 중심 플레이로 자연스러운 소통이 발생합니다.</p>
          </article>
          {/* Stats strip */}
          <article className="bento-card col-6 row-2 anim-fadein delay-3 stat-strip">
            <div className="stat-item" style={{textAlign: 'center'}}>
              <b className="stat-num" style={{background: 'linear-gradient(90deg,var(--pink),var(--blue))', WebkitBackgroundClip: 'text', color: 'transparent'}} data-target={3000}>0</b>
              <span>누적 플레이어</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item" style={{textAlign: 'center'}}>
              <b className="stat-num" style={{background: 'linear-gradient(90deg,var(--purple),var(--cyan))', WebkitBackgroundClip: 'text', color: 'transparent'}} data-target={98}>0</b>
              <span>만족도 %</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item" style={{textAlign: 'center'}}>
              <b className="stat-num" style={{background: 'linear-gradient(90deg,var(--blue),var(--pink))', WebkitBackgroundClip: 'text', color: 'transparent'}} data-target={50}>0</b>
              <span>최대 동시 인원</span>
            </div>
          </article>
        </div>
      </div>
    </section>
    {/* ─── REVIEWS ─── */}
    <section id="reviews">
      <div className="wrap" style={{ maxWidth: '100%', padding: '0 20px', overflow: 'hidden' }}>
        <div className="reviews-head" style={{ maxWidth: '1200px', margin: '0 auto 52px' }}>
          <div className="section-label anim-fadein">User Reviews</div>
          <h2 className="section-title anim-fadein delay-1">직접 플레이한<br />유저들의 후기</h2>
        </div>
        
        <div className="reviews-carousel anim-fadein delay-2">
          {/* 첫 번째 줄: 왼쪽으로 롤링 */}
          <div className="auto-scroll-track left-scroll">
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"회사 워크샵으로 방문했는데, 팀원들 모두 완전히 빠져들었어요! 평소에 조용하던 팀원이 MVP를 차지해서 다 같이 엄청 웃었습니다."</p>
              <div className="review-author">
                <div className="review-avatar">K</div>
                <div><div className="review-name">Kim J.H.</div><div className="review-meta">기업 워크샵 · 30명</div></div>
              </div>
            </div>
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"QR 리포트가 진짜 신기했어요. 제 정확도가 72%라는 걸 처음 알았는데, 친구들이랑 경쟁하면서 더 재밌게 즐겼습니다."</p>
              <div className="review-author">
                <div className="review-avatar" style={{background: 'linear-gradient(135deg,var(--blue),var(--cyan))'}}>L</div>
                <div><div className="review-name">Lee S.Y.</div><div className="review-meta">친구 모임 · 6명</div></div>
              </div>
            </div>
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"사격 게임 좋아하는데 실제로 뛰면서 하니까 완전 다른 느낌. 어드레날린 폭발이에요!"</p>
              <div className="review-author">
                <div className="review-avatar" style={{background: 'linear-gradient(135deg,var(--pink),var(--purple))'}}>C</div>
                <div><div className="review-name">Choi D.W.</div><div className="review-meta">개인 방문</div></div>
              </div>
            </div>
            <div className="review-card">
              <div className="review-stars">★★★★☆</div>
              <p className="review-text">"아이들 생일파티 장소로 완전 강추! 아이들이 엄청 좋아했고, 어른들도 함께 즐길 수 있어서 좋았어요."</p>
              <div className="review-author">
                <div className="review-avatar" style={{background: 'linear-gradient(135deg,var(--green),var(--blue))'}}>P</div>
                <div><div className="review-name">Park M.J.</div><div className="review-meta">가족 생일파티 · 12명</div></div>
              </div>
            </div>
            {/* 왼쪽 스크롤 복제본 */}
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"회사 워크샵으로 방문했는데, 팀원들 모두 완전히 빠져들었어요! 평소에 조용하던 팀원이 MVP를 차지해서 다 같이 엄청 웃었습니다."</p>
              <div className="review-author">
                <div className="review-avatar">K</div>
                <div><div className="review-name">Kim J.H.</div><div className="review-meta">기업 워크샵 · 30명</div></div>
              </div>
            </div>
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"QR 리포트가 진짜 신기했어요. 제 정확도가 72%라는 걸 처음 알았는데, 친구들이랑 경쟁하면서 더 재밌게 즐겼습니다."</p>
              <div className="review-author">
                <div className="review-avatar" style={{background: 'linear-gradient(135deg,var(--blue),var(--cyan))'}}>L</div>
                <div><div className="review-name">Lee S.Y.</div><div className="review-meta">친구 모임 · 6명</div></div>
              </div>
            </div>
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"사격 게임 좋아하는데 실제로 뛰면서 하니까 완전 다른 느낌. 어드레날린 폭발이에요!"</p>
              <div className="review-author">
                <div className="review-avatar" style={{background: 'linear-gradient(135deg,var(--pink),var(--purple))'}}>C</div>
                <div><div className="review-name">Choi D.W.</div><div className="review-meta">개인 방문</div></div>
              </div>
            </div>
            <div className="review-card">
              <div className="review-stars">★★★★☆</div>
              <p className="review-text">"아이들 생일파티 장소로 완전 강추! 아이들이 엄청 좋아했고, 어른들도 함께 즐길 수 있어서 좋았어요."</p>
              <div className="review-author">
                <div className="review-avatar" style={{background: 'linear-gradient(135deg,var(--green),var(--blue))'}}>P</div>
                <div><div className="review-name">Park M.J.</div><div className="review-meta">가족 생일파티 · 12명</div></div>
              </div>
            </div>
          </div>
          
          {/* 두 번째 줄: 오른쪽으로 롤링 */}
          <div className="auto-scroll-track right-scroll">
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"동아리 행사로 방문했습니다. 팀장님이 친절하게 설명해 주시고 분위기도 너무 좋았어요. 시설도 깔끔했습니다!"</p>
              <div className="review-author">
                <div className="review-avatar" style={{background: 'linear-gradient(135deg,var(--purple),var(--blue))'}}>J</div>
                <div><div className="review-name">Jung H.S.</div><div className="review-meta">동아리 · 20명</div></div>
              </div>
            </div>
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"비가 오는 날 우연히 방문했는데 이제 비만 오면 여기 오고 싶어요. 실내라 쾌적하고 게임은 너무 재밌습니다."</p>
              <div className="review-author">
                <div className="review-avatar" style={{background: 'linear-gradient(135deg,var(--blue),var(--green))'}}>S</div>
                <div><div className="review-name">Son B.K.</div><div className="review-meta">커플 방문</div></div>
              </div>
            </div>
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"처음엔 무서울 것 같았는데 스태프분들이 친절하게 안내해 주셔서 금방 적응했어요. 결과 리포트 보는 재미도 있었습니다."</p>
              <div className="review-author">
                <div className="review-avatar" style={{background: 'linear-gradient(135deg,var(--pink),var(--cyan))'}}>N</div>
                <div><div className="review-name">Na Y.R.</div><div className="review-meta">친구 4명</div></div>
              </div>
            </div>
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"학원 아이들 데리고 갔는데 집중력, 팀워크, 전략적 사고까지 자연스럽게 훈련됐어요. 교육적으로도 훌륭합니다!"</p>
              <div className="review-author">
                <div className="review-avatar" style={{background: 'linear-gradient(135deg,var(--green),var(--purple))'}}>O</div>
                <div><div className="review-name">Oh T.H.</div><div className="review-meta">청소년 그룹 · 25명</div></div>
              </div>
            </div>
            {/* 오른쪽 스크롤 복제본 */}
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"동아리 행사로 방문했습니다. 팀장님이 친절하게 설명해 주시고 분위기도 너무 좋았어요. 시설도 깔끔했습니다!"</p>
              <div className="review-author">
                <div className="review-avatar" style={{background: 'linear-gradient(135deg,var(--purple),var(--blue))'}}>J</div>
                <div><div className="review-name">Jung H.S.</div><div className="review-meta">동아리 · 20명</div></div>
              </div>
            </div>
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"비가 오는 날 우연히 방문했는데 이제 비만 오면 여기 오고 싶어요. 실내라 쾌적하고 게임은 너무 재밌습니다."</p>
              <div className="review-author">
                <div className="review-avatar" style={{background: 'linear-gradient(135deg,var(--blue),var(--green))'}}>S</div>
                <div><div className="review-name">Son B.K.</div><div className="review-meta">커플 방문</div></div>
              </div>
            </div>
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"처음엔 무서울 것 같았는데 스태프분들이 친절하게 안내해 주셔서 금방 적응했어요. 결과 리포트 보는 재미도 있었습니다."</p>
              <div className="review-author">
                <div className="review-avatar" style={{background: 'linear-gradient(135deg,var(--pink),var(--cyan))'}}>N</div>
                <div><div className="review-name">Na Y.R.</div><div className="review-meta">친구 4명</div></div>
              </div>
            </div>
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"학원 아이들 데리고 갔는데 집중력, 팀워크, 전략적 사고까지 자연스럽게 훈련됐어요. 교육적으로도 훌륭합니다!"</p>
              <div className="review-author">
                <div className="review-avatar" style={{background: 'linear-gradient(135deg,var(--green),var(--purple))'}}>O</div>
                <div><div className="review-name">Oh T.H.</div><div className="review-meta">청소년 그룹 · 25명</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* ─── GALLERY ─── */}
    <section id="gallery">
      <div className="wrap">
        <div className="gallery-head">
          <div className="section-label anim-fadein">Offline Arena</div>
          <h2 className="section-title anim-fadein delay-1">매장 &amp; 아레나<br />갤러리</h2>
          <p className="section-desc anim-fadein delay-2">직접 방문해 경험하는 압도적인 공간. 어두운 조명, 레이저, 그리고 팀전의 긴장감.</p>
        </div>
        <div className="gallery-grid anim-scale">
          <div className="gallery-item g1" data-idx={0}>
            <img src="/1.jpeg" alt="매장 사진 1" loading="lazy" />
            <span className="gallery-icon"><IconSearch /></span>
          </div>
          <div className="gallery-item g2" data-idx={1}>
            <img src="/2.jpeg" alt="매장 사진 2" loading="lazy" />
            <span className="gallery-icon"><IconSearch /></span>
          </div>
          <div className="gallery-item g3" data-idx={2}>
            <img src="/3.jpeg" alt="매장 사진 3" loading="lazy" />
            <span className="gallery-icon"><IconSearch /></span>
          </div>
          <div className="gallery-item g4" data-idx={3}>
            <img src="/4.jpeg" alt="매장 사진 4" loading="lazy" />
            <span className="gallery-icon"><IconSearch /></span>
          </div>
          <div className="gallery-item g5" data-idx={4}>
            <img src="/5.jpeg" alt="매장 사진 5" loading="lazy" />
            <span className="gallery-icon"><IconSearch /></span>
          </div>
          <div className="gallery-item g6" data-idx={5}>
            <img src="/6.jpeg" alt="매장 사진 6" loading="lazy" />
            <span className="gallery-icon"><IconSearch /></span>
          </div>
          <div className="gallery-item g7" data-idx={6}>
            <img src="/7.jpeg" alt="매장 사진 7" loading="lazy" />
            <span className="gallery-icon"><IconSearch /></span>
          </div>
          <div className="gallery-item g8" data-idx={7}>
            <img src="/8.jpeg" alt="매장 사진 8" loading="lazy" />
            <span className="gallery-icon"><IconSearch /></span>
          </div>
        </div>
      </div>
    </section>
    {/* Lightbox */}
    <div className="lightbox" id="lightbox" role="dialog" aria-modal="true">
      <button className="lb-btn lb-close" id="lbClose" aria-label="닫기">✕</button>
      <button className="lb-btn lb-prev" id="lbPrev" aria-label="이전">‹</button>
      <img src="" alt="갤러리 이미지" id="lbImg" />
      <button className="lb-btn lb-next" id="lbNext" aria-label="다음">›</button>
    </div>
    {/* ─── PROGRAM ─── */}
    <section id="program">
      <div className="wrap">
        <div className="program-grid">
          <div>
            <div className="section-label anim-fadein">Group Program</div>
            <h2 className="section-title anim-fadein delay-1">단체 활동에 강한<br /><span style={{background: 'linear-gradient(90deg,var(--pink),var(--blue))', WebkitBackgroundClip: 'text', color: 'transparent'}}>실내 콘텐츠</span></h2>
            <p className="section-desc anim-fadein delay-2" style={{marginTop: 16}}>짧은 시간 안에 분위기를 풀고, 자연스럽게 협업과 경쟁을 경험할 수 있는 프로그램으로 구성합니다.</p>
            <a className="btn btn-primary anim-fadein delay-3" href="https://talk.naver.com/profile/w4cqwe" target="_blank" rel="noopener noreferrer" style={{marginTop: 32, width: 'max-content'}}>
              <span>단체 문의하기</span>
            </a>
          </div>
          <div className="program-list">
            <div className="program-item anim-fadein">
              <span className="program-num">01</span>
              <div className="program-info">
                <h3>기업 워크샵 / 팀빌딩</h3>
                <p>협동과 전략으로 팀워크를 높이는 몰입형 실내 액티비티.</p>
              </div>
            </div>
            <div className="program-item anim-fadein delay-1">
              <span className="program-num">02</span>
              <div className="program-info">
                <h3>회식 / 친목 모임</h3>
                <p>동호회, 친구 모임, 회식에서 부담 없이 즐기는 게임형 모임.</p>
              </div>
            </div>
            <div className="program-item anim-fadein delay-2">
              <span className="program-num">03</span>
              <div className="program-info">
                <h3>학교·학원·청소년 활동</h3>
                <p>청소년 체육 활동 및 특별 프로그램으로 활용 가능한 구성.</p>
              </div>
            </div>
            <div className="program-item anim-fadein delay-3">
              <span className="program-num">04</span>
              <div className="program-info">
                <h3>생일파티 / 가족 모임</h3>
                <p>특별한 날을 기억에 남는 액티비티로 만드는 파티형 프로그램.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* ─── QR REPORT ─── */}
    <section id="report" className="report-preview-section">
      <div className="wrap">
        <div className="report-preview-layout">
          <div className="report-preview-phone-area">
            <div className="report-phone anim-scale">
              <div className="phone-frame">
                <div className="phone-notch" />
                <div className="phone-screen">
                  <div className="report-scroll-content">
                    <img src="/report.png" alt="리포트 예시" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="section-label anim-fadein">Shooting Report</div>
            <h2 className="section-title anim-fadein delay-1">QR로 확인하는<br /><span style={{background: 'linear-gradient(90deg,var(--pink),var(--blue))', WebkitBackgroundClip: 'text', color: 'transparent'}}>나만의 결과 리포트</span></h2>
            <p className="section-desc anim-fadein delay-2" style={{marginTop: 16}}>게임 종료 즉시 QR 코드를 스캔하면 랭킹, 점수, 발사 수, 정확도 등 상세 플레이 데이터를 확인할 수 있습니다.</p>
            <div className="report-metrics anim-fadein delay-2">
              <div className="metric-card"><small>Rank</small><b>랭킹</b></div>
              <div className="metric-card"><small>Score</small><b>점수</b></div>
              <div className="metric-card"><small>Shots</small><b>발사 수</b></div>
              <div className="metric-card"><small>Hits</small><b>맞힌 수</b></div>
              <div className="metric-card"><small>Damaged</small><b>맞은 수</b></div>
              <div className="metric-card"><small>Accuracy</small><b>정확도</b></div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* ─── CTA ─── */}
    <section className="cta-section" id="contact">
      <div className="wrap">
        <div className="section-label anim-fadein" style={{justifyContent: 'center'}}>Contact</div>
        <h2 className="anim-fadein delay-1">방문 예약과<br />단체 문의를 지금 바로.</h2>
        <p className="anim-fadein delay-2">네이버 예약, 전화 문의, 길찾기 버튼은 실제 운영 링크로 연결됩니다.</p>
        <div className="cta-actions anim-fadein delay-3">
          <a className="btn btn-primary" href="https://m.booking.naver.com/booking/12/bizes/766721/items/4624099?area=pll&lang=ko&service-target=map-pc&startDateTime=2026-06-26T00%3A00%3A00%2B09%3A00&theme=place" target="_blank" rel="noopener noreferrer"><IconCalendar /><span>네이버 예약</span></a>
          <a className="btn btn-ghost" href="https://talk.naver.com/profile/w4cqwe" target="_blank" rel="noopener noreferrer"><IconPhone />톡톡 문의</a>
          <a className="btn btn-ghost" href="https://naver.me/xIFpW5pv" target="_blank" rel="noopener noreferrer"><IconMap />길찾기</a>
        </div>
      </div>
    </section>
  </main>
  {/* ─── FOOTER ─── */}
  <footer>
    <div className="wrap">
      <div className="footer-grid">
        <div>
          <div className="footer-brand" style={{background: 'linear-gradient(90deg,#fff,var(--pink))', WebkitBackgroundClip: 'text', color: 'transparent'}}>ALACTION</div>
          <p className="footer-tagline">평택 실내 레이저태그. 기록으로 남는 특별한 체험, 알액션에서 경험하세요.</p>
        </div>
        <div className="footer-col">
          <h4>방문 안내</h4>
          <a href="https://naver.me/xIFpW5pv" target="_blank" rel="noopener noreferrer">찾아오는 길</a>
          <a href="https://naver.me/xIFpW5pv" target="_blank" rel="noopener noreferrer">운영 시간</a>
          <a href="https://naver.me/xIFpW5pv" target="_blank" rel="noopener noreferrer">주차 안내</a>
        </div>
        <div className="footer-col">
          <h4>운영 시간</h4>
          <a href="#">평일 14:00 – 22:00</a>
          <a href="#">주말·공휴일 10:00 – 22:00</a>
        </div>
        <div className="footer-col">
          <h4>문의</h4>
          <a href="tel:031-000-0000">031-000-0000</a>
          <a href="mailto:info@alaction-pt.com">info@alaction-pt.com</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 ALACTION. All rights reserved.</p>
        <div className="social-links">
          <a className="social-link" href="#" aria-label="Instagram"><IconInstagram /></a>
          <a className="social-link" href="#" aria-label="YouTube"><IconYoutube /></a>
          <a className="social-link" href="#" aria-label="Blog"><IconBlog /></a>
        </div>
      </div>
    </div>
  </footer>
    </>
  );
}
