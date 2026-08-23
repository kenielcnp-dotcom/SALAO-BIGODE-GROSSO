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
    <nav className="sticky top-0 z-30 flex h-[74px] items-center justify-between border-b border-[#1b2021] bg-bg/90 px-[5.5vw] backdrop-blur-2xl">
      <Link href="/" className="font-display text-lg font-bold tracking-wide">
        <b className="text-gold">✦</b> BIGODE GROSSO
      </Link>
      <div className="hidden gap-6 md:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              pathname === link.href
                ? "text-gold-2"
                : "text-muted hover:text-gold-2"
            }
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="flex gap-3">
        <Link href="/agendamento" className="btn-gold">
          Agendar agora
        </Link>
      </div>
    </nav>
  );
}
