import { Nav } from "@/components/public/Nav";
import { Footer } from "@/components/public/Footer";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { getProfessionals, getServices } from "@/lib/data/catalog";

export const metadata = { title: "Agendamento — Bigode Grosso" };

export default async function AgendamentoPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; pro?: string }>;
}) {
  const [services, professionals, params] = await Promise.all([
    getServices(),
    getProfessionals(),
    searchParams,
  ]);

  return (
    <>
      <Nav />
      <main className="px-[7vw] py-[58px]">
        <div className="eyebrow">Agendamento online</div>
        <h1 className="my-2 font-display text-[45px] font-semibold">
          Em poucos passos, você reserva o seu melhor horário.
        </h1>
        <BookingWizard
          services={services}
          professionals={professionals}
          initialServiceId={
            services.find((s) => s.id === params.service)?.id ?? null
          }
          initialProfessionalId={
            professionals.find((p) => p.id === params.pro)?.id ?? null
          }
        />
      </main>
      <Footer />
    </>
  );
}
