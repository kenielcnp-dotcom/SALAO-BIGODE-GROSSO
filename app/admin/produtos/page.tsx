import Link from "next/link";
import { getStockItems } from "@/lib/data/admin";
import { DataTable } from "@/components/admin/DataTable";
import { formatMoney } from "@/lib/data/types";

export const metadata = { title: "Produtos — Bigode Grosso" };

export default async function ProdutosPage() {
  const items = await getStockItems();
  const forSale = items.filter((i) => i.sale_price);

  return (
    <>
      <header className="flex h-[70px] items-center justify-between border-b border-line px-7.5">
        <div>
          <h1 className="font-display text-2xl font-semibold">Produtos</h1>
          <div className="text-xs text-muted">
            Catálogo de produtos à venda no balcão
          </div>
        </div>
        <Link href="/admin/estoque" className="btn-ghost">
          Gerenciar estoque
        </Link>
      </header>
      <div className="p-7.5">
        <section className="panel p-4.5">
          <DataTable
            headers={["PRODUTO", "CATEGORIA", "PREÇO DE VENDA", "DISPONIBILIDADE"]}
            emptyLabel="Nenhum produto com preço de venda cadastrado."
            rows={forSale.map((i) => [
              <b key="n">{i.name}</b>,
              i.category ?? "—",
              formatMoney(Number(i.sale_price)),
              <span
                key="s"
                className={`status-pill ${i.status === "Crítico" ? "status-pill-red" : i.status === "Baixo" ? "status-pill-warn" : ""}`}
              >
                {i.status === "Normal" ? "Em estoque" : i.status}
              </span>,
            ])}
          />
        </section>
      </div>
    </>
  );
}
