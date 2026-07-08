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
  title: "Dylan Caballero | Full Stack Software Engineer, IAM + AI Automation",
  description:
    "Full Stack Software Engineer specializing in IAM, OAuth 2.0, MFA, ForgeRock, and production AI agent and automation development with LangChain, CrewAI, n8n, and OpenAI/Claude APIs.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Dylan Caballero | Full Stack Software Engineer, IAM + AI Automation",
    description:
      "Portfolio of Dylan Caballero, a Full Stack Software Engineer focused on enterprise IAM, OAuth 2.0, MFA, ForgeRock, and production AI agents and automations.",
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
