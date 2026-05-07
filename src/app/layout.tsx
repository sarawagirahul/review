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
  keywords: ["google reviews", "local SEO", "review automation", "AI reviews", "QR code reviews"],
  openGraph: {
    title: "ReviewBoost - Turn Happy Customers Into 5-Star Reviews",
    description: "One QR code. AI-crafted review drafts. Posted to Google in seconds.",
    type: "website",
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
