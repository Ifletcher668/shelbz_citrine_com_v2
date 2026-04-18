import { StrapiClient } from "strapi-typed-client";

const strapiClient = new StrapiClient({
  baseURL: "http://localhost:1337",
  token: process.env.STRAPI_API_TOKEN,
});

export default strapiClient;
