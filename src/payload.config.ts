// Webko site configuration
import {
  createPayloadConfig,
  serviceBusinessPreset, serviceBusinessGlobals,
} from "@webko-labs/payload-config"
import { i18nConfig } from "@/lib/i18n/config"

export default createPayloadConfig({
  siteName: "My Site",
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
  secret: process.env.PAYLOAD_SECRET || "",
  databaseURL: process.env.POSTGRES_URL || "",
  blobToken: process.env.BLOB_READ_WRITE_TOKEN,
  collections: serviceBusinessPreset,
  globals: serviceBusinessGlobals,
  locales: i18nConfig.locales.map((code) => ({
    label: i18nConfig.localeLabels[code],
    code,
  })),
  defaultLocale: i18nConfig.defaultLocale,
  seo: {
    collections: ["pages"],
    globals: ["site-settings"],
  },
})
