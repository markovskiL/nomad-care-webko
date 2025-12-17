import { i18nConfig } from "@/lib/i18n/config"

/**
 * Resolves a single href with locale prefix if needed.
 *
 * Rules:
 * - Anchors (#contact) -> unchanged
 * - External URLs (http://, https://, //) -> unchanged
 * - Default locale -> no prefix (as-needed strategy)
 * - Other locales -> add prefix
 */
export function resolveHref(
  href: string | null | undefined,
  locale: string
): string {
  if (!href) return ""

  // Skip anchors
  if (href.startsWith("#")) {
    return href
  }

  // Skip external URLs
  if (href.startsWith("http") || href.startsWith("//")) {
    return href
  }

  // Skip if locale prefix not needed (default locale with as-needed prefix)
  if (locale === i18nConfig.defaultLocale) {
    return href
  }

  // Add locale prefix to internal paths
  const normalizedHref = href.startsWith("/") ? href : `/${href}`
  return `/${locale}${normalizedHref}`
}

/**
 * Resolves hrefs in an array of items with href property.
 */
export function resolveNavLinks<T extends { href?: string | null }>(
  items: T[],
  locale: string
): T[] {
  return items.map((item) => ({
    ...item,
    href: resolveHref(item.href, locale),
  }))
}

/**
 * Resolves hrefs in navigation items with nested children.
 */
export function resolveNavItemsWithChildren<
  T extends {
    href?: string | null
    children?: Array<{ href?: string | null }> | null
    viewAllHref?: string | null
  }
>(items: T[], locale: string): T[] {
  return items.map((item) => ({
    ...item,
    href: resolveHref(item.href, locale),
    viewAllHref: item.viewAllHref ? resolveHref(item.viewAllHref, locale) : item.viewAllHref,
    children: item.children
      ? item.children.map((child) => ({
          ...child,
          href: resolveHref(child.href, locale),
        }))
      : item.children,
  }))
}

/**
 * Resolves hrefs in special links array.
 */
export function resolveSpecialLinks<T extends { href?: string | null }>(
  links: T[] | null | undefined,
  locale: string
): T[] | null | undefined {
  if (!links) return links
  return links.map((link) => ({
    ...link,
    href: resolveHref(link.href, locale),
  }))
}
