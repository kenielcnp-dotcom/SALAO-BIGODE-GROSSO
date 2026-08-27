import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

/**
 * nbarchitekt is not publicly licensed; Space Grotesk is the substitute named
 * in the style reference — a geometric sans with comparable x-height.
 */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Bigode Grosso — Gestão Premium",
  description: "Barbearia premium em Campo Novo do Parecis — MT",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={spaceGrotesk.variable}>
      <body className="min-h-screen bg-void-black font-nbarchitekt text-[14px] text-ghost-white antialiased">
        {children}
      </body>
    </html>
  );
}
