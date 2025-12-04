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
    prisma.agent.create({ data: { userId: users[0].id, agencyId: agencies[0].id, firstName: "Aziz", lastName: "Rahimov", phone: "+998901234567", email: "aziz@example.com", licenseNumber: "UZ001", verified: true, superAgent: true, responseTime: "fast", rating: 4.8, reviewCount: 56, photo: "https://randomuser.me/api/portraits/men/32.jpg" } }),
    prisma.agent.create({ data: { userId: users[1].id, agencyId: agencies[0].id, firstName: "Dilorom", lastName: "Karimova", phone: "+998902345678", email: "dilorom@example.com", licenseNumber: "UZ002", verified: true, responseTime: "fast", rating: 4.7, reviewCount: 42, photo: "https://randomuser.me/api/portraits/women/44.jpg" } }),
    prisma.agent.create({ data: { userId: users[2].id, agencyId: agencies[1].id, firstName: "Javohir", lastName: "Tursunov", phone: "+998903456789", email: "javohir@example.com", licenseNumber: "UZ003", verified: true, superAgent: true, responseTime: "medium", rating: 4.6, reviewCount: 38, photo: "https://randomuser.me/api/portraits/men/67.jpg" } }),
    prisma.agent.create({ data: { userId: users[3].id, agencyId: agencies[1].id, firstName: "Malika", lastName: "Yusupova", phone: "+998904567890", email: "malika@example.com", licenseNumber: "UZ004", verified: true, responseTime: "fast", rating: 4.9, reviewCount: 31, photo: "https://randomuser.me/api/portraits/women/68.jpg" } }),
    prisma.agent.create({ data: { userId: users[4].id, agencyId: null, firstName: "Rustam", lastName: "Sharipov", phone: "+998905678901", email: "rustam@example.com", licenseNumber: "UZ005", verified: true, responseTime: "medium", rating: 4.5, reviewCount: 22, photo: "https://randomuser.me/api/portraits/men/52.jpg" } }),
  ])
  console.log("Created agents: " + agents.length)

  console.log("Creating properties...")
  const props = [
    // TASHKENT - Apartments
    { title: "Modern apt Tashkent", description: "Spacious 3-room apartment in the heart of Tashkent with panoramic city views. Modern renovation, premium finishes, smart home system.", price: 185000, propertyType: "APARTMENT", listingType: "SALE", address: "Navoi 15", city: "Tashkent", district: "Mirzo-Ulugbek", bedrooms: 3, bathrooms: 2, area: 120, rooms: 4, yearBuilt: 2021, floor: 8, totalFloors: 16, buildingType: "MONOLITHIC", buildingClass: "BUSINESS", renovation: "EURO", userId: users[0].id, featured: true, verified: true },
    { title: "Cozy studio center", description: "Compact studio apartment perfect for young professionals. Fully furnished, close to metro station and shopping centers.", price: 350, propertyType: "STUDIO", listingType: "RENT", address: "Mukimi 48", city: "Tashkent", district: "Yakkasaray", bedrooms: 0, bathrooms: 1, area: 38, rooms: 1, yearBuilt: 2019, floor: 3, totalFloors: 9, buildingType: "PANEL", buildingClass: "COMFORT", renovation: "COSMETIC", userId: users[1].id, verified: true },
    { title: "Elite apt Infinity Tower", description: "Luxury 4-room apartment in prestigious Infinity Tower. Designer renovation, imported materials, concierge service 24/7.", price: 450000, propertyType: "APARTMENT", listingType: "SALE", address: "Rustaveli 1", city: "Tashkent", district: "Mirabad", bedrooms: 4, bathrooms: 3, area: 210, rooms: 5, yearBuilt: 2023, floor: 15, totalFloors: 25, buildingType: "MONOLITHIC", buildingClass: "ELITE", renovation: "DESIGNER", userId: users[0].id, featured: true, verified: true },
    { title: "Penthouse panoramic views", description: "Unique penthouse with 360-degree city views. Private terrace, jacuzzi, wine cellar. The pinnacle of luxury living.", price: 650000, propertyType: "APARTMENT", listingType: "SALE", address: "Sky Tower", city: "Tashkent", district: "Yunusabad", bedrooms: 5, bathrooms: 4, area: 320, rooms: 7, yearBuilt: 2022, floor: 30, totalFloors: 30, buildingType: "MONOLITHIC", buildingClass: "ELITE", renovation: "DESIGNER", userId: users[0].id, featured: true, verified: true },
    { title: "Daily rental Mirabad", description: "Stylish apartment for daily rent. Perfect for business travelers and tourists. Near Magic City and Amir Temur square.", price: 75, propertyType: "APARTMENT", listingType: "RENT", address: "Babur 22", city: "Tashkent", district: "Mirabad", bedrooms: 2, bathrooms: 1, area: 65, rooms: 3, yearBuilt: 2018, floor: 6, totalFloors: 12, buildingType: "MONOLITHIC", buildingClass: "BUSINESS", renovation: "EURO", userId: users[1].id, verified: true },
    { title: "Family apt Chilanzar", description: "Comfortable 3-room apartment in family-friendly Chilanzar district. Near schools, parks, and shopping.", price: 95000, propertyType: "APARTMENT", listingType: "SALE", address: "Bunyodkor 78", city: "Tashkent", district: "Chilanzar", bedrooms: 3, bathrooms: 1, area: 85, rooms: 4, yearBuilt: 2015, floor: 4, totalFloors: 9, buildingType: "PANEL", buildingClass: "COMFORT", renovation: "EURO", userId: users[2].id, verified: true },
    { title: "Apt near metro Kosmonavtlar", description: "Renovated apartment 2 minutes walk from Kosmonavtlar metro. Perfect commute location.", price: 78000, propertyType: "APARTMENT", listingType: "SALE", address: "Chilanzar 10", city: "Tashkent", district: "Chilanzar", bedrooms: 2, bathrooms: 1, area: 62, rooms: 3, yearBuilt: 1990, floor: 2, totalFloors: 5, buildingType: "BRICK", buildingClass: "ECONOMY", renovation: "EURO", userId: users[4].id, verified: true },
    { title: "New building Sergeli", description: "Brand new apartment in modern residential complex. Underground parking, playground, 24/7 security.", price: 125000, propertyType: "APARTMENT", listingType: "SALE", address: "Sergeli 15", city: "Tashkent", district: "Sergeli", bedrooms: 3, bathrooms: 2, area: 98, rooms: 4, yearBuilt: 2024, floor: 7, totalFloors: 16, buildingType: "MONOLITHIC", buildingClass: "COMFORT", renovation: "NONE", userId: users[3].id },
    { title: "Luxury apt Tashkent City", description: "Premium apartment in Tashkent City business district. Walking distance to major corporations and embassies.", price: 380000, propertyType: "APARTMENT", listingType: "SALE", address: "Tashkent City Mall", city: "Tashkent", district: "Shaykhantaur", bedrooms: 3, bathrooms: 2, area: 145, rooms: 4, yearBuilt: 2023, floor: 18, totalFloors: 35, buildingType: "MONOLITHIC", buildingClass: "ELITE", renovation: "DESIGNER", userId: users[0].id, featured: true, verified: true },
    { title: "Budget apt for students", description: "Affordable apartment near universities. Perfect for students. Good transport connections.", price: 42000, propertyType: "APARTMENT", listingType: "SALE", address: "Universitet 5", city: "Tashkent", district: "Almazar", bedrooms: 1, bathrooms: 1, area: 35, rooms: 2, yearBuilt: 1985, floor: 3, totalFloors: 5, buildingType: "PANEL", buildingClass: "ECONOMY", renovation: "COSMETIC", userId: users[4].id },

    // SAMARKAND - Properties
    { title: "Apt near Registan", description: "Beautifully renovated 2-room apartment just 500m from the legendary Registan Square. Tourist rental potential.", price: 68000, propertyType: "APARTMENT", listingType: "SALE", address: "Registan 25", city: "Samarkand", district: "Central", bedrooms: 2, bathrooms: 1, area: 72, rooms: 3, yearBuilt: 2024, floor: 5, totalFloors: 12, buildingType: "BRICK", buildingClass: "COMFORT", renovation: "EURO", userId: users[3].id, verified: true },
    { title: "Traditional house Samarkand", description: "Charming traditional Uzbek house with courtyard. Authentic architecture meets modern comfort.", price: 95000, propertyType: "HOUSE", listingType: "SALE", address: "Temur 89", city: "Samarkand", district: "Central", bedrooms: 4, bathrooms: 2, area: 180, rooms: 6, yearBuilt: 2005, totalFloors: 1, buildingType: "BRICK", buildingClass: "COMFORT", renovation: "COSMETIC", userId: users[3].id, verified: true },
    { title: "New apt Samarkand", description: "Modern apartment in new residential complex. European-style renovation, central heating.", price: 55000, propertyType: "APARTMENT", listingType: "SALE", address: "Gagarin 45", city: "Samarkand", district: "Samarkand", bedrooms: 2, bathrooms: 1, area: 65, rooms: 3, yearBuilt: 2023, floor: 4, totalFloors: 9, buildingType: "MONOLITHIC", buildingClass: "COMFORT", renovation: "EURO", userId: users[3].id, verified: true },
    { title: "Guest house Samarkand", description: "Operating guest house near tourist attractions. 8 rooms, established business with regular bookings.", price: 180000, propertyType: "COMMERCIAL", listingType: "SALE", address: "Bukhara str 12", city: "Samarkand", district: "Central", area: 350, rooms: 10, yearBuilt: 2010, totalFloors: 2, buildingType: "BRICK", buildingClass: "COMFORT", renovation: "EURO", userId: users[3].id, verified: true },
    { title: "Studio for rent Samarkand", description: "Cozy studio for long-term rent. Fully furnished, all utilities included. Near bazaar.", price: 200, propertyType: "STUDIO", listingType: "RENT", address: "Navoi 78", city: "Samarkand", district: "Samarkand", bedrooms: 0, bathrooms: 1, area: 32, rooms: 1, yearBuilt: 2020, floor: 2, totalFloors: 5, buildingType: "BRICK", buildingClass: "ECONOMY", renovation: "COSMETIC", userId: users[3].id },

    // BUKHARA - Properties
    { title: "House rent Bukhara", description: "Family house for rent in quiet neighborhood. Large courtyard, fruit trees, traditional atmosphere.", price: 800, propertyType: "HOUSE", listingType: "RENT", address: "Nakshbandi 45", city: "Bukhara", district: "Bukhara", bedrooms: 3, bathrooms: 2, area: 140, rooms: 5, yearBuilt: 2010, totalFloors: 1, buildingType: "BRICK", buildingClass: "COMFORT", renovation: "EURO", userId: users[3].id },
    { title: "Restaurant Old Bukhara", description: "Operating restaurant in historic center. Authentic Bukhara cuisine, established clientele, great reviews.", price: 2800, propertyType: "COMMERCIAL", listingType: "RENT", address: "Nakshbandi 12", city: "Bukhara", district: "Old Town", area: 280, rooms: 5, yearBuilt: 1990, floor: 1, totalFloors: 2, buildingType: "BRICK", renovation: "EURO", userId: users[3].id },
    { title: "Boutique hotel Bukhara", description: "Historic building converted to boutique hotel. 12 rooms, rooftop terrace with minaret views.", price: 450000, propertyType: "COMMERCIAL", listingType: "SALE", address: "Lyabi Hauz 5", city: "Bukhara", district: "Old Town", area: 600, rooms: 15, yearBuilt: 1920, totalFloors: 2, buildingType: "BRICK", buildingClass: "BUSINESS", renovation: "DESIGNER", userId: users[3].id, featured: true, verified: true },
    { title: "Apt center Bukhara", description: "Renovated apartment in the heart of Bukhara. Walking distance to all major sights.", price: 48000, propertyType: "APARTMENT", listingType: "SALE", address: "Mustaqillik 34", city: "Bukhara", district: "Bukhara", bedrooms: 2, bathrooms: 1, area: 58, rooms: 3, yearBuilt: 2018, floor: 3, totalFloors: 5, buildingType: "BRICK", buildingClass: "COMFORT", renovation: "EURO", userId: users[3].id, verified: true },

    // FERGANA - Properties
    { title: "Budget apt Fergana", description: "Good 2-room apartment in quiet area. Needs some renovation but great potential.", price: 28000, propertyType: "APARTMENT", listingType: "SALE", address: "Navoi 112", city: "Fergana", district: "Fergana", bedrooms: 2, bathrooms: 1, area: 54, rooms: 2, yearBuilt: 1985, floor: 2, totalFloors: 5, buildingType: "PANEL", buildingClass: "ECONOMY", renovation: "NEEDS_REPAIR", userId: users[2].id },
    { title: "House with garden Fergana", description: "Spacious house with large garden. 10 sotka land, garage, fruit trees. Perfect for family.", price: 85000, propertyType: "HOUSE", listingType: "SALE", address: "Mustaqillik 56", city: "Fergana", district: "Fergana", bedrooms: 4, bathrooms: 2, area: 160, rooms: 6, yearBuilt: 2008, totalFloors: 1, buildingType: "BRICK", buildingClass: "COMFORT", renovation: "COSMETIC", userId: users[2].id, verified: true },
    { title: "New apt Fergana center", description: "Modern apartment in new building. Elevator, underground parking. Near central park.", price: 52000, propertyType: "APARTMENT", listingType: "SALE", address: "Amir Temur 23", city: "Fergana", district: "Fergana", bedrooms: 3, bathrooms: 1, area: 78, rooms: 4, yearBuilt: 2022, floor: 6, totalFloors: 12, buildingType: "MONOLITHIC", buildingClass: "COMFORT", renovation: "NONE", userId: users[2].id },
    { title: "Farmland Fergana Valley", description: "5 hectares of fertile farmland in Fergana Valley. Irrigation system, access road.", price: 120000, propertyType: "LAND", listingType: "SALE", address: "Fergana", city: "Fergana", district: "Fergana", area: 50000, userId: users[2].id },

    // NAMANGAN - Properties
    { title: "Plot Namangan city", description: "6 sotka plot in developing area. All communications nearby. Building permit ready.", price: 18000, propertyType: "LAND", listingType: "SALE", address: "Navoi", city: "Namangan", district: "Namangan", area: 600, userId: users[4].id },
    { title: "House Namangan", description: "Well-maintained house in central Namangan. 8 sotka land, renovated 2020.", price: 72000, propertyType: "HOUSE", listingType: "SALE", address: "Bobur 45", city: "Namangan", district: "Namangan", bedrooms: 3, bathrooms: 2, area: 130, rooms: 5, yearBuilt: 1995, totalFloors: 1, buildingType: "BRICK", buildingClass: "COMFORT", renovation: "EURO", userId: users[4].id, verified: true },
    { title: "Apt Namangan new", description: "New apartment in modern complex. Good investment opportunity in growing city.", price: 38000, propertyType: "APARTMENT", listingType: "SALE", address: "Dustlik 12", city: "Namangan", district: "Namangan", bedrooms: 2, bathrooms: 1, area: 56, rooms: 3, yearBuilt: 2023, floor: 4, totalFloors: 9, buildingType: "MONOLITHIC", buildingClass: "COMFORT", renovation: "NONE", userId: users[4].id },
    { title: "Shop Namangan bazaar", description: "Commercial space near Namangan bazaar. High foot traffic, established location.", price: 1200, propertyType: "COMMERCIAL", listingType: "RENT", address: "Bazaar 5", city: "Namangan", district: "Namangan", area: 45, rooms: 1, yearBuilt: 2000, floor: 1, totalFloors: 1, buildingType: "BRICK", renovation: "COSMETIC", userId: users[4].id },

    // ANDIJAN - Properties
    { title: "Apt Andijan center", description: "Centrally located apartment with good transport links. Near market and schools.", price: 35000, propertyType: "APARTMENT", listingType: "SALE", address: "Navoi 67", city: "Andijan", district: "Andijan", bedrooms: 2, bathrooms: 1, area: 52, rooms: 3, yearBuilt: 2010, floor: 3, totalFloors: 5, buildingType: "BRICK", buildingClass: "ECONOMY", renovation: "COSMETIC", userId: users[4].id },
    { title: "House Andijan suburbs", description: "Large house in quiet suburb. 12 sotka, pool, sauna, garage for 2 cars.", price: 145000, propertyType: "HOUSE", listingType: "SALE", address: "Bog 23", city: "Andijan", district: "Andijan", bedrooms: 5, bathrooms: 3, area: 220, rooms: 8, yearBuilt: 2015, totalFloors: 2, buildingType: "BRICK", buildingClass: "BUSINESS", renovation: "EURO", userId: users[4].id, verified: true },

    // NUKUS - Properties
    { title: "Apt Nukus center", description: "Apartment in capital of Karakalpakstan. Near Savitsky Museum. Investment opportunity.", price: 25000, propertyType: "APARTMENT", listingType: "SALE", address: "Karakalpakstan 12", city: "Nukus", district: "Nukus", bedrooms: 2, bathrooms: 1, area: 48, rooms: 3, yearBuilt: 2005, floor: 2, totalFloors: 5, buildingType: "PANEL", buildingClass: "ECONOMY", renovation: "COSMETIC", userId: users[4].id },
    { title: "Guest house Nukus", description: "Small guest house near museum. 5 rooms, steady tourist traffic. Aral Sea tour base.", price: 65000, propertyType: "COMMERCIAL", listingType: "SALE", address: "Museum str 8", city: "Nukus", district: "Nukus", area: 180, rooms: 7, yearBuilt: 2015, totalFloors: 2, buildingType: "BRICK", buildingClass: "COMFORT", renovation: "EURO", userId: users[4].id },

    // KHIVA - Properties
    { title: "Historic house Khiva", description: "Authentic house inside Ichan-Kala. UNESCO heritage area. Unique opportunity.", price: 220000, propertyType: "HOUSE", listingType: "SALE", address: "Ichan-Kala 15", city: "Khiva", district: "Khiva", bedrooms: 4, bathrooms: 2, area: 200, rooms: 6, yearBuilt: 1890, totalFloors: 2, buildingType: "BRICK", buildingClass: "ELITE", renovation: "DESIGNER", userId: users[3].id, featured: true, verified: true },
    { title: "Guesthouse Khiva walls", description: "Operating guesthouse just outside old city walls. 6 rooms with traditional decor.", price: 2000, propertyType: "COMMERCIAL", listingType: "RENT", address: "Ota Darvoza 3", city: "Khiva", district: "Khiva", area: 250, rooms: 8, yearBuilt: 2018, totalFloors: 2, buildingType: "BRICK", buildingClass: "COMFORT", renovation: "EURO", userId: users[3].id },

    // URGENCH - Properties
    { title: "New apt Urgench", description: "Modern apartment in regional center. Close to airport, good rental potential.", price: 42000, propertyType: "APARTMENT", listingType: "SALE", address: "Al-Khorezmi 34", city: "Urgench", district: "Urgench", bedrooms: 2, bathrooms: 1, area: 62, rooms: 3, yearBuilt: 2021, floor: 5, totalFloors: 9, buildingType: "MONOLITHIC", buildingClass: "COMFORT", renovation: "EURO", userId: users[4].id, verified: true },

    // TASHKENT - Houses and Villas
    { title: "House with pool Yunusabad", description: "Two-story house with swimming pool in prestigious Yunusabad. 8 sotka, mature garden.", price: 520000, propertyType: "HOUSE", listingType: "SALE", address: "Yunusabad 15", city: "Tashkent", district: "Yunusabad", bedrooms: 5, bathrooms: 4, area: 380, rooms: 8, yearBuilt: 2020, totalFloors: 2, buildingType: "BRICK", buildingClass: "ELITE", renovation: "DESIGNER", userId: users[1].id, featured: true, verified: true },
    { title: "Villa Golf City", description: "Exclusive villa in Golf City gated community. Pool, gym, sauna, smart home, 3-car garage.", price: 850000, propertyType: "VILLA", listingType: "SALE", address: "Golf City 7", city: "Tashkent", district: "Sergeli", bedrooms: 6, bathrooms: 5, area: 520, rooms: 10, yearBuilt: 2022, totalFloors: 3, buildingType: "MONOLITHIC", buildingClass: "ELITE", renovation: "DESIGNER", userId: users[0].id, featured: true, verified: true },
    { title: "Villa Charvak lake", description: "Country villa with Charvak lake views. Weekend retreat or permanent residence. 15 sotka.", price: 380000, propertyType: "VILLA", listingType: "SALE", address: "Charvak", city: "Tashkent", district: "Bostanlyk", bedrooms: 4, bathrooms: 3, area: 280, rooms: 7, yearBuilt: 2018, totalFloors: 2, buildingType: "BRICK", buildingClass: "BUSINESS", renovation: "EURO", userId: users[1].id, verified: true },
    { title: "Townhouse gated community", description: "3-level townhouse in secure gated community. Private yard, 2-car garage, pool access.", price: 245000, propertyType: "TOWNHOUSE", listingType: "SALE", address: "Green Village", city: "Tashkent", district: "Chilanzar", bedrooms: 4, bathrooms: 3, area: 195, rooms: 6, yearBuilt: 2021, totalFloors: 3, buildingType: "BRICK", buildingClass: "BUSINESS", renovation: "EURO", userId: users[2].id, verified: true },
    { title: "Townhouse for rent", description: "Modern townhouse for long-term rent. Fully furnished, with utilities. Near international school.", price: 2500, propertyType: "TOWNHOUSE", listingType: "RENT", address: "Premium Residence", city: "Tashkent", district: "Mirzo-Ulugbek", bedrooms: 3, bathrooms: 2, area: 160, rooms: 5, yearBuilt: 2020, totalFloors: 2, buildingType: "BRICK", buildingClass: "BUSINESS", renovation: "EURO", userId: users[0].id, verified: true },

    // TASHKENT - Commercial
    { title: "Office Infinity Tower", description: "Class A office space in Infinity Tower. Reception, meeting rooms, parking included.", price: 320000, propertyType: "COMMERCIAL", listingType: "SALE", address: "BC Infinity", city: "Tashkent", district: "Mirabad", area: 250, rooms: 4, yearBuilt: 2023, floor: 10, totalFloors: 25, buildingType: "MONOLITHIC", buildingClass: "ELITE", renovation: "EURO", userId: users[2].id, verified: true },
    { title: "Retail space Chorsu", description: "Prime retail location near Chorsu bazaar. High foot traffic, established shopping area.", price: 4500, propertyType: "COMMERCIAL", listingType: "RENT", address: "Beruni 3", city: "Tashkent", district: "Shaykhantaur", area: 120, rooms: 2, yearBuilt: 2000, floor: 1, totalFloors: 3, buildingType: "BRICK", renovation: "COSMETIC", userId: users[2].id },
    { title: "Warehouse Sergeli", description: "Modern warehouse with loading docks. 24/7 security, fire system, office space included.", price: 180000, propertyType: "COMMERCIAL", listingType: "SALE", address: "Sergeli Industrial", city: "Tashkent", district: "Sergeli", area: 550, rooms: 3, yearBuilt: 2015, totalFloors: 1, buildingType: "BLOCK", renovation: "NONE", userId: users[2].id },
    { title: "Mini-office IT Park", description: "Ready-to-use workspace in IT Park. High-speed internet, meeting room access, parking.", price: 800, propertyType: "COMMERCIAL", listingType: "RENT", address: "IT Park Mirzo", city: "Tashkent", district: "Mirzo-Ulugbek", area: 30, rooms: 1, yearBuilt: 2021, floor: 3, totalFloors: 5, buildingType: "MONOLITHIC", buildingClass: "BUSINESS", renovation: "EURO", userId: users[2].id, verified: true },
    { title: "Restaurant space Yunusabad", description: "Turn-key restaurant space with equipment. 80 seats, terrace, parking. Great location.", price: 5500, propertyType: "COMMERCIAL", listingType: "RENT", address: "Amir Temur 156", city: "Tashkent", district: "Yunusabad", area: 320, rooms: 4, yearBuilt: 2019, floor: 1, totalFloors: 2, buildingType: "BRICK", buildingClass: "BUSINESS", renovation: "EURO", userId: users[2].id },
    { title: "Beauty salon space", description: "Perfect space for beauty salon or spa. 6 workstations, reception, storage.", price: 1800, propertyType: "COMMERCIAL", listingType: "RENT", address: "Navoi 89", city: "Tashkent", district: "Mirabad", area: 85, rooms: 3, yearBuilt: 2020, floor: 1, totalFloors: 12, buildingType: "MONOLITHIC", buildingClass: "BUSINESS", renovation: "EURO", userId: users[1].id },

    // TASHKENT - Land
    { title: "Plot Yangiyul", description: "10 sotka plot in Yangiyul district. All communications, paved road, building permit.", price: 45000, propertyType: "LAND", listingType: "SALE", address: "Yangiyul", city: "Tashkent", district: "Yangiyul", area: 1000, userId: users[4].id, verified: true },
    { title: "Land Bostanlyk mountains", description: "25 sotka in scenic Bostanlyk. Mountain views, river nearby. Build your dream retreat.", price: 85000, propertyType: "LAND", listingType: "SALE", address: "Bostanlyk", city: "Tashkent", district: "Bostanlyk", area: 2500, userId: users[4].id },
    { title: "Commercial land Sergeli", description: "Industrial land in Sergeli FEZ. 50 sotka, tax benefits, all infrastructure.", price: 350000, propertyType: "LAND", listingType: "SALE", address: "Sergeli FEZ", city: "Tashkent", district: "Sergeli", area: 5000, userId: users[2].id, verified: true },

    // KARSHI - Properties
    { title: "Apt Karshi center", description: "Central apartment in Kashkadarya region capital. Near government buildings.", price: 32000, propertyType: "APARTMENT", listingType: "SALE", address: "Mustaqillik 45", city: "Karshi", district: "Karshi", bedrooms: 2, bathrooms: 1, area: 55, rooms: 3, yearBuilt: 2015, floor: 3, totalFloors: 5, buildingType: "BRICK", buildingClass: "COMFORT", renovation: "COSMETIC", userId: users[4].id },
    { title: "House Karshi", description: "Family house with orchard. 6 sotka land, quiet neighborhood, good schools.", price: 58000, propertyType: "HOUSE", listingType: "SALE", address: "Navoi 78", city: "Karshi", district: "Karshi", bedrooms: 3, bathrooms: 2, area: 120, rooms: 5, yearBuilt: 2010, totalFloors: 1, buildingType: "BRICK", buildingClass: "COMFORT", renovation: "EURO", userId: users[4].id, verified: true },

    // TERMEZ - Properties
    { title: "Apt Termez", description: "Apartment in southernmost city of Uzbekistan. Near Afghan border, strategic location.", price: 28000, propertyType: "APARTMENT", listingType: "SALE", address: "At-Termizi 23", city: "Termez", district: "Termez", bedrooms: 2, bathrooms: 1, area: 50, rooms: 3, yearBuilt: 2012, floor: 2, totalFloors: 5, buildingType: "BRICK", buildingClass: "ECONOMY", renovation: "COSMETIC", userId: users[4].id },

    // JIZZAKH - Properties
    { title: "House Jizzakh", description: "Spacious house on main road. Commercial potential, 8 sotka land.", price: 65000, propertyType: "HOUSE", listingType: "SALE", address: "Sharof Rashidov 56", city: "Jizzakh", district: "Jizzakh", bedrooms: 4, bathrooms: 2, area: 150, rooms: 6, yearBuilt: 2008, totalFloors: 1, buildingType: "BRICK", buildingClass: "COMFORT", renovation: "COSMETIC", userId: users[4].id, verified: true },
    { title: "Apt Jizzakh new", description: "New apartment in growing regional center. Near new highway to Samarkand.", price: 35000, propertyType: "APARTMENT", listingType: "SALE", address: "Mustaqillik 12", city: "Jizzakh", district: "Jizzakh", bedrooms: 2, bathrooms: 1, area: 58, rooms: 3, yearBuilt: 2022, floor: 4, totalFloors: 9, buildingType: "MONOLITHIC", buildingClass: "COMFORT", renovation: "NONE", userId: users[4].id },

    // NAVOI - Properties
    { title: "Apt Navoi city", description: "Modern apartment in industrial city. Near Navoi FEZ, good rental to expats.", price: 45000, propertyType: "APARTMENT", listingType: "SALE", address: "Galaba 34", city: "Navoi", district: "Navoi", bedrooms: 2, bathrooms: 1, area: 62, rooms: 3, yearBuilt: 2019, floor: 5, totalFloors: 9, buildingType: "MONOLITHIC", buildingClass: "COMFORT", renovation: "EURO", userId: users[4].id, verified: true },
    { title: "Office Navoi FEZ", description: "Office space in Navoi Free Economic Zone. Tax benefits, modern infrastructure.", price: 85000, propertyType: "COMMERCIAL", listingType: "SALE", address: "FEZ Navoi", city: "Navoi", district: "Navoi", area: 120, rooms: 3, yearBuilt: 2020, floor: 2, totalFloors: 4, buildingType: "MONOLITHIC", buildingClass: "BUSINESS", renovation: "EURO", userId: users[2].id },

    // Additional Tashkent rentals
    { title: "Studio Tashkent City", description: "Compact studio in Tashkent City. Doorman, gym, pool. Perfect for executives.", price: 1200, propertyType: "STUDIO", listingType: "RENT", address: "Tashkent City 8", city: "Tashkent", district: "Shaykhantaur", bedrooms: 0, bathrooms: 1, area: 45, rooms: 1, yearBuilt: 2023, floor: 22, totalFloors: 40, buildingType: "MONOLITHIC", buildingClass: "ELITE", renovation: "DESIGNER", userId: users[0].id, verified: true },
    { title: "Family apt rent Mirabad", description: "Spacious family apartment for rent. Near parks, schools, shopping.", price: 1500, propertyType: "APARTMENT", listingType: "RENT", address: "Shota Rustaveli 45", city: "Tashkent", district: "Mirabad", bedrooms: 3, bathrooms: 2, area: 110, rooms: 4, yearBuilt: 2020, floor: 8, totalFloors: 16, buildingType: "MONOLITHIC", buildingClass: "BUSINESS", renovation: "EURO", userId: users[1].id, verified: true },
  ]

  for (const p of props) {
    // Generate 4-6 images per property for gallery display
    const seed = p.title.replace(/\s+/g, '').substring(0, 10)
    const imageCount = 4 + Math.floor(Math.random() * 3) // 4-6 images
    const images = Array.from({ length: imageCount }, (_, i) => ({
      url: `https://picsum.photos/seed/${seed}${i}/800/600`,
      order: i,
      isPrimary: i === 0
    }))

    const prop = await prisma.property.create({
      data: { ...p, images: { create: images }, amenities: { create: p.propertyType === "LAND" ? [] : [{ amenity: "internet" }] } }
    })
    await prisma.priceHistory.create({ data: { propertyId: prop.id, price: p.price, changeType: "INITIAL" } })
  }
  console.log("Created properties: " + props.length)

  console.log("=== Seeding completed! ===")
  console.log("Default password: password123")
}

main().catch(e => { console.error(e); process.exit(1) }).finally(async () => await prisma.$disconnect())
