import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NetUP - Red Social",
  description: "Conecta, comparte y descubre. La red social para todos.",
  authors: [
    {
      name: "Franckracko",
      url: "https://franckcracko.vercel.app/"
    }
  ],
  keywords: [
    "red social",
    "conectar",
    "compartir",
    "descubrir",
    "comunidad",
    "interacción",
    "contenido",
    "usuarios"
  ],
  openGraph: {
    title: "NetUP - Red Social",
    description: "Conecta, comparte y descubre. La red social para todos.",
    url: "https://netup.space",
    siteName: "NetUP",
    // images: [
    //   {
    //     url: "/og-image.png",
    //     width: 1200,
    //     height: 630,
    //     alt: "NetUP - Red Social",
    //   },
    // ],
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
