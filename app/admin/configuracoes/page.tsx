import { getShopSettingsAdmin } from "@/lib/data/admin";
import { updateShopSettings } from "@/lib/actions/admin";

export const metadata = { title: "Configurações — Bigode Grosso" };

export default async function ConfiguracoesPage() {
  const settings = await getShopSettingsAdmin();

  return (
    <>
      <header className="flex h-[70px] items-center border-b border-line px-7.5">
        <div>
          <h1 className="font-display text-2xl font-semibold">Configurações</h1>
          <div className="text-xs text-muted">
            Personalize operação, acessos e comunicação
          </div>
        </div>
      </header>
      <div className="grid grid-cols-1 gap-3.5 p-7.5 lg:grid-cols-2">
        <section className="panel p-4.5">
          <h3 className="mb-4 text-[13px]">Dados da barbearia</h3>
          <form
            action={async (formData: FormData) => {
              "use server";
              await updateShopSettings({
                name: String(formData.get("name")),
                whatsapp: String(formData.get("whatsapp")),
                city: String(formData.get("city")),
                email: String(formData.get("email")),
              });
            }}
            className="grid grid-cols-1 gap-3.5"
          >
            <label className="grid gap-1.5 text-xs text-muted">
              NOME
              <input
                name="name"
                defaultValue={settings.name}
                className="rounded-md border border-[#353c3e] bg-[#0d1011] p-2.5 text-[#eee]"
              />
            </label>
            <label className="grid gap-1.5 text-xs text-muted">
              WHATSAPP
              <input
                name="whatsapp"
                defaultValue={settings.whatsapp ?? ""}
                className="rounded-md border border-[#353c3e] bg-[#0d1011] p-2.5 text-[#eee]"
              />
            </label>
            <label className="grid gap-1.5 text-xs text-muted">
              CIDADE
              <input
                name="city"
                defaultValue={settings.city ?? ""}
                className="rounded-md border border-[#353c3e] bg-[#0d1011] p-2.5 text-[#eee]"
              />
            </label>
            <label className="grid gap-1.5 text-xs text-muted">
              E-MAIL
              <input
                name="email"
                defaultValue={settings.email ?? ""}
                className="rounded-md border border-[#353c3e] bg-[#0d1011] p-2.5 text-[#eee]"
              />
            </label>
            <button type="submit" className="btn-gold">
              SALVAR ALTERAÇÕES
            </button>
          </form>
        </section>

        <section className="panel p-4.5">
          <h3 className="mb-4 text-[13px]">Acesso</h3>
          <div className="flex items-center justify-between border-b border-line py-2.5 text-xs">
            <span>
              Proprietário
              <br />
              <small className="text-muted">Acesso total ao painel</small>
            </span>
            <span className="status-pill">Ativo</span>
          </div>
          <p className="mt-4 text-xs text-muted">
            Este sistema tem um único usuário administrador. Novas contas não
            podem ser criadas por cadastro público — apenas pelo Supabase
            diretamente.
          </p>
        </section>
      </div>
    </>
  );
}
