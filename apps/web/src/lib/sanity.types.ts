export type ProductPriceType = "fixed" | "variable";

export interface Product {
  _id: string;
  name: string;
  category: string;
  priceType: ProductPriceType;
  price?: number | null;
  availabilityNote?: string | null;
  images?: unknown[] | null;
  featured?: boolean | null;
  sortOrder?: number | null;
  slug: {
    current: string;
  };
}

export type MenuItemCategory = "Hot" | "Iced" | "Pastries";

export interface MenuItem {
  _id: string;
  name: string;
  category: MenuItemCategory;
  description?: string | null;
  price?: number | null;
  badges?: string[] | null;
  available?: boolean | null;
  image?: unknown | null;
  sortOrder?: number | null;
}

export interface SiteSettings {
  businessName: string;
  address: string;
  phone?: string | null;
  email?: string | null;
  hours?: string | null;
  doorDashUrl?: string | null;
  announcementText?: string | null;
  socialLinks?: {
    label: string;
    url: string;
  }[];
}

export interface HomePage {
  heroHeadline?: string | null;
  heroSubheadline?: string | null;
  heroImage?: unknown | null;
  featuredMenuItems?: MenuItem[] | null;
  featuredProducts?: Product[] | null;
  showFeaturedMenu?: boolean | null;
  showFeaturedProducts?: boolean | null;
}

