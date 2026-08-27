import { getCustomers } from "@/lib/data/admin";
import { updateCustomerTag } from "@/lib/actions/admin";
import { formatMoney } from "@/lib/data/types";

export const metadata = { title: "Clientes — Bigode Grosso" };

const TAGS = ["Novo", "Recorrente", "VIP", "Inativo"] as const;

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("pt-BR");
}

export default async function ClientesPage() {
  const customers = await getCustomers();

  return (
    <>
      <header className="flex h-[70px] items-center justify-between border-b border-ash-border px-7.5">
        <div>
          <h1 className="font-nbarchitekt text-2xl font-semibold">Clientes CRM</h1>
          <div className="text-xs text-pale-mist">
            Relacionamento, preferências e oportunidades de retorno
          </div>
        </div>
      </header>
      <div className="p-7.5">
        <section className="panel p-4.5">
          {customers.length === 0 ? (
            <p className="text-xs text-pale-mist">Nenhum cliente cadastrado ainda.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-ash-border text-left text-fog">
                    <th className="p-2.5 font-medium">CLIENTE</th>
                    <th className="p-2.5 font-medium">TELEFONE</th>
                    <th className="p-2.5 font-medium">ÚLTIMA VISITA</th>
                    <th className="p-2.5 font-medium">PRÓXIMA</th>
                    <th className="p-2.5 font-medium">TOTAL GASTO</th>
                    <th className="p-2.5 font-medium">VISITAS</th>
                    <th className="p-2.5 font-medium">FAVORITO</th>
                    <th className="p-2.5 font-medium">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id} className="border-b border-ash-border last:border-0">
                      <td className="p-2.5">
                        <b>{c.fullName}</b>
                      </td>
                      <td className="p-2.5">{c.phone}</td>
                      <td className="p-2.5">{formatDate(c.lastVisit)}</td>
                      <td className="p-2.5">{formatDate(c.nextVisit)}</td>
                      <td className="p-2.5">{formatMoney(c.totalSpent)}</td>
                      <td className="p-2.5">{c.visitCount}</td>
                      <td className="p-2.5">{c.favoriteProfessional ?? "—"}</td>
                      <td className="p-2.5">
                        <form
                          action={async (formData: FormData) => {
                            "use server";
                            const tag = String(formData.get("tag"));
                            await updateCustomerTag(c.id, tag);
                          }}
                          className="flex items-center gap-1.5"
                        >
                          <select
                            name="tag"
                            defaultValue={c.tag}
                            className={`rounded-full border-0 px-2 py-1 text-[10px] ${
                              c.tag === "VIP"
                                ? "status-pill"
                                : c.tag === "Inativo"
                                  ? "status-pill status-pill-red"
                                  : "status-pill status-pill-warn"
                            }`}
                          >
                            {TAGS.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                          <button type="submit" className="text-pale-mist" title="Salvar">
                            ✓
                          </button>
                        </form>
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
