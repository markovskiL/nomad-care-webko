import 'dotenv/config'
import { getPayload } from 'payload'
import config from './src/payload.config'

const testimonials = [
  {
    quote: 'Absolutely outstanding service! The team was professional, thorough, and left my home sparkling clean. I highly recommend them to anyone looking for quality cleaning.',
    author: 'Sarah Johnson',
    role: 'Homeowner, Brooklyn',
    rating: 5,
    featured: true,
  },
  {
    quote: 'We have been using their office cleaning services for over a year now. Consistent quality and reliability. Our workspace has never looked better.',
    author: 'Michael Chen',
    role: 'Office Manager, Manhattan',
    rating: 5,
    featured: true,
  },
  {
    quote: 'The carpet cleaning exceeded my expectations. Stains I thought were permanent are completely gone. Great value for the price!',
    author: 'Emily Rodriguez',
    role: 'Apartment Resident, Queens',
    rating: 5,
    featured: true,
  },
  {
    quote: 'Friendly staff and excellent attention to detail. They even cleaned areas I forgot to mention. Will definitely book again.',
    author: 'David Thompson',
    role: 'Business Owner',
    rating: 4,
    featured: false,
  },
  {
    quote: 'Used their move-out cleaning service and got my full deposit back. The landlord was impressed with how spotless everything was.',
    author: 'Jessica Martinez',
    role: 'Former Tenant, Bronx',
    rating: 5,
    featured: true,
  },
  {
    quote: 'Professional, punctual, and reasonably priced. The window cleaning made such a difference to our storefront. Customers have noticed!',
    author: 'Robert Kim',
    role: 'Retail Store Owner',
    rating: 5,
    featured: false,
  },
  {
    quote: 'I appreciate their eco-friendly products. As someone with allergies, it is great to have a clean home without harsh chemical smells.',
    author: 'Amanda Lewis',
    role: 'Homeowner, Staten Island',
    rating: 4,
    featured: false,
  },
  {
    quote: 'The team went above and beyond. They noticed a small leak under my sink and let me know right away. That is the kind of service you cannot find everywhere.',
    author: 'Thomas Wilson',
    role: 'Homeowner, New Jersey',
    rating: 5,
    featured: true,
  },
]

async function seed() {
  const payload = await getPayload({ config })

  for (const testimonial of testimonials) {
    // Check if testimonial already exists by author name
    const existing = await payload.find({
      collection: 'testimonials',
      where: { author: { equals: testimonial.author } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`Skipping existing: ${testimonial.author}`)
      continue
    }

    const created = await payload.create({
      collection: 'testimonials',
      data: testimonial,
    })
    console.log(`Created testimonial from: ${created.author}`)
  }

  console.log('\nDone! Seeded testimonials.')
  process.exit(0)
}

seed().catch(console.error)