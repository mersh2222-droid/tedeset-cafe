import type { Metadata } from "next";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { BrandStamp } from "@/components/BrandStamp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSiteSettings } from "@/lib/sanity.queries";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Tedeset Cafe and Marketplace."
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const businessName =
    settings?.businessName || "Tedeset Cafe and Marketplace";
  const address =
    settings?.address || "10240 NE Halsey St, Portland, OR 97220";
  const mapQuery = encodeURIComponent(address);

  return (
    <section className="section">
      <div className="container space-y-10">
        <div className="section-divider">Contact</div>
        <SectionHeader
          title="Contact"
          description="We'd love to hear from you. Use the form or stop by the cafe."
        />
        <div className="flex justify-end">
          <BrandStamp label="Visit + Connect" />
        </div>
        <div className="section-frame">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal className="space-y-6 rounded-[2.5rem] border border-border/70 bg-white/85 p-6 shadow-sm backdrop-blur">
            <h3 className="text-lg font-semibold">{businessName}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-accent/40 p-4 text-sm text-muted-foreground">
                <MapPin className="mt-1 h-4 w-4 text-foreground" />
                <div>
                  <p className="font-medium text-foreground">Address</p>
                  <p>{address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-accent/40 p-4 text-sm text-muted-foreground">
                <Clock className="mt-1 h-4 w-4 text-foreground" />
                <div>
                  <p className="font-medium text-foreground">Hours</p>
                  <p>{settings?.hours || "Daily · 9am–9pm"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-accent/40 p-4 text-sm text-muted-foreground">
                <Phone className="mt-1 h-4 w-4 text-foreground" />
                <div>
                  <p className="font-medium text-foreground">Phone</p>
                  <p>{settings?.phone || "(503) 555-0142"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-accent/40 p-4 text-sm text-muted-foreground">
                <Mail className="mt-1 h-4 w-4 text-foreground" />
                <div>
                  <p className="font-medium text-foreground">Email</p>
                  <p>{settings?.email || "hello@tedesetcafe.com"}</p>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-[2.5rem] border border-border/70">
              <iframe
                title="Google Maps"
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                className="h-64 w-full"
                loading="lazy"
              />
            </div>
            </Reveal>
            <Reveal className="space-y-4 rounded-[2.5rem] border border-border/70 bg-white/85 p-6 shadow-sm backdrop-blur">
            <h3 className="text-lg font-semibold">Send a message</h3>
            <p className="text-sm text-muted-foreground">
              This form uses Formspree. Replace the placeholder endpoint with your
              live Formspree URL.
            </p>
            <form
              className="space-y-4"
              action="https://formspree.io/f/your-form-id"
              method="POST"
            >
              <Input name="name" placeholder="Your name" required />
              <Input name="email" placeholder="Email address" type="email" required />
              <Input name="subject" placeholder="Subject" />
              <textarea
                name="message"
                className="min-h-[140px] w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                placeholder="Message"
                required
              />
              <Button type="submit" size="lg">
                Send Message
              </Button>
            </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

