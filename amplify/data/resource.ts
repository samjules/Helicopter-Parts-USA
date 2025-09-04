import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/* ==========================================================================
   DATA MODEL
   ========================================================================== */

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  Product: a
    .model({
      partNumber: a.string().required(),     // searchable field
      name: a.string().required(),           // display name
      description: a.string(),               // product details
      price: a.float(),                      // product price
      imageUrl: a.string(),                  // product image
      category: a.string(),                  // for filtering later
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
