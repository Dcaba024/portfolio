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
  metadataBase: new URL("https://dylancaballero.dev"),
  title: "Dylan Caballero | Full-Stack Software Engineer",
  description:
    "Full-stack software engineer skilled in React, Next.js, Java, Spring Boot, IAM, and AI-assisted product development.",
  openGraph: {
    title: "Dylan Caballero | Full-Stack Software Engineer",
    description:
      "Portfolio of Dylan Caballero — full-stack software engineer focused on secure web products, Java/Spring Boot backends, React interfaces, IAM, and AI features.",
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
