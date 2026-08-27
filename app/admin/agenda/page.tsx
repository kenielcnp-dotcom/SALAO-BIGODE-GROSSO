import { getAgendaAppointments } from "@/lib/data/admin";
import { advanceAppointmentStatus, cancelAppointment } from "@/lib/actions/admin";

export const metadata = { title: "Agenda — Bigode Grosso" };

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function shiftDate(date: string, days: number) {
  const d = new Date(date + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: dateParam } = await searchParams;
  const date = dateParam ?? todayISO();
  const appointments = await getAgendaAppointments(date);

  const formattedDate = new Date(date + "T00:00:00").toLocaleDateString(
    "pt-BR",
    { weekday: "long", day: "2-digit", month: "long", year: "numeric" },
  );

  return (
    <>
      <header className="flex h-[70px] items-center justify-between border-b border-ash-border px-7.5">
        <div>
          <h1 className="font-nbarchitekt text-2xl font-semibold">Agenda</h1>
          <div className="text-xs text-pale-mist">
            Gerencie confirmações, encaixes e atendimentos
          </div>
        </div>
      </header>
      <div className="p-7.5">
        <div className="mb-5 flex items-center gap-3">
          <a href={`/admin/agenda?date=${shiftDate(date, -1)}`} className="btn-ghost">
            ← Anterior
          </a>
          <a href={`/admin/agenda?date=${todayISO()}`} className="btn-ghost">
            Hoje
          </a>
          <a href={`/admin/agenda?date=${shiftDate(date, 1)}`} className="btn-ghost">
            Próximo →
          </a>
        </div>

        <section className="panel p-4.5">
          <h3 className="mb-4 text-[13px] capitalize">{formattedDate}</h3>
          {appointments.length === 0 ? (
            <p className="text-xs text-pale-mist">Nenhum agendamento nesse dia.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-ash-border text-left text-fog">
                    <th className="p-2.5 font-medium">HORÁRIO</th>
                    <th className="p-2.5 font-medium">CLIENTE</th>
                    <th className="p-2.5 font-medium">SERVIÇO</th>
                    <th className="p-2.5 font-medium">PROFISSIONAL</th>
                    <th className="p-2.5 font-medium">STATUS</th>
                    <th className="p-2.5 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr key={a.id} className="border-b border-ash-border last:border-0">
                      <td className="p-2.5">{a.time}</td>
                      <td className="p-2.5">
                        <b>{a.customerName}</b>
                        <br />
                        <span className="text-pale-mist">{a.customerPhone}</span>
                      </td>
                      <td className="p-2.5">{a.serviceName}</td>
                      <td className="p-2.5">{a.professionalName}</td>
                      <td className="p-2.5">
                        <span
                          className={`status-pill ${a.status === "Cancelado" ? "status-pill-red" : ""}`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="p-2.5">
                        {a.status !== "Concluído" && a.status !== "Cancelado" && (
                          <div className="flex gap-2">
                            <form
                              action={advanceAppointmentStatus.bind(
                                null,
                                a.id,
                                a.status,
                              )}
                            >
                              <button type="submit" className="text-pale-mist">
                                Avançar
                              </button>
                            </form>
                            <form action={cancelAppointment.bind(null, a.id)}>
                              <button type="submit" className="text-alert">
                                Cancelar
                              </button>
                            </form>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
