"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/actions/auth";

const links = [
  ["/admin", "▦", "Dashboard"],
  ["/admin/agenda", "▣", "Agenda"],
  ["/admin/atendimentos", "◷", "Atendimentos"],
  ["/admin/clientes", "♙", "Clientes"],
  ["/admin/profissionais", "♜", "Profissionais"],
  ["/admin/servicos", "✦", "Serviços"],
  ["/admin/estoque", "▤", "Estoque"],
  ["/admin/produtos", "▱", "Produtos"],
  ["/admin/financeiro", "◌", "Financeiro"],
  ["/admin/relatorios", "▧", "Relatórios"],
  ["/admin/configuracoes", "⚙", "Configurações"],
] as const;

export function AdminSidebar() {
  const activePath = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen border-r border-line p-6 px-3.5 md:block">
      <div className="px-2.5 pb-6 font-display text-lg font-bold">
        <b className="text-gold">✦</b> BIGODE GROSSO
      </div>
      <nav className="grid gap-0.5">
        {links.map(([href, icon, label]) => (
          <Link
            key={href}
            href={href}
            className={`rounded-md px-2.5 py-2.5 text-xs ${
              activePath === href
                ? "bg-[#2a2112] text-gold-2"
                : "text-cream/80 hover:bg-[#2a2112] hover:text-gold-2"
            }`}
          >
            {icon} &nbsp;{label}
          </Link>
        ))}
      </nav>
      <form
        action={signOut}
        className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-2 border-t border-line pt-4 text-[11px]"
      >
        <span>
          Proprietário
          <br />
          <small className="text-muted">Sessão autenticada</small>
        </span>
        <button type="submit" className="text-gold hover:text-gold-2">
          Sair
        </button>
      </form>
    </aside>
  );
}
