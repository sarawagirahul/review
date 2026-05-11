import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JustHustle — Professional Reputation Management for Indian Businesses",
  description:
    "JustHustle is a professional reputation management platform for Indian businesses. Connect your Google Business Profile via official API, collect authentic reviews, and manage customer feedback — built by Goself Technologies, Bengaluru.",
  keywords: [
    "google business profile management",
    "reputation management software India",
    "google review management",
    "local business reputation",
    "customer feedback management",
    "google business profile API",
    "online reputation management India",
    "business review software",
  ],
  authors: [{ name: "Goself Technologies" }],
  creator: "Goself Technologies",
  openGraph: {
    title: "JustHustle — Professional Reputation Management for Indian Businesses",
    description:
      "Connect your Google Business Profile, collect authentic customer reviews, and manage feedback professionally. Official Google Business Profile API integration.",
    type: "website",
    url: "https://justhustle.in",
    siteName: "JustHustle",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JustHustle — Professional Reputation Management for Indian Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JustHustle — Professional Reputation Management for Indian Businesses",
    description:
      "Professional reputation management for Indian businesses. Official Google Business Profile API integration.",
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
