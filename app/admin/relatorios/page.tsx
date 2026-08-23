import { getDashboardData, getStockItems } from "@/lib/data/admin";
import { formatMoney } from "@/lib/data/types";

export const metadata = { title: "Relatórios — Bigode Grosso" };

export default async function RelatoriosPage() {
  const [dashboard, stock] = await Promise.all([
    getDashboardData(),
    getStockItems(),
  ]);

  const attendances = dashboard.topServices.reduce((sum, [, c]) => sum + c, 0);

  return (
    <>
      <header className="flex h-[70px] items-center justify-between border-b border-line px-7.5">
        <div>
          <h1 className="font-display text-2xl font-semibold">Relatórios</h1>
          <div className="text-xs text-muted">
            Indicadores para decisões mais precisas
          </div>
        </div>
        <a href="/api/reports/export" className="btn-gold">
          ⇩ EXPORTAR CSV
        </a>
      </header>
      <div className="p-7.5">
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Faturamento do mês", formatMoney(dashboard.monthRevenue)],
            ["Atendimentos do mês", String(attendances)],
            ["Clientes cadastrados", String(dashboard.customersCount)],
            ["Produtos em estoque", `${stock.length} itens`],
          ].map(([label, value]) => (
            <article key={label} className="panel p-4.5">
              <span className="text-[11px] text-muted">{label}</span>
              <b className="my-1.5 block font-display text-2xl font-medium">
                {value}
              </b>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
