import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { getSiteSettings } from "@/lib/sanity.queries";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about the Tedeset Cafe and Marketplace experience."
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <section className="section">
      <div className="container space-y-10">
        <div className="section-divider">About</div>
        <SectionHeader
          title="A warm, premium cafe ritual"
          description="We blend modern hospitality with a curated marketplace so every visit feels intentional."
        />
        <div className="section-frame">
          <div className="grid gap-8 md:grid-cols-2">
            <Reveal className="space-y-4 rounded-[2.5rem] border border-border/70 bg-white/85 p-6 shadow-sm backdrop-blur">
            <h3 className="text-lg font-semibold">Our Story</h3>
            <p className="text-sm text-muted-foreground">
              Tedeset Cafe and Marketplace was created to bring elevated coffee,
              community, and curated goods together in one inviting destination.
              Every espresso, tea, and pastry is prepared with care, while the
              marketplace highlights local makers and thoughtful pantry staples.
            </p>
            </Reveal>
            <Reveal className="space-y-4 rounded-[2.5rem] border border-border/70 bg-white/85 p-6 shadow-sm backdrop-blur">
            <h3 className="text-lg font-semibold">Visit Us</h3>
            <p className="text-sm text-muted-foreground">
              {settings?.address ||
                "10240 NE Halsey St, Portland, OR 97220"}
            </p>
            {settings?.hours ? (
              <p className="text-sm text-muted-foreground">
                Hours: {settings.hours}
              </p>
            ) : null}
            <p className="text-sm text-muted-foreground">
              Expect a warm, modern atmosphere designed for quick stops or long
              conversations.
            </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

