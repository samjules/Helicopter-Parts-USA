// amplify/data/resource.ts
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Vendor: a
    .model({
      name: a.string().required(),       // Vendor name
      contactEmail: a.string(),          // Optional email
      phone: a.string(),                 // Optional phone
      products: a.hasMany("Product", "vendorId"),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  Product: a
    .model({
      partNumber: a.string().required(),
      name: a.string().required(),
      description: a.string(),
      price: a.float(),
      imageUrl: a.string(),
      category: a.string(),
      vendorId: a.id().required(),        // foreign key
      vendor: a.belongsTo("Vendor", "vendorId"),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: { expiresInDays: 30 },
  },
});
