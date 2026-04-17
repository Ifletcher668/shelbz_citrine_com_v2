import type {
  BulletListGetPayload,
  ButtonGetPayload,
  ContactFormGetPayload,
  FaqGetPayload,
  FooterGetPayload,
  HeaderGetPayload,
  MediaFile,
  MediaMetadataGetPayload,
  PageGetPayload,
  StepGroupGetPayload,
  ThemeGetPayload,
} from "strapi-typed-client";
import strapiClient from "./strapiClient";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

// DO NOT USE THESE TYPES
export type PageSummary = PageGetPayload<{
  populate: {
    parent_page: { fields: ["slug"] };
  };
}>;

export type PageTemplateSlug = "default_page" | "gallery_page" | "blog_page";

export type FullHeader = HeaderGetPayload<{
  populate: {
    primary: {
      on: {
        "navigation.logo-image": { populate: { image: true } };
      };
    };
    navigation: {
      populate: {
        links: {
          populate: {
            page: {
              fields: ["slug"];
              populate: { parent_page: { fields: ["slug"] } };
            };
            sub_navigation: {
              populate: {
                links: {
                  populate: {
                    page: {
                      fields: ["slug"];
                      populate: { parent_page: { fields: ["slug"] } };
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
    header_cta: {
      populate: {
        page: { fields: ["slug"] };
      };
    };
  };
}>;

export type FullFooter = FooterGetPayload<{
  populate: {
    navigation: {
      populate: {
        links: {
          populate: {
            page: {
              fields: ["slug"];
              populate: { parent_page: { fields: ["slug"] } };
            };
            sub_navigation: {
              populate: {
                links: {
                  populate: {
                    page: {
                      fields: ["slug"];
                      populate: { parent_page: { fields: ["slug"] } };
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
  };
}>;

export type FullBulletList = BulletListGetPayload<{
  populate: { items: true };
}>;
export type FullFaq = FaqGetPayload<{ populate: { items: true } }>;
export type FullStepGroup = StepGroupGetPayload<{ populate: { steps: true } }>;
export type FullContactForm = ContactFormGetPayload<{
  populate: { fields: true };
}>;
export type FullButton = ButtonGetPayload<{
  populate: {
    action: true;
    link: { populate: { page: { fields: ["slug"] } } };
  };
}>;

// ─── Page queries ──────────────────────────────────────────────────────────

export async function getPages(): Promise<PageSummary[]> {
  return strapiClient.pages.find({
    status: "published",
    populate: {
      parent_page: { fields: ["slug"] },
    },
    pagination: { pageSize: 100 },
  }) as Promise<PageSummary[]>;
}

export async function getPageBySlug(slug: string) {
  const results = await strapiClient.pages.find({
    status: "published",
    filters: { slug: { $eq: slug } },
    populate: {
      sections: {
        on: {
          "sections.row": { populate: { columns: true } },
          "sections.media-gallery": { populate: { Images: true } },
        },
      },
      parent_page: true,
      page_template: true,
      sub_pages: true,
    },
  });
  return results[0] ?? null;
}
export type GetPageBySlugReturn = Awaited<ReturnType<typeof getPageBySlug>>;
export type GetPageBySlugMediaGallerySection = Extract<
  NonNullable<NonNullable<GetPageBySlugReturn>["sections"]>[number],
  { __component: "sections.media-gallery" }
>;
export type GetPageBySlugRowSection = Extract<
  NonNullable<NonNullable<GetPageBySlugReturn>["sections"]>[number],
  { __component: "sections.row" }
>;

export type PageBySlug = typeof getPageBySlug;

export type FullMediaMetadata = MediaMetadataGetPayload<{
  populate: { Media: true };
}> & { metadata: Record<string, unknown> };

export async function getMediaMetadata() {
  const results = await strapiClient.mediasMetadata.find({
    populate: {
      Media: true,
    },
  });

  return (results ?? []) as FullMediaMetadata[];
}
export type GetMediaMetadataReturn = Awaited<
  ReturnType<typeof getMediaMetadata>
>;

// ─── Single types ──────────────────────────────────────────────────────────

export async function getHeader(): Promise<FullHeader | null> {
  return strapiClient.header.find({
    populate: {
      primary: {
        on: {
          "navigation.logo-image": { populate: { image: true } },
        },
      },
      navigation: {
        populate: {
          links: {
            populate: {
              page: {
                fields: ["slug", "publishedAt"],
                populate: { parent_page: { fields: ["slug"] } },
              },
              sub_navigation: {
                populate: {
                  links: {
                    populate: {
                      page: {
                        fields: ["slug", "publishedAt"],
                        populate: { parent_page: { fields: ["slug"] } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      header_cta: {
        populate: {
          page: { fields: ["slug", "title"] },
        },
      },
    },
  }) as Promise<FullHeader | null>;
}

export async function getFooter(): Promise<FullFooter | null> {
  return strapiClient.footer.find({
    populate: {
      navigation: {
        populate: {
          links: {
            populate: {
              page: {
                fields: ["slug", "publishedAt"],
                populate: { parent_page: { fields: ["slug"] } },
              },
              sub_navigation: {
                populate: {
                  links: {
                    populate: {
                      page: {
                        fields: ["slug", "publishedAt"],
                        populate: { parent_page: { fields: ["slug"] } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  }) as Promise<FullFooter | null>;
}

export async function getActiveTheme() {
  try {
    const results = await strapiClient.themes.find({
      filters: { is_active: { $eq: true } },
      populate: {
        colors: true,
        typography: true,
        spacing: true,
        layout: true,
      },
    });
    return results[0] ?? null;
  } catch {
    return null;
  }
}
export type GetActiveThemeReturn = Awaited<ReturnType<typeof getActiveTheme>>;

export async function getNotFoundPageNavigationData() {
  const documentId = "pnq4ycxac21bpfd8xs84log0";

  return strapiClient.navigations.findOne(documentId, {
    fields: ["id"],
    populate: {
      links: {
        fields: ["id", "url", "label", "path"],
        populate: { page: { fields: ["title", "slug", "publishedAt"] } },
      },
    },
  });
}

// ─── Media helpers ─────────────────────────────────────────────────────────

export function getStrapiMediaUrl(
  url: string | null | undefined,
): string | null {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${STRAPI_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

type SrcSetMedia = {
  url: string;
  width: number | null;
  formats?: {
    thumbnail?: { url: string; width: number } | undefined;
    small?: { url: string; width: number } | undefined;
    medium?: { url: string; width: number } | undefined;
    large?: { url: string; width: number } | undefined;
  } | null;
};

export function buildStrapiSrcSet(
  image: SrcSetMedia | null | undefined,
): string | null {
  if (!image) return null;
  const entries: string[] = [];

  if (image.formats) {
    for (const key of ["thumbnail", "small", "medium", "large"] as const) {
      const fmt = image.formats[key];
      if (fmt?.url && fmt?.width) {
        entries.push(`${getStrapiMediaUrl(fmt.url)} ${fmt.width}w`);
      }
    }
  }

  if (image.url && image.width) {
    entries.push(`${getStrapiMediaUrl(image.url)} ${image.width}w`);
  }

  return entries.length > 0 ? entries.join(", ") : null;
}

export function extractImageUrls(obj: unknown): string[] {
  const urls = new Set<string>();
  const re = /!\[[^\]]*\]\(([^)\s]+)/g;

  function walk(val: unknown): void {
    if (typeof val === "string") {
      re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(val)) !== null) {
        if (m[1].startsWith("/uploads/")) urls.add(m[1]);
      }
    } else if (Array.isArray(val)) {
      val.forEach(walk);
    } else if (val && typeof val === "object") {
      Object.values(val).forEach(walk);
    }
  }

  walk(obj);
  return [...urls];
}

/** Media record from the upload API (not a typed collection type) */
export interface StrapiMediaRecord {
  url: string;
  alternativeText: string | null;
  width: number | null;
  height: number | null;
  formats: {
    thumbnail?: { url: string; width: number };
    small?: { url: string; width: number };
    medium?: { url: string; width: number };
    large?: { url: string; width: number };
  };
}

export async function fetchMediaData(
  urls: string[],
): Promise<Record<string, StrapiMediaRecord>> {
  if (!urls.length) return {};

  const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;
  const headers: Record<string, string> = {};
  if (STRAPI_TOKEN) headers["Authorization"] = `Bearer ${STRAPI_TOKEN}`;

  const filterQs = urls
    .map((url, i) => `filters[url][$in][${i}]=${encodeURIComponent(url)}`)
    .join("&");

  try {
    const res = await fetch(
      `${STRAPI_URL}/api/upload/files?${filterQs}&pagination[pageSize]=100`,
      { headers },
    );
    if (!res.ok) return {};

    const response = await res.json();
    const files: MediaFile[] = Array.isArray(response)
      ? response
      : (response.data ?? []);

    return Object.fromEntries(
      files.map((m) => {
        const formats: StrapiMediaRecord["formats"] = {};
        for (const key of ["thumbnail", "small", "medium", "large"] as const) {
          const fmt = m.formats?.[key];
          if (fmt) formats[key] = { url: fmt.url, width: fmt.width };
        }
        return [
          m.url,
          {
            url: m.url,
            alternativeText: m.alternativeText ?? null,
            width: m.width,
            height: m.height,
            formats,
          },
        ];
      }),
    );
  } catch {
    return {};
  }
}

// ─── Relation embed helpers ────────────────────────────────────────────────

export interface RefToken {
  type: string;
  id: number;
}

export function extractAllRefs(obj: unknown): RefToken[] {
  const refs: RefToken[] = [];
  const seen = new Set<string>();

  function walk(val: unknown): void {
    if (typeof val === "string") {
      const re = /\[ref:([\w-]+):(\d+)\]/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(val)) !== null) {
        const key = `${m[1]}:${m[2]}`;
        if (!seen.has(key)) {
          seen.add(key);
          refs.push({ type: m[1], id: parseInt(m[2], 10) });
        }
      }
    } else if (Array.isArray(val)) {
      val.forEach(walk);
    } else if (val && typeof val === "object") {
      Object.values(val).forEach(walk);
    }
  }

  walk(obj);
  return refs;
}

type RelationApiKey =
  | "bullet-list"
  | "faq"
  | "step-group"
  | "contact-form"
  | "button";

export async function fetchRelationData(
  refs: RefToken[],
): Promise<Record<string, unknown>> {
  if (!refs.length) return {};

  const results: Record<string, unknown> = {};

  await Promise.all(
    refs.map(async ({ type, id }) => {
      try {
        let data: unknown = null;

        switch (type as RelationApiKey) {
          case "bullet-list": {
            const rows = await strapiClient.bulletLists.find({
              filters: { id: { $eq: id } } as any,
              populate: { items: true },
              pagination: { pageSize: 1 },
            });
            data = rows[0] ?? null;
            break;
          }
          case "faq": {
            const rows = await strapiClient.faqs.find({
              filters: { id: { $eq: id } } as any,
              populate: { items: true },
              pagination: { pageSize: 1 },
            });
            data = rows[0] ?? null;
            break;
          }
          case "step-group": {
            const rows = await strapiClient.stepGroups.find({
              filters: { id: { $eq: id } } as any,
              populate: { steps: true },
              pagination: { pageSize: 1 },
            });
            data = rows[0] ?? null;
            break;
          }
          case "contact-form": {
            const rows = await strapiClient.contactForms.find({
              filters: { id: { $eq: id } } as any,
              populate: { fields: true },
              pagination: { pageSize: 1 },
            });
            data = rows[0] ?? null;
            break;
          }
          case "button": {
            const rows = await strapiClient.buttons.find({
              filters: { id: { $eq: id } } as any,
              populate: {
                action: true,
                link: { populate: { page: { fields: ["slug"] } } },
              },
              pagination: { pageSize: 1 },
            });
            data = rows[0] ?? null;
            break;
          }
          default:
            return;
        }

        if (data) results[`${type}:${id}`] = data;
      } catch {
        // silent — embed placeholder renders empty
      }
    }),
  );

  return results;
}
