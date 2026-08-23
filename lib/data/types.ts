// Tipos e helpers puros (sem acesso a banco) — podem ser importados tanto
// por Server quanto por Client Components. As funções que de fato buscam
// dados (server-only) ficam em lib/data/catalog.ts.

export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  icon: string;
};

export type Professional = {
  id: string;
  fullName: string;
  initials: string;
  specialty: string;
  rating: string;
  hoursLabel: string;
};

export type ShopSettings = {
  name: string;
  whatsapp: string;
  city: string;
  email: string;
};

export function formatMoney(value: number): string {
  return "R$ " + value.toFixed(2).replace(".", ",");
}
