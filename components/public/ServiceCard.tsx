import Link from "next/link";
import { formatMoney, type Service } from "@/lib/data/types";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="overflow-hidden rounded-[var(--radius-cards)] border border-ash-border bg-transparent transition-colors duration-200 ease-out hover:border-white/60">
      <div className="flex h-[130px] items-center justify-center border-b border-ash-border bg-white/[0.04] font-nbarchitekt text-5xl text-ghost-white">
        {service.icon}
      </div>
      <div className="p-[17px]">
        <h3 className="mb-1.5 text-[15px]">{service.name}</h3>
        <div className="font-nbarchitekt text-xs text-pale-mist">{service.description}</div>
        <div className="mt-3.5 flex items-center justify-between font-extrabold text-ghost-white">
          {formatMoney(service.price)}
          <Link
            href={`/agendamento?service=${service.id}`}
            className="text-xs font-extrabold text-pale-mist"
          >
            SELECIONAR →
          </Link>
        </div>
        <div className="mt-1.5 font-nbarchitekt text-xs text-pale-mist">
          ◷ {service.durationMinutes} min · com especialista
        </div>
      </div>
    </article>
  );
}
