import { createI18nConfig } from "@webko-labs/i18n"

export const i18nConfig = createI18nConfig({
  enabled: true,
  locales: ["en", "bg"] as const,
  defaultLocale: "en",
  localeLabels: {
    en: "English",
    bg: "Български",
  },
})

export type Locale = (typeof i18nConfig.locales)[number]
export const ENABLE_LOCALIZATION = i18nConfig.enabled
