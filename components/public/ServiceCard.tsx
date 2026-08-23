import Link from "next/link";
import { formatMoney, type Service } from "@/lib/data/types";

const artGradients = [
  "from-[#2c261e] to-[#111416]",
  "from-[#152128] to-[#101314]",
  "from-[#2d2221] to-[#101314]",
  "from-[#1d2824] to-[#101314]",
  "from-[#29212f] to-[#101314]",
];

export function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  return (
    <article className="overflow-hidden rounded-[10px] border border-line bg-gradient-to-br from-[#15191a] to-[#101314] transition duration-200 hover:-translate-y-1 hover:border-[#7a6032]">
      <div
        className={`flex h-[130px] items-center justify-center bg-gradient-to-br font-display text-5xl text-gold ${artGradients[index % artGradients.length]}`}
      >
        {service.icon}
      </div>
      <div className="p-[17px]">
        <h3 className="mb-1.5 text-[15px]">{service.name}</h3>
        <div className="font-mono text-xs text-muted">{service.description}</div>
        <div className="mt-3.5 flex items-center justify-between font-extrabold text-gold-2">
          {formatMoney(service.price)}
          <Link
            href={`/agendamento?service=${service.id}`}
            className="text-xs font-extrabold text-gold"
          >
            SELECIONAR →
          </Link>
        </div>
        <div className="mt-1.5 font-mono text-xs text-muted">
          ◷ {service.durationMinutes} min · com especialista
        </div>
      </div>
    </article>
  );
}
