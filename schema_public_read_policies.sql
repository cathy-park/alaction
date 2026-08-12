-- schema.sql은 관리자(authenticated)만 접근 가능한 정책만 있었다 —
-- 고객이 QR을 스캔해서 보는 /report/[token] 페이지는 로그인하지 않은
-- 방문자(anon)라서, 이 정책 없이는 RLS에 막혀 리포트를 볼 수 없다.
-- schema.sql 적용 후 이어서 이 파일을 실행할 것.

create policy "Public can read reports" on public.reports
  for select to anon using (true);

create policy "Public can read sessions" on public.sessions
  for select to anon using (true);

create policy "Public can read participants" on public.participants
  for select to anon using (true);

create policy "Public can read shooting_results" on public.shooting_results
  for select to anon using (true);
