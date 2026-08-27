import Link from "next/link";
import type { Professional } from "@/lib/data/types";

export function ProCard({ pro }: { pro: Professional }) {
  return (
    <article className="panel p-[18px]">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-dusk-violet font-nbarchitekt text-lg font-bold text-ghost-white">
          {pro.initials}
        </div>
        <div>
          <h3 className="m-0">{pro.fullName}</h3>
          <small className="font-nbarchitekt text-xs text-pale-mist">Barbeiro especialista</small>
        </div>
        <span className="ml-auto text-pale-mist">★ {pro.rating}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        <span className="inline-block rounded-[500px] border border-ash-border bg-white/[0.06] px-2 py-1 text-[11px] text-pale-mist">
          {pro.specialty}
        </span>
        <span className="inline-block rounded-[500px] border border-ash-border bg-white/[0.06] px-2 py-1 text-[11px] text-pale-mist">
          Consultoria de estilo
        </span>
      </div>
      <p className="mt-4 text-xs text-pale-mist">◷ {pro.hoursLabel}</p>
      <Link
        href={`/agendamento?pro=${pro.id}`}
        className="btn-ghost mt-[18px] w-full"
      >
        VER DISPONIBILIDADE
      </Link>
    </article>
  );
}
