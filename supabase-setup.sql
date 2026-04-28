-- Users table
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  email text not null unique,
  role text not null default 'viewer' check (role in ('author', 'viewer', 'admin'))
);

-- Posts table
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  body text not null,
  image_url text,
  summary text,
  author_id uuid references public.users(id) on delete cascade not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Comments table
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  comment_text text not null,
  created_at timestamptz default now()
);

-- RLS setup
alter table public.users enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;

-- Policies
create policy "Anyone can read users" on public.users for select using (true);
create policy "Users can update their own row" on public.users for update using (auth.uid() = id);

create policy "Anyone can read posts" on public.posts for select using (true);
create policy "Authors and admins can insert posts" on public.posts for insert with check (
  exists (select 1 from public.users where id = auth.uid() and role in ('author', 'admin'))
);
create policy "Authors can update own posts" on public.posts for update using (
  auth.uid() = author_id and exists (select 1 from public.users where id = auth.uid() and role = 'author')
);
create policy "Admins can update any post" on public.posts for update using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

create policy "Authors and admins can delete posts" on public.posts for delete using (
  auth.uid() = author_id OR 
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

create policy "Anyone can read comments" on public.comments for select using (true);
create policy "Authenticated users can insert comments" on public.comments for insert with check (auth.uid() is not null);
create policy "Users can delete own comments" on public.comments for delete using (auth.uid() = user_id);
create policy "Admins can delete any comment" on public.comments for delete using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- Note: Ensure to create a storage bucket named 'post-images' and set it to public.
-- You can do this via the Supabase Dashboard or by running the following SQL:

-- Create the bucket
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

-- Set up access control for storage
-- Allow public access to images
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'post-images' );

-- Allow authenticated users to upload images
create policy "Authenticated users can upload images"
on storage.objects for insert
with check (
  bucket_id = 'post-images' AND
  auth.role() = 'authenticated'
);

-- Trigger for automatically inserting a user into public.users after signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, name, email, role)
  values (new.id, new.raw_user_meta_data->>'name', new.email, coalesce(new.raw_user_meta_data->>'role', 'viewer'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
