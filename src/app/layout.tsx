import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "./providers"; // Importa o provedor

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Controle de Contas",
  description: "Organize suas finanças de forma simples.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {/* Envolve todo o conteúdo com o provedor de autenticação */}
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}