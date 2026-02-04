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

