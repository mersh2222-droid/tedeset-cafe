import { createClient } from "@sanity/client";

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "6ecg5phg";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";
const token = process.env.SANITY_API_READ_TOKEN;
const perspective: "previewDrafts" | "published" =
  token && process.env.NODE_ENV !== "production" ? "previewDrafts" : "published";

export const sanityConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
  perspective
};

export const client = createClient(sanityConfig);

