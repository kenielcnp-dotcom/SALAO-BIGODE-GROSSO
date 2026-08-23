-- Catálogo real inicial (substitui os dados que hoje estão mockados no
-- front-end). Roda uma única vez — migrations não são reaplicadas.

insert into shop_settings (id, name, whatsapp, city, email, business_hours)
values (
  1,
  'Barbearia Bigode Grosso',
  '(65) 98408-4009',
  'Campo Novo do Parecis — MT',
  'contato@bigodegrosso.com',
  '{"segunda_a_sabado": "08:00-20:00", "domingo": "fechado"}'::jsonb
);

insert into services (name, description, price, duration_minutes, icon, sort_order) values
  ('Corte de Cabelo', 'Precisão, estilo e acabamento impecável.', 60, 45, '✂', 1),
  ('Barba', 'Ritual completo com toalha quente.', 50, 30, '♜', 2),
  ('Visagismo Personalizado', 'Imagem alinhada ao seu estilo.', 80, 60, '◈', 3),
  ('Corte + Barba', 'A experiência Bigode Grosso completa.', 100, 75, '✦', 4),
  ('Designer de Sobrancelha', 'Harmonia e definição no olhar.', 40, 30, '⌁', 5);

insert into professionals (full_name, initials, specialty, rating) values
  ('João Oliveira', 'JO', 'Visagismo & Navalha', 4.9),
  ('Carlos Mendes', 'CM', 'Degradê & Barba', 4.8),
  ('Rafael Lima', 'RL', 'Cortes clássicos', 4.9);

-- Horários de atendimento por profissional (weekday: 0=domingo..6=sábado)
insert into professional_hours (professional_id, weekday, start_time, end_time)
select p.id, wd, sched.start_time, sched.end_time
from (values
  ('João Oliveira', 1, 6, '08:00'::time, '18:00'::time),
  ('Carlos Mendes', 2, 6, '10:00'::time, '20:00'::time),
  ('Rafael Lima',   1, 6, '09:00'::time, '19:00'::time)
) as sched(full_name, wd_from, wd_to, start_time, end_time)
join professionals p on p.full_name = sched.full_name
cross join lateral generate_series(sched.wd_from, sched.wd_to) as wd;

-- Todos os 3 profissionais atendem os 5 serviços (ajustar depois pelo admin
-- se algum profissional não realizar determinado serviço).
insert into professional_services (professional_id, service_id)
select p.id, s.id from professionals p cross join services s;
