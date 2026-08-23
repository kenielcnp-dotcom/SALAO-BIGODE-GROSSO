import type { Metadata } from "next";
import { Playfair_Display, Manrope, DM_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Bigode Grosso — Gestão Premium",
  description: "Barbearia premium em Campo Novo do Parecis — MT",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${manrope.variable} ${dmMono.variable}`}
    >
      <body className="min-h-screen bg-bg font-sans text-[14px] text-cream antialiased">
        {children}
      </body>
    </html>
  );
}
