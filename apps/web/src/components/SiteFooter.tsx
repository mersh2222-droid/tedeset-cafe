import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { Separator } from "@/components/ui/separator";

interface SiteFooterProps {
  businessName: string;
  address: string;
  phone?: string | null;
  email?: string | null;
  hours?: string | null;
  socialLinks?: { label: string; url: string }[] | null;
}

export function SiteFooter({
  businessName,
  address,
  phone,
  email,
  hours,
  socialLinks
}: SiteFooterProps) {
  const socials =
    socialLinks?.length
      ? socialLinks
      : [
          { label: "Instagram", url: "https://instagram.com" },
          { label: "Facebook", url: "https://facebook.com" },
          { label: "TikTok", url: "https://tiktok.com" }
        ];

  return (
    <footer className="border-t border-border/70 bg-[linear-gradient(180deg,#fff7ef_0%,#ffffff_45%)]">
      <div className="container section grid gap-10 md:grid-cols-[1.1fr_0.9fr_0.8fr]">
        <Reveal className="space-y-4">
          <p className="text-xl font-semibold tracking-tight font-display">{businessName}</p>
          <p className="text-sm text-muted-foreground">{address}</p>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            {socials.map((social) => (
              <Link
                key={social.label}
                href={social.url}
                className="rounded-full border border-border px-3 py-1 transition hover:border-primary hover:text-foreground"
                target="_blank"
                rel="noreferrer"
              >
                {social.label}
              </Link>
            ))}
          </div>
        </Reveal>
        <Reveal className="space-y-3 text-sm text-muted-foreground">
          {phone ? <p>Phone: {phone}</p> : null}
          {email ? <p>Email: {email}</p> : null}
          {hours ? <p>Hours: {hours}</p> : null}
        </Reveal>
        <Reveal className="space-y-3 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Explore</p>
          <nav className="flex flex-col gap-2">
            <Link href="/menu" className="hover:text-foreground">
              Menu
            </Link>
            <Link href="/marketplace" className="hover:text-foreground">
              Marketplace
            </Link>
            <Link href="/order" className="hover:text-foreground">
              Order Online
            </Link>
            <Link href="/contact" className="hover:text-foreground">
              Contact
            </Link>
          </nav>
        </Reveal>
      </div>
      <Separator />
      <Reveal className="container flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted-foreground md:flex-row">
        <p>© {new Date().getFullYear()} {businessName}. All rights reserved.</p>
        <p>Crafted for warm, premium cafe experiences.</p>
      </Reveal>
      <div className="container pb-10">
        <div className="card-glass">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Founder’s note
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            “Every cup and every item is chosen to reflect care, culture, and a
            welcoming Portland community. Thank you for being part of our story.”
          </p>
        </div>
      </div>
    </footer>
  );
}

