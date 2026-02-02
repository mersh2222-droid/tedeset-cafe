import { defineField, defineType } from "sanity";

export default defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string"
    }),
    defineField({
      name: "heroSubheadline",
      title: "Hero Subheadline",
      type: "text",
      rows: 3
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true }
    }),
    defineField({
      name: "showFeaturedMenu",
      title: "Show Featured Menu",
      type: "boolean",
      initialValue: true
    }),
    defineField({
      name: "featuredMenuItems",
      title: "Featured Menu Items",
      type: "array",
      of: [{ type: "reference", to: [{ type: "menuItem" }] }]
    }),
    defineField({
      name: "showFeaturedProducts",
      title: "Show Featured Products",
      type: "boolean",
      initialValue: true
    }),
    defineField({
      name: "featuredProducts",
      title: "Featured Products",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }]
    })
  ],
  preview: {
    prepare() {
      return {
        title: "Home Page",
        subtitle: "Hero and featured sections"
      };
    }
  }
});

