import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 5 detailed properties in Russian - Tashkent, Uzbekistan
const detailedProperties = [
  {
    userId: "demo_user_1",
    title: "Элитная 4-комнатная квартира в ЖК «Миллениум» с панорамным видом",
    description: `Роскошная квартира премиум-класса в самом престижном жилом комплексе Ташкента — «Миллениум».

Квартира полностью готова к проживанию с дизайнерским ремонтом от студии «Arthaus». Использованы только натуральные материалы: итальянский мрамор, паркет из массива дуба, венецианская штукатурка.

Планировка: просторная гостиная 45 м², объединённая с кухней-столовой, мастер-спальня с гардеробной и собственной ванной комнатой, две дополнительные спальни, два санузла, постирочная комната.

Панорамное остекление от пола до потолка открывает потрясающий вид на горы Чимган и город. Высота потолков 3.2 метра создаёт ощущение простора и свободы.

Система «Умный дом» позволяет управлять освещением, климатом, шторами и мультимедиа с телефона. Центральное кондиционирование, подогрев полов во всех помещениях.

В комплекс входят: подземный паркинг на 2 машино-места, консьерж 24/7, фитнес-центр, бассейн, детская площадка, закрытая охраняемая территория.

Идеально для требовательных покупателей, ценящих комфорт и статус.`,
    price: 850000,
    propertyType: "APARTMENT",
    listingType: "SALE",
    status: "ACTIVE",
    address: "ул. Бабура 48, кв. 145",
    city: "Ташкент",
    state: "Ташкент",
    country: "Узбекистан",
    zipCode: "100000",
    district: "Мирзо-Улугбекский район",
    nearestMetro: "Космонавтлар",
    metroDistance: 8,
    latitude: 41.3111,
    longitude: 69.2797,

    // Площадь
    bedrooms: 3,
    bathrooms: 2,
    area: 186,
    livingArea: 125,
    kitchenArea: 28,
    rooms: 4,

    // Дом
    yearBuilt: 2022,
    floor: 14,
    totalFloors: 18,
    ceilingHeight: 3.2,

    // Парковка и балконы
    parking: 2,
    parkingType: "UNDERGROUND",
    balcony: 2,
    loggia: 0,

    // Характеристики здания
    buildingType: "MONOLITHIC",
    buildingClass: "ELITE",
    buildingName: "ЖК Миллениум",
    elevatorPassenger: 3,
    elevatorCargo: 1,
    hasGarbageChute: true,
    hasConcierge: true,
    hasGatedArea: true,

    // Состояние
    renovation: "DESIGNER",
    windowView: "PANORAMIC",
    bathroomType: "MULTIPLE",
    furnished: "FULL",

    // Мета
    featured: true,
    verified: true,
    views: 1247,

    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800",
    ],
    amenities: ["PARKING", "ELEVATOR", "SECURITY", "GYM", "POOL", "AIR_CONDITIONING", "HEATING", "INTERNET", "FURNISHED"],
  },
  {
    userId: "demo_user_2",
    title: "Просторная 3-комнатная квартира с евроремонтом в Юнусабаде",
    description: `Светлая и уютная квартира в одном из лучших районов Ташкента — Юнусабаде. Тихий зелёный двор, развитая инфраструктура.

Квартира расположена на 7 этаже 9-этажного кирпичного дома 2015 года постройки. Сделан качественный евроремонт с использованием современных материалов.

Планировка удобная: изолированные комнаты, просторная прихожая с встроенными шкафами, раздельный санузел. Гостиная 22 м², спальня 18 м², детская 14 м².

Кухня 12 м² оборудована встроенной техникой: холодильник, посудомоечная машина, духовой шкаф, варочная панель. Столовая зона у окна с видом на сквер.

Пластиковые окна, натяжные потолки, качественный ламинат. Установлены сплит-системы в каждой комнате. Счётчики воды и электричества.

В шаговой доступности: школа №156, детский сад, поликлиника, супермаркет Korzinka, станция метро «Минор».

Подходит для семьи с детьми. Тихие соседи, аккуратный подъезд.`,
    price: 185000,
    propertyType: "APARTMENT",
    listingType: "SALE",
    status: "ACTIVE",
    address: "ул. Осиё 28, кв. 56",
    city: "Ташкент",
    state: "Ташкент",
    country: "Узбекистан",
    zipCode: "100128",
    district: "Юнусабадский район",
    nearestMetro: "Минор",
    metroDistance: 12,
    latitude: 41.3547,
    longitude: 69.2867,

    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    livingArea: 54,
    kitchenArea: 12,
    rooms: 3,

    yearBuilt: 2015,
    floor: 7,
    totalFloors: 9,
    ceilingHeight: 2.7,

    parking: 0,
    parkingType: "STREET",
    balcony: 1,
    loggia: 1,

    buildingType: "BRICK",
    buildingClass: "COMFORT",
    buildingName: null,
    elevatorPassenger: 1,
    elevatorCargo: 0,
    hasGarbageChute: true,
    hasConcierge: false,
    hasGatedArea: false,

    renovation: "EURO",
    windowView: "COURTYARD",
    bathroomType: "SEPARATE",
    furnished: "PARTIAL",

    featured: false,
    verified: true,
    views: 523,

    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800",
    ],
    amenities: ["ELEVATOR", "BALCONY", "AIR_CONDITIONING", "DISHWASHER", "WASHING_MACHINE", "INTERNET"],
  },
  {
    userId: "demo_user_3",
    title: "Современный двухэтажный дом в посёлке Дурмень",
    description: `Новый дом для большой семьи в экологически чистом районе Дурмень. Свежий воздух, тишина и комфорт загородной жизни в 20 минутах от центра.

Дом построен в 2023 году по индивидуальному проекту. Площадь дома 280 м², участок 8 соток с ландшафтным дизайном, фруктовыми деревьями и зоной барбекю.

Первый этаж: просторная гостиная с камином (45 м²), кухня-столовая (25 м²), гостевая спальня, санузел, техническая комната.

Второй этаж: мастер-спальня с гардеробной и собственной ванной (35 м²), две детские комнаты по 18 м², общая ванная комната, балкон с видом на горы.

Отделка выполнена в современном стиле: тёплые полы на первом этаже, центральное отопление, кондиционеры во всех комнатах.

Инженерные системы: газ, центральное водоснабжение, канализация, скважина для полива. Установлена система видеонаблюдения и сигнализация.

Гараж на 2 машины, навес для ещё одной. Въезд через автоматические ворота.

Дом в закрытом посёлке с охраной. Рядом: международная школа Tashkent International School, супермаркет Makro.`,
    price: 420000,
    propertyType: "HOUSE",
    listingType: "SALE",
    status: "ACTIVE",
    address: "ул. Боғбон 15",
    city: "Ташкент",
    state: "Ташкентская область",
    country: "Узбекистан",
    zipCode: "100204",
    district: "Дурмень",
    nearestMetro: null,
    metroDistance: null,
    latitude: 41.3856,
    longitude: 69.3521,

    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    livingArea: 195,
    kitchenArea: 25,
    rooms: 6,

    yearBuilt: 2023,
    floor: 1,
    totalFloors: 2,
    ceilingHeight: 3.0,

    parking: 3,
    parkingType: "GARAGE",
    balcony: 1,
    loggia: 0,

    buildingType: "BRICK",
    buildingClass: "BUSINESS",
    buildingName: "Посёлок Боғбон",
    elevatorPassenger: 0,
    elevatorCargo: 0,
    hasGarbageChute: false,
    hasConcierge: false,
    hasGatedArea: true,

    renovation: "EURO",
    windowView: "PANORAMIC",
    bathroomType: "MULTIPLE",
    furnished: "NONE",

    featured: true,
    verified: true,
    views: 892,

    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
    ],
    amenities: ["GARAGE", "GARDEN", "SECURITY", "HEATING", "AIR_CONDITIONING", "FIREPLACE", "INTERNET"],
  },
  {
    userId: "demo_user_1",
    title: "2-комнатная квартира в аренду в центре — ул. Навои",
    description: `Стильная квартира в самом сердце Ташкента, в пешей доступности от Амира Темура и Broadway.

Квартира после свежего ремонта в современном минималистичном стиле. Идеально подходит для молодой пары или одного человека, работающего в центре.

Гостиная-студия 28 м² объединена с кухней и оборудована всем необходимым: диван-кровать, smart TV 55", обеденный стол на 4 персоны, рабочее место.

Кухонная зона полностью укомплектована: холодильник, микроволновая печь, электрочайник, посуда и столовые приборы.

Спальня 16 м² с двуспальной кроватью, большим шкафом-купе и кондиционером. Современная ванная комната с душевой кабиной и стиральной машиной.

Высокоскоростной интернет 100 Мбит/с включён в стоимость. Коммунальные услуги оплачиваются отдельно (около $80/мес).

Здание с консьержем, видеонаблюдением. Парковка во дворе.

В стоимость включена еженедельная уборка. Минимальный срок аренды — 6 месяцев.`,
    price: 1200,
    propertyType: "APARTMENT",
    listingType: "RENT",
    status: "ACTIVE",
    address: "ул. Навои 12, кв. 34",
    city: "Ташкент",
    state: "Ташкент",
    country: "Узбекистан",
    zipCode: "100029",
    district: "Мирабадский район",
    nearestMetro: "Амир Темур Хиёбони",
    metroDistance: 5,
    latitude: 41.3115,
    longitude: 69.2793,

    bedrooms: 1,
    bathrooms: 1,
    area: 58,
    livingArea: 44,
    kitchenArea: 8,
    rooms: 2,

    yearBuilt: 2018,
    floor: 5,
    totalFloors: 12,
    ceilingHeight: 2.8,

    parking: 1,
    parkingType: "STREET",
    balcony: 1,
    loggia: 0,

    buildingType: "MONOLITHIC",
    buildingClass: "BUSINESS",
    buildingName: "ЖК Навои Плаза",
    elevatorPassenger: 2,
    elevatorCargo: 0,
    hasGarbageChute: true,
    hasConcierge: true,
    hasGatedArea: false,

    renovation: "DESIGNER",
    windowView: "STREET",
    bathroomType: "COMBINED",
    furnished: "FULL",

    featured: true,
    verified: true,
    views: 2156,

    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    ],
    amenities: ["ELEVATOR", "SECURITY", "AIR_CONDITIONING", "FURNISHED", "INTERNET", "WASHING_MACHINE", "CABLE_TV"],
  },
  {
    userId: "demo_user_2",
    title: "Офисное помещение 120 м² в бизнес-центре «Пойтахт»",
    description: `Готовый офис класса А в престижном бизнес-центре «Пойтахт» на проспекте Мустакиллик.

Офис на 8 этаже с красивым видом на город. Помещение в отличном состоянии, готово к въезду.

Планировка open-space с возможностью зонирования: основной зал 85 м², переговорная комната 15 м², кабинет руководителя 12 м², мини-кухня, санузел.

Отделка: подвесные потолки Armstrong с LED-освещением, ковролин, пластиковые окна с жалюзи. Установлены центральное кондиционирование и вентиляция.

Все коммуникации: высокоскоростной интернет (оптика), телефонные линии, серверная стойка. Система контроля доступа по картам.

Бизнес-центр оборудован: подземный паркинг (2 места включены), охрана и ресепшн 24/7, конференц-зал на 50 человек, кафетерий.

Расположение идеальное для бизнеса: рядом министерства, банки, международные компании. В 10 минутах от аэропорта.

Возможна аренда дополнительных парковочных мест. Гибкие условия по сроку аренды.`,
    price: 3500,
    propertyType: "COMMERCIAL",
    listingType: "RENT",
    status: "ACTIVE",
    address: "пр. Мустакиллик 75, офис 812",
    city: "Ташкент",
    state: "Ташкент",
    country: "Узбекистан",
    zipCode: "100000",
    district: "Яккасарайский район",
    nearestMetro: "Мустакиллик",
    metroDistance: 3,
    latitude: 41.3061,
    longitude: 69.2655,

    bedrooms: null,
    bathrooms: 1,
    area: 120,
    livingArea: null,
    kitchenArea: 5,
    rooms: 3,

    yearBuilt: 2019,
    floor: 8,
    totalFloors: 16,
    ceilingHeight: 3.0,

    parking: 2,
    parkingType: "UNDERGROUND",
    balcony: 0,
    loggia: 0,

    buildingType: "MONOLITHIC",
    buildingClass: "BUSINESS",
    buildingName: "БЦ Пойтахт",
    elevatorPassenger: 4,
    elevatorCargo: 1,
    hasGarbageChute: false,
    hasConcierge: true,
    hasGatedArea: true,

    renovation: "EURO",
    windowView: "PANORAMIC",
    bathroomType: "SEPARATE",
    furnished: "PARTIAL",

    featured: false,
    verified: true,
    views: 734,

    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800",
      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800",
    ],
    amenities: ["PARKING", "ELEVATOR", "SECURITY", "AIR_CONDITIONING", "INTERNET"],
  },
]

async function main() {
  console.log('Добавление детальных объектов...\n')

  const createdProperties: { id: string; title: string; price: number }[] = []

  for (const prop of detailedProperties) {
    const { images, amenities, ...propertyData } = prop

    // Check if property with same title exists
    const existing = await prisma.property.findFirst({
      where: { title: prop.title }
    })

    if (existing) {
      console.log(`⏭️  Пропущено (уже существует): ${prop.title.substring(0, 45)}...`)
      createdProperties.push({ id: existing.id, title: existing.title, price: existing.price })
      continue
    }

    const property = await prisma.property.create({
      data: {
        ...propertyData,
        images: {
          create: images.map((url, index) => ({
            url,
            order: index,
            isPrimary: index === 0,
          })),
        },
        amenities: {
          create: amenities.map(amenity => ({
            amenity,
          })),
        },
      },
    })

    // Create initial price history
    await prisma.priceHistory.create({
      data: {
        propertyId: property.id,
        price: property.price,
        changeType: 'INITIAL',
      },
    })

    console.log(`✅ Создано: ${property.title.substring(0, 45)}...`)
    createdProperties.push({ id: property.id, title: property.title, price: property.price })
  }

  console.log('\n' + '═'.repeat(70))
  console.log('📋 СОЗДАННЫЕ ОБЪЕКТЫ:')
  console.log('═'.repeat(70))

  createdProperties.forEach((p, i) => {
    const priceStr = p.price >= 10000
      ? `$${(p.price / 1000).toFixed(0)}k`
      : `$${p.price}/мес`
    console.log(`\n${i + 1}. ${p.title.substring(0, 55)}...`)
    console.log(`   💰 ${priceStr}`)
    console.log(`   🔗 http://localhost:3000/properties/${p.id}`)
  })

  console.log('\n' + '═'.repeat(70))
  console.log(`✅ Готово! ${createdProperties.length} объектов.`)
}

main()
  .catch((e) => {
    console.error('Ошибка:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
