import { Nav } from "@/components/public/Nav";
import { Footer } from "@/components/public/Footer";
import { getMyAppointments } from "@/lib/data/account";
import { formatMoney } from "@/lib/data/types";

export const metadata = { title: "Minha Conta — Bigode Grosso" };

export default async function MinhaContaPage({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string; code?: string }>;
}) {
  const { phone, code } = await searchParams;
  const searched = Boolean(phone && code);
  const appointments =
    searched && phone && code ? await getMyAppointments(phone, code) : [];

  return (
    <>
      <Nav />
      <main className="px-[7vw] py-[58px]">
        <div className="eyebrow">Acompanhe seus agendamentos</div>
        <h1 className="my-2 font-display text-[45px] font-semibold">
          Minha conta.
        </h1>
        <p className="mb-9 max-w-[560px] text-muted">
          Informe o WhatsApp usado no agendamento e o código de confirmação
          (enviado ao final do agendamento, formato BG-0000) para ver seu
          histórico.
        </p>

        <form
          method="get"
          className="mb-9 grid max-w-[560px] grid-cols-1 gap-3.5 sm:grid-cols-[1fr_1fr_auto]"
        >
          <input
            name="phone"
            defaultValue={phone}
            required
            placeholder="WhatsApp usado no agendamento"
            className="rounded-md border border-[#353c3e] bg-[#0d1011] p-3 text-[#eee]"
          />
          <input
            name="code"
            defaultValue={code}
            required
            placeholder="Código (BG-0000)"
            className="rounded-md border border-[#353c3e] bg-[#0d1011] p-3 text-[#eee]"
          />
          <button type="submit" className="btn-gold">
            BUSCAR
          </button>
        </form>

        {searched && appointments.length === 0 && (
          <p className="text-sm text-danger">
            Não encontramos agendamentos com esses dados. Confira o telefone e
            o código e tente novamente.
          </p>
        )}

        {appointments.length > 0 && (
          <section className="panel p-4.5">
            <h3 className="mb-4 text-[13px]">Histórico de atendimentos</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-line text-left text-[#858d8c]">
                    <th className="p-2.5 font-medium">DATA</th>
                    <th className="p-2.5 font-medium">SERVIÇO</th>
                    <th className="p-2.5 font-medium">PROFISSIONAL</th>
                    <th className="p-2.5 font-medium">VALOR</th>
                    <th className="p-2.5 font-medium">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr key={a.id} className="border-b border-line last:border-0">
                      <td className="p-2.5">
                        {new Date(a.scheduledDate + "T00:00:00").toLocaleDateString("pt-BR")}{" "}
                        · {a.scheduledTime}
                      </td>
                      <td className="p-2.5">{a.serviceName}</td>
                      <td className="p-2.5">{a.professionalName}</td>
                      <td className="p-2.5">{formatMoney(a.price)}</td>
                      <td className="p-2.5">
                        <span className="status-pill">{a.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
