import { getDashboardData } from "@/lib/data/admin";
import { formatMoney } from "@/lib/data/types";

export const metadata = { title: "Dashboard — Bigode Grosso" };

function RevenueChart({ points }: { points: [string, number][] }) {
  if (points.length < 2) {
    return (
      <div className="grid h-[210px] place-items-center text-xs text-pale-mist">
        Ainda sem dados suficientes para o gráfico.
      </div>
    );
  }
  const max = Math.max(...points.map((p) => p[1]), 1);
  const step = 500 / (points.length - 1);
  const coords = points
    .map(([, value], i) => {
      const x = i * step;
      const y = 200 - (value / max) * 190;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="h-[210px] overflow-hidden bg-[repeating-linear-gradient(0deg,transparent_0_41px,#1c1c1c_42px)]">
      <svg viewBox="0 0 500 210" preserveAspectRatio="none" className="h-full w-full">
        <polyline fill="none" stroke="#ffffff" strokeWidth="2" points={coords} />
        <polyline fill="none" stroke="#34375566" strokeWidth="18" points={coords} />
      </svg>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  return (
    <>
      <header className="flex h-[70px] items-center justify-between border-b border-ash-border px-7.5">
        <div>
          <h1 className="font-nbarchitekt text-2xl font-semibold">Bom dia.</h1>
          <div className="text-xs text-pale-mist">
            Visão geral da operação em tempo real
          </div>
        </div>
      </header>
      <div className="p-7.5">
        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          {[
            ["Agendamentos hoje", String(data.todayCount)],
            ["Faturamento do dia", formatMoney(data.todayRevenue)],
            ["Faturamento do mês", formatMoney(data.monthRevenue)],
            ["Clientes cadastrados", String(data.customersCount)],
          ].map(([label, value]) => (
            <article key={label} className="panel p-4.5">
              <span className="text-[11px] text-pale-mist">{label}</span>
              <b className="my-1.5 block font-nbarchitekt text-2xl font-medium">
                {value}
              </b>
            </article>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3.5 lg:grid-cols-[1.5fr_0.8fr]">
          <section className="panel p-4.5">
            <h3 className="mb-4 text-[13px]">Agenda de hoje</h3>
            {data.todayAppointments.length === 0 ? (
              <p className="text-xs text-pale-mist">Nenhum agendamento para hoje.</p>
            ) : (
              data.todayAppointments.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between border-b border-ash-border py-2.5 text-xs last:border-0"
                >
                  <span>
                    <b>{a.time}</b> &nbsp;{a.customerName}
                    <br />
                    <small className="text-pale-mist">
                      {a.serviceName} · {a.professionalName}
                    </small>
                  </span>
                  <span className="status-pill">{a.status}</span>
                </div>
              ))
            )}
          </section>
          <aside className="panel p-4.5">
            <h3 className="mb-4 text-[13px]">Alertas de estoque</h3>
            {data.stockAlerts.length === 0 ? (
              <p className="text-xs text-pale-mist">Nenhum alerta no momento.</p>
            ) : (
              data.stockAlerts.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-ash-border py-2.5 text-xs last:border-0"
                >
                  <span>{item.name}</span>
                  <span
                    className={`status-pill ${item.status === "Crítico" ? "status-pill-red" : "status-pill-warn"}`}
                  >
                    {item.status}
                  </span>
                </div>
              ))
            )}
          </aside>
        </div>

        <div className="mt-3.5 grid grid-cols-1 gap-3.5 lg:grid-cols-[1.5fr_0.8fr]">
          <section className="panel p-4.5">
            <h3 className="mb-4 text-[13px]">Faturamento — este mês</h3>
            <RevenueChart points={data.chartPoints} />
          </section>
          <section className="panel p-4.5">
            <h3 className="mb-4 text-[13px]">Serviços mais realizados</h3>
            {data.topServices.length === 0 ? (
              <p className="text-xs text-pale-mist">Sem dados este mês.</p>
            ) : (
              data.topServices.map(([name, count]) => (
                <div
                  key={name}
                  className="flex items-center justify-between border-b border-ash-border py-2.5 text-xs last:border-0"
                >
                  <span>{name}</span>
                  <b>{count} atend.</b>
                </div>
              ))
            )}
          </section>
        </div>
      </div>
    </>
  );
}
