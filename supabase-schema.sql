-- اسکیما پایه برای Supabase

create table if not exists users (
  id text primary key,
  coach_id text,
  name text,
  phone text,
  age text,
  weight text,
  height text,
  gender text,
  days text,
  level text,
  activity text,
  nutritionGoals text,
  injuries jsonb,
  medicalConditions jsonb,
  plans jsonb,
  measurements jsonb,
  financial jsonb,
  created_at timestamptz default now()
);

create table if not exists templates (
  id bigint primary key,
  coach_id text,
  name text,
  workout jsonb,
  created_at timestamptz default now()
);

create table if not exists profiles (
  id uuid primary key,
  full_name text,
  role text,
  email text,
  username text unique,
  created_at timestamptz default now()
);

-- جدول شاگردان (clients) مرتبط با مربیان
create table if not exists clients (
  id text primary key,
  coach_id uuid references profiles(id) on delete cascade,
  full_name text,
  gender text,
  age text,
  height text,
  weight text,
  goal text,
  notes text,
  profile_data jsonb,
  profile_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- برنامه‌های تمرینی شاگرد
create table if not exists workout_plans (
  id text primary key,
  coach_id uuid references profiles(id) on delete cascade,
  client_id text references clients(id) on delete cascade,
  title text,
  description text,
  plan_data jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- جدول درخواست‌های برنامه از شاگردان
create table if not exists program_requests (
  id text primary key,
  client_id text not null,
  client_name text,
  coach_id text not null,
  coach_code text not null,
  request_type text default 'training',
  status text default 'pending',
  client_data jsonb,
  coach_response text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- اضافه کردن کد 5 رقمی به profiles
alter table profiles add column if not exists coach_code text unique;

