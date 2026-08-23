"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAvailableSlots(
  professionalId: string,
  date: string,
  durationMinutes: number,
): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_available_slots", {
    p_professional_id: professionalId,
    p_date: date,
    p_duration_minutes: durationMinutes,
  });

  if (error) throw new Error(error.message);

  return ((data ?? []) as { slot_time: string }[]).map((row) =>
    row.slot_time.slice(0, 5),
  );
}

export type CreateBookingInput = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceId: string;
  professionalId: string;
  date: string;
  time: string;
  notes: string;
};

export async function createBooking(
  input: CreateBookingInput,
): Promise<{ bookingCode: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("book_appointment", {
    p_customer_name: input.customerName,
    p_customer_phone: input.customerPhone,
    p_customer_email: input.customerEmail || null,
    p_service_id: input.serviceId,
    p_professional_id: input.professionalId,
    p_date: input.date,
    p_time: input.time,
    p_notes: input.notes || null,
  });

  if (error) throw new Error(error.message);

  const bookingCode = (data as { booking_code: string }[] | null)?.[0]
    ?.booking_code;
  if (!bookingCode) throw new Error("Não foi possível confirmar o agendamento.");

  return { bookingCode };
}
