import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcrypt"
import { seedLocations } from "./seed-locations"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting database seed...")
  await seedLocations()

  console.log("\nClearing existing data...")
  await prisma.message.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.review.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.savedSearch.deleteMany()
  await prisma.recentlyViewed.deleteMany()
  await prisma.viewing.deleteMany()
  await prisma.propertyInquiry.deleteMany()
  await prisma.propertyNote.deleteMany()
  await prisma.propertyAmenity.deleteMany()
  await prisma.propertyImage.deleteMany()
  await prisma.priceHistory.deleteMany()
  await prisma.property.deleteMany()
  await prisma.agentReview.deleteMany()
  await prisma.agentApplication.deleteMany()
  await prisma.agent.deleteMany()
  await prisma.agency.deleteMany()
  await prisma.adminLog.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  const hashedPassword = await bcrypt.hash("password123", 10)

  console.log("Creating users...")
  const users = await Promise.all([
    prisma.user.create({ data: { name: "Aziz Rahimov", email: "aziz@example.com", password: hashedPassword, role: "AGENT" } }),
    prisma.user.create({ data: { name: "Dilorom Karimova", email: "dilorom@example.com", password: hashedPassword, role: "AGENT" } }),
    prisma.user.create({ data: { name: "Javohir Tursunov", email: "javohir@example.com", password: hashedPassword, role: "AGENT" } }),
    prisma.user.create({ data: { name: "Malika Yusupova", email: "malika@example.com", password: hashedPassword, role: "AGENT" } }),
    prisma.user.create({ data: { name: "Rustam Sharipov", email: "rustam@example.com", password: hashedPassword, role: "AGENT" } }),
    prisma.user.create({ data: { name: "Oybek Abdullayev", email: "oybek@example.com", password: hashedPassword, role: "USER" } }),
    prisma.user.create({ data: { name: "Nilufar Nazarova", email: "nilufar@example.com", password: hashedPassword, role: "USER" } }),
    prisma.user.create({ data: { name: "Bobur Mahmudov", email: "bobur@example.com", password: hashedPassword, role: "USER" } }),
    prisma.user.create({ data: { name: "Sardor Alimov", email: "admin@example.com", password: hashedPassword, role: "ADMIN" } }),
  ])
  console.log("Created " + users.length + " users")

  console.log("Creating agencies...")
  const agencies = await Promise.all([
    prisma.agency.create({ data: { name: "Tashkent Realty", slug: "tashkent-realty", description: "Leading agency", email: "info@tr.uz", phone: "+998711234567", city: "Tashkent", yearsOnPlatform: 3, verified: true } }),
    prisma.agency.create({ data: { name: "Silk Road Properties", slug: "silk-road-properties", description: "Premium real estate", email: "contact@srp.uz", phone: "+998719876543", city: "Tashkent", yearsOnPlatform: 2, verified: true } }),
  ])
  console.log("Created " + agencies.length + " agencies")

  console.log("Creating agents...")
  await Promise.all([
    prisma.agent.create({ data: { userId: users[0].id, agencyId: agencies[0].id, firstName: "Aziz", lastName: "Rahimov", phone: "+998901234567", email: "aziz@example.com", licenseNumber: "UZ001", verified: true, superAgent: true, responseTime: "fast", rating: 4.8, reviewCount: 56 } }),
    prisma.agent.create({ data: { userId: users[1].id, agencyId: agencies[0].id, firstName: "Dilorom", lastName: "Karimova", phone: "+998902345678", email: "dilorom@example.com", licenseNumber: "UZ002", verified: true, responseTime: "fast", rating: 4.7, reviewCount: 42 } }),
    prisma.agent.create({ data: { userId: users[2].id, agencyId: agencies[1].id, firstName: "Javohir", lastName: "Tursunov", phone: "+998903456789", email: "javohir@example.com", licenseNumber: "UZ003", verified: true, superAgent: true, responseTime: "medium", rating: 4.6, reviewCount: 38 } }),
    prisma.agent.create({ data: { userId: users[3].id, agencyId: agencies[1].id, firstName: "Malika", lastName: "Yusupova", phone: "+998904567890", email: "malika@example.com", licenseNumber: "UZ004", verified: true, responseTime: "fast", rating: 4.9, reviewCount: 31 } }),
    prisma.agent.create({ data: { userId: users[4].id, agencyId: null, firstName: "Rustam", lastName: "Sharipov", phone: "+998905678901", email: "rustam@example.com", licenseNumber: "UZ005", verified: true, responseTime: "medium", rating: 4.5, reviewCount: 22 } }),
  ])
  console.log("Created 5 agents")

  const tashkent = await prisma.city.findUnique({ where: { slug: "tashkent" } })
  const samarkand = await prisma.city.findUnique({ where: { slug: "samarkand" } })
  const bukhara = await prisma.city.findUnique({ where: { slug: "bukhara" } })
  const fergana = await prisma.city.findUnique({ where: { slug: "fergana" } })
  const namangan = await prisma.city.findUnique({ where: { slug: "namangan" } })
  const chirchiq = await prisma.city.findUnique({ where: { slug: "chirchiq" } })
  const nukus = await prisma.city.findUnique({ where: { slug: "nukus" } })

  const yunusabad = await prisma.district.findFirst({ where: { slug: "yunusabad" } })
  const mirzoUlugbek = await prisma.district.findFirst({ where: { slug: "mirzo-ulugbek" } })
  const yakkasaray = await prisma.district.findFirst({ where: { slug: "yakkasaray" } })
  const mirabad = await prisma.district.findFirst({ where: { slug: "mirabad" } })
  const chilanzar = await prisma.district.findFirst({ where: { slug: "chilanzar" } })
  const sergeli = await prisma.district.findFirst({ where: { slug: "sergeli" } })

  console.log("Creating properties...")
  const props = [
    { title: "Modern apt Mirzo Ulugbek", price: 185000, propertyType: "APARTMENT", listingType: "SALE", address: "Navoi 15", cityId: tashkent?.id, districtId: mirzoUlugbek?.id, bedrooms: 3, bathrooms: 2, area: 120, userId: users[0].id, featured: true, verified: true },
    { title: "Studio near Chorsu", price: 350, propertyType: "STUDIO", listingType: "RENT", address: "Mukimi 48", cityId: tashkent?.id, districtId: yakkasaray?.id, bedrooms: 0, bathrooms: 1, area: 38, userId: users[1].id, verified: true },
    { title: "Elite apt Infinity", price: 450000, propertyType: "APARTMENT", listingType: "SALE", address: "Rustaveli 1", cityId: tashkent?.id, districtId: mirabad?.id, bedrooms: 4, bathrooms: 3, area: 210, userId: users[0].id, featured: true, verified: true },
    { title: "Apt Samarkand center", price: 68000, propertyType: "APARTMENT", listingType: "SALE", address: "Registan 25", cityId: samarkand?.id, bedrooms: 2, bathrooms: 1, area: 72, userId: users[3].id, verified: true },
    { title: "Budget apt Fergana", price: 28000, propertyType: "APARTMENT", listingType: "SALE", address: "Navoi 112", cityId: fergana?.id, bedrooms: 2, bathrooms: 1, area: 54, userId: users[2].id },
    { title: "House pool Yunusabad", price: 520000, propertyType: "HOUSE", listingType: "SALE", address: "Yunusabad 15", cityId: tashkent?.id, districtId: yunusabad?.id, bedrooms: 5, bathrooms: 4, area: 380, userId: users[1].id, featured: true, verified: true },
    { title: "House Samarkand", price: 95000, propertyType: "HOUSE", listingType: "SALE", address: "Temur 89", cityId: samarkand?.id, bedrooms: 4, bathrooms: 2, area: 180, userId: users[3].id, verified: true },
    { title: "House rent Bukhara", price: 800, propertyType: "HOUSE", listingType: "RENT", address: "Nakshbandi 45", cityId: bukhara?.id, bedrooms: 3, bathrooms: 2, area: 140, userId: users[3].id },
    { title: "Villa Golf City", price: 850000, propertyType: "VILLA", listingType: "SALE", address: "Golf City 7", cityId: tashkent?.id, districtId: sergeli?.id, bedrooms: 6, bathrooms: 5, area: 520, userId: users[0].id, featured: true, verified: true },
    { title: "Villa Charvak", price: 380000, propertyType: "VILLA", listingType: "SALE", address: "Charvak", cityId: chirchiq?.id, bedrooms: 4, bathrooms: 3, area: 280, userId: users[1].id, verified: true },
    { title: "Townhouse gated", price: 245000, propertyType: "TOWNHOUSE", listingType: "SALE", address: "Green Village", cityId: tashkent?.id, districtId: chilanzar?.id, bedrooms: 4, bathrooms: 3, area: 195, userId: users[2].id, verified: true },
    { title: "Townhouse rent", price: 2500, propertyType: "TOWNHOUSE", listingType: "RENT", address: "Premium Res", cityId: tashkent?.id, districtId: mirzoUlugbek?.id, bedrooms: 3, bathrooms: 2, area: 160, userId: users[0].id, verified: true },
    { title: "Office Infinity", price: 320000, propertyType: "COMMERCIAL", listingType: "SALE", address: "BC Infinity", cityId: tashkent?.id, districtId: mirabad?.id, area: 250, userId: users[2].id, verified: true },
    { title: "Retail Chorsu", price: 4500, propertyType: "COMMERCIAL", listingType: "RENT", address: "Beruni 3", cityId: tashkent?.id, districtId: yakkasaray?.id, area: 120, userId: users[2].id },
    { title: "Warehouse Sergeli", price: 180000, propertyType: "COMMERCIAL", listingType: "SALE", address: "Sergeli Zone", cityId: tashkent?.id, districtId: sergeli?.id, area: 550, userId: users[2].id },
    { title: "Restaurant Bukhara", price: 2800, propertyType: "COMMERCIAL", listingType: "RENT", address: "Nakshbandi 12", cityId: bukhara?.id, area: 280, userId: users[3].id },
    { title: "Plot Yangiyul", price: 45000, propertyType: "LAND", listingType: "SALE", address: "Yangiyul", cityId: tashkent?.id, area: 1000, userId: users[4].id, verified: true },
    { title: "Farmland Fergana", price: 120000, propertyType: "LAND", listingType: "SALE", address: "Fergana", cityId: fergana?.id, area: 50000, userId: users[2].id },
    { title: "Plot Namangan", price: 18000, propertyType: "LAND", listingType: "SALE", address: "Navoi", cityId: namangan?.id, area: 600, userId: users[4].id },
    { title: "Daily apt center", price: 75, propertyType: "APARTMENT", listingType: "RENT", address: "Bobur 22", cityId: tashkent?.id, districtId: mirabad?.id, bedrooms: 2, bathrooms: 1, area: 65, userId: users[1].id, verified: true },
    { title: "Penthouse panoramic", price: 650000, propertyType: "APARTMENT", listingType: "SALE", address: "Sky Tower", cityId: tashkent?.id, districtId: yunusabad?.id, bedrooms: 5, bathrooms: 4, area: 320, userId: users[0].id, featured: true, verified: true },
    { title: "Mini-office IT Park", price: 800, propertyType: "COMMERCIAL", listingType: "RENT", address: "IT Park", cityId: tashkent?.id, districtId: mirzoUlugbek?.id, area: 30, userId: users[2].id, verified: true },
    { title: "Apartment Nukus", price: 35000, propertyType: "APARTMENT", listingType: "SALE", address: "Berdakh 15", cityId: nukus?.id, bedrooms: 3, bathrooms: 1, area: 85, userId: users[4].id },
  ]

  for (const p of props) {
    const prop = await prisma.property.create({
      data: {
        ...p,
        description: "Quality property in great location",
        country: "Uzbekistan",
        images: { create: [{ url: "https://picsum.photos/seed/" + p.title.substring(0,6) + "/800/600", order: 0, isPrimary: true }] },
        amenities: { create: p.propertyType === "LAND" ? [] : [{ amenity: "internet" }] }
      }
    })
    await prisma.priceHistory.create({ data: { propertyId: prop.id, price: p.price, changeType: "INITIAL" } })
  }
  console.log("Created " + props.length + " properties")

  console.log("\n=== Seeding Complete ===")
  console.log("Password: password123")
}

main().catch(e => { console.error(e); process.exit(1) }).finally(async () => await prisma.$disconnect())
