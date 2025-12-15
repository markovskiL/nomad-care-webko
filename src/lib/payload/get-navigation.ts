import { getPayloadClient } from "./get-payload"
import type { NavigationData } from "@webko-labs/ui"

export async function getNavigation(locale?: string): Promise<NavigationData | null> {
  try {
    const payload = await getPayloadClient()
    const navigation = await payload.findGlobal({
      slug: "navigation",
      locale: locale,
      depth: 2,
    })
    return navigation as NavigationData
  } catch {
    return null
  }
}
