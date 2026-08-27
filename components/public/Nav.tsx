"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Início" },
  { href: "/servicos", label: "Serviços" },
  { href: "/profissionais", label: "Profissionais" },
  { href: "/minha-conta", label: "Minha conta" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-30 flex h-[74px] items-center justify-between border-b border-ash-border bg-black/50 px-[5.5vw] backdrop-blur-[4px]">
      <Link href="/" className="font-nbarchitekt text-lg font-bold tracking-wide">
        <b className="text-ghost-white">✦</b> BIGODE GROSSO
      </Link>
      <div className="hidden items-center gap-2 md:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`btn-ghost-nav ${
              pathname === link.href
                ? "bg-white/10"
                : "border-white/25 text-pale-mist"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="flex gap-3">
        <Link href="/agendamento" className="btn-pill">
          Agendar agora
        </Link>
      </div>
    </nav>
  );
}
