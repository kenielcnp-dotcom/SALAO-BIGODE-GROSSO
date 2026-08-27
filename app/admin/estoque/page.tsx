import { getStockItems, getStockMovements } from "@/lib/data/admin";
import { createStockItem, recordStockMovement } from "@/lib/actions/admin";
import { DataTable } from "@/components/admin/DataTable";
import { formatMoney } from "@/lib/data/types";

export const metadata = { title: "Estoque — Bigode Grosso" };

export default async function EstoquePage() {
  const [items, movements] = await Promise.all([
    getStockItems(),
    getStockMovements(),
  ]);

  return (
    <>
      <header className="flex h-[70px] items-center justify-between border-b border-ash-border px-7.5">
        <div>
          <h1 className="font-nbarchitekt text-2xl font-semibold">Estoque</h1>
          <div className="text-xs text-pale-mist">
            Controle produtos, validade e movimentações
          </div>
        </div>
      </header>
      <div className="p-7.5">
        <div className="mb-4.5 grid grid-cols-1 gap-3.5 lg:grid-cols-2">
          <details className="panel p-4.5">
            <summary className="cursor-pointer text-xs font-extrabold text-pale-mist">
              ＋ NOVO PRODUTO
            </summary>
            <form
              action={async (formData: FormData) => {
                "use server";
                await createStockItem({
                  name: String(formData.get("name")),
                  category: String(formData.get("category")),
                  quantity: Number(formData.get("quantity")),
                  minQuantity: Number(formData.get("minQuantity")),
                  salePrice: Number(formData.get("salePrice")),
                });
              }}
              className="mt-4 grid grid-cols-2 gap-3"
            >
              <input
                name="name"
                required
                placeholder="Produto"
                className="col-span-2 field"
              />
              <input
                name="category"
                placeholder="Categoria"
                className="col-span-2 field"
              />
              <input
                name="quantity"
                type="number"
                required
                placeholder="Qtd. atual"
                className="field"
              />
              <input
                name="minQuantity"
                type="number"
                required
                placeholder="Qtd. mínima"
                className="field"
              />
              <input
                name="salePrice"
                type="number"
                step="0.01"
                placeholder="Preço de venda"
                className="col-span-2 field"
              />
              <button type="submit" className="btn-pill col-span-2">
                SALVAR PRODUTO
              </button>
            </form>
          </details>

          <details className="panel p-4.5">
            <summary className="cursor-pointer text-xs font-extrabold text-pale-mist">
              ＋ REGISTRAR MOVIMENTAÇÃO
            </summary>
            <form
              action={async (formData: FormData) => {
                "use server";
                await recordStockMovement({
                  stockItemId: String(formData.get("stockItemId")),
                  type: String(formData.get("type")) as "Entrada" | "Saída" | "Perda",
                  quantity: Number(formData.get("quantity")),
                  note: String(formData.get("note") ?? ""),
                });
              }}
              className="mt-4 grid grid-cols-2 gap-3"
            >
              <select
                name="stockItemId"
                required
                className="col-span-2 field"
              >
                <option value="">Selecione o produto</option>
                {items.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
              <select
                name="type"
                className="field"
              >
                <option value="Entrada">Entrada</option>
                <option value="Saída">Saída</option>
                <option value="Perda">Perda</option>
              </select>
              <input
                name="quantity"
                type="number"
                required
                placeholder="Quantidade"
                className="field"
              />
              <input
                name="note"
                placeholder="Observação (opcional)"
                className="col-span-2 field"
              />
              <button type="submit" className="btn-pill col-span-2">
                REGISTRAR
              </button>
            </form>
          </details>
        </div>

        <section className="panel p-4.5">
          <DataTable
            headers={["PRODUTO", "CATEGORIA", "ATUAL", "MÍNIMO", "VENDA", "STATUS"]}
            emptyLabel="Nenhum produto cadastrado ainda."
            rows={items.map((i) => [
              <b key="n">{i.name}</b>,
              i.category ?? "—",
              `${i.quantity} ${i.unit}`,
              `${i.min_quantity} ${i.unit}`,
              i.sale_price ? formatMoney(Number(i.sale_price)) : "—",
              <span
                key="s"
                className={`status-pill ${i.status === "Crítico" ? "status-pill-red" : i.status === "Baixo" ? "status-pill-warn" : ""}`}
              >
                {i.status}
              </span>,
            ])}
          />
        </section>

        <section className="panel mt-3.5 p-4.5">
          <h3 className="mb-4 text-[13px]">Movimentações recentes</h3>
          {movements.length === 0 ? (
            <p className="text-xs text-pale-mist">Nenhuma movimentação registrada.</p>
          ) : (
            movements.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between border-b border-ash-border py-2.5 text-xs last:border-0"
              >
                <span>
                  {m.type} · {m.itemName} · {m.quantity} un.
                  {m.note ? ` — ${m.note}` : ""}
                </span>
                <span className="text-pale-mist">
                  {new Date(m.createdAt).toLocaleString("pt-BR")}
                </span>
              </div>
            ))
          )}
        </section>
      </div>
    </>
  );
}
