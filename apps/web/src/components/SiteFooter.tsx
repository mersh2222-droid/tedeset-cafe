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
  const phoneDigits = phone ? phone.replace(/\D/g, "") : null;
  const phoneDial = phoneDigits
    ? phoneDigits.length === 10
      ? `1${phoneDigits}`
      : phoneDigits
    : null;
  const phoneHref = phoneDial ? `tel:+${phoneDial}` : null;
  const formattedPhone = phoneDigits
    ? phoneDigits.length === 11 && phoneDigits.startsWith("1")
      ? `+1 (${phoneDigits.slice(1, 4)}) ${phoneDigits.slice(4, 7)}-${phoneDigits.slice(7)}`
      : phoneDigits.length === 10
        ? `+1 (${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(3, 6)}-${phoneDigits.slice(6)}`
        : phone
    : phone;
  const socials =
    socialLinks?.length
      ? socialLinks
      : [
          {
            label: "Instagram",
            url: "https://www.instagram.com/tedesetmarketandcafe?igsh=MWNibzRtOGxrdDlkNw%3D%3D&utm_source=qr"
          },
          {
            label: "Facebook",
            url: "https://www.facebook.com/share/1FYA2bVSLK/?mibextid=wwXIfr"
          }
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
        <Reveal className="space-y-4">
          <div className="card-glass group space-y-4 p-6 transition hover:-translate-y-1 hover:shadow-soft">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-white/70 text-primary shadow-sm transition group-hover:scale-105">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h1.5a1.5 1.5 0 0 0 1.5-1.5v-2.636a1.5 1.5 0 0 0-1.019-1.416l-3.122-1.041a1.5 1.5 0 0 0-1.662.517l-.843 1.125a12.03 12.03 0 0 1-5.355-5.355l1.125-.843a1.5 1.5 0 0 0 .517-1.662L7.302 4.77A1.5 1.5 0 0 0 5.886 3.75H3.75a1.5 1.5 0 0 0-1.5 1.5v1.5Z"
                  />
                </svg>
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Phone</p>
                {formattedPhone ? (
                  <p className="text-base font-semibold text-foreground">{formattedPhone}</p>
                ) : (
                  <p className="text-base font-semibold text-foreground">Available on request</p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              {email ? (
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-white/70 text-muted-foreground">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a1.5 1.5 0 0 1-1.5 1.5h-16.5a1.5 1.5 0 0 1-1.5-1.5V6.75m19.5 0A1.5 1.5 0 0 0 20.25 5.25h-16.5A1.5 1.5 0 0 0 2.25 6.75m19.5 0-9.75 6-9.75-6"
                      />
                    </svg>
                  </span>
                  <span>{email}</span>
                </div>
              ) : null}
              {hours ? (
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-white/70 text-muted-foreground">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </span>
                  <span>{hours}</span>
                </div>
              ) : null}
            </div>
            {phoneHref ? (
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={phoneHref}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary-foreground shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h1.5a1.5 1.5 0 0 0 1.5-1.5v-2.636a1.5 1.5 0 0 0-1.019-1.416l-3.122-1.041a1.5 1.5 0 0 0-1.662.517l-.843 1.125a12.03 12.03 0 0 1-5.355-5.355l1.125-.843a1.5 1.5 0 0 0 .517-1.662L7.302 4.77A1.5 1.5 0 0 0 5.886 3.75H3.75a1.5 1.5 0 0 0-1.5 1.5v1.5Z"
                    />
                  </svg>
                  Call now
                </Link>
                <span className="text-xs text-muted-foreground">Tap to connect instantly</span>
              </div>
            ) : null}
            <Link
              href="/faq"
              className="group inline-flex w-full items-center justify-between gap-3 rounded-2xl border border-border/70 bg-white/70 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:bg-white hover:shadow-md"
            >
              <span className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border/70 bg-white text-[0.6rem] font-semibold text-foreground transition group-hover:border-primary/50 group-hover:bg-primary/5">
                  ?
                </span>
                FAQ
              </span>
              <span className="text-xs text-muted-foreground transition group-hover:text-foreground">
                Quick answers →
              </span>
            </Link>
          </div>
        </Reveal>
        <Reveal className="md:justify-self-end">
          <div className="card-glass group relative overflow-hidden space-y-4 p-6 text-sm text-muted-foreground">
            <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
              <div className="absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.75),transparent_55%)]" />
            </div>
            <p className="relative font-medium text-foreground">Explore</p>
            <nav className="relative flex flex-col gap-2 items-start">
              {[
                { label: "Menu", href: "/menu" },
                { label: "Marketplace", href: "/marketplace" },
                { label: "Order Online", href: "/order" },
                { label: "Contact", href: "/contact" }
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group/link flex w-full items-center justify-between gap-3 rounded-full border border-transparent px-3 py-2 transition hover:border-border/70 hover:bg-white/70 hover:text-foreground"
                >
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary/60 transition group-hover/link:scale-110" />
                    <span>{item.label}</span>
                  </span>
                  <span className="text-xs text-muted-foreground transition group-hover/link:text-foreground">
                    →
                  </span>
                </Link>
              ))}
            </nav>
          </div>
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

