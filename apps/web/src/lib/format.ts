import type { Product } from "@/lib/sanity.types";

export function formatPrice(price?: number | null) {
  if (price === null || price === undefined) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(price);
}

export function getProductPriceLabel(product: Product) {
  if (product.priceType === "variable") {
    return "Variable";
  }
  return formatPrice(product.price);
}

