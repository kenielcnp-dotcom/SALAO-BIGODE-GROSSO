import { getServices } from "@/lib/data/catalog";
import { formatMoney } from "@/lib/data/types";
import { createService, toggleServiceActive } from "@/lib/actions/admin";
import { DataTable } from "@/components/admin/DataTable";

export const metadata = { title: "Serviços — Bigode Grosso" };

export default async function AdminServicosPage() {
  const services = await getServices();

  return (
    <>
      <header className="flex h-[70px] items-center justify-between border-b border-line px-7.5">
        <div>
          <h1 className="font-display text-2xl font-semibold">Serviços</h1>
          <div className="text-xs text-muted">
            Gerencie informações, disponibilidade e status
          </div>
        </div>
      </header>
      <div className="p-7.5">
        <details className="panel mb-4.5 p-4.5">
          <summary className="cursor-pointer text-xs font-extrabold text-gold">
            ＋ NOVO SERVIÇO
          </summary>
          <form
            action={async (formData: FormData) => {
              "use server";
              await createService({
                name: String(formData.get("name")),
                description: String(formData.get("description")),
                price: Number(formData.get("price")),
                durationMinutes: Number(formData.get("duration")),
              });
            }}
            className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            <input
              name="name"
              required
              placeholder="Nome do serviço"
              className="rounded-md border border-[#353c3e] bg-[#0d1011] p-2.5 text-[#eee]"
            />
            <input
              name="description"
              placeholder="Descrição"
              className="rounded-md border border-[#353c3e] bg-[#0d1011] p-2.5 text-[#eee]"
            />
            <input
              name="price"
              type="number"
              step="0.01"
              required
              placeholder="Preço (R$)"
              className="rounded-md border border-[#353c3e] bg-[#0d1011] p-2.5 text-[#eee]"
            />
            <input
              name="duration"
              type="number"
              required
              placeholder="Duração (min)"
              className="rounded-md border border-[#353c3e] bg-[#0d1011] p-2.5 text-[#eee]"
            />
            <button type="submit" className="btn-gold sm:col-span-2">
              SALVAR SERVIÇO
            </button>
          </form>
        </details>

        <section className="panel p-4.5">
          <DataTable
            headers={["SERVIÇO", "DESCRIÇÃO", "PREÇO", "DURAÇÃO", "STATUS"]}
            emptyLabel="Nenhum serviço cadastrado ainda."
            rows={services.map((s) => [
              <b key="n">{s.name}</b>,
              s.description,
              formatMoney(s.price),
              `${s.durationMinutes} min`,
              <form
                key="a"
                action={toggleServiceActive.bind(null, s.id, false)}
              >
                <button type="submit" className="status-pill">
                  Ativo
                </button>
              </form>,
            ])}
          />
        </section>
      </div>
    </>
  );
}
