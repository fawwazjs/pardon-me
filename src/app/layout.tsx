import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Untuk Bita | Sebuah Surat",
  description:
    "Sebuah surat yang mungkin terlambat kusampaikan dengan cara yang benar. Dibuat dengan harapan, bukan paksaan.",
  openGraph: {
    title: "Untuk Bita",
    description: "Sebuah surat yang mungkin terlambat kusampaikan dengan cara yang benar.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${jakarta.variable} ${jetbrainsMono.variable} dark scroll-smooth`}>
      <body className="font-sans antialiased min-h-screen selection:bg-rose-400/30 selection:text-stone-900 dark:selection:text-white">
        {children}
      </body>
    </html>
  );
}
