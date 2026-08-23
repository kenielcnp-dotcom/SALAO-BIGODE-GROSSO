"use server";

import { revalidatePath } from "next/cache";
import { requireOwnerAction } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const STATUS_FLOW = [
  "Agendado",
  "Confirmado",
  "Em atendimento",
  "Concluído",
] as const;

export async function advanceAppointmentStatus(id: string, currentStatus: string) {
  await requireOwnerAction();
  const idx = STATUS_FLOW.indexOf(currentStatus as (typeof STATUS_FLOW)[number]);
  const next = idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : STATUS_FLOW[0];

  const supabase = await createClient();
  const { error } = await supabase
    .from("appointments")
    .update({ status: next })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/agenda");
}

export async function cancelAppointment(id: string) {
  await requireOwnerAction();
  const supabase = await createClient();
  const { error } = await supabase
    .from("appointments")
    .update({ status: "Cancelado" })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/admin/agenda");
}

export async function createManualAppointment(input: {
  customerName: string;
  customerPhone: string;
  serviceId: string;
  professionalId: string;
  date: string;
  time: string;
}) {
  await requireOwnerAction();
  const supabase = await createClient();

  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("price, duration_minutes")
    .eq("id", input.serviceId)
    .single();
  if (serviceError) throw new Error(serviceError.message);

  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .upsert(
      { full_name: input.customerName, phone: input.customerPhone },
      { onConflict: "phone" },
    )
    .select("id")
    .single();
  if (customerError) throw new Error(customerError.message);

  const bookingCode = "BG-" + String(Math.floor(1000 + Math.random() * 8999));

  const { error } = await supabase.from("appointments").insert({
    customer_id: customer.id,
    service_id: input.serviceId,
    professional_id: input.professionalId,
    scheduled_date: input.date,
    scheduled_time: input.time,
    duration_minutes: service.duration_minutes,
    price: service.price,
    status: "Agendado",
    booking_code: bookingCode,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/agenda");
}

export async function updateCustomerTag(id: string, tag: string) {
  await requireOwnerAction();
  const supabase = await createClient();
  const { error } = await supabase
    .from("customers")
    .update({ tag })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/clientes");
}

export async function createService(input: {
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
}) {
  await requireOwnerAction();
  const supabase = await createClient();
  const { error } = await supabase.from("services").insert({
    name: input.name,
    description: input.description,
    price: input.price,
    duration_minutes: input.durationMinutes,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/servicos");
  revalidatePath("/servicos");
  revalidatePath("/");
}

export async function toggleServiceActive(id: string, active: boolean) {
  await requireOwnerAction();
  const supabase = await createClient();
  const { error } = await supabase
    .from("services")
    .update({ active })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/servicos");
  revalidatePath("/servicos");
  revalidatePath("/");
}

export async function createProfessional(input: {
  fullName: string;
  specialty: string;
  initials: string;
}) {
  await requireOwnerAction();
  const supabase = await createClient();
  const { error } = await supabase.from("professionals").insert({
    full_name: input.fullName,
    specialty: input.specialty,
    initials: input.initials || input.fullName.slice(0, 2).toUpperCase(),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/profissionais");
  revalidatePath("/profissionais");
}

export async function toggleProfessionalActive(id: string, active: boolean) {
  await requireOwnerAction();
  const supabase = await createClient();
  const { error } = await supabase
    .from("professionals")
    .update({ active })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/profissionais");
  revalidatePath("/profissionais");
}

export async function createStockItem(input: {
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  salePrice: number;
}) {
  await requireOwnerAction();
  const supabase = await createClient();
  const { error } = await supabase.from("stock_items").insert({
    name: input.name,
    category: input.category,
    quantity: input.quantity,
    min_quantity: input.minQuantity,
    sale_price: input.salePrice,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/estoque");
  revalidatePath("/admin/produtos");
}

export async function recordStockMovement(input: {
  stockItemId: string;
  type: "Entrada" | "Saída" | "Perda";
  quantity: number;
  note: string;
}) {
  await requireOwnerAction();
  const supabase = await createClient();

  const { error: moveError } = await supabase.from("stock_movements").insert({
    stock_item_id: input.stockItemId,
    type: input.type,
    quantity: input.quantity,
    note: input.note || null,
  });
  if (moveError) throw new Error(moveError.message);

  const { data: item, error: itemError } = await supabase
    .from("stock_items")
    .select("quantity")
    .eq("id", input.stockItemId)
    .single();
  if (itemError) throw new Error(itemError.message);

  const delta = input.type === "Entrada" ? input.quantity : -input.quantity;
  const { error: updateError } = await supabase
    .from("stock_items")
    .update({ quantity: Number(item.quantity) + delta })
    .eq("id", input.stockItemId);
  if (updateError) throw new Error(updateError.message);

  revalidatePath("/admin/estoque");
  revalidatePath("/admin/produtos");
}

export async function createExpense(input: {
  description: string;
  amount: number;
  category: string;
  expenseDate: string;
}) {
  await requireOwnerAction();
  const supabase = await createClient();
  const { error } = await supabase.from("expenses").insert({
    description: input.description,
    amount: input.amount,
    category: input.category,
    expense_date: input.expenseDate,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/financeiro");
}

export async function updateShopSettings(input: {
  name: string;
  whatsapp: string;
  city: string;
  email: string;
}) {
  await requireOwnerAction();
  const supabase = await createClient();
  const { error } = await supabase
    .from("shop_settings")
    .update({
      name: input.name,
      whatsapp: input.whatsapp,
      city: input.city,
      email: input.email,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/configuracoes");
  revalidatePath("/");
}
