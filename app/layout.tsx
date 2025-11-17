import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "Dylan Caballero | Front-End Developer",
  description:
    "Front-End Developer skilled in React, Next.js, and Tailwind. Former Deloitte engineer passionate about sleek UI and modern web experiences.",
  openGraph: {
    title: "Dylan Caballero | Front-End Developer",
    description:
      "Portfolio of Dylan Caballero — React developer and UI specialist based in Florida.",
    url: "https://dylancaballero.dev",
    siteName: "Dylan Caballero Portfolio",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "Dylan Caballero Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
