import type { Metadata } from "next";
import "./globals.css";
import { Montserrat, Poppins } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const poppins = Poppins({ subsets: ["latin"], weight: ["300","400","500","600","700"], variable: "--font-poppins" });

export const metadata: Metadata = {
  title: "JP | Mentoria, Consultoria e Suplementos",
  description: "Landing com carrossel e links oficiais.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${montserrat.variable} ${poppins.variable}`} style={{fontFamily: "var(--font-poppins), var(--font-montserrat), system-ui, Arial"}}>
        {children}
      </body>
    </html>
  );
}