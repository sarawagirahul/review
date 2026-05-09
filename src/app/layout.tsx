import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JustHustle - Professional Reputation Management for Indian Businesses",
  description:
    "Collect authentic Google reviews, manage customer feedback privately, and grow your online presence with a simple QR code flow. Built for Indian businesses by Goself.",
  keywords: [
    "google reviews",
    "reputation management",
    "local SEO",
    "review management",
    "customer feedback",
    "QR code reviews",
    "business reviews",
    "Indian businesses",
    "private feedback channel",
  ],
  authors: [{ name: "Goself" }],
  creator: "Goself",
  openGraph: {
    title: "JustHustle - Professional Reputation Management for Indian Businesses",
    description:
      "Collect authentic Google reviews, manage customer feedback privately, and grow your online presence transparently.",
    type: "website",
    url: "https://justhustle.in",
    siteName: "JustHustle",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JustHustle - Professional Reputation Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JustHustle - Professional Reputation Management for Indian Businesses",
    description:
      "Collect authentic Google reviews, manage customer feedback privately, and grow your online presence transparently.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://justhustle.in",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="overflow-x-hidden">{children}</div>
      </body>
    </html>
  );
}
