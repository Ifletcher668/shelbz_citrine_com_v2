import { StrapiClient } from "strapi-typed-client";

const strapiClient = new StrapiClient({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_URL,
  token: process.env.STRAPI_API_TOKEN,
});

export default strapiClient;
