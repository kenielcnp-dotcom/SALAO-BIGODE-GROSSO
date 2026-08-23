import { NextResponse } from "next/server";
import { getOwnerUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  // Route Handlers são endpoints independentes — não herdam a proteção do
  // layout de /admin, então reverificam por conta própria (mesma regra dos
  // Server Actions, ver lib/auth.ts).
  const user = await getOwnerUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .select(
      "scheduled_date, scheduled_time, price, status, customers(full_name), services(name), professionals(full_name)",
    )
    .order("scheduled_date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  type Row = {
    scheduled_date: string;
    scheduled_time: string;
    price: number;
    status: string;
    customers: { full_name: string } | null;
    services: { name: string } | null;
    professionals: { full_name: string } | null;
  };

  const header = ["Data", "Hora", "Cliente", "Serviço", "Profissional", "Valor", "Status"];
  const lines = [header.join(",")];

  for (const row of (data ?? []) as unknown as Row[]) {
    lines.push(
      [
        row.scheduled_date,
        row.scheduled_time.slice(0, 5),
        row.customers?.full_name ?? "",
        row.services?.name ?? "",
        row.professionals?.full_name ?? "",
        String(row.price),
        row.status,
      ]
        .map((v) => csvEscape(String(v)))
        .join(","),
    );
  }

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="atendimentos.csv"`,
    },
  });
}
