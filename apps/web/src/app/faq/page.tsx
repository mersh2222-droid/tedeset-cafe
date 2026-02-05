"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";

type FaqItem = {
  question: string;
  answer: string;
  category: "Coffee" | "Marketplace" | "Visit" | "Orders" | "Community" | "Products";
  featured?: boolean;
};

const faqs: FaqItem[] = [
  {
    question: "What is TEDESET Market and Café?",
    answer:
      "TEDESET Market and Café is a hybrid Ethiopian and Eritrean specialty grocery store and coffee café in Portland, Oregon. We offer authentic East African groceries, premium spices like Berbere and Shiro, fresh Injera bread, and a full-service traditional coffee café at 10240 NE Halsey Street.",
    category: "Visit",
    featured: true
  },
  {
    question: "Where is TEDESET Market located in Portland?",
    answer:
      "We’re located at 10240 NE Halsey Street in Portland’s Gateway neighborhood. We have dedicated customer parking and serve the entire Portland metro area.",
    category: "Visit",
    featured: true
  },
  {
    question: "What are TEDESET Market's business hours?",
    answer:
      "Hours vary by season and holidays. Please check the Contact page or call 503-436-6006 for the most current hours.",
    category: "Visit"
  },
  {
    question: "Where can I buy Ethiopian spices like Berbere, Shiro, and Mitmita in Portland?",
    answer:
      "TEDESET carries authentic Ethiopian spices including Berbere, Shiro (chickpea flour), Mitmita, Kororima, Kimem, turmeric, and more. Visit us at 10240 NE Halsey Street.",
    category: "Products",
    featured: true
  },
  {
    question: "Where can I buy fresh Injera bread in Portland?",
    answer:
      "Fresh Injera bread is available daily at TEDESET. We offer individual packs and large trays for parties and events.",
    category: "Products"
  },
  {
    question: "Where can I buy Ethiopian coffee beans in Portland?",
    answer:
      "We sell premium Ethiopian coffee beans—both green (unroasted) and freshly roasted. Enjoy a cup in our café or take beans home.",
    category: "Coffee",
    featured: true
  },
  {
    question: "Are marketplace items available for online checkout?",
    answer:
      "Marketplace items are inquiry-only. Use the contact form or visit in-store and we’ll confirm availability and pricing.",
    category: "Marketplace",
    featured: true
  },
  {
    question: "How do I inquire about a marketplace item?",
    answer:
      "Send us a message or visit in person with the item name. We’ll confirm availability, pricing, and pickup timing.",
    category: "Marketplace"
  },
  {
    question: "Do marketplace items change seasonally?",
    answer:
      "Yes. Our curated shelves rotate based on local makers, seasonal goods, and limited releases. Check back often.",
    category: "Marketplace"
  },
  {
    question: "Can I reserve a marketplace item?",
    answer:
      "We can reserve select items for a short window once availability is confirmed. Contact us with the item name and preferred pickup time.",
    category: "Marketplace"
  },
  {
    question: "Is there an African grocery store in Portland, Oregon?",
    answer:
      "Yes. TEDESET is Portland’s destination for Ethiopian and Eritrean groceries, including spices, grains, Injera, coffee, oils, legumes, beverages, and cultural items.",
    category: "Products"
  },
  {
    question: "Where can I buy Teff flour in Portland?",
    answer:
      "We carry both white and brown Teff flour—essential for traditional Injera—along with other Ethiopian grains and specialty flours.",
    category: "Products"
  },
  {
    question: "Is there an Eritrean grocery store in Portland?",
    answer:
      "TEDESET serves both Ethiopian and Eritrean communities with authentic products from both cultures, including spices, grains, coffee, Injera, and oils.",
    category: "Products"
  },
  {
    question: "Where can I find East African food products in Portland?",
    answer:
      "TEDESET is a one-stop shop for East African food products: spices, grains, Injera, coffee, Niter Kibbeh, legumes, traditional beverages, snacks, and cultural items.",
    category: "Products"
  },
  {
    question: "Where can I buy Niter Kibbeh in Portland?",
    answer:
      "Niter Kibbeh (spiced clarified butter) is available at TEDESET, along with the ingredients to make it at home.",
    category: "Products"
  },
  {
    question: "Is there an international grocery store with African products near Gateway Portland?",
    answer:
      "Yes. TEDESET is located in Portland’s Gateway neighborhood and specializes in Ethiopian and Eritrean groceries with free customer parking.",
    category: "Visit"
  },
  {
    question: "Where can I buy Ethiopian food for a party or catering in Portland?",
    answer:
      "We offer catering and bulk orders including Injera trays, bulk spices, snack assortments, and gift baskets. Contact 503-436-6006.",
    category: "Orders"
  },
  {
    question: "Where can I experience Ethiopian coffee ceremony in Portland?",
    answer:
      "TEDESET offers an authentic Ethiopian coffee experience with freshly roasted, traditionally brewed coffee in a warm atmosphere.",
    category: "Coffee"
  },
  {
    question: "Is there an Ethiopian coffee shop in Portland?",
    answer:
      "Yes. TEDESET includes a traditional Ethiopian coffee café with premium beans roasted in-house.",
    category: "Coffee"
  },
  {
    question: "Does TEDESET Café serve food?",
    answer:
      "We serve traditional Ethiopian beverages and snacks in a relaxed, community-focused environment.",
    category: "Coffee"
  },
  {
    question: "What Ethiopian spices does TEDESET carry?",
    answer:
      "We carry a full selection including Berbere, Shiro, Mitmita, Kororima, Kimem, turmeric, and more—all sourced for authenticity.",
    category: "Products"
  },
  {
    question: "Can I buy green or roasted coffee beans at TEDESET?",
    answer:
      "Yes. We sell both green (unroasted) and freshly roasted Ethiopian coffee beans.",
    category: "Coffee"
  },
  {
    question: "Does TEDESET have vegetarian and vegan Ethiopian food options?",
    answer:
      "Yes. Many Ethiopian and Eritrean dishes are naturally plant-based. We carry Shiro flour, lentils, split peas, and spices for vegan cooking.",
    category: "Products"
  },
  {
    question: "Does TEDESET offer catering and bulk orders?",
    answer:
      "Yes. We provide catering and bulk ordering services for restaurants, parties, celebrations, and corporate events.",
    category: "Orders"
  },
  {
    question: "How much advance notice does TEDESET need for large orders?",
    answer:
      "We request 7–10 days advance notice for large orders, especially for fresh Injera and specialty items.",
    category: "Orders"
  },
  {
    question: "Can I order an Ethiopian gift basket from TEDESET?",
    answer:
      "Yes. We create custom Ethiopian and Eritrean gift baskets with coffee, spices, snacks, and traditional items.",
    category: "Orders"
  },
  {
    question: "Does TEDESET offer cultural education packages for schools?",
    answer:
      "Yes. We offer Cultural Education Packages for schools and organizations, including coffee ceremony kits and traditional snack assortments.",
    category: "Community"
  },
  {
    question: "Can TEDESET staff help me learn to cook Ethiopian food?",
    answer:
      "Yes. Our staff can explain ingredients, recommend essential spices, and share tips for preparing Ethiopian meals at home.",
    category: "Community"
  },
  {
    question: "How do I contact TEDESET Market and Café?",
    answer:
      "Call 503-436-6006 or email orders@tedeset.com. Visit us at 10240 NE Halsey Street in Portland’s Gateway neighborhood.",
    category: "Visit"
  },
  {
    question: "What does “TEDESET” mean?",
    answer:
      "“TEDESET” means “Be Happy” in Amharic and Tigrinya. It reflects our mission to bring warmth, culture, and happiness to every visit.",
    category: "Community"
  }
];

const categories: Array<FaqItem["category"] | "All"> = [
  "All",
  "Coffee",
  "Marketplace",
  "Visit",
  "Orders",
  "Products",
  "Community"
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All");
  const [query, setQuery] = useState("");
  const [openQuestion, setOpenQuestion] = useState<string | null>(faqs[0]?.question ?? null);
  const [page, setPage] = useState(1);
  const perPage = 10;

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pagedResults = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    setPage(1);
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
              pagedResults.map((item) => {
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
        {filtered.length > 0 ? (
          <Reveal className="flex flex-wrap items-center justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Previous
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Page</span>
              <span className="rounded-full border border-border/70 bg-white px-3 py-1 text-foreground">
                {page}
              </span>
              <span>of {totalPages}</span>
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            >
              Next
            </Button>
          </Reveal>
        ) : null}

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
