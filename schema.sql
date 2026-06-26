-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Sessions table
create table public.sessions (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  play_date date not null,
  program_type text not null,
  memo text,
  status text not null default 'ready' check (status in ('ready', 'published', 'private', 'expired')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Participants table
create table public.participants (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  nickname text not null,
  team_name text,
  age_group text,
  gender text,
  memo text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Shooting Results table
create table public.shooting_results (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  participant_id uuid not null references public.participants(id) on delete cascade,
  rank integer not null,
  score integer not null,
  shots_fired integer not null check (shots_fired >= 0),
  hits integer not null check (hits >= 0),
  times_hit integer not null check (times_hit >= 0),
  accuracy numeric not null check (accuracy >= 0 and accuracy <= 100),
  admin_memo text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Check constraint: hits <= shots_fired (cannot have more hits than shots)
alter table public.shooting_results add constraint hits_less_than_shots check (hits <= shots_fired);

-- Reports table
create table public.reports (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  participant_id uuid not null references public.participants(id) on delete cascade,
  result_id uuid not null references public.shooting_results(id) on delete cascade,
  report_token text not null unique,
  report_status text not null default 'ready' check (report_status in ('ready', 'published', 'private', 'expired')),
  report_url text,
  qr_image_url text,
  published_at timestamp with time zone,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) policies
alter table public.sessions enable row level security;
alter table public.participants enable row level security;
alter table public.shooting_results enable row level security;
alter table public.reports enable row level security;

-- Admin can do everything
create policy "Admins can do everything on sessions" on public.sessions for all to authenticated using (true);
create policy "Admins can do everything on participants" on public.participants for all to authenticated using (true);
create policy "Admins can do everything on shooting_results" on public.shooting_results for all to authenticated using (true);
create policy "Admins can do everything on reports" on public.reports for all to authenticated using (true);
