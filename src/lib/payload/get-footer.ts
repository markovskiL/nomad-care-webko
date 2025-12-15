import { getPayloadClient } from "./get-payload"
import type { FooterData } from "@webko-labs/ui"

export async function getFooter(locale?: string): Promise<FooterData | null> {
  try {
    const payload = await getPayloadClient()
    const footer = await payload.findGlobal({
      slug: "footer",
      locale: locale as "en" | "bg" | "all" | undefined,
      depth: 2,
    })
    return footer as FooterData
  } catch {
    return null
  }
}
