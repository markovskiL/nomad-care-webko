import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { getPageByPathname, getAllPages } from "@/lib/payload"
import { routing } from "@/lib/i18n/routing"
import { ENABLE_LOCALIZATION, type Locale } from "@/lib/i18n/config"
import { BlockRenderer, type SectionBlock } from "@/lib/blocks"

export const revalidate = 60

interface PageProps {
  params: Promise<{
    locale: string
    slug?: string[]
  }>
}

function getPathnameFromSlug(slugArray?: string[]): string {
  if (!slugArray || slugArray.length === 0) return "/"
  return "/" + slugArray.join("/")
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug: slugArray } = await params
  const pathname = getPathnameFromSlug(slugArray)
  const page = await getPageByPathname(
    pathname,
    ENABLE_LOCALIZATION ? locale : undefined
  )

  if (!page) {
    return { title: "Page Not Found" }
  }

  return {
    title: (page.meta as { title?: string })?.title ?? (page.title as string),
    description: (page.meta as { description?: string })?.description,
  }
}

export async function generateStaticParams() {
  const pages = await getAllPages()

  return routing.locales.flatMap((locale) =>
    pages.map((page) => ({
      locale,
      slug: page.pathname === "/" ? [] : (page.pathname as string).slice(1).split("/"),
    }))
  )
}

export default async function Page({ params }: PageProps) {
  const { locale, slug: slugArray } = await params

  setRequestLocale(locale)

  const pathname = getPathnameFromSlug(slugArray)
  const page = await getPageByPathname(
    pathname,
    ENABLE_LOCALIZATION ? (locale as Locale) : undefined
  )

  if (!page) {
    notFound()
  }

  // Cast sections to SectionBlock array
  const sections = (page.sections ?? []) as SectionBlock[]

  return (
    <main>
      {sections.length === 0 ? (
        <div className="py-20 px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">{page.title as string}</h1>
          <p className="mt-4 text-gray-600">
            Add sections to this page in the admin panel.
          </p>
        </div>
      ) : (
        <BlockRenderer blocks={sections} />
      )}
    </main>
  )
}
