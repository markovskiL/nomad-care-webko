import 'dotenv/config'
import { getPayload } from 'payload'
import config from './src/payload.config'

const services = [
  {
    title: 'Home Cleaning',
    slug: 'home-cleaning',
    template: 'service',
    serviceData: {
      description: 'Professional home cleaning services for a spotless living space.',
      icon: 'home',
      price: 'From $99',
      features: [
        { feature: 'Deep cleaning of all rooms' },
        { feature: 'Kitchen and bathroom sanitization' },
        { feature: 'Eco-friendly products' },
      ],
    },
  },
  {
    title: 'Office Cleaning',
    slug: 'office-cleaning',
    template: 'service',
    serviceData: {
      description: 'Keep your workspace clean and productive with our office cleaning.',
      icon: 'building',
      price: 'From $149',
      features: [
        { feature: 'Daily or weekly schedules' },
        { feature: 'Desk and workstation cleaning' },
        { feature: 'Common area maintenance' },
      ],
    },
  },
  {
    title: 'Carpet Cleaning',
    slug: 'carpet-cleaning',
    template: 'service',
    serviceData: {
      description: 'Deep carpet cleaning to remove stains and allergens.',
      icon: 'sparkles',
      price: 'From $79',
      features: [
        { feature: 'Steam cleaning technology' },
        { feature: 'Stain removal' },
        { feature: 'Fast drying time' },
      ],
    },
  },
  {
    title: 'Window Cleaning',
    slug: 'window-cleaning',
    template: 'service',
    serviceData: {
      description: 'Crystal clear windows inside and out.',
      icon: 'star',
      price: 'From $59',
      features: [
        { feature: 'Interior and exterior cleaning' },
        { feature: 'Streak-free finish' },
        { feature: 'Screen cleaning included' },
      ],
    },
  },
  {
    title: 'Move-In/Out Cleaning',
    slug: 'move-cleaning',
    template: 'service',
    serviceData: {
      description: 'Comprehensive cleaning for moving transitions.',
      icon: 'truck',
      price: 'From $199',
      features: [
        { feature: 'Complete property cleaning' },
        { feature: 'Appliance deep clean' },
        { feature: 'Deposit-back guarantee' },
      ],
    },
  },
  {
    title: 'Commercial Cleaning',
    slug: 'commercial-cleaning',
    template: 'service',
    serviceData: {
      description: 'Professional cleaning for retail and commercial spaces.',
      icon: 'building',
      price: 'Custom Quote',
      features: [
        { feature: 'Flexible scheduling' },
        { feature: 'Health code compliant' },
        { feature: 'Insured and bonded' },
      ],
    },
  },
]

async function seed() {
  const payload = await getPayload({ config })

  // Find existing Services parent page
  const existingServices = await payload.find({
    collection: 'pages',
    where: { pathname: { equals: '/services' } },
    limit: 1,
  })

  let servicesPage = existingServices.docs[0]

  if (!servicesPage) {
    // Create if doesn't exist
    servicesPage = await payload.create({
      collection: 'pages',
      data: {
        title: 'Services',
        slug: 'services',
        pathname: '/services',
        template: 'services',
        visibility: {
          showInNavigation: true,
          showInFooter: true,
          navigationOrder: 2,
        },
      },
    })
    console.log('Created Services parent page:', servicesPage.id)
  } else {
    console.log('Using existing Services page:', servicesPage.id)
  }

  // Create each service as a child of Services
  for (const service of services) {
    const pathname = `/services/${service.slug}`

    // Check if already exists
    const existing = await payload.find({
      collection: 'pages',
      where: { pathname: { equals: pathname } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`Skipping existing: ${service.title} (${pathname})`)
      continue
    }

    const page = await payload.create({
      collection: 'pages',
      data: {
        ...service,
        pathname,
        parent: servicesPage.id,
        visibility: {
          showInNavigation: true,
          showInFooter: false,
          navigationOrder: services.indexOf(service) + 1,
        },
      },
    })
    console.log(`Created service: ${page.title} (${page.pathname})`)
  }

  console.log('\nDone! Created 6 service pages under /services')
  process.exit(0)
}

seed().catch(console.error)
