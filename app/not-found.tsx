import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <div className="eyebrow">Erro 404</div>
        <h1 className="my-4 font-nbarchitekt text-5xl font-semibold">
          Página não encontrada.
        </h1>
        <p className="copy-muted mx-auto max-w-md">
          O endereço que você tentou acessar não existe.
        </p>
        <Link href="/" className="btn-pill mt-8 inline-flex">
          VOLTAR PARA O INÍCIO
        </Link>
      </div>
    </main>
  );
}
