import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ReviewBoost - Turn Happy Customers Into 5-Star Google Reviews",
  description:
    "One QR code. AI-crafted review drafts. Authentic 5-star Google reviews in seconds, built for premium local brands in India.",
  keywords: [
    "google reviews",
    "local SEO",
    "review automation",
    "AI reviews",
    "QR code reviews",
    "business reviews",
    "customer feedback",
  ],
  authors: [{ name: "ReviewBoost" }],
  creator: "ReviewBoost",
  openGraph: {
    title: "ReviewBoost - Turn Happy Customers Into 5-Star Reviews",
    description:
      "One QR code. AI-crafted review drafts. Posted to Google in seconds.",
    type: "website",
    url: "https://reviewboost.in",
    siteName: "ReviewBoost",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ReviewBoost - AI-powered Google Reviews",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ReviewBoost - Turn Happy Customers Into 5-Star Reviews",
    description:
      "One QR code. AI-crafted review drafts. Posted to Google in seconds.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://reviewboost.in",
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
