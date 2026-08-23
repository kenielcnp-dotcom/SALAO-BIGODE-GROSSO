import "server-only";
import { createClient } from "@/lib/supabase/server";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function firstOfMonthISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

export type TodayAppointment = {
  id: string;
  time: string;
  customerName: string;
  serviceName: string;
  professionalName: string;
  status: string;
};

export async function getDashboardData() {
  const supabase = await createClient();
  const today = todayISO();
  const monthStart = firstOfMonthISO();

  const [todayRes, monthRes, customersRes, stockRes, servicesCountRes] =
    await Promise.all([
      supabase
        .from("appointments")
        .select(
          "id, scheduled_time, status, price, customers(full_name), services(name), professionals(full_name)",
        )
        .eq("scheduled_date", today)
        .neq("status", "Cancelado")
        .order("scheduled_time"),
      supabase
        .from("appointments")
        .select("scheduled_date, price, status, service_id, services(name)")
        .gte("scheduled_date", monthStart)
        .lte("scheduled_date", today)
        .neq("status", "Cancelado"),
      supabase.from("customers").select("id", { count: "exact", head: true }),
      supabase
        .from("stock_items")
        .select("id, name, status")
        .in("status", ["Crítico", "Baixo"])
        .order("status"),
      Promise.resolve(null),
    ]);

  if (todayRes.error) throw new Error(todayRes.error.message);
  if (monthRes.error) throw new Error(monthRes.error.message);
  if (customersRes.error) throw new Error(customersRes.error.message);
  if (stockRes.error) throw new Error(stockRes.error.message);

  type TodayRow = {
    id: string;
    scheduled_time: string;
    status: string;
    price: number;
    customers: { full_name: string } | null;
    services: { name: string } | null;
    professionals: { full_name: string } | null;
  };

  const todayAppointments: TodayAppointment[] = (
    (todayRes.data ?? []) as unknown as TodayRow[]
  ).map((a) => ({
    id: a.id,
    time: a.scheduled_time.slice(0, 5),
    customerName: a.customers?.full_name ?? "—",
    serviceName: a.services?.name ?? "—",
    professionalName: a.professionals?.full_name ?? "—",
    status: a.status,
  }));

  type MonthRow = {
    scheduled_date: string;
    price: number;
    services: { name: string } | null;
  };
  const monthRows = (monthRes.data ?? []) as unknown as MonthRow[];

  const todayRevenueTotal = monthRows
    .filter((m) => m.scheduled_date === today)
    .reduce((sum, m) => sum + Number(m.price), 0);
  const monthRevenue = monthRows.reduce((sum, m) => sum + Number(m.price), 0);

  const byDay = new Map<string, number>();
  for (const m of monthRows) {
    byDay.set(m.scheduled_date, (byDay.get(m.scheduled_date) ?? 0) + Number(m.price));
  }
  const chartPoints = Array.from(byDay.entries()).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  const byService = new Map<string, number>();
  for (const m of monthRows) {
    const name = m.services?.name ?? "Outro";
    byService.set(name, (byService.get(name) ?? 0) + 1);
  }
  const topServices = Array.from(byService.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return {
    todayAppointments,
    todayCount: todayAppointments.length,
    todayRevenue: todayRevenueTotal,
    monthRevenue,
    customersCount: customersRes.count ?? 0,
    stockAlerts: stockRes.data ?? [],
    chartPoints,
    topServices,
  };
}

export type AgendaAppointment = {
  id: string;
  time: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  professionalName: string;
  status: string;
};

export async function getAgendaAppointments(
  date: string,
): Promise<AgendaAppointment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .select(
      "id, scheduled_time, status, customers(full_name, phone), services(name), professionals(full_name)",
    )
    .eq("scheduled_date", date)
    .order("scheduled_time");

  if (error) throw new Error(error.message);

  type Row = {
    id: string;
    scheduled_time: string;
    status: string;
    customers: { full_name: string; phone: string } | null;
    services: { name: string } | null;
    professionals: { full_name: string } | null;
  };

  return ((data ?? []) as unknown as Row[]).map((a) => ({
    id: a.id,
    time: a.scheduled_time.slice(0, 5),
    customerName: a.customers?.full_name ?? "—",
    customerPhone: a.customers?.phone ?? "",
    serviceName: a.services?.name ?? "—",
    professionalName: a.professionals?.full_name ?? "—",
    status: a.status,
  }));
}

export type AdminCustomer = {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  tag: string;
  lastVisit: string | null;
  nextVisit: string | null;
  totalSpent: number;
  visitCount: number;
  favoriteProfessional: string | null;
};

export async function getCustomers(): Promise<AdminCustomer[]> {
  const supabase = await createClient();

  // v_customer_stats é uma view (sem FK detectável pelo PostgREST), então
  // não dá pra "embutir" ela no select de customers — busca-se à parte e
  // junta em código.
  const [customersRes, statsRes] = await Promise.all([
    supabase
      .from("customers")
      .select("id, full_name, phone, email, tag, professionals(full_name)")
      .order("full_name"),
    supabase
      .from("v_customer_stats")
      .select("customer_id, last_visit, next_visit, total_spent, visit_count"),
  ]);

  if (customersRes.error) throw new Error(customersRes.error.message);
  if (statsRes.error) throw new Error(statsRes.error.message);

  type CustomerRow = {
    id: string;
    full_name: string;
    phone: string;
    email: string | null;
    tag: string;
    professionals: { full_name: string } | { full_name: string }[] | null;
  };
  type StatsRow = {
    customer_id: string;
    last_visit: string | null;
    next_visit: string | null;
    total_spent: number;
    visit_count: number;
  };

  const statsByCustomer = new Map(
    ((statsRes.data ?? []) as unknown as StatsRow[]).map((s) => [s.customer_id, s]),
  );

  return ((customersRes.data ?? []) as unknown as CustomerRow[]).map((c) => {
    const stats = statsByCustomer.get(c.id);
    const pro = Array.isArray(c.professionals) ? c.professionals[0] : c.professionals;
    return {
      id: c.id,
      fullName: c.full_name,
      phone: c.phone,
      email: c.email,
      tag: c.tag,
      favoriteProfessional: pro?.full_name ?? null,
      lastVisit: stats?.last_visit ?? null,
      nextVisit: stats?.next_visit ?? null,
      totalSpent: Number(stats?.total_spent ?? 0),
      visitCount: Number(stats?.visit_count ?? 0),
    };
  });
}

export async function getStockItems() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stock_items")
    .select("id, name, category, unit, quantity, min_quantity, sale_price, status")
    .order("name");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export type StockMovement = {
  id: string;
  type: string;
  quantity: number;
  note: string | null;
  createdAt: string;
  itemName: string;
};

export async function getStockMovements(): Promise<StockMovement[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stock_movements")
    .select("id, type, quantity, note, created_at, stock_items(name)")
    .order("created_at", { ascending: false })
    .limit(10);
  if (error) throw new Error(error.message);

  type Row = {
    id: string;
    type: string;
    quantity: number;
    note: string | null;
    created_at: string;
    stock_items: { name: string } | { name: string }[] | null;
  };

  return ((data ?? []) as unknown as Row[]).map((m) => {
    const item = Array.isArray(m.stock_items) ? m.stock_items[0] : m.stock_items;
    return {
      id: m.id,
      type: m.type,
      quantity: Number(m.quantity),
      note: m.note,
      createdAt: m.created_at,
      itemName: item?.name ?? "—",
    };
  });
}

export async function getExpenses() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("expenses")
    .select("id, description, amount, category, expense_date")
    .order("expense_date", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getShopSettingsAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("shop_settings")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) throw new Error(error.message);
  return data;
}
