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
              "radial-gradient(circle at 75% 30%, #31261970 0, transparent 30%), linear-gradient(115deg, #090b0c 40%, #111516)",
          }}
        >
          <div>
            <div className="eyebrow">
              Barbearia premium · {shop.city}
            </div>
            <h1 className="my-4 font-display text-[clamp(40px,5vw,72px)] leading-[1.04] font-semibold">
              Seu estilo merece <em className="text-gold-2 not-italic">presença.</em>
            </h1>
            <p className="max-w-[540px] text-base leading-[1.7] text-[#c4c3bc]">
              Visagismo Personalizado. Corte e Barba de Excelência. Designer de
              Sobrancelha. Um ritual de cuidado feito para a sua melhor versão.
            </p>
            <div className="my-8 flex flex-wrap gap-3">
              <Link href="/agendamento" className="btn-gold">
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
            <div className="flex flex-wrap gap-7 text-xs text-muted">
              <span>⌖ {shop.city}</span>
              <span>◉ {shop.whatsapp}</span>
            </div>
          </div>
          <div className="relative h-[370px] overflow-hidden rounded-xl border border-[#3e3525] bg-[#0c0d0e] md:h-[495px]">
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
                  "linear-gradient(90deg, #090b0c90, transparent 50%, #090b0c20), linear-gradient(0deg, #090b0c80, transparent 40%)",
              }}
            />
            <div className="absolute bottom-6 left-6 z-[1] border-l-2 border-gold pl-3">
              <b className="block font-display text-2xl font-semibold">
                Bigode Grosso
              </b>
              <span className="text-xs text-gold-2">
                Excelência em cada detalhe
              </span>
            </div>
          </div>
        </section>

        <section className="bg-[#0d1011] px-[7vw] py-[85px]">
          <div className="mb-8 flex items-end justify-between gap-5">
            <div>
              <div className="eyebrow">O seu momento</div>
              <h2 className="my-2 font-display text-[37px] font-semibold">
                Serviços com assinatura.
              </h2>
            </div>
            <Link href="/servicos" className="eyebrow cursor-pointer">
              VER TODOS →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.slice(0, 4).map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))}
          </div>
        </section>

        <section className="px-[7vw] py-[85px]">
          <div className="mb-8 flex items-end justify-between gap-5">
            <div>
              <div className="eyebrow">Quem vive, recomenda</div>
              <h2 className="my-2 font-display text-[37px] font-semibold">
                Mais do que um corte.
              </h2>
            </div>
            <p className="max-w-[610px] leading-[1.7] text-muted">
              Ambiente, técnica e atenção que fazem do atendimento uma
              experiência.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {testimonials.map((t) => (
              <article key={t.author} className="panel p-6">
                <p className="mb-5 font-display text-lg leading-[1.6] font-medium">
                  {t.quote}
                </p>
                <small className="text-gold">★★★★★ · {t.author}</small>
              </article>
            ))}
          </div>
        </section>

        <section
          className="flex flex-col items-start justify-between gap-6 px-[7vw] py-[70px] sm:flex-row sm:items-center"
          style={{
            background: "linear-gradient(110deg, #1c160d, #0d1111)",
          }}
        >
          <div>
            <div className="eyebrow">Seu próximo nível começa aqui</div>
            <h2 className="my-1.5 font-display text-4xl font-semibold">
              Reserve seu horário.
            </h2>
            <p className="text-muted">
              Escolha seu serviço e profissional em menos de dois minutos.
            </p>
          </div>
          <Link href="/agendamento" className="btn-gold">
            AGENDAR ATENDIMENTO →
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
