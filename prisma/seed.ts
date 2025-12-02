import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting database seed...")
  console.log("Clearing existing data...")
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
  console.log("Cleared existing data successfully")

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
  console.log("Created users: " + users.length)

  console.log("Creating agencies...")
  const agencies = await Promise.all([
    prisma.agency.create({ data: { name: "Tashkent Realty", slug: "tashkent-realty", description: "Leading agency", email: "info@tr.uz", phone: "+998711234567", city: "Tashkent", yearsOnPlatform: 3, verified: true } }),
    prisma.agency.create({ data: { name: "Silk Road Properties", slug: "silk-road-properties", description: "Premium real estate", email: "contact@srp.uz", phone: "+998719876543", city: "Tashkent", yearsOnPlatform: 2, verified: true } }),
  ])
  console.log("Created agencies: " + agencies.length)

  console.log("Creating agents...")
  const agents = await Promise.all([
    prisma.agent.create({ data: { userId: users[0].id, agencyId: agencies[0].id, firstName: "Aziz", lastName: "Rahimov", phone: "+998901234567", email: "aziz@example.com", licenseNumber: "UZ001", verified: true, superAgent: true, responseTime: "fast", rating: 4.8, reviewCount: 56 } }),
    prisma.agent.create({ data: { userId: users[1].id, agencyId: agencies[0].id, firstName: "Dilorom", lastName: "Karimova", phone: "+998902345678", email: "dilorom@example.com", licenseNumber: "UZ002", verified: true, responseTime: "fast", rating: 4.7, reviewCount: 42 } }),
    prisma.agent.create({ data: { userId: users[2].id, agencyId: agencies[1].id, firstName: "Javohir", lastName: "Tursunov", phone: "+998903456789", email: "javohir@example.com", licenseNumber: "UZ003", verified: true, superAgent: true, responseTime: "medium", rating: 4.6, reviewCount: 38 } }),
    prisma.agent.create({ data: { userId: users[3].id, agencyId: agencies[1].id, firstName: "Malika", lastName: "Yusupova", phone: "+998904567890", email: "malika@example.com", licenseNumber: "UZ004", verified: true, responseTime: "fast", rating: 4.9, reviewCount: 31 } }),
    prisma.agent.create({ data: { userId: users[4].id, agencyId: null, firstName: "Rustam", lastName: "Sharipov", phone: "+998905678901", email: "rustam@example.com", licenseNumber: "UZ005", verified: true, responseTime: "medium", rating: 4.5, reviewCount: 22 } }),
  ])
  console.log("Created agents: " + agents.length)

  console.log("Creating properties...")
  const props = [
    { title: "Modern apt Tashkent", description: "Spacious 3-room", price: 185000, propertyType: "APARTMENT", listingType: "SALE", address: "Navoi 15", city: "Tashkent", district: "Mirzo-Ulugbek", bedrooms: 3, bathrooms: 2, area: 120, rooms: 4, yearBuilt: 2021, floor: 8, totalFloors: 16, buildingType: "MONOLITHIC", buildingClass: "BUSINESS", renovation: "EURO", userId: users[0].id, featured: true, verified: true },
    { title: "Cozy studio", description: "Compact studio", price: 350, propertyType: "STUDIO", listingType: "RENT", address: "Mukimi 48", city: "Tashkent", district: "Yakkasaray", bedrooms: 0, bathrooms: 1, area: 38, rooms: 1, yearBuilt: 2019, floor: 3, totalFloors: 9, buildingType: "PANEL", buildingClass: "COMFORT", renovation: "COSMETIC", userId: users[1].id, verified: true },
    { title: "Elite apt Infinity", description: "Luxury 4-room", price: 450000, propertyType: "APARTMENT", listingType: "SALE", address: "Rustaveli 1", city: "Tashkent", district: "Mirabad", bedrooms: 4, bathrooms: 3, area: 210, rooms: 5, yearBuilt: 2023, floor: 15, totalFloors: 25, buildingType: "MONOLITHIC", buildingClass: "ELITE", renovation: "DESIGNER", userId: users[0].id, featured: true, verified: true },
    { title: "Apt Samarkand", description: "2-room apt", price: 68000, propertyType: "APARTMENT", listingType: "SALE", address: "Registan 25", city: "Samarkand", district: "Central", bedrooms: 2, bathrooms: 1, area: 72, rooms: 3, yearBuilt: 2024, floor: 5, totalFloors: 12, buildingType: "BRICK", buildingClass: "COMFORT", renovation: "NONE", userId: users[3].id, verified: true },
    { title: "Budget apt Fergana", description: "Good 2-room", price: 28000, propertyType: "APARTMENT", listingType: "SALE", address: "Navoi 112", city: "Fergana", district: "Fergana", bedrooms: 2, bathrooms: 1, area: 54, rooms: 2, yearBuilt: 1985, floor: 2, totalFloors: 5, buildingType: "PANEL", buildingClass: "ECONOMY", renovation: "NEEDS_REPAIR", userId: users[2].id },
    { title: "House with pool", description: "Two-story house", price: 520000, propertyType: "HOUSE", listingType: "SALE", address: "Yunusabad 15", city: "Tashkent", district: "Yunusabad", bedrooms: 5, bathrooms: 4, area: 380, rooms: 8, yearBuilt: 2020, totalFloors: 2, buildingType: "BRICK", buildingClass: "ELITE", renovation: "DESIGNER", userId: users[1].id, featured: true, verified: true },
    { title: "House Samarkand", description: "Traditional house", price: 95000, propertyType: "HOUSE", listingType: "SALE", address: "Temur 89", city: "Samarkand", district: "Central", bedrooms: 4, bathrooms: 2, area: 180, rooms: 6, yearBuilt: 2005, totalFloors: 1, buildingType: "BRICK", buildingClass: "COMFORT", renovation: "COSMETIC", userId: users[3].id, verified: true },
    { title: "House rent Bukhara", description: "Family house", price: 800, propertyType: "HOUSE", listingType: "RENT", address: "Nakshbandi 45", city: "Bukhara", district: "Bukhara", bedrooms: 3, bathrooms: 2, area: 140, rooms: 5, yearBuilt: 2010, totalFloors: 1, buildingType: "BRICK", buildingClass: "COMFORT", renovation: "EURO", userId: users[3].id },
    { title: "Villa Golf City", description: "Exclusive villa", price: 850000, propertyType: "VILLA", listingType: "SALE", address: "Golf City 7", city: "Tashkent", district: "Sergeli", bedrooms: 6, bathrooms: 5, area: 520, rooms: 10, yearBuilt: 2022, totalFloors: 3, buildingType: "MONOLITHIC", buildingClass: "ELITE", renovation: "DESIGNER", userId: users[0].id, featured: true, verified: true },
    { title: "Villa Charvak", description: "Country villa", price: 380000, propertyType: "VILLA", listingType: "SALE", address: "Charvak", city: "Tashkent", district: "Bostanlyk", bedrooms: 4, bathrooms: 3, area: 280, rooms: 7, yearBuilt: 2018, totalFloors: 2, buildingType: "BRICK", buildingClass: "BUSINESS", renovation: "EURO", userId: users[1].id, verified: true },
    { title: "Townhouse gated", description: "3-level townhouse", price: 245000, propertyType: "TOWNHOUSE", listingType: "SALE", address: "Green Village", city: "Tashkent", district: "Chilanzar", bedrooms: 4, bathrooms: 3, area: 195, rooms: 6, yearBuilt: 2021, totalFloors: 3, buildingType: "BRICK", buildingClass: "BUSINESS", renovation: "EURO", userId: users[2].id, verified: true },
    { title: "Townhouse rent", description: "Modern townhouse", price: 2500, propertyType: "TOWNHOUSE", listingType: "RENT", address: "Premium Res", city: "Tashkent", district: "Mirzo-Ulugbek", bedrooms: 3, bathrooms: 2, area: 160, rooms: 5, yearBuilt: 2020, totalFloors: 2, buildingType: "BRICK", buildingClass: "BUSINESS", renovation: "EURO", userId: users[0].id, verified: true },
    { title: "Office Infinity", description: "Class A office", price: 320000, propertyType: "COMMERCIAL", listingType: "SALE", address: "BC Infinity", city: "Tashkent", district: "Mirabad", area: 250, rooms: 4, yearBuilt: 2023, floor: 10, totalFloors: 25, buildingType: "MONOLITHIC", buildingClass: "ELITE", renovation: "EURO", userId: users[2].id, verified: true },
    { title: "Retail Chorsu", description: "Great location", price: 4500, propertyType: "COMMERCIAL", listingType: "RENT", address: "Beruni 3", city: "Tashkent", district: "Shaykhantaur", area: 120, rooms: 2, yearBuilt: 2000, floor: 1, totalFloors: 3, buildingType: "BRICK", renovation: "COSMETIC", userId: users[2].id },
    { title: "Warehouse", description: "Warehouse 500sqm", price: 180000, propertyType: "COMMERCIAL", listingType: "SALE", address: "Sergeli Zone", city: "Tashkent", district: "Sergeli", area: 550, rooms: 3, yearBuilt: 2015, totalFloors: 1, buildingType: "BLOCK", renovation: "NONE", userId: users[2].id },
    { title: "Restaurant Bukhara", description: "Operating restaurant", price: 2800, propertyType: "COMMERCIAL", listingType: "RENT", address: "Nakshbandi 12", city: "Bukhara", district: "Old Town", area: 280, rooms: 5, yearBuilt: 1990, floor: 1, totalFloors: 2, buildingType: "BRICK", renovation: "EURO", userId: users[3].id },
    { title: "Plot Yangiyul", description: "10 sotka plot", price: 45000, propertyType: "LAND", listingType: "SALE", address: "Yangiyul", city: "Tashkent", district: "Yangiyul", area: 1000, userId: users[4].id, verified: true },
    { title: "Farmland Fergana", description: "5 hectares", price: 120000, propertyType: "LAND", listingType: "SALE", address: "Fergana", city: "Fergana", district: "Fergana", area: 50000, userId: users[2].id },
    { title: "Plot Namangan", description: "6 sotka plot", price: 18000, propertyType: "LAND", listingType: "SALE", address: "Navoi", city: "Namangan", district: "Namangan", area: 600, userId: users[4].id },
    { title: "Daily rental", description: "Stylish apt", price: 75, propertyType: "APARTMENT", listingType: "RENT", address: "Babur 22", city: "Tashkent", district: "Mirabad", bedrooms: 2, bathrooms: 1, area: 65, rooms: 3, yearBuilt: 2018, floor: 6, totalFloors: 12, buildingType: "MONOLITHIC", buildingClass: "BUSINESS", renovation: "EURO", userId: users[1].id, verified: true },
    { title: "Penthouse panoramic", description: "Unique penthouse", price: 650000, propertyType: "APARTMENT", listingType: "SALE", address: "Sky Tower", city: "Tashkent", district: "Yunusabad", bedrooms: 5, bathrooms: 4, area: 320, rooms: 7, yearBuilt: 2022, floor: 30, totalFloors: 30, buildingType: "MONOLITHIC", buildingClass: "ELITE", renovation: "DESIGNER", userId: users[0].id, featured: true, verified: true },
    { title: "Mini-office", description: "Ready workspace", price: 800, propertyType: "COMMERCIAL", listingType: "RENT", address: "IT Park", city: "Tashkent", district: "Mirzo-Ulugbek", area: 30, rooms: 1, yearBuilt: 2021, floor: 3, totalFloors: 5, buildingType: "MONOLITHIC", buildingClass: "BUSINESS", renovation: "EURO", userId: users[2].id, verified: true },
  ]

  for (const p of props) {
    const prop = await prisma.property.create({
      data: { ...p, images: { create: [{ url: "https://picsum.photos/seed/" + p.title.substring(0,6) + "/800/600", order: 0, isPrimary: true }] }, amenities: { create: p.propertyType === "LAND" ? [] : [{ amenity: "internet" }] } }
    })
    await prisma.priceHistory.create({ data: { propertyId: prop.id, price: p.price, changeType: "INITIAL" } })
  }
  console.log("Created properties: " + props.length)

  console.log("=== Seeding completed! ===")
  console.log("Default password: password123")
}

main().catch(e => { console.error(e); process.exit(1) }).finally(async () => await prisma.$disconnect())
