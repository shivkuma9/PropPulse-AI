-- PropPulse AI - Complete Supabase (PostgreSQL) Schema
-- Run this in Supabase Dashboard -> SQL Editor

create extension if not exists "uuid-ossp";

create table if not exists public.employees (
  id text primary key,
  name text not null,
  email text,
  mobile text,
  department text,
  designation text,
  role text not null default 'Sales Executive',
  status text not null default 'Active',
  created_at timestamptz default now()
);

create table if not exists public.leads (
  id text primary key,
  date text not null,
  assign_to text,
  name text not null,
  mobile text not null,
  email text,
  business_type text not null default 'Residential',
  category text,
  subcategory text,
  residential_structure text,
  budget_range text,
  project_requirement text,
  source text,
  status text not null default 'New',
  priority text not null default 'Medium',
  next_follow_up text,
  visit_done boolean default false,
  deal_done boolean default false,
  special_notes text,
  created_at timestamptz default now()
);

create table if not exists public.opportunities (
  id text primary key,
  lead_id text,
  lead_date text,
  qualify_date text,
  assign_to text,
  name text not null,
  mobile text,
  project_or_property text,
  business_type text not null default 'Residential',
  estimated_value numeric default 0,
  status text not null default 'Open',
  stage text not null default 'Qualification',
  lost_reason text default '',
  next_follow_up text,
  special_notes text,
  created_at timestamptz default now()
);

create table if not exists public.projects (
  id text primary key,
  name text not null,
  developer text,
  stage text,
  category text not null default 'Residential',
  segment text,
  specification text,
  availability text default 'Available',
  total_area numeric default 0,
  area_unit text default 'Sq. Ft.',
  package_price numeric default 0,
  package_contents text,
  rate_of_land numeric default 0,
  loan_amount numeric default 0,
  rera_registered boolean default false,
  rera_number text,
  development_authority text,
  electricity_provider text,
  bank_tie_up text,
  amenities jsonb default '[]'::jsonb,
  livability text,
  city text,
  area text,
  address text,
  lat double precision default 23.0338,
  lng double precision default 72.5082,
  commission_method text default 'Percentage',
  commission_value numeric default 2.0,
  bank_details jsonb default '[]'::jsonb,
  share_email boolean default true,
  share_sms boolean default true,
  terms text,
  created_at text
);

create table if not exists public.properties (
  id text primary key,
  project_id text,
  project_name text,
  transaction_type text not null default 'Sale',
  category text not null default 'Residential',
  subcategory text,
  property_type text,
  residential_structure text,
  floor text,
  furnished text,
  door_facing text,
  unit_no text,
  building_block text,
  carpet_area numeric default 0,
  super_built_up_area numeric default 0,
  area_unit text default 'Sq. Ft.',
  price numeric default 0,
  other_charges numeric default 0,
  representative text,
  owner_name text,
  owner_mobile text,
  contact_type text,
  country text default 'India',
  state text default 'Gujarat',
  city text default 'Ahmedabad',
  area text,
  address text,
  landmark text,
  pincode text,
  lat double precision default 23.034,
  lng double precision default 72.508,
  possession_status text,
  status text not null default 'Active',
  source text,
  window_view text,
  commission_method text default 'Percentage',
  commission_value numeric default 2.0,
  bank_details jsonb default '[]'::jsonb,
  documents jsonb default '[]'::jsonb,
  created_at text
);

create table if not exists public.customers (
  id text primary key,
  name text not null,
  mobile text,
  email text,
  customer_type text,
  profession text,
  city text,
  total_deals integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.deals (
  id text primary key,
  customer_name text not null,
  property_title text not null,
  transaction_type text not null default 'Sale',
  deal_value numeric default 0,
  commission_amount numeric default 0,
  executive text,
  closed_date text,
  status text not null default 'In Progress',
  created_at timestamptz default now()
);

create table if not exists public.expansion_signals (
  id text primary key,
  company_id text,
  company_name text not null,
  sector text not null,
  signal_type text not null,
  confidence text not null default 'Medium',
  neighborhood text,
  city text,
  title text not null,
  summary text,
  source_name text,
  detected_at text,
  created_at timestamptz default now()
);

create table if not exists public.watchlists (
  id text primary key,
  name text not null,
  type text not null,
  target text not null,
  city text,
  alerts_enabled boolean default true,
  created_at text
);

create table if not exists public.alerts (
  id text primary key,
  title text not null,
  message text,
  severity text default 'Info',
  module text default 'CRM',
  timestamp text,
  read boolean default false
);

-- Enable Row Level Security (open policy for initial setup; tighten with Supabase Auth when ready)
alter table public.employees enable row level security;
alter table public.leads enable row level security;
alter table public.opportunities enable row level security;
alter table public.projects enable row level security;
alter table public.properties enable row level security;
alter table public.customers enable row level security;
alter table public.deals enable row level security;
alter table public.expansion_signals enable row level security;
alter table public.watchlists enable row level security;
alter table public.alerts enable row level security;

do $$
declare
  tbl text;
begin
  for tbl in select unnest(array[
    'employees','leads','opportunities','projects','properties',
    'customers','deals','expansion_signals','watchlists','alerts'
  ])
  loop
    execute format('drop policy if exists "Allow all for anon" on public.%I', tbl);
    execute format('create policy "Allow all for anon" on public.%I for all using (true) with check (true)', tbl);
  end loop;
end $$;
