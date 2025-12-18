// AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
// Generated from Payload CMS Languages global
// To update: modify languages in Payload admin, then rebuild the site

import { createI18nConfig } from "@webko-labs/i18n"

export const i18nConfig = createI18nConfig({
  enabled: true,
  locales: ["en","bg"] as const,
  enabledLocales: ["en","bg"] as const,
  defaultLocale: "bg",
  localeLabels: {
      "en": "🇬🇧 English",
      "bg": "🇧🇬 Български"
  },
})

export type Locale = (typeof i18nConfig.locales)[number]
/** Locale type for Payload API calls (includes "all" for fetching all locales) */
export type PayloadLocale = Locale | "all" | undefined
export const ENABLE_LOCALIZATION = i18nConfig.enabled
