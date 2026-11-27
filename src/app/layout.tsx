import type { Metadata } from "next";
import {
  Plus_Jakarta_Sans,
  Outfit,
  DM_Sans,
  Inter,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import { AppShell } from "@/components/AppShell";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dmsans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "PropPulse AI | Real Estate CRM & Market Intelligence",
  description:
    "PropPulse AI — Unified Real Estate CRM, Project & Property Inventory, GIS Market Map, Competitor Radar, Opportunity Scoring, and Expansion Signal Platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="emerald"
      data-font="outfit"
      data-motion="smooth"
      className={`${jakarta.variable} ${outfit.variable} ${dmSans.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AuthProvider>
          <AppProvider>
            <AppShell>{children}</AppShell>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
