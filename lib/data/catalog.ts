import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Professional, Service, ShopSettings } from "@/lib/data/types";

export type { Service, Professional, ShopSettings } from "@/lib/data/types";
export { formatMoney } from "@/lib/data/types";

const WEEKDAY_NAMES = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

function formatTime(t: string) {
  return t.slice(0, 5).replace(":", "h");
}

function formatHoursLabel(
  hours: { weekday: number; start_time: string; end_time: string }[],
): string {
  if (hours.length === 0) return "Consulte disponibilidade";
  const sorted = [...hours].sort((a, b) => a.weekday - b.weekday);
  const first = WEEKDAY_NAMES[sorted[0].weekday];
  const last = WEEKDAY_NAMES[sorted[sorted.length - 1].weekday];
  const range =
    sorted.length > 1 && sorted[0].weekday !== sorted[sorted.length - 1].weekday
      ? `${first} a ${last}`
      : first;
  return `${range} · ${formatTime(sorted[0].start_time)}–${formatTime(sorted[0].end_time)}`;
}

export async function getServices(): Promise<Service[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("id, name, description, price, duration_minutes, icon")
    .eq("active", true)
    .order("sort_order");

  if (error) throw new Error(error.message);

  return (data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description ?? "",
    price: Number(s.price),
    durationMinutes: s.duration_minutes,
    icon: s.icon ?? "✦",
  }));
}

export async function getProfessionals(): Promise<Professional[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("professionals")
    .select(
      "id, full_name, initials, specialty, rating, professional_hours(weekday, start_time, end_time)",
    )
    .eq("active", true);

  if (error) throw new Error(error.message);

  return (data ?? []).map((p) => ({
    id: p.id,
    fullName: p.full_name,
    initials: p.initials ?? p.full_name.slice(0, 2).toUpperCase(),
    specialty: p.specialty ?? "",
    rating: Number(p.rating).toFixed(1),
    hoursLabel: formatHoursLabel(p.professional_hours ?? []),
  }));
}

export async function getShopSettings(): Promise<ShopSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("shop_settings")
    .select("name, whatsapp, city, email")
    .eq("id", 1)
    .single();

  if (error) throw new Error(error.message);

  return {
    name: data.name,
    whatsapp: data.whatsapp ?? "",
    city: data.city ?? "",
    email: data.email ?? "",
  };
}
