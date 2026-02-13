import type { Metadata } from "next";
import "./globals.css";
import { ClientPWA } from "@/components/ClientPWA";

export const metadata: Metadata = {
  title: "SherpAI | AvyTS",
  description:
    "SherpAI AvyTS demo: interactive avalanche zones, live observations, and AI guidance.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: "/icons/icon-192.svg",
  },
};

export const viewport = {
  themeColor: "#0b0d12",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SherpAI AvyTS" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body className="antialiased">
        {children}
        <ClientPWA />
      </body>
    </html>
  );
}
