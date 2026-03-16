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

const fallbackSettings = {
  businessName: "Tedeset Cafe and Marketplace",
  address: "10240 NE Halsey St, Portland, OR 97220",
  phone: "(503) 555-0142",
  email: "tedesetmarketcafe@gmail.com",
  hours: "Daily · 9am–9pm",
  doorDashUrl: null as string | null,
  uberEatsUrl: null as string | null,
  socialLinks: [] as { label: string; url: string }[] | null
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  let settings;
  try {
    settings = await getSiteSettings();
  } catch {
    settings = fallbackSettings;
  }
  if (!settings) settings = fallbackSettings;

  const businessName =
    settings?.businessName || "Tedeset Cafe and Marketplace";
  const address =
    settings?.address || "10240 NE Halsey St, Portland, OR 97220";
  const orderUrl = "https://www.ubereats.com/store/tedeset-market-and-cafe-10240a-northeast-halsey-street/9vv36UqmWXShQl442xxvQw?diningMode=DELIVERY";

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">
        <SiteHeader orderUrl={orderUrl} phone={settings?.phone} />
        <main className="page-shell">{children}</main>
        <SiteFooter
          businessName={businessName}
          address={address}
          phone={settings?.phone}
          email={settings?.email}
          hours={settings?.hours}
          orderUrl={orderUrl}
          socialLinks={settings?.socialLinks}
        />
        <StickyOrderButton orderUrl={orderUrl} phone={settings?.phone} />
      </body>
    </html>
  );
}

