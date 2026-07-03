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
  title: "Dylan Caballero | AI Automation & Full-Stack Engineer",
  description:
    "AI automation and full-stack engineer building agents, workflow automations, OpenAI integrations, secure IAM experiences, and production web applications.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Dylan Caballero | AI Automation & Full-Stack Engineer",
    description:
      "Portfolio of Dylan Caballero, an engineer focused on AI agents, workflow automation, OpenAI integrations, secure IAM products, and full-stack delivery.",
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
