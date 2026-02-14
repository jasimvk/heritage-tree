-- Create family members table
create table if not exists public.members (
  id uuid default gen_random_uuid() primary key,
  first_name text not null,
  last_name text not null,
  birth_date date,
  death_date date,
  gender text check (gender in ('male', 'female', 'other')),
  bio text,
  avatar_url text,
  father_id uuid references public.members(id) on delete set null,
  mother_id uuid references public.members(id) on delete set null,
  spouse_id uuid references public.members(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.members enable row level security;

-- Create policy to allow all users to read (public tree)
create policy "Allow public read access" on public.members
  for select using (true);

-- Create policy to allow all users to insert (collaborative)
create policy "Allow anonymous insert" on public.members
  for insert with check (true);

-- Create policy to allow all users to update
create policy "Allow anonymous update" on public.members
  for update using (true);
