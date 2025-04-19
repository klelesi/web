import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Footer from "@/components/footer";
import { Providers } from "@/components/providers";
import React from "react";

config.autoAddCss = false;

export const metadata: Metadata = {
  title: "Klele.si | Kjer so dobre debate doma",
  description: "Kjer so dobre debate doma.",
  openGraph: {
    siteName: "Klele.si",
    type: "website",
    images: "/images/seo.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sl">
      <head>
        <title>Klele.si | Kjer so dobre debate doma</title>
        <link rel="shortcut icon" type="image/jpg" href="/images/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Kulim+Park:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <Providers>
        <body className={"sans bg-beige h-screen overflow-none flex flex-col"}>
          <Navbar />
          <main className="flex-1 py-3 overflow-auto">{children}</main>
          <Footer />
        </body>
      </Providers>
    </html>
  );
}
