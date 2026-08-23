import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <div className="eyebrow">Erro 404</div>
        <h1 className="my-4 font-display text-5xl font-semibold">
          Página não encontrada.
        </h1>
        <p className="mx-auto max-w-md text-muted">
          O endereço que você tentou acessar não existe.
        </p>
        <Link href="/" className="btn-gold mt-8 inline-flex">
          VOLTAR PARA O INÍCIO
        </Link>
      </div>
    </main>
  );
}
