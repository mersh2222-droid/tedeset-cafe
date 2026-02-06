import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Music2 } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { BrandStamp } from "@/components/BrandStamp";

interface HeroProps {
  headline: string;
  subheadline?: string | null;
  imageUrl?: string | null;
  orderUrl?: string | null;
  phone?: string | null;
  address?: string | null;
  socialLinks?: { label: string; url: string }[] | null;
}

export function Hero({
  headline,
  subheadline,
  imageUrl,
  orderUrl,
  phone,
  address,
  socialLinks
}: HeroProps) {
  const mapsUrl = address
    ? `https://www.google.com/maps?q=${encodeURIComponent(address)}`
    : "https://www.google.com/maps?q=10240%20NE%20Halsey%20St,%20Portland,%20OR%2097220";
  const phoneHref = phone ? `tel:${phone.replace(/\D/g, "")}` : null;

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

  const iconFor = (label: string) => {
    const key = label.toLowerCase();
    if (key.includes("instagram")) return <Instagram className="h-4 w-4" />;
    if (key.includes("facebook")) return <Facebook className="h-4 w-4" />;
    if (key.includes("tiktok")) return <Music2 className="h-4 w-4" />;
    return <span className="text-[0.65rem] font-semibold">S</span>;
  };

  const socialColor = (label: string) => {
    const key = label.toLowerCase();
    if (key.includes("instagram")) return "text-[#FF5FA2] border-[#FF5FA2]/70";
    if (key.includes("facebook")) return "text-[#2D7CFF] border-[#2D7CFF]/70";
    if (key.includes("tiktok")) return "text-[#33FFF5] border-[#33FFF5]/70";
    return "text-white/80 border-white/25";
  };

  return (
    <section className="relative min-h-[700px] overflow-hidden md:min-h-[860px]">
      <div className="absolute inset-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Tedeset Cafe hero"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-accent text-sm text-muted-foreground">
            Upload a hero image in Sanity
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/45 to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.22),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_25%,rgba(255,255,255,0.12),transparent_40%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-white/20" />
      </div>
      <div className="container relative z-10 grid min-h-[700px] items-center gap-10 pb-12 pt-10 md:min-h-[860px] md:pb-16 md:grid-cols-[1.1fr_0.9fr]">
        <div className="absolute right-6 top-6 hidden flex-col items-start gap-3 md:flex">
          {socials.map((social) => (
            <Link
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className={`group flex items-center gap-3 rounded-full border bg-black/30 px-3 py-2 backdrop-blur transition hover:bg-black/40 ${socialColor(
                social.label
              )}`}
              aria-label={social.label}
            >
              <span className={`rounded-full border bg-black/30 p-2 ${socialColor(
                social.label
              )}`}>
                {iconFor(social.label)}
              </span>
              <span className="max-w-0 overflow-hidden text-[0.65rem] uppercase tracking-[0.3em] transition-all duration-300 group-hover:max-w-[160px]">
                {social.label}
              </span>
            </Link>
          ))}
        </div>
        <div className="space-y-6 text-left md:space-y-8">
          <Reveal className="space-y-5">
            <div className="flex items-center gap-6 text-white/70">
              <span className="text-[0.6rem] uppercase tracking-[0.5em]">Tedeset</span>
              <span className="h-px w-16 bg-white/30" />
              <span className="text-[0.6rem] uppercase tracking-[0.5em]">Cafe & Marketplace</span>
            </div>
            <h1 className="text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-7xl font-display">
              {headline}
            </h1>
            {subheadline ? (
              <p className="max-w-xl text-sm text-white/80 sm:text-base md:text-lg">
                {subheadline}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" variant="accent">
                <Link href={phoneHref || orderUrl || "/order"}>Order Online</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/menu">Explore Menu</Link>
              </Button>
            </div>
          </Reveal>
          <Reveal className="hidden gap-3 rounded-[1.5rem] border border-white/25 bg-white/10 p-3 text-[0.65rem] text-white/80 backdrop-blur sm:grid sm:grid-cols-3 sm:rounded-[2rem] sm:p-4 sm:text-xs">
            <div>
              <p className="uppercase tracking-[0.3em] text-white/60">Roasts</p>
              <p className="mt-2 text-[0.7rem] sm:text-sm">Ethiopian heritage blends</p>
            </div>
            <div>
              <p className="uppercase tracking-[0.3em] text-white/60">Pastries</p>
              <p className="mt-2 text-[0.7rem] sm:text-sm">Fresh daily bakes</p>
            </div>
            <div>
              <p className="uppercase tracking-[0.3em] text-white/60">Goods</p>
              <p className="mt-2 text-[0.7rem] sm:text-sm">Curated pantry staples</p>
            </div>
          </Reveal>
          <Reveal className="flex items-center gap-3 md:hidden">
            {socials.map((social) => (
              <Link
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className={`rounded-full border bg-black/30 p-2 backdrop-blur transition hover:bg-black/40 ${socialColor(
                  social.label
                )}`}
              >
                {iconFor(social.label)}
              </Link>
            ))}
          </Reveal>
        </div>
        <div className="relative space-y-4 md:space-y-5">
          <Reveal className="rounded-[2rem] border border-white/30 bg-white/10 p-4 text-white shadow-soft backdrop-blur sm:rounded-[2.5rem] sm:p-6">
            <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.2em] text-white/70">
              <span>Visit us</span>
              <BrandStamp label="Portland" />
            </div>
            <p className="mt-4 text-base font-semibold text-white sm:text-xl md:text-2xl">
              {address || "10240 NE Halsey St, Portland, OR 97220"}
            </p>
            <p className="mt-2 text-xs text-white/80 sm:text-sm md:text-base">
              Espresso bar · Artisan pastries · Marketplace staples
            </p>
            <div className="mt-3 inline-flex">
              <div className="relative inline-flex items-center">
                <div className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-emerald-200/70 via-white/40 to-transparent blur-[1px] opacity-80" />
                <div className="relative inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/40 px-3 py-1 text-[0.7rem] uppercase tracking-[0.25em] text-white shadow-soft backdrop-blur">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-200/80 opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-200 shadow-[0_0_10px_rgba(167,243,208,0.9)]" />
                  </span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5 text-emerald-200 drop-shadow-[0_0_6px_rgba(167,243,208,0.8)]"
                    fill="currentColor"
                  >
                    <path d="M12 2.5a6.5 6.5 0 0 0-6.5 6.5c0 4.7 6.5 12 6.5 12s6.5-7.3 6.5-12A6.5 6.5 0 0 0 12 2.5Zm0 9.25a2.75 2.75 0 1 1 0-5.5 2.75 2.75 0 0 1 0 5.5Z" />
                  </svg>
                  <span className="whitespace-nowrap">Main Entrance · NE Halsey St</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 sm:mt-5">
              <Button asChild size="sm" variant="accent">
                <Link href={mapsUrl} target="_blank" rel="noreferrer">
                  Get Directions
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/marketplace">Browse Goods</Link>
              </Button>
            </div>
          </Reveal>
          <Reveal className="rounded-[2rem] border border-white/30 bg-white/10 p-4 text-white/80 backdrop-blur sm:rounded-[2.5rem] sm:p-5">
            <p className="text-xs uppercase tracking-[0.35em]">Cafe Signature</p>
            <p className="mt-2 text-xs text-white/80 sm:text-sm">
              Ethiopian-inspired coffee rituals paired with curated pantry staples.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

