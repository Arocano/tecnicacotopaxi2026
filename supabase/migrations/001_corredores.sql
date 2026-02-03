-- Tabla corredores (reemplaza la colección Firestore "corredores")
create table if not exists public.corredores (
  id uuid primary key default gen_random_uuid(),
  nombres text not null,
  apellidos text not null,
  email text not null,
  telefono text,
  camiseta text,
  cedula text not null,
  num_comprobante text,
  categoria text,
  nacimiento text,
  genero text,
  comprobante text,
  utc text default 'no',
  carrera text,
  ciclismo text,
  rifa text,
  competencia text,
  created_at timestamptz default now()
);

-- Índices para consultas frecuentes
create index if not exists idx_corredores_cedula on public.corredores (cedula);
create index if not exists idx_corredores_created_at on public.corredores (created_at desc);
create index if not exists idx_corredores_utc on public.corredores (utc);

-- RLS: permitir lectura/escritura con anon key (ajusta después con Auth si quieres restringir)
alter table public.corredores enable row level security;

create policy "Allow all for anon" on public.corredores
  for all using (true) with check (true);

-- Storage: crear bucket "comprobantes" desde Dashboard > Storage:
-- 1. New bucket > nombre "comprobantes"
-- 2. Marcar "Public bucket" para que getPublicUrl funcione
-- 3. En Policies del bucket: "New policy" > "For full customization" >
--    - ALLOW INSERT para anon/authenticated según prefieras (ej. role anon)
--    - ALLOW SELECT para anon (lectura pública de comprobantes)
