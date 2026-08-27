import { getShopSettings } from "@/lib/data/catalog";

export async function Footer() {
  const shop = await getShopSettings();

  return (
    <footer className="flex flex-col gap-2 border-t border-ash-border px-[7vw] py-8 text-xs text-smoke sm:flex-row sm:justify-between">
      <span>© {new Date().getFullYear()} {shop.name}</span>
      <span>
        {shop.city} · {shop.whatsapp}
      </span>
    </footer>
  );
}
