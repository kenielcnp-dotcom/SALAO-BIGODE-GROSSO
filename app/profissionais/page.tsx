import { Nav } from "@/components/public/Nav";
import { Footer } from "@/components/public/Footer";
import { ProCard } from "@/components/public/ProCard";
import { getProfessionals } from "@/lib/data/catalog";

export const metadata = { title: "Profissionais — Bigode Grosso" };

export default async function ProfissionaisPage() {
  const professionals = await getProfessionals();

  return (
    <>
      <Nav />
      <main className="px-[7vw] py-[58px]">
        <div className="eyebrow">Time de especialistas</div>
        <h1 className="my-2 font-display text-[45px] font-semibold">
          Profissionais de presença.
        </h1>
        <div className="mt-9 grid grid-cols-1 gap-4.5 md:grid-cols-3">
          {professionals.map((pro) => (
            <ProCard key={pro.id} pro={pro} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
