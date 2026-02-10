import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2024-02-01" });

const pastries = [
  {
    _id: "menu-pastry-2",
    name: "Butter Croissant",
    description: "Classic French laminated dough, flaky and buttery.",
    price: 4.25,
    badges: ["Croissants"],
    sortOrder: 201
  },
  {
    _id: "menu-pastry-3",
    name: "Pain au Chocolat",
    description: "Dark chocolate batons wrapped in croissant dough.",
    price: 5.5,
    badges: ["Croissants"],
    sortOrder: 202
  },
  {
    _id: "menu-pastry-4",
    name: "Almond Croissant",
    description: "Twice-baked with frangipane filling and almonds.",
    price: 6,
    badges: ["Croissants"],
    sortOrder: 203
  },
  {
    _id: "menu-pastry-5",
    name: "Fruit Danish",
    description: "Seasonal local fruit, rotating selections.",
    price: 5.5,
    badges: ["Danishes"],
    sortOrder: 204
  },
  {
    _id: "menu-pastry-6",
    name: "Cheese Danish",
    description: "Sweet cream cheese filling with lemon zest.",
    price: 5,
    badges: ["Danishes"],
    sortOrder: 205
  },
  {
    _id: "menu-pastry-7",
    name: "Savory Danish",
    description: "Leek, parmesan, or seasonal vegetable filling.",
    price: 6.5,
    badges: ["Danishes"],
    sortOrder: 206
  },
  {
    _id: "menu-pastry-8",
    name: "Hand-Rolled Bagel",
    description: "Plain, sesame, poppy, or everything.",
    price: 3,
    badges: ["Bagels"],
    sortOrder: 207
  },
  {
    _id: "menu-pastry-9",
    name: "Bagel & Schmear",
    description: "Toasted with plain or herbed cream cheese.",
    price: 5.5,
    badges: ["Bagels"],
    sortOrder: 208
  },
  {
    _id: "menu-pastry-10",
    name: "Classic Muffin",
    description: "Blueberry, lemon poppyseed, or bran.",
    price: 4.25,
    badges: ["Muffins"],
    sortOrder: 209
  },
  {
    _id: "menu-pastry-11",
    name: "Premium Muffin",
    description: "Gluten-free, vegan, or morning glory.",
    price: 5.25,
    badges: ["Muffins"],
    sortOrder: 210
  },
  {
    _id: "menu-pastry-12",
    name: "Raised Glazed Donut",
    description: "Classic yeast donut with vanilla or maple glaze.",
    price: 3,
    badges: ["Donuts"],
    sortOrder: 211
  },
  {
    _id: "menu-pastry-13",
    name: "Old Fashioned Donut",
    description: "Cake donut with crunchy edges and glaze.",
    price: 3.25,
    badges: ["Donuts"],
    sortOrder: 212
  },
  {
    _id: "menu-pastry-14",
    name: "Artisan Filled Donut",
    description: "Brioche dough with curd filling or toppings.",
    price: 5.5,
    badges: ["Donuts"],
    sortOrder: 213
  },
  {
    _id: "menu-pastry-15",
    name: "Buttermilk Scone",
    description: "Current/oat or cheddar/chive, baked daily.",
    price: 4.5,
    badges: ["Classics"],
    sortOrder: 214
  },
  {
    _id: "menu-pastry-16",
    name: "Cinnamon Roll",
    description: "Brioche dough with cream cheese icing.",
    price: 6,
    badges: ["Classics"],
    sortOrder: 215
  },
  {
    _id: "menu-pastry-17",
    name: "Sea Salt Cookie",
    description: "Large chocolate chip with fleur de sel.",
    price: 4,
    badges: ["Classics"],
    sortOrder: 216
  }
].map((item) => ({
  _type: "menuItem",
  category: "Pastries",
  available: true,
  image: null,
  ...item
}));

async function run() {
  const results = await Promise.all(
    pastries.map((item) => client.createIfNotExists(item))
  );
  console.log(`Seeded ${results.length} pastry items.`);
}

run().catch((error) => {
  console.error("Failed to seed pastry items", error);
  process.exit(1);
});
