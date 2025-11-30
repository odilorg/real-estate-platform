import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Samarkand districts and neighborhoods
const samarkandDistricts = [
  'Registan',
  'Siab',
  'Urgut',
  'Kattakurgan',
  'Bulungur',
  'Jomboy',
  'Payariq',
  'Pastdargom',
  'Ishtixon',
  'Samarkand Center'
]

const samarkandAddresses = [
  'Registan Square, 1',
  'Amir Temur Street, 45',
  'Buyuk Ipak Yoli, 123',
  'Mirzo Ulugbek Avenue, 78',
  'Shohruh Street, 34',
  'Ibn Sino Street, 56',
  'Gagarin Street, 89',
  'Navoi Street, 12',
  'Rudaki Street, 67',
  'Afrosiyob Street, 23',
  'Kuk Saroy Street, 90',
  'Bibi Khanym Street, 15',
  'Shah-i-Zinda Street, 42',
  'Gur Emir Street, 8',
  'Ulugbek Street, 101'
]

// Property images from Unsplash
const propertyImages = {
  apartment: [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
  ],
  house: [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800'
  ],
  commercial: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800',
    'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800'
  ],
  land: [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
    'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800'
  ]
}

// New properties to add
const newProperties = [
  // Apartments for Sale
  {
    title: '3-комнатная квартира в новостройке',
    titleEn: 'Modern 3-Room Apartment in New Building',
    description: 'Просторная квартира с евроремонтом в престижном районе Регистан. Высокие потолки, панорамные окна, встроенная кухня.',
    price: 85000,
    propertyType: 'APARTMENT',
    listingType: 'SALE',
    bedrooms: 3,
    bathrooms: 2,
    area: 95,
    floor: 5,
    totalFloors: 9,
    district: 'Registan',
    yearBuilt: 2023,
    renovation: 'EURO',
    buildingClass: 'COMFORT'
  },
  {
    title: 'Элитная квартира с видом на Регистан',
    titleEn: 'Luxury Apartment with Registan View',
    description: 'Уникальная возможность жить с видом на историческую площадь Регистан. Дизайнерский ремонт, умный дом.',
    price: 150000,
    propertyType: 'APARTMENT',
    listingType: 'SALE',
    bedrooms: 4,
    bathrooms: 2,
    area: 140,
    floor: 8,
    totalFloors: 12,
    district: 'Registan',
    yearBuilt: 2022,
    renovation: 'DESIGNER',
    buildingClass: 'ELITE'
  },
  {
    title: '2-комнатная квартира в центре',
    titleEn: '2-Room Apartment in City Center',
    description: 'Уютная квартира в самом сердце Самарканда. Рядом базар Сиаб, рестораны и кафе.',
    price: 55000,
    propertyType: 'APARTMENT',
    listingType: 'SALE',
    bedrooms: 2,
    bathrooms: 1,
    area: 65,
    floor: 3,
    totalFloors: 5,
    district: 'Siab',
    yearBuilt: 2018,
    renovation: 'COSMETIC',
    buildingClass: 'COMFORT'
  },
  {
    title: 'Студия в новом жилом комплексе',
    titleEn: 'Studio in New Residential Complex',
    description: 'Компактная студия идеальна для молодых специалистов. Охраняемая территория, подземный паркинг.',
    price: 32000,
    propertyType: 'STUDIO',
    listingType: 'SALE',
    bedrooms: 1,
    bathrooms: 1,
    area: 38,
    floor: 7,
    totalFloors: 16,
    district: 'Samarkand Center',
    yearBuilt: 2024,
    renovation: 'EURO',
    buildingClass: 'BUSINESS'
  },

  // Apartments for Rent
  {
    title: 'Квартира посуточно у Регистана',
    titleEn: 'Daily Rental Apartment near Registan',
    description: 'Идеально для туристов! 5 минут пешком до Регистана. Полностью меблирована, кондиционер, Wi-Fi.',
    price: 50,
    propertyType: 'APARTMENT',
    listingType: 'RENT',
    bedrooms: 2,
    bathrooms: 1,
    area: 60,
    floor: 2,
    totalFloors: 4,
    district: 'Registan',
    yearBuilt: 2015,
    renovation: 'EURO',
    furnished: 'FULL'
  },
  {
    title: 'Просторная квартира на длительный срок',
    titleEn: 'Spacious Apartment for Long-term Rent',
    description: 'Светлая 3-комнатная квартира для семьи. Тихий район, рядом школа и детский сад.',
    price: 400,
    propertyType: 'APARTMENT',
    listingType: 'RENT',
    bedrooms: 3,
    bathrooms: 1,
    area: 85,
    floor: 4,
    totalFloors: 5,
    district: 'Jomboy',
    yearBuilt: 2010,
    renovation: 'COSMETIC',
    furnished: 'PARTIAL'
  },
  {
    title: 'Однокомнатная квартира для студентов',
    titleEn: 'One-Room Apartment for Students',
    description: 'Рядом с Самаркандским университетом. Интернет, стиральная машина, все удобства.',
    price: 200,
    propertyType: 'APARTMENT',
    listingType: 'RENT',
    bedrooms: 1,
    bathrooms: 1,
    area: 42,
    floor: 3,
    totalFloors: 9,
    district: 'Samarkand Center',
    yearBuilt: 2019,
    renovation: 'EURO',
    furnished: 'FULL'
  },

  // Houses for Sale
  {
    title: 'Традиционный узбекский дом с садом',
    titleEn: 'Traditional Uzbek House with Garden',
    description: 'Аутентичный дом с хавли (внутренним двором). Фруктовый сад, виноградник, летняя кухня.',
    price: 120000,
    propertyType: 'HOUSE',
    listingType: 'SALE',
    bedrooms: 5,
    bathrooms: 2,
    area: 250,
    district: 'Urgut',
    yearBuilt: 1995,
    renovation: 'COSMETIC'
  },
  {
    title: 'Современный коттедж в Самарканде',
    titleEn: 'Modern Cottage in Samarkand',
    description: 'Двухэтажный дом европейского типа. Гараж на 2 машины, бассейн, зона барбекю.',
    price: 280000,
    propertyType: 'HOUSE',
    listingType: 'SALE',
    bedrooms: 6,
    bathrooms: 3,
    area: 350,
    district: 'Pastdargom',
    yearBuilt: 2021,
    renovation: 'DESIGNER',
    buildingClass: 'ELITE'
  },
  {
    title: 'Дом с участком в пригороде',
    titleEn: 'House with Land in Suburbs',
    description: 'Уютный дом на большом участке. Отличный вариант для выращивания овощей и фруктов.',
    price: 75000,
    propertyType: 'HOUSE',
    listingType: 'SALE',
    bedrooms: 4,
    bathrooms: 1,
    area: 180,
    district: 'Bulungur',
    yearBuilt: 2005,
    renovation: 'COSMETIC'
  },

  // Houses for Rent
  {
    title: 'Гостевой дом для туристов',
    titleEn: 'Guest House for Tourists',
    description: 'Традиционный дом в старом городе. Идеально для групп туристов. Завтрак включен.',
    price: 150,
    propertyType: 'HOUSE',
    listingType: 'RENT',
    bedrooms: 4,
    bathrooms: 2,
    area: 200,
    district: 'Siab',
    yearBuilt: 1980,
    renovation: 'EURO',
    furnished: 'FULL'
  },

  // Commercial Properties
  {
    title: 'Магазин на центральной улице',
    titleEn: 'Shop on Main Street',
    description: 'Готовый бизнес! Торговое помещение с высокой проходимостью. Идеально для сувениров.',
    price: 95000,
    propertyType: 'COMMERCIAL',
    listingType: 'SALE',
    bathrooms: 1,
    area: 80,
    floor: 1,
    totalFloors: 2,
    district: 'Registan',
    yearBuilt: 2010
  },
  {
    title: 'Офисное помещение в бизнес-центре',
    titleEn: 'Office Space in Business Center',
    description: 'Современный офис с отдельным входом. Кондиционер, интернет, парковка.',
    price: 800,
    propertyType: 'COMMERCIAL',
    listingType: 'RENT',
    bathrooms: 1,
    area: 120,
    floor: 3,
    totalFloors: 5,
    district: 'Samarkand Center',
    yearBuilt: 2020
  },
  {
    title: 'Ресторан с летней террасой',
    titleEn: 'Restaurant with Summer Terrace',
    description: 'Полностью оборудованный ресторан на 80 посадочных мест. Вид на исторические памятники.',
    price: 180000,
    propertyType: 'COMMERCIAL',
    listingType: 'SALE',
    bathrooms: 2,
    area: 300,
    floor: 1,
    totalFloors: 2,
    district: 'Registan',
    yearBuilt: 2015
  },
  {
    title: 'Склад в промышленной зоне',
    titleEn: 'Warehouse in Industrial Zone',
    description: 'Складское помещение с удобным подъездом для грузовиков. Охрана 24/7.',
    price: 500,
    propertyType: 'COMMERCIAL',
    listingType: 'RENT',
    bathrooms: 1,
    area: 500,
    district: 'Kattakurgan',
    yearBuilt: 2008
  },
  {
    title: 'Отель-бутик на продажу',
    titleEn: 'Boutique Hotel for Sale',
    description: '15 номеров с ванными комнатами. Ресторан, хаммам. Работающий бизнес с клиентской базой.',
    price: 450000,
    propertyType: 'COMMERCIAL',
    listingType: 'SALE',
    bathrooms: 17,
    area: 800,
    district: 'Siab',
    yearBuilt: 2018
  },

  // Land
  {
    title: 'Земельный участок под строительство',
    titleEn: 'Land Plot for Construction',
    description: 'Участок 10 соток с коммуникациями. Разрешение на строительство жилого дома.',
    price: 25000,
    propertyType: 'LAND',
    listingType: 'SALE',
    area: 1000,
    district: 'Ishtixon'
  },
  {
    title: 'Сельскохозяйственная земля',
    titleEn: 'Agricultural Land',
    description: '2 гектара плодородной земли. Водоснабжение, подходит для фермерского хозяйства.',
    price: 40000,
    propertyType: 'LAND',
    listingType: 'SALE',
    area: 20000,
    district: 'Payariq'
  }
]

async function main() {
  console.log('Starting Samarkand property seed...')

  // First, update all existing properties to be in Samarkand
  const existingProperties = await prisma.property.findMany()
  console.log(`Found ${existingProperties.length} existing properties to update`)

  for (let i = 0; i < existingProperties.length; i++) {
    const prop = existingProperties[i]
    const district = samarkandDistricts[i % samarkandDistricts.length]
    const address = samarkandAddresses[i % samarkandAddresses.length]

    await prisma.property.update({
      where: { id: prop.id },
      data: {
        city: 'Samarkand',
        state: 'Samarkand Region',
        country: 'Uzbekistan',
        district: district,
        address: address,
        // Add Samarkand coordinates (approximate)
        latitude: 39.6542 + (Math.random() * 0.05 - 0.025),
        longitude: 66.9597 + (Math.random() * 0.05 - 0.025)
      }
    })
    console.log(`Updated: ${prop.title} -> ${district}`)
  }

  // Now add new properties
  console.log('\nAdding new Samarkand properties...')

  // Get a userId from existing properties or use a default
  const sampleProperty = await prisma.property.findFirst()
  const userId = sampleProperty?.userId || 'user_default'

  for (const prop of newProperties) {
    const district = prop.district || samarkandDistricts[Math.floor(Math.random() * samarkandDistricts.length)]
    const addressIndex = Math.floor(Math.random() * samarkandAddresses.length)

    // Determine image type
    let imageType: keyof typeof propertyImages = 'apartment'
    if (prop.propertyType === 'HOUSE') imageType = 'house'
    else if (prop.propertyType === 'COMMERCIAL') imageType = 'commercial'
    else if (prop.propertyType === 'LAND') imageType = 'land'

    const images = propertyImages[imageType]
    const imageUrl = images[Math.floor(Math.random() * images.length)]

    const newProperty = await prisma.property.create({
      data: {
        userId,
        title: prop.titleEn,
        description: prop.description,
        price: prop.price,
        propertyType: prop.propertyType,
        listingType: prop.listingType,
        status: 'ACTIVE',
        address: `${samarkandAddresses[addressIndex]}, ${district}`,
        city: 'Samarkand',
        state: 'Samarkand Region',
        country: 'Uzbekistan',
        district: district,
        bedrooms: prop.bedrooms || null,
        bathrooms: prop.bathrooms || null,
        area: prop.area || null,
        floor: prop.floor || null,
        totalFloors: prop.totalFloors || null,
        yearBuilt: prop.yearBuilt || null,
        renovation: prop.renovation || null,
        buildingClass: prop.buildingClass || null,
        furnished: prop.furnished || null,
        latitude: 39.6542 + (Math.random() * 0.05 - 0.025),
        longitude: 66.9597 + (Math.random() * 0.05 - 0.025),
        images: {
          create: {
            url: imageUrl,
            order: 0,
            isPrimary: true
          }
        }
      }
    })
    console.log(`Created: ${newProperty.title}`)
  }

  console.log('\nSeed completed successfully!')

  // Show summary
  const totalProperties = await prisma.property.count()
  const samarkandProperties = await prisma.property.count({
    where: { city: 'Samarkand' }
  })
  const forSale = await prisma.property.count({
    where: { city: 'Samarkand', listingType: 'SALE' }
  })
  const forRent = await prisma.property.count({
    where: { city: 'Samarkand', listingType: 'RENT' }
  })

  console.log('\n=== Summary ===')
  console.log(`Total properties: ${totalProperties}`)
  console.log(`Samarkand properties: ${samarkandProperties}`)
  console.log(`For Sale: ${forSale}`)
  console.log(`For Rent: ${forRent}`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
