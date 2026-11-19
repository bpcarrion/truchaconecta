-- PASO 4 · Ejecutar en Supabase → SQL Editor → New query → Run

-- (Solo si antes creaste otras tablas de pruebas en este mismo proyecto de Supabase)
drop view  if exists public.lotes_disponibles;
drop table if exists public.reservas, public.lotes, public.productos, public.profiles, public.dispositivos cascade;
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user() cascade;
drop function if exists public.validar_reserva() cascade;
drop function if exists public.cantidad_disponible(bigint, bigint) cascade;
drop function if exists public.is_admin() cascade;

-- Tabla del CRUD
create table public.lotes (
  id text primary key,
  codigo text not null,
  producto text not null,
  origen text not null,
  cantidad text not null,
  llegada text not null,
  creado_en timestamptz not null default now()
);

alter table public.lotes enable row level security;

grant select, insert, update, delete on public.lotes to anon;

create policy "anon puede leer" on public.lotes
  for select to anon using (true);
create policy "anon puede crear" on public.lotes
  for insert to anon with check (true);
create policy "anon puede editar" on public.lotes
  for update to anon using (true) with check (true);
create policy "anon puede eliminar" on public.lotes
  for delete to anon using (true);
