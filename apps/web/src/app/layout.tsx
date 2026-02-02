import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StickyOrderButton } from "@/components/StickyOrderButton";
import { getSiteSettings } from "@/lib/sanity.queries";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: "Tedeset Cafe and Marketplace",
    template: "%s | Tedeset Cafe"
  },
  description:
    "Premium cafe and curated marketplace in Portland. Espresso, teas, pastries, and artisan goods.",
  metadataBase: new URL("https://tedesetcafe.com"),
  openGraph: {
    title: "Tedeset Cafe and Marketplace",
    description:
      "Premium cafe and curated marketplace in Portland. Espresso, teas, pastries, and artisan goods.",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Tedeset Cafe and Marketplace"
      }
    ]
  }
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  const businessName =
    settings?.businessName || "Tedeset Cafe and Marketplace";
  const address =
    settings?.address || "10240 NE Halsey St, Portland, OR 97220";

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">
        <SiteHeader orderUrl={settings?.doorDashUrl} />
        <main className="page-shell">{children}</main>
        <SiteFooter
          businessName={businessName}
          address={address}
          phone={settings?.phone}
          email={settings?.email}
          hours={settings?.hours}
          socialLinks={settings?.socialLinks}
        />
        <StickyOrderButton orderUrl={settings?.doorDashUrl} />
      </body>
    </html>
  );
}

