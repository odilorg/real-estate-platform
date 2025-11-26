import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const mockProperties = [
  {
    userId: "demo_user_1",
    title: "Modern 2-Bedroom Apartment in Downtown",
    description: "Beautiful apartment with stunning city views. Recently renovated with modern amenities. Close to public transportation and shopping centers.",
    price: 2500,
    propertyType: "APARTMENT",
    listingType: "RENT",
    address: "123 Main Street, Apt 5B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    yearBuilt: 2018,
    floor: 5,
    totalFloors: 10,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    ],
    amenities: ["PARKING", "ELEVATOR", "GYM", "AIR_CONDITIONING"],
    latitude: 40.7505,
    longitude: -73.9934,
  },
  {
    userId: "demo_user_2",
    title: "Spacious Family House with Garden",
    description: "Charming 4-bedroom house perfect for families. Large backyard, modern kitchen, and attached garage.",
    price: 650000,
    propertyType: "HOUSE",
    listingType: "SALE",
    address: "456 Oak Avenue",
    city: "Austin",
    state: "TX",
    zipCode: "78701",
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    yearBuilt: 2015,
    parking: 2,
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    ],
    amenities: ["GARAGE", "GARDEN", "HEATING", "DISHWASHER"],
    latitude: 30.2672,
    longitude: -97.7431,
  },
  {
    userId: "demo_user_1",
    title: "Luxury Studio in Heart of City",
    description: "High-end studio apartment with floor-to-ceiling windows. Perfect for young professionals. All utilities included.",
    price: 1800,
    propertyType: "STUDIO",
    listingType: "RENT",
    address: "789 Park Lane, Unit 12A",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    bedrooms: 1,
    bathrooms: 1,
    area: 650,
    yearBuilt: 2020,
    floor: 12,
    totalFloors: 20,
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800",
    ],
    amenities: ["ELEVATOR", "SECURITY", "GYM", "POOL"],
    latitude: 37.7749,
    longitude: -122.4194,
  },
  {
    userId: "demo_user_3",
    title: "Commercial Office Space Downtown",
    description: "Prime commercial space ideal for startups or small businesses. High-speed internet, conference rooms included.",
    price: 3500,
    propertyType: "COMMERCIAL",
    listingType: "RENT",
    address: "321 Business Blvd, Suite 200",
    city: "Chicago",
    state: "IL",
    zipCode: "60601",
    area: 1500,
    yearBuilt: 2019,
    floor: 2,
    totalFloors: 15,
    parking: 5,
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
    ],
    amenities: ["PARKING", "ELEVATOR", "SECURITY", "INTERNET"],
    latitude: 41.8781,
    longitude: -87.6298,
  },
  {
    userId: "demo_user_2",
    title: "Cozy 3-Bedroom Condo with Balcony",
    description: "Well-maintained condo in quiet neighborhood. Large balcony with mountain views. Pet-friendly building.",
    price: 2200,
    propertyType: "CONDO",
    listingType: "RENT",
    address: "555 Maple Drive, #304",
    city: "Denver",
    state: "CO",
    zipCode: "80202",
    bedrooms: 3,
    bathrooms: 2,
    area: 1400,
    yearBuilt: 2016,
    floor: 3,
    totalFloors: 6,
    images: [
      "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
    ],
    amenities: ["BALCONY", "PARKING", "PET_FRIENDLY", "WASHING_MACHINE"],
    latitude: 39.7392,
    longitude: -104.9903,
  },
  {
    userId: "demo_user_1",
    title: "Beautiful Villa with Pool",
    description: "Stunning Mediterranean-style villa with private pool and landscaped gardens. Perfect for luxury living.",
    price: 1250000,
    propertyType: "VILLA",
    listingType: "SALE",
    address: "888 Sunset Boulevard",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90028",
    bedrooms: 5,
    bathrooms: 4,
    area: 4200,
    yearBuilt: 2017,
    parking: 3,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800",
      "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800",
    ],
    amenities: ["POOL", "GARDEN", "GARAGE", "FIREPLACE", "SECURITY"],
    latitude: 34.0522,
    longitude: -118.2437,
  },
  {
    userId: "demo_user_3",
    title: "Development Land - 2 Acres",
    description: "Prime development opportunity. Zoned for residential construction. All utilities available at property line.",
    price: 180000,
    propertyType: "LAND",
    listingType: "SALE",
    address: "County Road 45",
    city: "Boulder",
    state: "CO",
    zipCode: "80301",
    area: 87120,
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
      "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800",
    ],
    amenities: [],
    latitude: 40.0150,
    longitude: -105.2705,
  },
  {
    userId: "demo_user_2",
    title: "Charming Townhouse in Suburbs",
    description: "Move-in ready townhouse with updated kitchen and bathrooms. Close to schools and parks. Great community.",
    price: 425000,
    propertyType: "TOWNHOUSE",
    listingType: "SALE",
    address: "234 Elm Street",
    city: "Seattle",
    state: "WA",
    zipCode: "98101",
    bedrooms: 3,
    bathrooms: 2.5,
    area: 1850,
    yearBuilt: 2010,
    parking: 2,
    images: [
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
    ],
    amenities: ["PARKING", "GARDEN", "STORAGE", "DISHWASHER"],
    latitude: 47.6062,
    longitude: -122.3321,
  },
]

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.message.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.review.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.savedSearch.deleteMany()
  await prisma.propertyAmenity.deleteMany()
  await prisma.propertyImage.deleteMany()
  await prisma.property.deleteMany()

  console.log('Cleared existing data')

  // Create properties with images and amenities
  for (const prop of mockProperties) {
    const { images, amenities, ...propertyData } = prop

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

    console.log(`Created property: ${property.title}`)
  }

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
