import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/* ==========================================================================
   DATA MODEL
   ========================================================================== */

const schema = a.schema({
  Vendor: a
    .model({
      name: a.string().required(),        // vendor company name
      email: a.string(),                  // contact email
      phone: a.string(),                  // contact phone
      address: a.string(),                // vendor address
      website: a.string(),                // optional website
      products: a.hasMany("Product", "vendorId"), // relationship
    })
    .authorization((allow) => [allow.publicApiKey()]),

  Product: a
    .model({
      partNumber: a.string().required(),   // searchable field
      name: a.string().required(),         // display name
      description: a.string(),             // product details
      price: a.float(),                    // product price
      imageUrl: a.string(),                // product image
      category: a.string(),                // for filtering later
      vendorId: a.id().required(),         // relation field
      vendor: a.belongsTo("Vendor", "vendorId"),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
