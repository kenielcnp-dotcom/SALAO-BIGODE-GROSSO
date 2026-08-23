-- Vincula o usuário criado manualmente no Supabase Auth como dono do sistema.
-- Idempotente: pode rodar de novo sem duplicar.
insert into profiles (id, full_name, role)
select
  id,
  coalesce(raw_user_meta_data ->> 'full_name', split_part(email, '@', 1)),
  'owner'
from auth.users
where email = 'kenielcnp@gmail.com'
on conflict (id) do update set role = 'owner';
