import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "6ecg5phg";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

export default defineConfig({
  name: "tedeset-studio",
  title: "Tedeset Cafe and Marketplace",
  projectId,
  dataset,
  apiVersion,
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemaTypes
  }
});

