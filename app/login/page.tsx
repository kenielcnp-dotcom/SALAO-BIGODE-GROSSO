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
        <h1 className="my-2 font-display text-2xl font-semibold">
          Entrar como proprietário
        </h1>
        <p className="mb-6 text-sm text-muted">
          Acesso exclusivo ao painel de gestão da Barbearia Bigode Grosso.
        </p>

        {error && (
          <p className="mb-4 rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger">
            {error}
          </p>
        )}

        <form action={signIn} className="grid gap-3.5">
          <input type="hidden" name="next" value={next ?? "/admin"} />
          <label className="grid gap-1.5 text-xs text-muted">
            E-MAIL
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="w-full rounded-md border border-[#353c3e] bg-[#0d1011] p-3 text-[#eee]"
            />
          </label>
          <label className="grid gap-1.5 text-xs text-muted">
            SENHA
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full rounded-md border border-[#353c3e] bg-[#0d1011] p-3 text-[#eee]"
            />
          </label>
          <button type="submit" className="btn-gold mt-2 w-full">
            ENTRAR
          </button>
        </form>
      </div>
    </main>
  );
}
