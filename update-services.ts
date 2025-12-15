import 'dotenv/config'
import { getPayload } from 'payload'
import config from './src/payload.config'

interface ServiceContent {
  slug: string
  en: {
    title: string
    description: string
    price: string
    features: string[]
  }
  bg: {
    title: string
    description: string
    price: string
    features: string[]
  }
  icon: string
}

const services: ServiceContent[] = [
  {
    slug: 'home-cleaning',
    icon: 'home',
    en: {
      title: 'Home Cleaning',
      description: 'Transform your living space with our professional home cleaning services. Our experienced team uses eco-friendly products and proven techniques to ensure every corner of your home sparkles. From regular maintenance to deep cleaning, we customize our services to meet your specific needs.',
      price: 'From $99',
      features: [
        'Deep cleaning of all rooms and surfaces',
        'Kitchen and bathroom sanitization',
        'Eco-friendly and safe cleaning products',
        'Dusting and vacuuming throughout',
        'Floor mopping and polishing',
        'Trash removal and organization',
      ],
    },
    bg: {
      title: 'Почистване на дома',
      description: 'Преобразете жилищното си пространство с нашите професионални услуги за почистване на дома. Нашият опитен екип използва екологични продукти и доказани техники, за да гарантира, че всеки ъгъл на дома ви блести. От редовна поддръжка до дълбоко почистване, ние персонализираме услугите си според вашите специфични нужди.',
      price: 'От 99 лв.',
      features: [
        'Дълбоко почистване на всички стаи и повърхности',
        'Санитаризиране на кухня и баня',
        'Екологични и безопасни почистващи продукти',
        'Обезпрашаване и прахосмукачка навсякъде',
        'Миене и полиране на подове',
        'Изхвърляне на боклук и организация',
      ],
    },
  },
  {
    slug: 'office-cleaning',
    icon: 'building',
    en: {
      title: 'Office Cleaning',
      description: 'Maintain a clean and productive workspace with our comprehensive office cleaning services. We understand that a tidy office environment boosts employee morale and impresses clients. Our flexible scheduling ensures minimal disruption to your business operations.',
      price: 'From $149',
      features: [
        'Daily, weekly, or monthly schedules available',
        'Desk and workstation sanitization',
        'Common area and reception cleaning',
        'Restroom deep cleaning and restocking',
        'Break room and kitchen maintenance',
        'Window and glass cleaning',
      ],
    },
    bg: {
      title: 'Почистване на офиси',
      description: 'Поддържайте чисто и продуктивно работно пространство с нашите цялостни услуги за почистване на офиси. Разбираме, че подредената офис среда повишава морала на служителите и впечатлява клиентите. Нашият гъвкав график гарантира минимално прекъсване на бизнес операциите ви.',
      price: 'От 149 лв.',
      features: [
        'Дневни, седмични или месечни графици',
        'Санитаризиране на бюра и работни станции',
        'Почистване на общи части и рецепция',
        'Дълбоко почистване и зареждане на тоалетни',
        'Поддръжка на стая за почивка и кухня',
        'Почистване на прозорци и стъкла',
      ],
    },
  },
  {
    slug: 'carpet-cleaning',
    icon: 'sparkles',
    en: {
      title: 'Carpet Cleaning',
      description: 'Revitalize your carpets with our professional deep cleaning services. Using state-of-the-art steam cleaning technology, we remove deep-seated dirt, allergens, and stubborn stains while extending the life of your carpets. Safe for children and pets.',
      price: 'From $79',
      features: [
        'Hot water extraction steam cleaning',
        'Stubborn stain and spot removal',
        'Pet odor and stain treatment',
        'Fast drying time (4-6 hours)',
        'Allergen and dust mite removal',
        'Carpet protection treatment available',
      ],
    },
    bg: {
      title: 'Почистване на килими',
      description: 'Съживете килимите си с нашите професионални услуги за дълбоко почистване. Използвайки най-съвременна технология за парно почистване, премахваме дълбоко натрупана мръсотия, алергени и упорити петна, като същевременно удължаваме живота на килимите ви. Безопасно за деца и домашни любимци.',
      price: 'От 79 лв.',
      features: [
        'Парно почистване с гореща вода',
        'Премахване на упорити петна',
        'Третиране на миризми и петна от домашни любимци',
        'Бързо време за съхнене (4-6 часа)',
        'Премахване на алергени и акари',
        'Налична защитна обработка на килими',
      ],
    },
  },
  {
    slug: 'window-cleaning',
    icon: 'star',
    en: {
      title: 'Window Cleaning',
      description: 'Let the light shine through with our professional window cleaning services. We clean windows inside and out, leaving them crystal clear and streak-free. Our team is equipped to handle windows at any height, from residential homes to commercial buildings.',
      price: 'From $59',
      features: [
        'Interior and exterior window cleaning',
        'Streak-free, spotless finish',
        'Screen cleaning and maintenance',
        'Window frame and sill cleaning',
        'High-rise window cleaning available',
        'Regular maintenance programs',
      ],
    },
    bg: {
      title: 'Почистване на прозорци',
      description: 'Нека светлината проникне с нашите професионални услуги за почистване на прозорци. Почистваме прозорци отвътре и отвън, оставяйки ги кристално чисти и без следи. Нашият екип е оборудван да работи с прозорци на всяка височина, от жилищни сгради до търговски обекти.',
      price: 'От 59 лв.',
      features: [
        'Почистване на прозорци отвътре и отвън',
        'Безупречен финиш без следи',
        'Почистване и поддръжка на комарници',
        'Почистване на рамки и первази',
        'Налично почистване на високи сгради',
        'Програми за редовна поддръжка',
      ],
    },
  },
  {
    slug: 'move-cleaning',
    icon: 'truck',
    en: {
      title: 'Move-In/Out Cleaning',
      description: 'Make your move stress-free with our comprehensive move-in and move-out cleaning services. Whether you\'re leaving a rental or preparing to welcome new tenants, we ensure the property is spotless. Our thorough cleaning helps secure your deposit back.',
      price: 'From $199',
      features: [
        'Complete property deep cleaning',
        'All appliances inside and out',
        'Cabinet and drawer cleaning',
        'Light fixture and fan cleaning',
        'Baseboard and trim detailing',
        'Deposit-back guarantee available',
      ],
    },
    bg: {
      title: 'Почистване при преместване',
      description: 'Направете преместването си безстресово с нашите цялостни услуги за почистване при нанасяне и изнасяне. Независимо дали напускате наето жилище или се подготвяте да посрещнете нови наематели, ние гарантираме, че имотът е безупречен. Нашето задълбочено почистване помага да си върнете депозита.',
      price: 'От 199 лв.',
      features: [
        'Пълно дълбоко почистване на имота',
        'Всички уреди отвътре и отвън',
        'Почистване на шкафове и чекмеджета',
        'Почистване на осветителни тела и вентилатори',
        'Детайлно почистване на первази и корнизи',
        'Налична гаранция за връщане на депозит',
      ],
    },
  },
  {
    slug: 'commercial-cleaning',
    icon: 'building',
    en: {
      title: 'Commercial Cleaning',
      description: 'Keep your business premises immaculate with our professional commercial cleaning services. From retail stores to warehouses, we provide customized cleaning solutions that meet industry standards. Our fully insured team works around your schedule to minimize business disruption.',
      price: 'Custom Quote',
      features: [
        'Flexible day and night scheduling',
        'Health and safety code compliant',
        'Fully insured and bonded staff',
        'Industry-specific cleaning protocols',
        'Green cleaning options available',
        'Regular quality inspections',
      ],
    },
    bg: {
      title: 'Търговско почистване',
      description: 'Поддържайте бизнес помещенията си безупречни с нашите професионални услуги за търговско почистване. От магазини до складове, ние предоставяме персонализирани решения за почистване, които отговарят на индустриалните стандарти. Нашият напълно застрахован екип работи според вашия график, за да минимизира прекъсването на бизнеса.',
      price: 'По заявка',
      features: [
        'Гъвкав дневен и нощен график',
        'Съответствие със здравни и безопасни кодове',
        'Напълно застрахован персонал',
        'Протоколи за почистване специфични за индустрията',
        'Налични екологични опции за почистване',
        'Редовни проверки на качеството',
      ],
    },
  },
]

async function updateServices() {
  const payload = await getPayload({ config })

  console.log('Updating services with richer content and Bulgarian translations...\n')

  for (const service of services) {
    const pathname = `/services/${service.slug}`

    // Find existing page
    const existing = await payload.find({
      collection: 'pages',
      where: { pathname: { equals: pathname } },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      console.log(`Service not found: ${pathname} - skipping`)
      continue
    }

    const pageId = existing.docs[0].id

    // Update with English content
    await payload.update({
      collection: 'pages',
      id: pageId,
      locale: 'en',
      data: {
        title: service.en.title,
        serviceData: {
          description: service.en.description,
          icon: service.icon,
          price: service.en.price,
          features: service.en.features.map(f => ({ feature: f })),
        },
      },
    })

    console.log(`✓ Updated English: ${service.en.title}`)

    // Update with Bulgarian content
    await payload.update({
      collection: 'pages',
      id: pageId,
      locale: 'bg',
      data: {
        title: service.bg.title,
        serviceData: {
          description: service.bg.description,
          icon: service.icon,
          price: service.bg.price,
          features: service.bg.features.map(f => ({ feature: f })),
        },
      },
    })

    console.log(`✓ Updated Bulgarian: ${service.bg.title}`)
    console.log('')
  }

  // Also update the parent Services page
  const servicesPage = await payload.find({
    collection: 'pages',
    where: { pathname: { equals: '/services' } },
    limit: 1,
  })

  if (servicesPage.docs.length > 0) {
    const servicesId = servicesPage.docs[0].id

    await payload.update({
      collection: 'pages',
      id: servicesId,
      locale: 'bg',
      data: {
        title: 'Услуги',
      },
    })
    console.log('✓ Updated Services parent page (Bulgarian: Услуги)')
  }

  console.log('\n✅ All services updated successfully!')
  process.exit(0)
}

updateServices().catch(console.error)
