import type { Metadata } from "next";
import { sansation } from "./fonts/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Platonautas",
  description: "Platonautas - Tu plataforma de viajes espaciales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
