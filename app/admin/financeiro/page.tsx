import { getDashboardData, getExpenses } from "@/lib/data/admin";
import { createExpense } from "@/lib/actions/admin";
import { formatMoney } from "@/lib/data/types";

export const metadata = { title: "Financeiro — Bigode Grosso" };

export default async function FinanceiroPage() {
  const [dashboard, expenses] = await Promise.all([
    getDashboardData(),
    getExpenses(),
  ]);

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const profit = dashboard.monthRevenue - totalExpenses;

  return (
    <>
      <header className="flex h-[70px] items-center justify-between border-b border-ash-border px-7.5">
        <div>
          <h1 className="font-nbarchitekt text-2xl font-semibold">Financeiro</h1>
          <div className="text-xs text-pale-mist">
            Receitas, despesas e performance do negócio
          </div>
        </div>
      </header>
      <div className="p-7.5">
        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-[1.5fr_0.8fr]">
          <section className="panel p-4.5">
            <h3 className="mb-4 text-[13px]">Serviços realizados — este mês</h3>
            {dashboard.topServices.length === 0 ? (
              <p className="text-xs text-pale-mist">Sem dados este mês.</p>
            ) : (
              dashboard.topServices.map(([name, count]) => (
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
          <section className="panel p-4.5">
            <h3 className="mb-4 text-[13px]">Resumo</h3>
            <div className="flex items-center justify-between border-b border-ash-border py-2.5 text-xs">
              <span>Faturamento do mês</span>
              <b>{formatMoney(dashboard.monthRevenue)}</b>
            </div>
            <div className="flex items-center justify-between border-b border-ash-border py-2.5 text-xs">
              <span>Despesas do mês</span>
              <b>{formatMoney(totalExpenses)}</b>
            </div>
            <div className="flex items-center justify-between py-2.5 text-xs">
              <span>Lucro estimado</span>
              <b className={profit >= 0 ? "text-ghost-white" : "text-alert"}>
                {formatMoney(profit)}
              </b>
            </div>
          </section>
        </div>

        <details className="panel mt-3.5 p-4.5">
          <summary className="cursor-pointer text-xs font-extrabold text-pale-mist">
            ＋ NOVA DESPESA
          </summary>
          <form
            action={async (formData: FormData) => {
              "use server";
              await createExpense({
                description: String(formData.get("description")),
                amount: Number(formData.get("amount")),
                category: String(formData.get("category")),
                expenseDate: String(formData.get("expenseDate")),
              });
            }}
            className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-4"
          >
            <input
              name="description"
              required
              placeholder="Descrição"
              className="field sm:col-span-2"
            />
            <input
              name="category"
              placeholder="Categoria"
              className="field"
            />
            <input
              name="amount"
              type="number"
              step="0.01"
              required
              placeholder="Valor (R$)"
              className="field"
            />
            <input
              name="expenseDate"
              type="date"
              required
              defaultValue={new Date().toISOString().slice(0, 10)}
              className="field"
            />
            <button type="submit" className="btn-pill sm:col-span-3">
              SALVAR DESPESA
            </button>
          </form>
        </details>

        <section className="panel mt-3.5 p-4.5">
          <h3 className="mb-4 text-[13px]">Despesas recentes</h3>
          {expenses.length === 0 ? (
            <p className="text-xs text-pale-mist">Nenhuma despesa registrada.</p>
          ) : (
            expenses.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between border-b border-ash-border py-2.5 text-xs last:border-0"
              >
                <span>
                  {e.description}
                  {e.category ? ` · ${e.category}` : ""}
                </span>
                <b>{formatMoney(Number(e.amount))}</b>
              </div>
            ))
          )}
        </section>
      </div>
    </>
  );
}
