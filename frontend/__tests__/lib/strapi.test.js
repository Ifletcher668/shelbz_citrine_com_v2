/**
 * Unit tests for pure utility functions in frontend/lib/strapi.js
 *
 * Only tests functions that don't make network calls:
 * - getStrapiMediaUrl
 * - extractAllRefs
 */

import { getStrapiMediaUrl, extractAllRefs } from "../../lib/strapi.js";

// ─── getStrapiMediaUrl ───────────────────────────────────────────────────────

test("getStrapiMediaUrl returns null for null input", () => {
  expect(getStrapiMediaUrl(null)).toBeNull();
});

test("getStrapiMediaUrl returns null for undefined input", () => {
  expect(getStrapiMediaUrl(undefined)).toBeNull();
});

test("getStrapiMediaUrl passes through absolute https URL unchanged", () => {
  const url = "https://cdn.example.com/uploads/image.jpg";
  expect(getStrapiMediaUrl(url)).toBe(url);
});

test("getStrapiMediaUrl passes through absolute http URL unchanged", () => {
  const url = "http://cdn.example.com/uploads/image.jpg";
  expect(getStrapiMediaUrl(url)).toBe(url);
});

test("getStrapiMediaUrl prepends Strapi base URL for relative path", () => {
  const result = getStrapiMediaUrl("/uploads/image.jpg");
  expect(result).toMatch(/\/uploads\/image\.jpg$/);
  expect(result).toMatch(/^https?:\/\//);
});

test("getStrapiMediaUrl relative path includes localhost by default", () => {
  const result = getStrapiMediaUrl("/uploads/photo.png");
  expect(result).toBe("http://localhost:1337/uploads/photo.png");
});

// ─── extractAllRefs ──────────────────────────────────────────────────────────

test("extractAllRefs returns empty array for empty object", () => {
  expect(extractAllRefs({})).toEqual([]);
});

test("extractAllRefs returns empty array for null", () => {
  expect(extractAllRefs(null)).toEqual([]);
});

test("extractAllRefs finds a ref in a string property", () => {
  const refs = extractAllRefs({ body: "[ref:bullet-list:42]" });
  expect(refs).toEqual([{ type: "bullet-list", id: 42 }]);
});

test("extractAllRefs finds multiple different refs", () => {
  const refs = extractAllRefs({ body: "[ref:bullet-list:1] and [ref:bullet-list:2]" });
  expect(refs).toHaveLength(2);
  expect(refs).toContainEqual({ type: "bullet-list", id: 1 });
  expect(refs).toContainEqual({ type: "bullet-list", id: 2 });
});

test("extractAllRefs deduplicates identical refs", () => {
  const refs = extractAllRefs({ body: "[ref:bullet-list:42] [ref:bullet-list:42]" });
  expect(refs).toHaveLength(1);
  expect(refs[0]).toEqual({ type: "bullet-list", id: 42 });
});

test("extractAllRefs finds refs in nested objects", () => {
  const data = {
    sections: [
      { type: "text", content: "[ref:bullet-list:5]" },
    ],
  };
  const refs = extractAllRefs(data);
  expect(refs).toContainEqual({ type: "bullet-list", id: 5 });
});

test("extractAllRefs finds refs in deeply nested arrays", () => {
  const data = {
    a: { b: { c: "[ref:bullet-list:99]" } },
  };
  const refs = extractAllRefs(data);
  expect(refs).toContainEqual({ type: "bullet-list", id: 99 });
});

test("extractAllRefs handles array of strings at top level", () => {
  const refs = extractAllRefs(["[ref:bullet-list:1]", "[ref:bullet-list:2]"]);
  expect(refs).toHaveLength(2);
});

test("extractAllRefs returns empty array when no refs present", () => {
  const refs = extractAllRefs({ body: "plain text with no refs" });
  expect(refs).toEqual([]);
});

test("extractAllRefs correctly parses id as integer", () => {
  const refs = extractAllRefs({ body: "[ref:bullet-list:007]" });
  expect(refs[0].id).toBe(7);
  expect(typeof refs[0].id).toBe("number");
});

test("extractAllRefs handles mixed ref types", () => {
  const refs = extractAllRefs({ body: "[ref:bullet-list:1] [ref:gallery:2]" });
  expect(refs).toContainEqual({ type: "bullet-list", id: 1 });
  expect(refs).toContainEqual({ type: "gallery", id: 2 });
});
