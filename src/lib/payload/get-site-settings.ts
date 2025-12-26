import { getPayloadClient } from "./get-payload"
import type { PayloadLocale } from "@/lib/i18n"
import type { SiteSettingsData } from "@webko-labs/ui"

export type { SiteSettingsData }

export async function getSiteSettings(locale?: string): Promise<SiteSettingsData | null> {
  try {
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({
      slug: "site-settings",
      locale: locale as PayloadLocale,
      depth: 2, // Increased to resolve logo media relationship
    })
    return settings as SiteSettingsData
  } catch {
    return null
  }
}
