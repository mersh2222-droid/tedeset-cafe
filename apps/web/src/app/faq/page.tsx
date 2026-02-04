"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";

type FaqItem = {
  question: string;
  answer: string;
  category: "Coffee" | "Marketplace" | "Visit" | "Orders";
  featured?: boolean;
};

const faqs: FaqItem[] = [
  {
    question: "Do you offer the traditional Ethiopian coffee ceremony?",
    answer:
      "Yes. We host traditional Ethiopian coffee ceremonies on select days. Ask our baristas about current availability and timing.",
    category: "Coffee",
    featured: true
  },
  {
    question: "What makes your espresso and coffee program unique?",
    answer:
      "We focus on Ethiopian heritage, precise roasting, and careful preparation so each cup feels balanced, aromatic, and intentional.",
    category: "Coffee",
    featured: true
  },
  {
    question: "Are your marketplace items available for checkout online?",
    answer:
      "Marketplace items are inquiry-only. Use the contact form or visit in-store and we’ll confirm availability and pricing.",
    category: "Marketplace",
    featured: true
  },
  {
    question: "Do you ship products?",
    answer:
      "We offer local pickup and select delivery options. Online shipping availability will be listed per item when applicable.",
    category: "Marketplace"
  },
  {
    question: "What are your hours and location?",
    answer:
      "We’re located at 10240 NE Halsey St, Portland, OR 97220. Hours are listed on the contact page and may vary for holidays.",
    category: "Visit",
    featured: true
  },
  {
    question: "Do you have vegan or gluten-friendly options?",
    answer:
      "We offer a rotating selection of vegan and gluten-friendly options. Availability varies daily, so please ask our team.",
    category: "Visit"
  },
  {
    question: "Can I place a large order or catering request?",
    answer:
      "Yes. For large orders, please contact us in advance so we can prepare and confirm timing.",
    category: "Orders"
  },
  {
    question: "How do I inquire about a marketplace item?",
    answer:
      "Use the contact form or visit us in person. We’ll confirm item availability and next steps.",
    category: "Marketplace"
  }
];

const categories: Array<FaqItem["category"] | "All"> = [
  "All",
  "Coffee",
  "Marketplace",
  "Visit",
  "Orders"
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All");
  const [query, setQuery] = useState("");
  const [openQuestion, setOpenQuestion] = useState<string | null>(faqs[0]?.question ?? null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return faqs.filter((item) => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const matchesQuery =
        !normalized ||
        item.question.toLowerCase().includes(normalized) ||
        item.answer.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <section className="section">
      <div className="container space-y-10">
        <div className="section-divider">FAQ</div>
        <SectionHeader
          title="Frequently Asked Questions"
          description="Quick answers about our coffee, marketplace, and visit details."
        />

        <Reveal className="card-glass space-y-4 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Search</p>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.3em] transition ${
                  activeCategory === category
                    ? "border-primary/60 bg-primary/10 text-foreground"
                    : "border-border/70 bg-white/70 text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search questions"
              className="w-full rounded-full border border-border bg-white px-4 py-3 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            />
          </div>
        </Reveal>

        <div className="section-frame">
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <Reveal className="rounded-[2rem] border border-dashed border-border bg-white p-6 text-sm text-muted-foreground">
                No results found. Try a different keyword or category.
              </Reveal>
            ) : (
              filtered.map((item) => {
                const isOpen = openQuestion === item.question;
                return (
                  <Reveal
                    key={item.question}
                    className="rounded-[2rem] border border-border/70 bg-white/85 p-5 shadow-soft backdrop-blur"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenQuestion(isOpen ? null : item.question)}
                      className="flex w-full items-center justify-between gap-4 text-left"
                    >
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                          {item.category}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-foreground">
                          {item.question}
                        </p>
                      </div>
                      <span className="text-xl text-muted-foreground">{isOpen ? "−" : "+"}</span>
                    </button>
                    {isOpen ? (
                      <p className="mt-3 text-sm text-muted-foreground">{item.answer}</p>
                    ) : null}
                  </Reveal>
                );
              })
            )}
          </div>
        </div>

        <Reveal className="card-glass flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Still need help?
            </p>
            <p className="mt-2 text-lg font-semibold text-foreground">
              Reach out and we’ll respond quickly.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/menu">Explore Menu</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
