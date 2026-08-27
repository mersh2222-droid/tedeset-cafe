# Writing Guide for Product & Menu Copy

Practical rules for turning a catalog line item into published copy in this
repo.

## Where copy actually goes

- `product` documents (`apps/studio/schemas/product.ts`) have **no
  description field today**. If the owner wants product descriptions on the
  storefront, that's a schema change (add a `description` field) plus a
  content-entry pass — don't silently invent a field name; confirm the
  addition with the owner first since it changes the content model.
- `menuItem.description` (`apps/studio/schemas/menuItem.ts`) is a free-text
  field, 3 rows in Studio, rendered on the site. The current NDJSON seed data
  (`Coffee_menu.ndjson`, etc.) fills it with generated filler
  (`"Available in-store Price range: $X - $Y."`) — replacing this with a
  real 1-2 sentence description is the main use case for this skill.

## Style

- 1-2 sentences per item. Lead with what it is, then flavor/spice/heat, then
  a notable serving detail (vegan, sizzling, served with X) if relevant.
- Plain, appetizing language — no overwrought marketing adjectives stacked
  on top of each other.
- Use the common English-menu spelling for dish names (e.g. "doro wat," not
  a phonetic variant), but it's fine to keep the catalog's existing spelling
  as the item `name` — the description is where you can clarify.
- It's fine (often good) to give the Amharic/Tigrinya term with a short
  gloss the first time a dish is introduced, e.g. "Kitfo — minced beef,
  seasoned with mitmita and niter kibbeh, served warm or raw."

## Allergens and heat level

- Treat spice-level and allergen claims (dairy in niter kibbeh/ayib, gluten
  in wheat-based items, nuts in kolo) as factual claims a customer will rely
  on. Only state what you're confident of from the reference files or the
  owner; when unsure, phrase around it (e.g. omit the allergen claim) rather
  than asserting something unverified.
- Don't downgrade or upgrade heat level based on the dish's popularity or to
  sound appealing — alicha dishes are mild, berbere/mitmita dishes are
  spicy; misdescribing this affects real customers with spice tolerance or
  health considerations.

## When the catalog name is ambiguous or unfamiliar

1. Check the `category` column first (e.g. "Traditional & culture" often
   means serveware/equipment, not food or spice).
2. Check price point — a $3-10 item is very likely a spice/pantry good; a
   $20-125 item in the same category is very likely equipment or serveware.
3. Cross-reference `references/spices-and-pantry.md` and
   `references/dishes-and-drinks.md`.
4. If still unclear, write the description conservatively (state only what's
   certain, e.g. "Traditional Ethiopian spice blend — ask our staff for
   preparation tips") or flag it as needing the owner's input rather than
   publishing a guessed ingredient list or etymology.
