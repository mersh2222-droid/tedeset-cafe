import { defineField, defineType } from "sanity";

export default defineType({
  name: "product",
  title: "Product",
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
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "priceType",
      title: "Price Type",
      type: "string",
      options: {
        list: [
          { title: "Fixed", value: "fixed" },
          { title: "Variable", value: "variable" }
        ],
        layout: "radio"
      },
      initialValue: "fixed",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      description: "Optional for variable pricing."
    }),
    defineField({
      name: "availabilityNote",
      title: "Availability Note",
      type: "string",
      description: "Optional note for variable or limited items."
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }]
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      initialValue: 100
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required()
    })
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category",
      media: "images.0"
    }
  }
});

