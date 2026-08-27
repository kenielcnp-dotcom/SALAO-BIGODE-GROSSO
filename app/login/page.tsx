import { signIn } from "@/lib/actions/auth";

export const metadata = { title: "Entrar — Bigode Grosso" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="panel w-full max-w-sm p-8">
        <div className="eyebrow">Área restrita</div>
        <h1 className="my-2 font-nbarchitekt text-2xl font-semibold">
          Entrar como proprietário
        </h1>
        <p className="copy-muted mb-6">
          Acesso exclusivo ao painel de gestão da Barbearia Bigode Grosso.
        </p>

        {error && (
          <p className="mb-4 rounded-md border border-alert/40 bg-alert/10 px-3 py-2 text-xs text-alert">
            {error}
          </p>
        )}

        <form action={signIn} className="grid gap-3.5">
          <input type="hidden" name="next" value={next ?? "/admin"} />
          <label className="grid gap-1.5 text-xs text-pale-mist">
            E-MAIL
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="field"
            />
          </label>
          <label className="grid gap-1.5 text-xs text-pale-mist">
            SENHA
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="field"
            />
          </label>
          <button type="submit" className="btn-pill mt-2 w-full">
            ENTRAR
          </button>
        </form>
      </div>
    </main>
  );
}
