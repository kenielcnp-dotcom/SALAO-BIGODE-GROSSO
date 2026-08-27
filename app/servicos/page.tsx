import { Nav } from "@/components/public/Nav";
import { Footer } from "@/components/public/Footer";
import { ServiceCard } from "@/components/public/ServiceCard";
import { getServices } from "@/lib/data/catalog";

export const metadata = { title: "Serviços — Bigode Grosso" };

export default async function ServicosPage() {
  const services = await getServices();

  return (
    <>
      <Nav />
      <main className="px-[7vw] py-[58px]">
        <div className="eyebrow">A experiência Bigode Grosso</div>
        <h1 className="my-2 font-nbarchitekt text-[45px] font-semibold">
          Escolha o seu ritual.
        </h1>
        <p className="copy-muted max-w-[610px]">
          Técnica precisa, produtos selecionados e profissionais que
          respeitam a sua identidade.
        </p>
        <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
