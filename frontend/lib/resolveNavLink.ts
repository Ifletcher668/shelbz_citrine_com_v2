// Minimal structural types — compatible with any strapiClient.navigations query
// that populates links → page → parent_page and sub_navigation → links.

type NavLinkRaw = {
  url?: string | null;
  path?: string | null;
  label?: string | null;
  page?: {
    slug?: string | null;
    title?: string | null;
    publishedAt?: string | null;
    parent_page?: { slug?: string | null } | null;
  } | null;
  sub_navigation?: {
    links?: NavLinkRaw[] | null;
  } | null;
};

type NavigationRaw = {
  links?: NavLinkRaw[] | null;
} | null | undefined;

export type NavLinkItem = {
  href: string;
  label: string;
  isExternal: boolean;
  subNavigation: NavLinkItem[] | null;
};

export function resolveNavLink(link: NavLinkRaw): NavLinkItem {
  const { page, path, url, label, sub_navigation } = link;

  const href = page
    ? page.slug === "home"
      ? "/"
      : page.parent_page?.slug
        ? `/${page.parent_page.slug}/${page.slug}`
        : `/${page.slug}`
    : path ?? url ?? "#";

  return {
    href,
    label: label || page?.title || "",
    isExternal: !page && !path && !!url,
    subNavigation: sub_navigation?.links?.filter(isPublished).map(resolveNavLink) ?? null,
  };
}

// Sync overload
export function resolveNavLinks(raw: NavigationRaw): NavLinkItem[];
// Async overload — infers return type from input
export function resolveNavLinks(
  raw: Promise<NavigationRaw>,
): Promise<NavLinkItem[]>;
export function resolveNavLinks(
  raw: NavigationRaw | Promise<NavigationRaw>,
): NavLinkItem[] | Promise<NavLinkItem[]> {
  if (raw instanceof Promise) {
    return raw.then(resolveNavLinksSync);
  }
  return resolveNavLinksSync(raw);
}

function isPublished(link: NavLinkRaw): boolean {
  // If the link points to a page, only include it if the page is published
  if (link.page !== undefined && link.page !== null) {
    return !!link.page.publishedAt;
  }
  return true;
}

function resolveNavLinksSync(raw: NavigationRaw): NavLinkItem[] {
  return (raw?.links ?? []).filter(isPublished).map(resolveNavLink);
}
