-- Bigode Grosso — schema inicial
-- Convenções: uuid como PK (default gen_random_uuid(), extensão pgcrypto
-- já vem habilitada por padrão nos projetos Supabase), timestamps em UTC.

-- ============================================================
-- TABELAS
-- ============================================================

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'owner' check (role = 'owner'),
  full_name text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table shop_settings (
  id smallint primary key default 1 check (id = 1),
  name text not null,
  whatsapp text,
  city text,
  email text,
  business_hours jsonb not null default '{}'::jsonb,
  notification_prefs jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  duration_minutes int not null check (duration_minutes > 0),
  icon text,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table professionals (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  initials text,
  specialty text,
  rating numeric(2, 1) not null default 5.0,
  avatar_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table professional_hours (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references professionals (id) on delete cascade,
  weekday int not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null check (end_time > start_time),
  unique (professional_id, weekday)
);

create table professional_services (
  professional_id uuid not null references professionals (id) on delete cascade,
  service_id uuid not null references services (id) on delete cascade,
  primary key (professional_id, service_id)
);

create table customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null unique,
  email text,
  notes text,
  tag text not null default 'Novo' check (tag in ('VIP', 'Recorrente', 'Inativo', 'Novo')),
  favorite_professional_id uuid references professionals (id),
  created_at timestamptz not null default now()
);

create table appointments (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers (id) on delete cascade,
  service_id uuid not null references services (id),
  professional_id uuid not null references professionals (id),
  scheduled_date date not null,
  scheduled_time time not null,
  duration_minutes int not null,
  price numeric(10, 2) not null,
  status text not null default 'Agendado'
    check (status in ('Agendado', 'Confirmado', 'Em atendimento', 'Concluído', 'Cancelado')),
  booking_code text not null unique,
  notes text,
  created_at timestamptz not null default now(),
  unique (professional_id, scheduled_date, scheduled_time)
);

create index appointments_date_idx on appointments (scheduled_date);
create index appointments_customer_idx on appointments (customer_id);

create table stock_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  unit text not null default 'un.',
  quantity numeric not null default 0,
  min_quantity numeric not null default 0,
  sale_price numeric(10, 2),
  status text generated always as (
    case
      when quantity <= min_quantity * 0.5 then 'Crítico'
      when quantity <= min_quantity then 'Baixo'
      else 'Normal'
    end
  ) stored
);

create table stock_movements (
  id uuid primary key default gen_random_uuid(),
  stock_item_id uuid not null references stock_items (id) on delete cascade,
  type text not null check (type in ('Entrada', 'Saída', 'Perda')),
  quantity numeric not null,
  note text,
  created_at timestamptz not null default now()
);

create table expenses (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  amount numeric(10, 2) not null,
  category text,
  expense_date date not null default current_date,
  created_at timestamptz not null default now()
);

-- ============================================================
-- VIEW: estatísticas de cliente (evita colunas duplicadas/desatualizadas)
-- ============================================================

create view v_customer_stats
with (security_invoker = true)
as
select
  c.id as customer_id,
  max(a.scheduled_date) filter (where a.scheduled_date <= current_date) as last_visit,
  min(a.scheduled_date) filter (where a.scheduled_date > current_date) as next_visit,
  coalesce(sum(a.price) filter (where a.status = 'Concluído'), 0) as total_spent,
  count(*) filter (where a.status = 'Concluído') as visit_count
from customers c
left join appointments a on a.customer_id = c.id
group by c.id;

-- ============================================================
-- FUNÇÃO AUXILIAR DE AUTORIZAÇÃO
-- ============================================================

create or replace function is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'owner'
  );
$$;

-- ============================================================
-- RPCs públicas (chamadas pelo fluxo de agendamento, sem exigir login)
-- ============================================================

create or replace function get_available_slots(
  p_professional_id uuid,
  p_date date,
  p_duration_minutes int
)
returns table (slot_time time)
language sql
stable
security definer
set search_path = public
as $$
  with hours as (
    select start_time, end_time
    from professional_hours
    where professional_id = p_professional_id
      and weekday = extract(dow from p_date)::int
  ),
  candidates as (
    select generate_series(
      p_date + h.start_time,
      p_date + h.end_time - (p_duration_minutes || ' minutes')::interval,
      interval '30 minutes'
    )::time as slot_time
    from hours h
  ),
  busy as (
    select scheduled_time, duration_minutes
    from appointments
    where professional_id = p_professional_id
      and scheduled_date = p_date
      and status <> 'Cancelado'
  )
  select c.slot_time
  from candidates c
  where p_date > current_date
     or (p_date = current_date and c.slot_time > current_time)
  order by c.slot_time;
$$;

create or replace function book_appointment(
  p_customer_name text,
  p_customer_phone text,
  p_customer_email text,
  p_service_id uuid,
  p_professional_id uuid,
  p_date date,
  p_time time,
  p_notes text default null
)
returns table (booking_code text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
  v_service services%rowtype;
  v_code text;
begin
  select * into v_service from services where id = p_service_id and active = true;
  if not found then
    raise exception 'Serviço inválido ou indisponível.';
  end if;

  insert into customers (full_name, phone, email)
  values (p_customer_name, p_customer_phone, nullif(p_customer_email, ''))
  on conflict (phone) do update set full_name = excluded.full_name
  returning id into v_customer_id;

  v_code := 'BG-' || lpad((floor(random() * 9000) + 1000)::text, 4, '0');

  insert into appointments (
    customer_id, service_id, professional_id, scheduled_date, scheduled_time,
    duration_minutes, price, status, booking_code, notes
  ) values (
    v_customer_id, p_service_id, p_professional_id, p_date, p_time,
    v_service.duration_minutes, v_service.price, 'Agendado', v_code, p_notes
  );

  return query select v_code;
exception
  when unique_violation then
    raise exception 'Esse horário acabou de ser reservado por outra pessoa. Escolha outro horário.';
end;
$$;

create or replace function get_my_appointments(p_phone text, p_booking_code text)
returns table (
  id uuid,
  service_name text,
  professional_name text,
  scheduled_date date,
  scheduled_time time,
  price numeric,
  status text
)
language sql
stable
security definer
set search_path = public
as $$
  select a.id, s.name, p.full_name, a.scheduled_date, a.scheduled_time, a.price, a.status
  from customers c
  join appointments a on a.customer_id = c.id
  join services s on s.id = a.service_id
  join professionals p on p.id = a.professional_id
  where c.phone = p_phone
    and exists (
      select 1 from appointments a2
      where a2.customer_id = c.id and a2.booking_code = p_booking_code
    )
  order by a.scheduled_date desc, a.scheduled_time desc;
$$;

grant execute on function get_available_slots to anon, authenticated;
grant execute on function book_appointment to anon, authenticated;
grant execute on function get_my_appointments to anon, authenticated;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table profiles enable row level security;
alter table shop_settings enable row level security;
alter table services enable row level security;
alter table professionals enable row level security;
alter table professional_hours enable row level security;
alter table professional_services enable row level security;
alter table customers enable row level security;
alter table appointments enable row level security;
alter table stock_items enable row level security;
alter table stock_movements enable row level security;
alter table expenses enable row level security;

-- profiles: cada dono só enxerga/edita o próprio registro
create policy "owner reads own profile" on profiles for select using (id = auth.uid());
create policy "owner updates own profile" on profiles for update using (id = auth.uid());

-- shop_settings: leitura pública, escrita só do dono
create policy "public reads shop settings" on shop_settings for select using (true);
create policy "owner manages shop settings" on shop_settings for update using (is_owner());

-- catálogo: leitura pública (ativos), CRUD completo só do dono
create policy "public reads active services" on services for select using (active = true or is_owner());
create policy "owner manages services" on services for all using (is_owner()) with check (is_owner());

create policy "public reads active professionals" on professionals for select using (active = true or is_owner());
create policy "owner manages professionals" on professionals for all using (is_owner()) with check (is_owner());

create policy "public reads professional hours" on professional_hours for select using (true);
create policy "owner manages professional hours" on professional_hours for all using (is_owner()) with check (is_owner());

create policy "public reads professional services" on professional_services for select using (true);
create policy "owner manages professional services" on professional_services for all using (is_owner()) with check (is_owner());

-- dados sensíveis: nenhum acesso direto para anon/authenticated não-dono.
-- O público só chega a customers/appointments via as RPCs security definer acima.
create policy "owner manages customers" on customers for all using (is_owner()) with check (is_owner());
create policy "owner manages appointments" on appointments for all using (is_owner()) with check (is_owner());
create policy "owner manages stock items" on stock_items for all using (is_owner()) with check (is_owner());
create policy "owner manages stock movements" on stock_movements for all using (is_owner()) with check (is_owner());
create policy "owner manages expenses" on expenses for all using (is_owner()) with check (is_owner());
