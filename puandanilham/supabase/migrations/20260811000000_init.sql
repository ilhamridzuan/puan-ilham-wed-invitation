-- ─── Tables ────────────────────────────────────────────────────────────────

create table public.rsvps (
  id           uuid        primary key default gen_random_uuid(),
  name         text        not null,
  attendance   text        not null check (attendance in ('hadir', 'tidak_hadir')),
  guest_count  integer     not null check (guest_count >= 1 and guest_count <= 10),
  created_at   timestamptz not null default now()
);

create table public.wishes (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  message     text        not null,
  created_at  timestamptz not null default now()
);

-- ─── Row Level Security ────────────────────────────────────────────────────

alter table public.rsvps  enable row level security;
alter table public.wishes enable row level security;

-- Guests: insert-only (anon, no read/edit/delete)
create policy "guests_insert_rsvps"
  on public.rsvps for insert to anon with check (true);

-- Guests: insert + read wishes (for real-time display)
create policy "guests_insert_wishes"
  on public.wishes for insert to anon with check (true);

create policy "anyone_read_wishes"
  on public.wishes for select to anon using (true);

-- Authenticated admin: full CRUD on rsvps
create policy "admin_manage_rsvps"
  on public.rsvps for all to authenticated using (true) with check (true);

-- ─── Realtime ─────────────────────────────────────────────────────────────

alter publication supabase_realtime add table public.wishes;
