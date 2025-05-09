-- User companies & sites
create table organizations (
  id uuid primary key default uuid_generate_v4(),
  name text,
  created_at timestamptz default now()
);

-- Each user's quiz instance
create table assessments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  org_id uuid references organizations(id),
  created_at timestamptz default now(),
  priorities jsonb,        -- ranking of cost/quality/safety/delivery/etc.
  maturity jsonb,          -- answers to readiness questions
  fin_inputs jsonb,        -- optional detailed cost figures
  results jsonb            -- cached roadmap & ROI calcs
);

-- Benchmark lookup (editable in /admin)
create table benchmarks (
  id serial primary key,
  category text,             -- e.g. 'downtime', 'scrap', 'energy'
  low numeric, med numeric, high numeric -- % improvement bands
);

-- Library of tech solutions
create table technologies (
  id serial primary key,
  name text,
  pillar text,               -- SIRI pillar or business area
  description text,
  vendor_examples text[]
);

-- Add Row Level Security (RLS) policies
alter table assessments enable row level security;

-- Users can only read their own assessments
create policy "Users can view their own assessments"
  on assessments for select
  using (auth.uid() = user_id);

-- Users can only insert their own assessments
create policy "Users can insert their own assessments"
  on assessments for insert
  with check (auth.uid() = user_id);

-- Seed data for benchmarks
insert into benchmarks (category, low, med, high) values
  ('Downtime', 5, 15, 30),
  ('Scrap', 3, 8, 15),
  ('Energy', 2, 6, 10); 