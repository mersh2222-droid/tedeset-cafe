import { defineField, defineType } from "sanity";

const categories = ["Hot", "Iced", "Pastries"];

export default defineType({
  name: "menuItem",
  title: "Menu Item",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: categories.map((category) => ({ title: category, value: category }))
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number"
    }),
    defineField({
      name: "badges",
      title: "Badges",
      type: "array",
      of: [{ type: "string" }]
    }),
    defineField({
      name: "available",
      title: "Available",
      type: "boolean",
      initialValue: true
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true }
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      initialValue: 100
    })
  ],
  preview: {
    select: {
      title: "name",
      category: "category",
      price: "price",
      media: "image"
    },
    prepare({ title, category, price, media }) {
      const priceLabel =
        typeof price === "number" ? `$${price.toFixed(2)}` : "Price TBD";
      return {
        title,
        subtitle: `${category} · ${priceLabel}`,
        media
      };
    }
  }
});

