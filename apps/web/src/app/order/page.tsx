import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/sanity.queries";

export const metadata: Metadata = {
  title: "Order Online",
  description: "Order Tedeset Cafe favorites via DoorDash."
};

export default async function OrderPage() {
  const settings = await getSiteSettings();
  const doorDashUrl = settings?.doorDashUrl || "https://example.com";

  return (
    <section className="section">
      <div className="container space-y-10">
        <div className="section-divider">Order Online</div>
        <SectionHeader
          title="Order Online"
          description="Place your order through DoorDash and enjoy our cafe favorites at home or work."
        />
        <div className="section-frame">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal className="space-y-4 rounded-[2.5rem] border border-border/70 bg-white/85 p-6 shadow-sm backdrop-blur">
            <h3 className="text-lg font-semibold">DoorDash Ordering</h3>
            <p className="text-sm text-muted-foreground">
              Tap the button to open DoorDash in a new tab. Our team prepares
              each order with the same care you experience in the cafe.
            </p>
            <Button asChild size="lg" variant="accent">
              <Link href={doorDashUrl} target="_blank" rel="noreferrer">
                Order on DoorDash
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              Update the DoorDash URL in Sanity Studio under Site Settings.
            </p>
            </Reveal>
            <Reveal className="space-y-4 rounded-[2.5rem] border border-border/70 bg-white/85 p-6 shadow-sm backdrop-blur">
            <h3 className="text-lg font-semibold">Pickup & Delivery</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Choose pickup or delivery directly in DoorDash.</li>
              <li>Marketplace items remain inquiry-only.</li>
              <li>Need help? Contact us and we'll assist quickly.</li>
            </ul>
            <Button asChild variant="outline">
              <Link href="/contact">Contact Us</Link>
            </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

