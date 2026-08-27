import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/public/Nav";
import { Footer } from "@/components/public/Footer";
import { ServiceCard } from "@/components/public/ServiceCard";
import { getServices, getShopSettings } from "@/lib/data/catalog";

const testimonials = [
  {
    quote:
      "“O visagismo mudou minha relação com a imagem. Atendimento impecável.”",
    author: "Gustavo N.",
  },
  {
    quote:
      "“Ambiente elegante e profissionais que realmente entendem de estilo.”",
    author: "Matheus R.",
  },
  {
    quote: "“Minha agenda fixa de cuidado. Consistência rara de encontrar.”",
    author: "Leonardo S.",
  },
];

export default async function HomePage() {
  const [services, shop] = await Promise.all([
    getServices(),
    getShopSettings(),
  ]);

  return (
    <>
      <Nav />
      <main>
        <section
          className="grid min-h-[665px] grid-cols-1 items-center gap-12 overflow-hidden px-[7vw] py-[90px] md:grid-cols-[1.05fr_0.95fr]"
          style={{
            background:
              "radial-gradient(circle at 18% 12%, rgba(52,55,85,0.55) 0, transparent 42%), radial-gradient(circle at 82% 78%, rgba(52,55,85,0.28) 0, transparent 38%), #000000",
          }}
        >
          <div>
            <div className="eyebrow">
              Barbearia premium · {shop.city}
            </div>
            <h1 className="my-4 font-nbarchitekt text-[clamp(40px,5vw,72px)] leading-[1.04] font-semibold">
              Seu estilo merece <em className="text-ghost-white not-italic">presença.</em>
            </h1>
            <p className="copy-muted max-w-[540px]">
              Visagismo Personalizado. Corte e Barba de Excelência. Designer de
              Sobrancelha. Um ritual de cuidado feito para a sua melhor versão.
            </p>
            <div className="my-8 flex flex-wrap gap-3">
              <Link href="/agendamento" className="btn-pill">
                AGENDAR ATENDIMENTO →
              </Link>
              <a
                href={`https://wa.me/55${shop.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                ◉ FALAR NO WHATSAPP
              </a>
            </div>
            <div className="flex flex-wrap gap-7 text-xs text-pale-mist">
              <span>⌖ {shop.city}</span>
              <span>◉ {shop.whatsapp}</span>
            </div>
          </div>
          <div className="relative h-[370px] overflow-hidden rounded-xl border border-ash-border bg-void-black md:h-[495px]">
            <Image
              src="/dono-bigode-grosso.jpg"
              alt="Proprietário da Barbearia Bigode Grosso"
              fill
              className="object-cover object-center"
              priority
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(0,0,0,0.6), transparent 50%, rgba(0,0,0,0.15)), linear-gradient(0deg, rgba(0,0,0,0.55), transparent 40%)",
              }}
            />
            <div className="absolute bottom-6 left-6 z-[1] border-l-2 border-white/60 pl-3">
              <b className="block font-nbarchitekt text-2xl font-semibold">
                Bigode Grosso
              </b>
              <span className="text-xs text-ghost-white">
                Excelência em cada detalhe
              </span>
            </div>
          </div>
        </section>

        <section className="border-y border-ash-border px-[7vw] py-[85px]">
          <div className="mb-8 flex items-end justify-between gap-5">
            <div>
              <div className="eyebrow">O seu momento</div>
              <h2 className="my-2 font-nbarchitekt text-[37px] font-semibold">
                Serviços com assinatura.
              </h2>
            </div>
            <Link href="/servicos" className="eyebrow cursor-pointer">
              VER TODOS →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.slice(0, 4).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>

        <section className="px-[7vw] py-[85px]">
          <div className="mb-8 flex items-end justify-between gap-5">
            <div>
              <div className="eyebrow">Quem vive, recomenda</div>
              <h2 className="my-2 font-nbarchitekt text-[37px] font-semibold">
                Mais do que um corte.
              </h2>
            </div>
            <p className="copy-muted max-w-[610px]">
              Ambiente, técnica e atenção que fazem do atendimento uma
              experiência.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {testimonials.map((t) => (
              <article key={t.author} className="panel p-6">
                <p className="copy mb-5">{t.quote}</p>
                <small className="text-pale-mist">★★★★★ · {t.author}</small>
              </article>
            ))}
          </div>
        </section>

        <section
          className="flex flex-col items-start justify-between gap-6 px-[7vw] py-[70px] sm:flex-row sm:items-center"
          style={{
            background:
              "radial-gradient(circle at 12% 50%, rgba(52,55,85,0.4) 0, transparent 55%), #000000",
          }}
        >
          <div>
            <div className="eyebrow">Seu próximo nível começa aqui</div>
            <h2 className="my-1.5 font-nbarchitekt text-4xl font-semibold">
              Reserve seu horário.
            </h2>
            <p className="copy-muted">
              Escolha seu serviço e profissional em menos de dois minutos.
            </p>
          </div>
          <Link href="/agendamento" className="btn-pill">
            AGENDAR ATENDIMENTO →
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
