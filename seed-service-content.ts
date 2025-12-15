import 'dotenv/config'
import { getPayload } from 'payload'
import config from './src/payload.config'

// Helper to create Lexical rich text structure
function createRichText(blocks: Array<{ type: 'heading' | 'paragraph' | 'list', level?: number, text?: string, items?: string[] }>) {
  const children = blocks.map(block => {
    if (block.type === 'heading') {
      return {
        type: 'heading',
        tag: `h${block.level || 2}`,
        children: [{ type: 'text', text: block.text || '' }],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      }
    }
    if (block.type === 'list') {
      return {
        type: 'list',
        listType: 'bullet',
        children: (block.items || []).map(item => ({
          type: 'listitem',
          children: [{ type: 'text', text: item }],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
          value: 1,
        })),
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        start: 1,
        tag: 'ul',
      }
    }
    // paragraph
    return {
      type: 'paragraph',
      children: [{ type: 'text', text: block.text || '' }],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
      textFormat: 0,
    }
  })

  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

const SERVICE_CONTENT: Record<string, { en: Parameters<typeof createRichText>[0], bg: Parameters<typeof createRichText>[0] }> = {
  'Regular Cleaning': {
    en: [
      { type: 'heading', level: 2, text: 'Keep Your Home Fresh Every Week' },
      { type: 'paragraph', text: 'Our regular cleaning service is designed to maintain the cleanliness and hygiene of your home on a consistent basis. Whether you need weekly, bi-weekly, or monthly visits, our professional team ensures your space always looks its best.' },
      { type: 'heading', level: 3, text: 'What We Clean' },
      { type: 'paragraph', text: 'During each visit, our trained cleaners focus on all the essential areas of your home:' },
      { type: 'list', items: [
        'Dusting all surfaces, furniture, and décor items',
        'Vacuuming carpets, rugs, and upholstered furniture',
        'Mopping hard floors with appropriate cleaning solutions',
        'Cleaning and sanitizing bathrooms including toilets, sinks, and showers',
        'Kitchen cleaning including countertops, stovetop, and appliance exteriors',
        'Making beds and tidying up living spaces',
        'Emptying trash bins and replacing liners',
      ]},
      { type: 'heading', level: 3, text: 'Why Choose Regular Cleaning?' },
      { type: 'paragraph', text: 'Consistent cleaning prevents the buildup of dust, allergens, and bacteria. It maintains your home\'s appearance and creates a healthier environment for your family. Plus, you\'ll always be ready for unexpected guests!' },
      { type: 'paragraph', text: 'Our flexible scheduling allows you to choose the frequency that works best for your lifestyle and budget. Contact us today to set up your regular cleaning schedule.' },
    ],
    bg: [
      { type: 'heading', level: 2, text: 'Поддържайте дома си свеж всяка седмица' },
      { type: 'paragraph', text: 'Нашата услуга за редовно почистване е създадена да поддържа чистотата и хигиената на вашия дом на постоянна основа. Независимо дали имате нужда от седмични, двуседмични или месечни посещения, нашият професионален екип гарантира, че вашето пространство винаги изглежда перфектно.' },
      { type: 'heading', level: 3, text: 'Какво почистваме' },
      { type: 'paragraph', text: 'По време на всяко посещение нашите обучени чистачи се фокусират върху всички основни зони на вашия дом:' },
      { type: 'list', items: [
        'Почистване на прах от всички повърхности, мебели и декоративни предмети',
        'Прахосмукачка на килими, пътеки и тапицирани мебели',
        'Измиване на твърди подове с подходящи почистващи разтвори',
        'Почистване и дезинфекция на бани включително тоалетни, мивки и душове',
        'Почистване на кухня включително плотове, котлони и външни повърхности на уреди',
        'Оправяне на легла и подреждане на жилищни пространства',
        'Изпразване на кошчета за боклук и смяна на торби',
      ]},
      { type: 'heading', level: 3, text: 'Защо да изберете редовно почистване?' },
      { type: 'paragraph', text: 'Постоянното почистване предотвратява натрупването на прах, алергени и бактерии. То поддържа външния вид на дома ви и създава по-здравословна среда за вашето семейство. Освен това винаги ще сте готови за неочаквани гости!' },
      { type: 'paragraph', text: 'Нашият гъвкав график ви позволява да изберете честотата, която работи най-добре за вашия начин на живот и бюджет. Свържете се с нас днес, за да настроите вашия график за редовно почистване.' },
    ],
  },
  'Deep Cleaning': {
    en: [
      { type: 'heading', level: 2, text: 'A Thorough Clean for Your Entire Home' },
      { type: 'paragraph', text: 'Deep cleaning goes beyond the surface to tackle dirt, grime, and buildup in areas that are often overlooked during regular cleaning. This intensive service is perfect for seasonal cleaning, preparing for special events, or giving your home a fresh start.' },
      { type: 'heading', level: 3, text: 'Our Deep Cleaning Process' },
      { type: 'paragraph', text: 'Our comprehensive deep cleaning service includes everything in our regular cleaning plus:' },
      { type: 'list', items: [
        'Cleaning inside cabinets and drawers',
        'Scrubbing tile grout and removing buildup',
        'Cleaning behind and under furniture and appliances',
        'Washing baseboards, door frames, and light switches',
        'Detailed cleaning of light fixtures and ceiling fans',
        'Interior window cleaning and window sill detailing',
        'Deep sanitization of all bathroom fixtures',
        'Oven and refrigerator interior cleaning',
        'Removing cobwebs from all corners and ceilings',
      ]},
      { type: 'heading', level: 3, text: 'When to Schedule Deep Cleaning' },
      { type: 'paragraph', text: 'We recommend deep cleaning at least twice a year, typically during spring and fall. It\'s also ideal before moving into a new home, after renovations, or when preparing for holidays and special occasions.' },
      { type: 'paragraph', text: 'Our team uses professional-grade equipment and eco-friendly cleaning products to ensure the best results while keeping your family and pets safe.' },
    ],
    bg: [
      { type: 'heading', level: 2, text: 'Основно почистване за целия ви дом' },
      { type: 'paragraph', text: 'Основното почистване надхвърля повърхността, за да се справи с мръсотия, нечистотии и натрупвания в зони, които често се пренебрегват по време на редовното почистване. Тази интензивна услуга е идеална за сезонно почистване, подготовка за специални събития или даване на нов старт на вашия дом.' },
      { type: 'heading', level: 3, text: 'Нашият процес на основно почистване' },
      { type: 'paragraph', text: 'Нашата цялостна услуга за основно почистване включва всичко от редовното ни почистване плюс:' },
      { type: 'list', items: [
        'Почистване вътре в шкафове и чекмеджета',
        'Изтъркване на фуги и премахване на натрупвания',
        'Почистване зад и под мебели и уреди',
        'Измиване на первази, каси на врати и ключове за осветление',
        'Детайлно почистване на осветителни тела и вентилатори на тавана',
        'Вътрешно почистване на прозорци и детайлно почистване на первази',
        'Дълбока дезинфекция на всички санитарни принадлежности',
        'Почистване на вътрешността на фурна и хладилник',
        'Премахване на паяжини от всички ъгли и тавани',
      ]},
      { type: 'heading', level: 3, text: 'Кога да планирате основно почистване' },
      { type: 'paragraph', text: 'Препоръчваме основно почистване поне два пъти годишно, обикновено през пролетта и есента. Също така е идеално преди нанасяне в нов дом, след ремонти или при подготовка за празници и специални поводи.' },
      { type: 'paragraph', text: 'Нашият екип използва професионално оборудване и екологично чисти почистващи продукти, за да осигури най-добри резултати, като същевременно пази вашето семейство и домашни любимци.' },
    ],
  },
  'Move-In/Out Cleaning': {
    en: [
      { type: 'heading', level: 2, text: 'Start Fresh in Your New Home' },
      { type: 'paragraph', text: 'Moving is stressful enough without worrying about cleaning. Our move-in/move-out cleaning service ensures that your old home is left spotless for the next occupants, or that your new home is thoroughly cleaned and ready for you to settle in.' },
      { type: 'heading', level: 3, text: 'Move-Out Cleaning' },
      { type: 'paragraph', text: 'Leave your old place in perfect condition with our comprehensive move-out cleaning:' },
      { type: 'list', items: [
        'Complete cleaning of all rooms from top to bottom',
        'Deep cleaning of kitchen appliances inside and out',
        'Thorough bathroom sanitization and descaling',
        'Cleaning inside all cabinets, closets, and storage areas',
        'Window cleaning (interior) and track cleaning',
        'Removal of all dust and debris from empty rooms',
        'Wall spot cleaning and scuff mark removal',
        'Garage and storage area sweeping (if applicable)',
      ]},
      { type: 'heading', level: 3, text: 'Move-In Cleaning' },
      { type: 'paragraph', text: 'Before you unpack, let us make your new space truly yours with a complete sanitization and deep clean. We\'ll ensure every surface is clean and disinfected, so you can start fresh in your new home.' },
      { type: 'paragraph', text: 'Our move-in/out cleaning helps you get your security deposit back and gives you peace of mind knowing your new home is perfectly clean. Schedule your cleaning around your moving date for a seamless transition.' },
    ],
    bg: [
      { type: 'heading', level: 2, text: 'Започнете начисто в новия си дом' },
      { type: 'paragraph', text: 'Преместването е достатъчно стресиращо без да се притеснявате за почистването. Нашата услуга за почистване при нанасяне/изнасяне гарантира, че старият ви дом е оставен безупречен за следващите обитатели, или че новият ви дом е основно почистен и готов да се настаните.' },
      { type: 'heading', level: 3, text: 'Почистване при изнасяне' },
      { type: 'paragraph', text: 'Оставете старото си място в перфектно състояние с нашето цялостно почистване при изнасяне:' },
      { type: 'list', items: [
        'Пълно почистване на всички стаи от горе до долу',
        'Основно почистване на кухненски уреди отвътре и отвън',
        'Основна дезинфекция на бани и премахване на варовик',
        'Почистване вътре във всички шкафове, гардероби и складови помещения',
        'Почистване на прозорци (вътрешни) и почистване на релси',
        'Премахване на целия прах и отломки от празни стаи',
        'Почистване на петна по стени и премахване на следи от драскотини',
        'Метене на гараж и складови помещения (ако е приложимо)',
      ]},
      { type: 'heading', level: 3, text: 'Почистване при нанасяне' },
      { type: 'paragraph', text: 'Преди да разопаковате, оставете ни да направим новото ви пространство наистина ваше с пълна дезинфекция и основно почистване. Ще гарантираме, че всяка повърхност е чиста и дезинфекцирана, така че да можете да започнете начисто в новия си дом.' },
      { type: 'paragraph', text: 'Нашето почистване при нанасяне/изнасяне ви помага да си върнете депозита и ви дава спокойствие, знаейки че новият ви дом е перфектно чист. Планирайте почистването си около датата на преместване за безпроблемен преход.' },
    ],
  },
  'Office Cleaning': {
    en: [
      { type: 'heading', level: 2, text: 'A Clean Office is a Productive Office' },
      { type: 'paragraph', text: 'A clean and organized workspace boosts employee morale, improves productivity, and creates a positive impression on clients and visitors. Our professional office cleaning services are tailored to meet the unique needs of your business.' },
      { type: 'heading', level: 3, text: 'Our Office Cleaning Services' },
      { type: 'paragraph', text: 'We offer flexible cleaning schedules to minimize disruption to your operations:' },
      { type: 'list', items: [
        'Daily, weekly, or bi-weekly cleaning schedules',
        'Desk and workstation sanitization',
        'Common area and break room cleaning',
        'Restroom cleaning and restocking supplies',
        'Floor care including vacuuming, mopping, and carpet cleaning',
        'Window and glass partition cleaning',
        'Trash removal and recycling',
        'Kitchen and pantry deep cleaning',
        'Conference room preparation and cleaning',
      ]},
      { type: 'heading', level: 3, text: 'Customized Cleaning Plans' },
      { type: 'paragraph', text: 'Every business is different, which is why we create customized cleaning plans based on your office size, industry requirements, and specific needs. We can work around your schedule, including evenings and weekends, to ensure minimal disruption.' },
      { type: 'paragraph', text: 'Our trained staff follows strict protocols and uses commercial-grade equipment to deliver consistent, high-quality results. We\'re fully insured and bonded for your peace of mind.' },
    ],
    bg: [
      { type: 'heading', level: 2, text: 'Чистият офис е продуктивен офис' },
      { type: 'paragraph', text: 'Чистото и организирано работно пространство повишава морала на служителите, подобрява продуктивността и създава положително впечатление у клиенти и посетители. Нашите професионални услуги за почистване на офиси са пригодени да отговарят на уникалните нужди на вашия бизнес.' },
      { type: 'heading', level: 3, text: 'Нашите услуги за почистване на офиси' },
      { type: 'paragraph', text: 'Предлагаме гъвкави графици за почистване, за да минимизираме смущенията във вашите операции:' },
      { type: 'list', items: [
        'Дневни, седмични или двуседмични графици за почистване',
        'Дезинфекция на бюра и работни станции',
        'Почистване на общи зони и стаи за почивка',
        'Почистване на тоалетни и зареждане на консумативи',
        'Грижа за подове включително прахосмукачка, измиване и почистване на килими',
        'Почистване на прозорци и стъклени прегради',
        'Извозване на боклук и рециклиране',
        'Основно почистване на кухня и килер',
        'Подготовка и почистване на конферентни зали',
      ]},
      { type: 'heading', level: 3, text: 'Персонализирани планове за почистване' },
      { type: 'paragraph', text: 'Всеки бизнес е различен, затова създаваме персонализирани планове за почистване въз основа на размера на вашия офис, изискванията на индустрията и специфичните нужди. Можем да работим около вашия график, включително вечери и уикенди, за да осигурим минимално смущение.' },
      { type: 'paragraph', text: 'Нашият обучен персонал следва строги протоколи и използва търговско оборудване, за да осигури последователни, висококачествени резултати. Ние сме напълно застраховани за вашето спокойствие.' },
    ],
  },
  'Window Cleaning': {
    en: [
      { type: 'heading', level: 2, text: 'Crystal Clear Windows, Inside and Out' },
      { type: 'paragraph', text: 'Clean windows make a world of difference to your home or business. They let in more natural light, improve your view, and enhance the overall appearance of your property. Our professional window cleaning service delivers streak-free results every time.' },
      { type: 'heading', level: 3, text: 'What\'s Included' },
      { type: 'paragraph', text: 'Our comprehensive window cleaning service covers:' },
      { type: 'list', items: [
        'Interior and exterior window glass cleaning',
        'Window frame and sill cleaning',
        'Screen cleaning and inspection',
        'Track and channel cleaning',
        'Removal of hard water stains and mineral deposits',
        'Skylight cleaning (where accessible)',
        'Glass door cleaning',
        'Mirror cleaning throughout your property',
      ]},
      { type: 'heading', level: 3, text: 'Professional Equipment and Techniques' },
      { type: 'paragraph', text: 'We use professional-grade squeegees, eco-friendly cleaning solutions, and water-fed pole systems for hard-to-reach windows. Our techniques ensure a spotless, streak-free finish that lasts.' },
      { type: 'paragraph', text: 'Regular window cleaning not only improves appearance but also extends the life of your windows by preventing damage from dirt, debris, and environmental pollutants. We recommend professional window cleaning at least twice a year.' },
    ],
    bg: [
      { type: 'heading', level: 2, text: 'Кристално чисти прозорци, отвътре и отвън' },
      { type: 'paragraph', text: 'Чистите прозорци правят огромна разлика за вашия дом или бизнес. Те пропускат повече естествена светлина, подобряват гледката ви и подобряват цялостния вид на вашия имот. Нашата професионална услуга за почистване на прозорци осигурява резултати без ивици всеки път.' },
      { type: 'heading', level: 3, text: 'Какво е включено' },
      { type: 'paragraph', text: 'Нашата цялостна услуга за почистване на прозорци обхваща:' },
      { type: 'list', items: [
        'Почистване на вътрешни и външни прозоречни стъкла',
        'Почистване на рамки и первази на прозорци',
        'Почистване и проверка на комарници',
        'Почистване на релси и канали',
        'Премахване на петна от твърда вода и минерални отлагания',
        'Почистване на капандури (където е достъпно)',
        'Почистване на стъклени врати',
        'Почистване на огледала в целия ви имот',
      ]},
      { type: 'heading', level: 3, text: 'Професионално оборудване и техники' },
      { type: 'paragraph', text: 'Използваме професионални стъргалки, екологично чисти почистващи разтвори и системи с прътове с подаване на вода за труднодостъпни прозорци. Нашите техники гарантират безупречен завършек без ивици, който трае.' },
      { type: 'paragraph', text: 'Редовното почистване на прозорци не само подобрява външния вид, но и удължава живота на прозорците ви, предотвратявайки повреди от мръсотия, отломки и замърсители от околната среда. Препоръчваме професионално почистване на прозорци поне два пъти годишно.' },
    ],
  },
  'Carpet Cleaning': {
    en: [
      { type: 'heading', level: 2, text: 'Revive Your Carpets to Like-New Condition' },
      { type: 'paragraph', text: 'Carpets trap dust, allergens, and stains over time, affecting indoor air quality and appearance. Our professional carpet cleaning service uses advanced techniques to deep clean your carpets, remove stubborn stains, and extend their lifespan.' },
      { type: 'heading', level: 3, text: 'Our Carpet Cleaning Process' },
      { type: 'paragraph', text: 'We follow a thorough multi-step process for optimal results:' },
      { type: 'list', items: [
        'Pre-inspection to identify stains and high-traffic areas',
        'Thorough vacuuming to remove loose dirt and debris',
        'Pre-treatment of stains and high-traffic areas',
        'Hot water extraction (steam cleaning) for deep cleaning',
        'Spot treatment for stubborn stains',
        'Grooming to reset carpet fibers',
        'Speed drying with professional air movers',
        'Post-cleaning inspection to ensure satisfaction',
      ]},
      { type: 'heading', level: 3, text: 'Benefits of Professional Carpet Cleaning' },
      { type: 'paragraph', text: 'Regular professional cleaning removes allergens and bacteria that regular vacuuming can\'t reach. It eliminates odors, restores carpet appearance, and can significantly extend the life of your carpet investment.' },
      { type: 'paragraph', text: 'We also offer stain protection treatments and deodorizing services to keep your carpets looking and smelling fresh longer. Our eco-friendly cleaning solutions are safe for children and pets.' },
    ],
    bg: [
      { type: 'heading', level: 2, text: 'Възстановете килимите си до състояние като нови' },
      { type: 'paragraph', text: 'Килимите задържат прах, алергени и петна с времето, засягайки качеството на въздуха в помещението и външния вид. Нашата професионална услуга за почистване на килими използва модерни техники за дълбоко почистване на килимите ви, премахване на упорити петна и удължаване на техния живот.' },
      { type: 'heading', level: 3, text: 'Нашият процес на почистване на килими' },
      { type: 'paragraph', text: 'Следваме задълбочен многостъпков процес за оптимални резултати:' },
      { type: 'list', items: [
        'Предварителна проверка за идентифициране на петна и зони с интензивно движение',
        'Основно почистване с прахосмукачка за премахване на свободна мръсотия и отломки',
        'Предварителна обработка на петна и зони с интензивно движение',
        'Екстракция с гореща вода (парно почистване) за дълбоко почистване',
        'Точково третиране на упорити петна',
        'Оформяне за възстановяване на влакната на килима',
        'Бързо изсушаване с професионални въздушни устройства',
        'Проверка след почистване за гарантиране на удовлетвореност',
      ]},
      { type: 'heading', level: 3, text: 'Ползи от професионалното почистване на килими' },
      { type: 'paragraph', text: 'Редовното професионално почистване премахва алергени и бактерии, които обикновената прахосмукачка не може да достигне. То елиминира миризми, възстановява външния вид на килима и може значително да удължи живота на вашата инвестиция в килими.' },
      { type: 'paragraph', text: 'Предлагаме също обработки за защита от петна и услуги за дезодориране, за да поддържате килимите си да изглеждат и миришат свежо по-дълго. Нашите екологично чисти почистващи разтвори са безопасни за деца и домашни любимци.' },
    ],
  },
  'Home Cleaning': {
    en: [
      { type: 'heading', level: 2, text: 'Professional Home Cleaning Services' },
      { type: 'paragraph', text: 'Transform your living space with our comprehensive home cleaning services. We provide thorough, reliable cleaning that lets you enjoy a spotless home without lifting a finger.' },
      { type: 'heading', level: 3, text: 'Our Home Cleaning Approach' },
      { type: 'paragraph', text: 'Every home is unique, and our cleaning approach reflects that:' },
      { type: 'list', items: [
        'Customized cleaning plans tailored to your home',
        'Eco-friendly and family-safe cleaning products',
        'Consistent quality with trained professionals',
        'Flexible scheduling to fit your lifestyle',
        'Attention to detail in every room',
        'Secure and trustworthy service',
      ]},
      { type: 'paragraph', text: 'Whether you need a one-time deep clean or regular maintenance, our team delivers exceptional results every time. We treat your home with the same care and respect as our own.' },
    ],
    bg: [
      { type: 'heading', level: 2, text: 'Професионални услуги за почистване на дома' },
      { type: 'paragraph', text: 'Трансформирайте жилищното си пространство с нашите цялостни услуги за почистване на дома. Предоставяме основно, надеждно почистване, което ви позволява да се наслаждавате на безупречен дом без да вдигате пръст.' },
      { type: 'heading', level: 3, text: 'Нашият подход за почистване на дома' },
      { type: 'paragraph', text: 'Всеки дом е уникален и нашият подход за почистване отразява това:' },
      { type: 'list', items: [
        'Персонализирани планове за почистване, съобразени с вашия дом',
        'Екологично чисти и безопасни за семейството почистващи продукти',
        'Постоянно качество с обучени професионалисти',
        'Гъвкав график, който отговаря на вашия начин на живот',
        'Внимание към детайла във всяка стая',
        'Сигурна и надеждна услуга',
      ]},
      { type: 'paragraph', text: 'Независимо дали имате нужда от еднократно основно почистване или редовна поддръжка, нашият екип предоставя изключителни резултати всеки път. Отнасяме се към вашия дом със същата грижа и уважение като към собствения си.' },
    ],
  },
  'Commercial Cleaning': {
    en: [
      { type: 'heading', level: 2, text: 'Professional Commercial Cleaning Services' },
      { type: 'paragraph', text: 'Keep your business premises clean, safe, and professional with our commercial cleaning services. We understand that a clean environment is essential for productivity, customer satisfaction, and employee well-being.' },
      { type: 'heading', level: 3, text: 'Industries We Serve' },
      { type: 'paragraph', text: 'Our commercial cleaning services cover a wide range of business types:' },
      { type: 'list', items: [
        'Office buildings and corporate headquarters',
        'Retail stores and shopping centers',
        'Medical and dental facilities',
        'Educational institutions',
        'Restaurants and food service establishments',
        'Warehouses and industrial facilities',
        'Banks and financial institutions',
        'Fitness centers and gyms',
      ]},
      { type: 'heading', level: 3, text: 'Why Choose Us for Commercial Cleaning?' },
      { type: 'paragraph', text: 'We offer flexible scheduling options including after-hours and weekend cleaning to minimize disruption to your business operations. Our trained staff follows industry-specific protocols and uses commercial-grade equipment.' },
      { type: 'paragraph', text: 'All our cleaners are background-checked, insured, and bonded. We provide consistent, reliable service that keeps your business looking its best every day.' },
    ],
    bg: [
      { type: 'heading', level: 2, text: 'Професионални услуги за търговско почистване' },
      { type: 'paragraph', text: 'Поддържайте бизнес помещенията си чисти, безопасни и професионални с нашите услуги за търговско почистване. Разбираме, че чистата среда е от съществено значение за продуктивността, удовлетвореността на клиентите и благосъстоянието на служителите.' },
      { type: 'heading', level: 3, text: 'Индустрии, които обслужваме' },
      { type: 'paragraph', text: 'Нашите услуги за търговско почистване обхващат широк спектър от бизнес типове:' },
      { type: 'list', items: [
        'Офис сгради и корпоративни централи',
        'Магазини и търговски центрове',
        'Медицински и дентални клиники',
        'Образователни институции',
        'Ресторанти и заведения за хранене',
        'Складове и индустриални съоръжения',
        'Банки и финансови институции',
        'Фитнес центрове и спортни зали',
      ]},
      { type: 'heading', level: 3, text: 'Защо да изберете нас за търговско почистване?' },
      { type: 'paragraph', text: 'Предлагаме гъвкави опции за планиране, включително почистване извън работно време и през уикенди, за да минимизираме смущенията във вашите бизнес операции. Нашият обучен персонал следва специфични за индустрията протоколи и използва търговско оборудване.' },
      { type: 'paragraph', text: 'Всички наши чистачи са проверени, застраховани и гарантирани. Предоставяме последователна, надеждна услуга, която поддържа вашия бизнес да изглежда най-добре всеки ден.' },
    ],
  },
}

async function seedServiceContent() {
  const payload = await getPayload({ config })

  console.log('Seeding service page content...\n')

  // Find all service pages
  const servicePages = await payload.find({
    collection: 'pages',
    where: { template: { equals: 'service' } },
    locale: 'en',
    limit: 100,
    depth: 1,
  })

  console.log(`Found ${servicePages.docs.length} service pages\n`)

  for (const page of servicePages.docs) {
    const title = page.title as string
    const contentData = SERVICE_CONTENT[title]

    if (!contentData) {
      console.log(`⚠ No content defined for "${title}", skipping...`)
      continue
    }

    try {
      // Update English content only - just the content field
      const enRichText = createRichText(contentData.en)

      // Use raw db update to avoid validation issues with other fields
      await payload.db.updateOne({
        collection: 'pages',
        where: { id: { equals: page.id } },
        data: {
          'serviceData.content': enRichText,
        },
        locale: 'en',
      })

      // Update Bulgarian content
      const bgRichText = createRichText(contentData.bg)
      await payload.db.updateOne({
        collection: 'pages',
        where: { id: { equals: page.id } },
        data: {
          'serviceData.content': bgRichText,
        },
        locale: 'bg',
      })

      console.log(`✓ Updated content for "${title}" (EN + BG)`)
    } catch (error: any) {
      console.error(`✗ Failed to update "${title}":`, error.message || error)
    }
  }

  console.log('\n✅ Service content seeding complete!')
  process.exit(0)
}

seedServiceContent().catch(console.error)
