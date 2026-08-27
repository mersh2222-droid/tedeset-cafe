---
name: tedeset-menu-knowledge
metadata:
  category: ContentAndMerchandising
description: >-
  Reference knowledge on Ethiopian/Eritrean groceries, spices, and dishes for
  TEDESET Market & Café. Use when writing or reviewing product descriptions
  (apps/studio/schemas/product.ts), menu item descriptions
  (apps/studio/schemas/menuItem.ts), CSV/NDJSON catalog imports under
  apps/studio/, or any customer-facing copy that names a spice, pantry item,
  or dish — especially transliterated Amharic/Tigrinya names in the existing
  catalog (e.g. "Abish Duket", "Alch Kimem", "Masoo Dal") that need an
  accurate, respectful English description.
---

# TEDESET Menu & Product Knowledge

TEDESET Market & Café (Portland, OR) sells authentic Ethiopian and Eritrean
groceries and spices and serves traditional dishes and coffee. This skill
supplies the domain knowledge needed to turn a bare catalog name into an
accurate description — not to invent products or prices.

## When to use this

- Filling in a description for a `product` document (the schema currently has
  **no `description` field** — see `apps/studio/schemas/product.ts` — so any
  copy you write goes in the Sanity Studio field text or a future field you
  add).
- Rewriting a `menuItem.description` that is currently placeholder text like
  `"Available in-store Price range: $3.00 - $4.25."` (see
  `apps/studio/Coffee_menu.ndjson`) into something that actually describes the
  drink or dish.
- Explaining what a catalog line item is when the name is a transliteration,
  a brand name, or ambiguous (e.g. is "Kitfo Dist" the dish or the serving
  plate? — check category first: items filed under "Traditional & culture"
  alongside jebena pots and teacup sets are almost always serveware, not
  food).
- Writing marketing copy, social captions, or answering a customer/staff
  question about ingredients, spice level, or allergens.

## How to use it

1. Load `references/spices-and-pantry.md` for spice blends, spice singles,
   grains/legumes, and other pantry staples.
2. Load `references/dishes-and-drinks.md` for prepared dishes, breads, and
   coffee/tea drinks.
3. Match the catalog name against the reference entry. Catalog spelling is
   often inconsistent (`Cinnamon Ethiopian Powder` vs `Cinnamon Sticks Mid
   East`, `Caraway Seed` vs `Caraway Seeds Ethiopian`) — match on the core
   ingredient, not exact string.
4. If a name doesn't clearly match anything in the references and isn't a
   well-known Ethiopian/Eritrean/East African grocery term, **don't guess at
   an etymology or ingredient list**. Say what's uncertain and flag it for
   Merhawi (the owner) to confirm, rather than publishing a plausible-sounding
   but wrong description — these are food and allergen claims.
5. Follow `references/writing-guide.md` for tone, length, and what to do
   about allergens/spice-level claims before publishing copy.

## Quick orientation

| Building block | What it is |
|---|---|
| **Berbere** | The foundational Ethiopian/Eritrean chili spice blend (chili, garlic, ginger, fenugreek, warm spices) — base of most "wat" (stew) dishes and tibs seasoning. |
| **Mitmita** | Hotter, finer chili blend with cardamom and salt — condiment for kitfo and raw/seared beef dishes. |
| **Shiro powder** | Ground, spiced chickpea/broad-bean flour — cooked into shiro wat, a staple vegan dish. |
| **Niter kibbeh** | Spiced clarified butter — the standard cooking fat for wats. |
| **Awaze** | A berbere-and-wine/water paste condiment, served alongside meat dishes. |
| **Injera** | The sourdough flatbread (fermented teff) that both plates and is used to scoop every dish. |
| **Teff** | The tiny grain injera is made from — sold as flour or whole grain. |
| **Gesho** | Dried hops-like leaves/bark used to ferment injera batter and brew tella (traditional beer) or as a bittering agent. |

See the two reference files for the full picture — this table is only the
handful of terms almost every other entry depends on.
