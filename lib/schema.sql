create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  display_name text not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_type where typname = 'species') then
    create type species as enum ('llama', 'alpaca');
  end if;
  if not exists (select 1 from pg_type where typname = 'image_status') then
    create type image_status as enum ('pending', 'approved', 'rejected');
  end if;
  if not exists (select 1 from pg_type where typname = 'image_source') then
    create type image_source as enum ('seed', 'user');
  end if;
end
$$;

create table if not exists images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  species species not null,
  status image_status not null default 'pending',
  source image_source not null default 'user',
  uploader_id uuid references users(id) on delete set null,
  attribution_name text,
  attribution_url text,
  license text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references users(id) on delete set null
);

create index if not exists images_status_species_idx on images (status, species);
create index if not exists images_uploader_idx on images (uploader_id);
