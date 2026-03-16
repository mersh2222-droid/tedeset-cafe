import { groq } from "next-sanity";
import { client } from "@/lib/sanity.client";
import type { HomePage, MenuItem, Product, SiteSettings } from "@/lib/sanity.types";

const noStore = { cache: "no-store" as const };

const demoSiteSettings: SiteSettings = {
  businessName: "Tedeset Cafe and Marketplace",
  address: "10240 NE Halsey St, Portland, OR 97220",
  phone: "(503) 555-0142",
  email: "tedesetmarketcafe@gmail.com",
  hours: "Daily · 9am–9pm",
  doorDashUrl: "https://example.com",
  uberEatsUrl: "https://www.ubereats.com",
  announcementText: "Now serving seasonal winter lattes.",
  socialLinks: [
    {
      label: "Instagram",
      url: "https://www.instagram.com/tedesetmarketandcafe?igsh=MWNibzRtOGxrdDlkNw%3D%3D&utm_source=qr"
    },
    {
      label: "Facebook",
      url: "https://www.facebook.com/share/1FYA2bVSLK/?mibextid=wwXIfr"
    }
  ]
};

const demoMenuItems: MenuItem[] = [
  {
    _id: "menu-espresso-1",
    name: "Signature Espresso",
    category: "Hot",
    description: "Rich, velvety espresso with caramelized notes.",
    price: 3.75,
    badges: ["House Favorite"],
    available: true,
    image: null,
    sortOrder: 1
  },
  {
    _id: "menu-iced-1",
    name: "Iced Vanilla Latte",
    category: "Iced",
    description: "Silky espresso, vanilla, and oat milk over ice.",
    price: 5.5,
    badges: ["Seasonal"],
    available: true,
    image: null,
    sortOrder: 2
  },
  {
    _id: "menu-tea-1",
    name: "Rose Black Tea",
    category: "Hot",
    description: "Aromatic black tea with soft floral notes.",
    price: 4.25,
    badges: [],
    available: true,
    image: null,
    sortOrder: 3
  },
  {
    _id: "menu-pastry-1",
    name: "Honey Cardamom Bun",
    category: "Pastries",
    description: "Baked fresh, glazed with honey.",
    price: 4.75,
    badges: ["Baked Daily"],
    available: true,
    image: null,
    sortOrder: 4
  },
  {
    _id: "menu-pastry-2",
    name: "Butter Croissant",
    category: "Pastries",
    description: "Classic French laminated dough, flaky and buttery.",
    price: 4.25,
    badges: ["Croissants"],
    available: true,
    image: null,
    sortOrder: 5
  },
  {
    _id: "menu-pastry-3",
    name: "Pain au Chocolat",
    category: "Pastries",
    description: "Dark chocolate batons wrapped in croissant dough.",
    price: 5.5,
    badges: ["Croissants"],
    available: true,
    image: null,
    sortOrder: 6
  },
  {
    _id: "menu-pastry-4",
    name: "Almond Croissant",
    category: "Pastries",
    description: "Twice-baked with frangipane filling and almonds.",
    price: 6,
    badges: ["Croissants"],
    available: true,
    image: null,
    sortOrder: 7
  },
  {
    _id: "menu-pastry-5",
    name: "Fruit Danish",
    category: "Pastries",
    description: "Seasonal local fruit, rotating selections.",
    price: 5.5,
    badges: ["Danishes"],
    available: true,
    image: null,
    sortOrder: 8
  },
  {
    _id: "menu-pastry-6",
    name: "Cheese Danish",
    category: "Pastries",
    description: "Sweet cream cheese filling with lemon zest.",
    price: 5,
    badges: ["Danishes"],
    available: true,
    image: null,
    sortOrder: 9
  },
  {
    _id: "menu-pastry-7",
    name: "Savory Danish",
    category: "Pastries",
    description: "Leek, parmesan, or seasonal vegetable filling.",
    price: 6.5,
    badges: ["Danishes"],
    available: true,
    image: null,
    sortOrder: 10
  },
  {
    _id: "menu-pastry-8",
    name: "Hand-Rolled Bagel",
    category: "Pastries",
    description: "Plain, sesame, poppy, or everything.",
    price: 3,
    badges: ["Bagels"],
    available: true,
    image: null,
    sortOrder: 11
  },
  {
    _id: "menu-pastry-9",
    name: "Bagel & Schmear",
    category: "Pastries",
    description: "Toasted with plain or herbed cream cheese.",
    price: 5.5,
    badges: ["Bagels"],
    available: true,
    image: null,
    sortOrder: 12
  },
  {
    _id: "menu-pastry-10",
    name: "Classic Muffin",
    category: "Pastries",
    description: "Blueberry, lemon poppyseed, or bran.",
    price: 4.25,
    badges: ["Muffins"],
    available: true,
    image: null,
    sortOrder: 13
  },
  {
    _id: "menu-pastry-11",
    name: "Premium Muffin",
    category: "Pastries",
    description: "Gluten-free, vegan, or morning glory.",
    price: 5.25,
    badges: ["Muffins"],
    available: true,
    image: null,
    sortOrder: 14
  },
  {
    _id: "menu-pastry-12",
    name: "Raised Glazed Donut",
    category: "Pastries",
    description: "Classic yeast donut with vanilla or maple glaze.",
    price: 3,
    badges: ["Donuts"],
    available: true,
    image: null,
    sortOrder: 15
  },
  {
    _id: "menu-pastry-13",
    name: "Old Fashioned Donut",
    category: "Pastries",
    description: "Cake donut with crunchy edges and glaze.",
    price: 3.25,
    badges: ["Donuts"],
    available: true,
    image: null,
    sortOrder: 16
  },
  {
    _id: "menu-pastry-14",
    name: "Artisan Filled Donut",
    category: "Pastries",
    description: "Brioche dough with curd filling or toppings.",
    price: 5.5,
    badges: ["Donuts"],
    available: true,
    image: null,
    sortOrder: 17
  },
  {
    _id: "menu-pastry-15",
    name: "Buttermilk Scone",
    category: "Pastries",
    description: "Current/oat or cheddar/chive, baked daily.",
    price: 4.5,
    badges: ["Classics"],
    available: true,
    image: null,
    sortOrder: 18
  },
  {
    _id: "menu-pastry-16",
    name: "Cinnamon Roll",
    category: "Pastries",
    description: "Brioche dough with cream cheese icing.",
    price: 6,
    badges: ["Classics"],
    available: true,
    image: null,
    sortOrder: 19
  },
  {
    _id: "menu-pastry-17",
    name: "Sea Salt Cookie",
    category: "Pastries",
    description: "Large chocolate chip with fleur de sel.",
    price: 4,
    badges: ["Classics"],
    available: true,
    image: null,
    sortOrder: 20
  }
];

const demoProducts: Product[] = [
  {
    _id: "product-1",
    name: "Ethiopian Single-Origin Beans",
    category: "Coffee",
    priceType: "fixed",
    price: 18,
    availabilityNote: null,
    images: null,
    featured: true,
    sortOrder: 1,
    slug: { current: "ethiopian-single-origin-beans" }
  },
  {
    _id: "product-2",
    name: "Handmade Ceramic Mug",
    category: "Home Goods",
    priceType: "variable",
    price: null,
    availabilityNote: "Limited batches from local makers.",
    images: null,
    featured: false,
    sortOrder: 2,
    slug: { current: "handmade-ceramic-mug" }
  },
  {
    _id: "product-3",
    name: "Tedeset Cold Brew Kit",
    category: "Pantry",
    priceType: "fixed",
    price: 28,
    availabilityNote: null,
    images: null,
    featured: true,
    sortOrder: 3,
    slug: { current: "tedeset-cold-brew-kit" }
  }
];

const demoHomePage: HomePage = {
  heroHeadline: "A premium cafe experience with a marketplace.",
  heroSubheadline:
    "Freshly made coffee, traditional flavors, and specialty items under one roof.",
  heroImage: null,
  featuredMenuItems: demoMenuItems.slice(0, 3),
  featuredProducts: demoProducts,
  showFeaturedMenu: true,
  showFeaturedProducts: true
};

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    businessName,
    address,
    phone,
    email,
    hours,
    doorDashUrl,
    uberEatsUrl,
    announcementText,
    socialLinks
  }
`;

export const homePageQuery = groq`
  *[_type == "homePage"][0]{
    heroHeadline,
    heroSubheadline,
    heroImage,
    showFeaturedMenu,
    showFeaturedProducts,
    featuredMenuItems[]->{
      _id,
      name,
      category,
      description,
      price,
      badges,
      available,
      image,
      sortOrder
    },
    featuredProducts[]->{
      _id,
      name,
      category,
      priceType,
      price,
      availabilityNote,
      images,
      featured,
      sortOrder,
      slug
    }
  }
`;

export const menuItemsQuery = groq`
  *[_type == "menuItem"] | order(sortOrder asc, name asc){
    _id,
    name,
    category,
    description,
    price,
    badges,
    available,
    image,
    sortOrder
  }
`;

export const productsQuery = groq`
  *[_type == "product"] | order(featured desc, sortOrder asc, name asc){
    _id,
    name,
    category,
    priceType,
    price,
    availabilityNote,
    images,
    featured,
    sortOrder,
    slug
  }
`;

export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0]{
    _id,
    name,
    category,
    priceType,
    price,
    availabilityNote,
    images,
    featured,
    sortOrder,
    slug
  }
`;

export async function getSiteSettings() {
  try {
    return await client.fetch<SiteSettings>(siteSettingsQuery, {}, noStore);
  } catch (error) {
    console.warn("Sanity settings fetch failed, using demo data.", error);
    return demoSiteSettings;
  }
}

export async function getHomePage() {
  try {
    return await client.fetch<HomePage>(homePageQuery, {}, noStore);
  } catch (error) {
    console.warn("Sanity home fetch failed, using demo data.", error);
    return demoHomePage;
  }
}

export async function getMenuItems() {
  try {
    return await client.fetch<MenuItem[]>(menuItemsQuery, {}, noStore);
  } catch (error) {
    console.warn("Sanity menu fetch failed, using demo data.", error);
    return demoMenuItems;
  }
}

export async function getProducts() {
  try {
    return await client.fetch<Product[]>(productsQuery, {}, noStore);
  } catch (error) {
    console.warn("Sanity products fetch failed, using demo data.", error);
    return demoProducts;
  }
}

export async function getProductBySlug(slug: string) {
  try {
    return await client.fetch<Product | null>(productBySlugQuery, { slug }, noStore);
  } catch (error) {
    console.warn("Sanity product fetch failed, using demo data.", error);
    return demoProducts.find((product) => product.slug.current === slug) ?? null;
  }
}

