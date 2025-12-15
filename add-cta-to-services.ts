import 'dotenv/config'
import { getPayload } from 'payload'
import config from './src/payload.config'

async function addCtaToServices() {
  const payload = await getPayload({ config })

  console.log('Adding CTA banners to service pages...\n')

  // First, create or find the "Services CTA" banner
  const existingBanners = await payload.find({
    collection: 'cta-banners',
    where: { title: { equals: 'Services CTA' } },
    limit: 1,
  })

  let ctaBanner = existingBanners.docs[0]

  if (!ctaBanner) {
    // Create the CTA banner with both English and Bulgarian content
    ctaBanner = await payload.create({
      collection: 'cta-banners',
      locale: 'en',
      data: {
        title: 'Services CTA',
        headingWhite: 'Ready to Get Started?',
        headingTeal: 'Book Your Service Today!',
        buttonText: 'Get Free Estimate',
        buttonHref: '/contact',
      },
    })

    // Update with Bulgarian content
    await payload.update({
      collection: 'cta-banners',
      id: ctaBanner.id,
      locale: 'bg',
      data: {
        headingWhite: 'Готови ли сте да започнете?',
        headingTeal: 'Запазете вашата услуга днес!',
        buttonText: 'Безплатна оценка',
      },
    })

    console.log('✓ Created CTA Banner: Services CTA')
  } else {
    console.log('✓ Using existing CTA Banner: Services CTA')
  }

  // Find all service pages
  const servicePages = await payload.find({
    collection: 'pages',
    where: { template: { equals: 'service' } },
    locale: 'en',
    limit: 100,
    depth: 0,
  })

  console.log(`\nFound ${servicePages.docs.length} service pages`)
  console.log(`\nTo add CTA Banner to each service page:`)
  console.log(`1. Go to admin panel → Pages`)
  console.log(`2. Edit each service page below`)
  console.log(`3. Scroll to Sections → Add Block → CTA Banner`)
  console.log(`4. Select "Services CTA" banner\n`)

  for (const page of servicePages.docs) {
    const existingSections = (page.sections ?? []) as Array<{ blockType: string }>
    const hasCta = existingSections.some(s => s.blockType === 'cta-banner-section')

    if (hasCta) {
      console.log(`  ✓ ${page.title} - already has CTA`)
    } else {
      console.log(`  → ${page.title} (${page.pathname}) - needs CTA`)
    }
  }

  console.log('\n✅ CTA Banner "Services CTA" is ready to use!')
  process.exit(0)
}

addCtaToServices().catch(console.error)
