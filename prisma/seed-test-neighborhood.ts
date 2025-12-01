import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Test property in central Tashkent to verify neighborhood data
const testProperty = {
  userId: "demo_user_1",
  title: "Тестовая квартира — проверка инфраструктуры района",
  description: `Тестовый объект для проверки автоматической загрузки данных об инфраструктуре района из OpenStreetMap.

Квартира расположена в центре Ташкента, рядом с метро Амир Темур Хиёбони. Это позволит проверить:
- Загрузку данных о транспорте (метро, автобусы)
- Школы и детские сады поблизости
- Больницы и аптеки
- Магазины и рестораны
- Парки и места отдыха

Координаты указывают на реальное место в центре города.`,
  price: 150000,
  propertyType: "APARTMENT",
  listingType: "SALE",
  status: "ACTIVE",
  address: "ул. Амира Темура 15",
  city: "Ташкент",
  state: "Ташкент",
  country: "Узбекистан",
  zipCode: "100000",
  district: "Мирабадский район",
  nearestMetro: "Амир Темур Хиёбони",
  metroDistance: 3,

  // Central Tashkent coordinates (near Amir Temur Square)
  latitude: 41.3111,
  longitude: 69.2797,

  bedrooms: 2,
  bathrooms: 1,
  area: 65,
  livingArea: 45,
  kitchenArea: 10,
  rooms: 3,

  yearBuilt: 2010,
  floor: 5,
  totalFloors: 9,
  ceilingHeight: 2.7,

  parking: 0,
  parkingType: "STREET",
  balcony: 1,

  buildingType: "BRICK",
  buildingClass: "COMFORT",
  elevatorPassenger: 1,
  hasGarbageChute: true,
  hasConcierge: false,
  hasGatedArea: false,

  renovation: "EURO",
  windowView: "STREET",
  bathroomType: "COMBINED",
  furnished: "PARTIAL",

  featured: false,
  verified: true,
  views: 0,

  images: [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
  ],
  amenities: ["ELEVATOR", "BALCONY", "AIR_CONDITIONING", "INTERNET"],
}

async function main() {
  console.log('Создание тестового объекта для проверки инфраструктуры...\n')

  const { images, amenities, ...propertyData } = testProperty

  // Check if already exists
  const existing = await prisma.property.findFirst({
    where: { title: testProperty.title }
  })

  if (existing) {
    console.log('Тестовый объект уже существует!')
    console.log(`ID: ${existing.id}`)
    console.log(`URL: http://localhost:3000/properties/${existing.id}`)
    return
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

  console.log('✅ Тестовый объект создан!')
  console.log(`\nID: ${property.id}`)
  console.log(`Координаты: ${property.latitude}, ${property.longitude}`)
  console.log(`\n🔗 Откройте в браузере:`)
  console.log(`   http://localhost:3000/properties/${property.id}`)
  console.log(`\nПрокрутите вниз до секции "Инфраструктура района"`)
  console.log('Данные загружаются из OpenStreetMap в реальном времени.')
}

main()
  .catch((e) => {
    console.error('Ошибка:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
