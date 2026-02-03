import type { Metadata } from "next";

import "./globals.css";
import { Exo_2 } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./providers";

const inter = Exo_2({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UNIVERSIDAD TÉCNICA DE COTOPAXI",
  description: "Registro de competidores 10K COTOPAXI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
