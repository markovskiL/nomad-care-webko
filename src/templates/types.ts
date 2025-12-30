import type { Page } from "@webko-labs/sdk"
import type { SectionBlock } from "@/lib/blocks"

export interface TemplateProps {
    page: Page
    locale: string
    siteSettings: Record<string, unknown> | null
    globalSections?: SectionBlock[]
}