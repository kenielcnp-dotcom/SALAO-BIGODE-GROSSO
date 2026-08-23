import Link from "next/link";
import type { Professional } from "@/lib/data/types";

export function ProCard({ pro }: { pro: Professional }) {
  return (
    <article className="panel p-[18px]">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-gold to-[#4c3516] font-display text-lg font-bold text-[#101010]">
          {pro.initials}
        </div>
        <div>
          <h3 className="m-0">{pro.fullName}</h3>
          <small className="font-mono text-xs text-muted">Barbeiro especialista</small>
        </div>
        <span className="ml-auto text-gold">★ {pro.rating}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        <span className="inline-block rounded-full bg-[#332918] px-2 py-1 text-[11px] text-[#c8b487]">
          {pro.specialty}
        </span>
        <span className="inline-block rounded-full bg-[#332918] px-2 py-1 text-[11px] text-[#c8b487]">
          Consultoria de estilo
        </span>
      </div>
      <p className="mt-4 text-xs text-muted">◷ {pro.hoursLabel}</p>
      <Link
        href={`/agendamento?pro=${pro.id}`}
        className="btn-ghost mt-[18px] w-full"
      >
        VER DISPONIBILIDADE
      </Link>
    </article>
  );
}
