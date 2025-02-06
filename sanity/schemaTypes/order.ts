import { defineType, defineField } from "sanity";

export default defineType({
  name: "order",
  title: "Orders",
  type: "document",
  fields: [
    defineField({
      name: "customerFirstName",
      title: "First Name",
      type: "string",
    }),
    defineField({
      name: "customerLastName",
      title: "Last Name",
      type: "string",
    }),
    defineField({
      name: "customerEmail",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "customerPhone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "items",
      title: "Order Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "productName", title: "Product Name", type: "string" },
            { name: "price", title: "Price", type: "number" },
            { name: "quantity", title: "Quantity", type: "number" },
          ],
        },
      ],
    }),
    defineField({
      name: "totalAmount",
      title: "Total Amount",
      type: "number",
    }),
  ],
});



