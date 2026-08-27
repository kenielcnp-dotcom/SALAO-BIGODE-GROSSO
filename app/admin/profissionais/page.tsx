import { getProfessionals } from "@/lib/data/catalog";
import { createProfessional, toggleProfessionalActive } from "@/lib/actions/admin";
import { DataTable } from "@/components/admin/DataTable";

export const metadata = { title: "Profissionais — Bigode Grosso" };

export default async function AdminProfissionaisPage() {
  const professionals = await getProfessionals();

  return (
    <>
      <header className="flex h-[70px] items-center justify-between border-b border-ash-border px-7.5">
        <div>
          <h1 className="font-nbarchitekt text-2xl font-semibold">Profissionais</h1>
          <div className="text-xs text-pale-mist">
            Gerencie informações, disponibilidade e status
          </div>
        </div>
      </header>
      <div className="p-7.5">
        <details className="panel mb-4.5 p-4.5">
          <summary className="cursor-pointer text-xs font-extrabold text-pale-mist">
            ＋ NOVO PROFISSIONAL
          </summary>
          <form
            action={async (formData: FormData) => {
              "use server";
              await createProfessional({
                fullName: String(formData.get("fullName")),
                specialty: String(formData.get("specialty")),
                initials: String(formData.get("initials")),
              });
            }}
            className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            <input
              name="fullName"
              required
              placeholder="Nome completo"
              className="field"
            />
            <input
              name="specialty"
              placeholder="Especialidade"
              className="field"
            />
            <input
              name="initials"
              maxLength={2}
              placeholder="Iniciais (ex: JO)"
              className="field"
            />
            <button type="submit" className="btn-pill sm:col-span-3">
              SALVAR PROFISSIONAL
            </button>
          </form>
        </details>

        <section className="panel p-4.5">
          <DataTable
            headers={["PROFISSIONAL", "ESPECIALIDADE", "AVALIAÇÃO", "HORÁRIO", "STATUS"]}
            emptyLabel="Nenhum profissional cadastrado ainda."
            rows={professionals.map((p) => [
              <b key="n">{p.fullName}</b>,
              p.specialty,
              `★ ${p.rating}`,
              p.hoursLabel,
              <form
                key="a"
                action={toggleProfessionalActive.bind(null, p.id, false)}
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
