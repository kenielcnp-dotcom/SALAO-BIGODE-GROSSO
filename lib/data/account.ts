import "server-only";
import { createClient } from "@/lib/supabase/server";

export type MyAppointment = {
  id: string;
  serviceName: string;
  professionalName: string;
  scheduledDate: string;
  scheduledTime: string;
  price: number;
  status: string;
};

export async function getMyAppointments(
  phone: string,
  bookingCode: string,
): Promise<MyAppointment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_my_appointments", {
    p_phone: phone,
    p_booking_code: bookingCode,
  });

  if (error) throw new Error(error.message);

  type Row = {
    id: string;
    service_name: string;
    professional_name: string;
    scheduled_date: string;
    scheduled_time: string;
    price: number;
    status: string;
  };

  return ((data ?? []) as Row[]).map((r) => ({
    id: r.id,
    serviceName: r.service_name,
    professionalName: r.professional_name,
    scheduledDate: r.scheduled_date,
    scheduledTime: r.scheduled_time.slice(0, 5),
    price: Number(r.price),
    status: r.status,
  }));
}
