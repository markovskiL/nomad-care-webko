// AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
// Generated from Payload CMS Languages global
// To update: modify languages in Payload admin, then rebuild the site

import { createI18nConfig } from "@webko-labs/i18n"

export const i18nConfig = createI18nConfig({
  enabled: true,
  locales: ["en","bg","mk"] as const,
  defaultLocale: "bg",
  localeLabels: {
      "en": "🇬🇧 English",
      "bg": "🇧🇬 Български",
      "mk": "Macedonian"
  },
})

export type Locale = (typeof i18nConfig.locales)[number]
export const ENABLE_LOCALIZATION = i18nConfig.enabled
