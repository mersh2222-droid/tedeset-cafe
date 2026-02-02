import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "businessName",
      title: "Business Name",
      type: "string",
      initialValue: "Tedeset Cafe and Marketplace"
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "string",
      initialValue: "10240 NE Halsey St, Portland, OR 97220"
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string"
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string"
    }),
    defineField({
      name: "hours",
      title: "Hours",
      type: "string"
    }),
    defineField({
      name: "doorDashUrl",
      title: "DoorDash URL",
      type: "url",
      initialValue: "https://example.com"
    }),
    defineField({
      name: "announcementText",
      title: "Announcement Text",
      type: "string"
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string"
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url"
            })
          ]
        }
      ]
    })
  ],
  preview: {
    prepare() {
      return {
        title: "Site Settings",
        subtitle: "Global business details"
      };
    }
  }
});

