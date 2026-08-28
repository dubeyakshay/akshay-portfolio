import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { getPublishedContent } from "@/lib/content";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublishedContent();
  const { seo, profile } = content;
  return {
    title: seo.title || `${profile.name} — ${profile.title}`,
    description: seo.description,
    keywords: seo.keywords ? seo.keywords.split(",").map((k) => k.trim()) : undefined,
    metadataBase: seo.siteUrl ? new URL(seo.siteUrl) : undefined,
    openGraph: {
      title: seo.title || `${profile.name} — ${profile.title}`,
      description: seo.description,
      type: "website",
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-base-950 font-sans">{children}</body>
    </html>
  );
}
