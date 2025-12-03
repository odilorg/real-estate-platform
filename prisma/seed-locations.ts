import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Complete Uzbekistan location data
const uzbekistanLocations = {
  regions: [
    // Tashkent City (special status)
    {
      slug: "tashkent-city",
      nameEn: "Tashkent City",
      nameRu: "Город Ташкент",
      nameUz: "Toshkent shahri",
      code: "TAS",
      sortOrder: 1,
      cities: [
        {
          slug: "tashkent",
          nameEn: "Tashkent",
          nameRu: "Ташкент",
          nameUz: "Toshkent",
          isCapital: true,
          population: 2909466,
          districts: [
            { slug: "almazar", nameEn: "Almazar", nameRu: "Алмазар", nameUz: "Olmazor" },
            { slug: "bektemir", nameEn: "Bektemir", nameRu: "Бектемир", nameUz: "Bektemir" },
            { slug: "chilanzar", nameEn: "Chilanzar", nameRu: "Чиланзар", nameUz: "Chilonzor" },
            { slug: "yashnabad", nameEn: "Yashnabad", nameRu: "Яшнабад", nameUz: "Yashnobod" },
            { slug: "mirabad", nameEn: "Mirabad", nameRu: "Мирабад", nameUz: "Mirobod" },
            { slug: "mirzo-ulugbek", nameEn: "Mirzo Ulugbek", nameRu: "Мирзо-Улугбек", nameUz: "Mirzo Ulug'bek" },
            { slug: "sergeli", nameEn: "Sergeli", nameRu: "Сергели", nameUz: "Sergeli" },
            { slug: "shaykhantaur", nameEn: "Shaykhantaur", nameRu: "Шайхантахур", nameUz: "Shayxontohur" },
            { slug: "uchtepa", nameEn: "Uchtepa", nameRu: "Учтепа", nameUz: "Uchtepa" },
            { slug: "yakkasaray", nameEn: "Yakkasaray", nameRu: "Яккасарай", nameUz: "Yakkasaroy" },
            { slug: "yunusabad", nameEn: "Yunusabad", nameRu: "Юнусабад", nameUz: "Yunusobod" },
          ]
        }
      ]
    },
    // Tashkent Region
    {
      slug: "tashkent-region",
      nameEn: "Tashkent Region",
      nameRu: "Ташкентская область",
      nameUz: "Toshkent viloyati",
      code: "TO",
      sortOrder: 2,
      cities: [
        { slug: "nurafshon", nameEn: "Nurafshon", nameRu: "Нурафшон", nameUz: "Nurafshon", population: 51000, districts: [] },
        { slug: "olmaliq", nameEn: "Olmaliq", nameRu: "Алмалык", nameUz: "Olmaliq", population: 114000, districts: [] },
        { slug: "angren", nameEn: "Angren", nameRu: "Ангрен", nameUz: "Angren", population: 128000, districts: [] },
        { slug: "chirchiq", nameEn: "Chirchiq", nameRu: "Чирчик", nameUz: "Chirchiq", population: 155000, districts: [] },
        { slug: "bekabad", nameEn: "Bekabad", nameRu: "Бекабад", nameUz: "Bekobod", population: 87000, districts: [] },
        { slug: "yangiyul", nameEn: "Yangiyul", nameRu: "Янгиюль", nameUz: "Yangiyo'l", population: 52000, districts: [] },
      ]
    },
    // Samarkand Region
    {
      slug: "samarkand-region",
      nameEn: "Samarkand Region",
      nameRu: "Самаркандская область",
      nameUz: "Samarqand viloyati",
      code: "SA",
      sortOrder: 3,
      cities: [
        {
          slug: "samarkand",
          nameEn: "Samarkand",
          nameRu: "Самарканд",
          nameUz: "Samarqand",
          population: 550000,
          districts: [
            { slug: "samarkand-center", nameEn: "Center", nameRu: "Центр", nameUz: "Markaz" },
            { slug: "samarkand-siab", nameEn: "Siab", nameRu: "Сиаб", nameUz: "Siob" },
            { slug: "samarkand-bagishamal", nameEn: "Bagishamal", nameRu: "Багишамал", nameUz: "Bog'ishamol" },
          ]
        },
        { slug: "kattakurgan", nameEn: "Kattakurgan", nameRu: "Каттакурган", nameUz: "Kattaqo'rg'on", population: 88000, districts: [] },
        { slug: "urgut", nameEn: "Urgut", nameRu: "Ургут", nameUz: "Urgut", population: 55000, districts: [] },
      ]
    },
    // Bukhara Region
    {
      slug: "bukhara-region",
      nameEn: "Bukhara Region",
      nameRu: "Бухарская область",
      nameUz: "Buxoro viloyati",
      code: "BU",
      sortOrder: 4,
      cities: [
        {
          slug: "bukhara",
          nameEn: "Bukhara",
          nameRu: "Бухара",
          nameUz: "Buxoro",
          population: 280000,
          districts: [
            { slug: "bukhara-old-city", nameEn: "Old City", nameRu: "Старый город", nameUz: "Eski shahar" },
            { slug: "bukhara-new-city", nameEn: "New City", nameRu: "Новый город", nameUz: "Yangi shahar" },
          ]
        },
        { slug: "kagan", nameEn: "Kagan", nameRu: "Каган", nameUz: "Kogon", population: 75000, districts: [] },
        { slug: "gijduvan", nameEn: "Gijduvan", nameRu: "Гиждуван", nameUz: "G'ijduvon", population: 45000, districts: [] },
      ]
    },
    // Fergana Region
    {
      slug: "fergana-region",
      nameEn: "Fergana Region",
      nameRu: "Ферганская область",
      nameUz: "Farg'ona viloyati",
      code: "FA",
      sortOrder: 5,
      cities: [
        {
          slug: "fergana",
          nameEn: "Fergana",
          nameRu: "Фергана",
          nameUz: "Farg'ona",
          population: 340000,
          districts: [
            { slug: "fergana-center", nameEn: "Center", nameRu: "Центр", nameUz: "Markaz" },
          ]
        },
        { slug: "margilan", nameEn: "Margilan", nameRu: "Маргилан", nameUz: "Marg'ilon", population: 215000, districts: [] },
        { slug: "kokand", nameEn: "Kokand", nameRu: "Коканд", nameUz: "Qo'qon", population: 233000, districts: [] },
        { slug: "kuvasoy", nameEn: "Kuvasoy", nameRu: "Кувасай", nameUz: "Quvasoy", population: 75000, districts: [] },
      ]
    },
    // Andijan Region
    {
      slug: "andijan-region",
      nameEn: "Andijan Region",
      nameRu: "Андижанская область",
      nameUz: "Andijon viloyati",
      code: "AN",
      sortOrder: 6,
      cities: [
        {
          slug: "andijan",
          nameEn: "Andijan",
          nameRu: "Андижан",
          nameUz: "Andijon",
          population: 430000,
          districts: [
            { slug: "andijan-center", nameEn: "Center", nameRu: "Центр", nameUz: "Markaz" },
          ]
        },
        { slug: "asaka", nameEn: "Asaka", nameRu: "Асака", nameUz: "Asaka", population: 65000, districts: [] },
        { slug: "khanabad", nameEn: "Khanabad", nameRu: "Ханабад", nameUz: "Xonobod", population: 35000, districts: [] },
      ]
    },
    // Namangan Region
    {
      slug: "namangan-region",
      nameEn: "Namangan Region",
      nameRu: "Наманганская область",
      nameUz: "Namangan viloyati",
      code: "NA",
      sortOrder: 7,
      cities: [
        {
          slug: "namangan",
          nameEn: "Namangan",
          nameRu: "Наманган",
          nameUz: "Namangan",
          population: 597000,
          districts: [
            { slug: "namangan-center", nameEn: "Center", nameRu: "Центр", nameUz: "Markaz" },
          ]
        },
        { slug: "chust", nameEn: "Chust", nameRu: "Чуст", nameUz: "Chust", population: 60000, districts: [] },
        { slug: "pop", nameEn: "Pop", nameRu: "Поп", nameUz: "Pop", population: 30000, districts: [] },
      ]
    },
    // Kashkadarya Region
    {
      slug: "kashkadarya-region",
      nameEn: "Kashkadarya Region",
      nameRu: "Кашкадарьинская область",
      nameUz: "Qashqadaryo viloyati",
      code: "QA",
      sortOrder: 8,
      cities: [
        { slug: "karshi", nameEn: "Karshi", nameRu: "Карши", nameUz: "Qarshi", population: 280000, districts: [] },
        { slug: "shahrisabz", nameEn: "Shahrisabz", nameRu: "Шахрисабз", nameUz: "Shahrisabz", population: 100000, districts: [] },
        { slug: "muborak", nameEn: "Muborak", nameRu: "Мубарек", nameUz: "Muborak", population: 30000, districts: [] },
      ]
    },
    // Surkhandarya Region
    {
      slug: "surkhandarya-region",
      nameEn: "Surkhandarya Region",
      nameRu: "Сурхандарьинская область",
      nameUz: "Surxondaryo viloyati",
      code: "SU",
      sortOrder: 9,
      cities: [
        { slug: "termez", nameEn: "Termez", nameRu: "Термез", nameUz: "Termiz", population: 180000, districts: [] },
        { slug: "denau", nameEn: "Denau", nameRu: "Денау", nameUz: "Denov", population: 70000, districts: [] },
      ]
    },
    // Jizzakh Region
    {
      slug: "jizzakh-region",
      nameEn: "Jizzakh Region",
      nameRu: "Джизакская область",
      nameUz: "Jizzax viloyati",
      code: "JI",
      sortOrder: 10,
      cities: [
        { slug: "jizzakh", nameEn: "Jizzakh", nameRu: "Джизак", nameUz: "Jizzax", population: 175000, districts: [] },
      ]
    },
    // Sirdarya Region
    {
      slug: "sirdarya-region",
      nameEn: "Sirdarya Region",
      nameRu: "Сырдарьинская область",
      nameUz: "Sirdaryo viloyati",
      code: "SI",
      sortOrder: 11,
      cities: [
        { slug: "gulistan", nameEn: "Gulistan", nameRu: "Гулистан", nameUz: "Guliston", population: 70000, districts: [] },
        { slug: "shirin", nameEn: "Shirin", nameRu: "Ширин", nameUz: "Shirin", population: 35000, districts: [] },
      ]
    },
    // Navoi Region
    {
      slug: "navoi-region",
      nameEn: "Navoi Region",
      nameRu: "Навоийская область",
      nameUz: "Navoiy viloyati",
      code: "NW",
      sortOrder: 12,
      cities: [
        { slug: "navoi", nameEn: "Navoi", nameRu: "Навои", nameUz: "Navoiy", population: 150000, districts: [] },
        { slug: "zarafshan", nameEn: "Zarafshan", nameRu: "Зарафшан", nameUz: "Zarafshon", population: 65000, districts: [] },
        { slug: "uchkuduk", nameEn: "Uchkuduk", nameRu: "Учкудук", nameUz: "Uchquduq", population: 30000, districts: [] },
      ]
    },
    // Khorezm Region
    {
      slug: "khorezm-region",
      nameEn: "Khorezm Region",
      nameRu: "Хорезмская область",
      nameUz: "Xorazm viloyati",
      code: "XO",
      sortOrder: 13,
      cities: [
        { slug: "urgench", nameEn: "Urgench", nameRu: "Ургенч", nameUz: "Urganch", population: 160000, districts: [] },
        { slug: "khiva", nameEn: "Khiva", nameRu: "Хива", nameUz: "Xiva", population: 60000, districts: [] },
      ]
    },
    // Republic of Karakalpakstan
    {
      slug: "karakalpakstan",
      nameEn: "Republic of Karakalpakstan",
      nameRu: "Республика Каракалпакстан",
      nameUz: "Qoraqalpog'iston Respublikasi",
      code: "QR",
      sortOrder: 14,
      cities: [
        { slug: "nukus", nameEn: "Nukus", nameRu: "Нукус", nameUz: "Nukus", population: 315000, districts: [] },
        { slug: "muynak", nameEn: "Muynak", nameRu: "Муйнак", nameUz: "Mo'ynoq", population: 14000, districts: [] },
      ]
    },
  ]
}

async function seedLocations() {
  console.log("Starting location seed...")

  // Clear existing location data
  console.log("Clearing existing location data...")
  await prisma.district.deleteMany()
  await prisma.city.deleteMany()
  await prisma.region.deleteMany()

  console.log("Seeding regions, cities, and districts...")

  let regionCount = 0
  let cityCount = 0
  let districtCount = 0

  for (const regionData of uzbekistanLocations.regions) {
    // Create region
    const region = await prisma.region.create({
      data: {
        slug: regionData.slug,
        nameEn: regionData.nameEn,
        nameRu: regionData.nameRu,
        nameUz: regionData.nameUz,
        code: regionData.code,
        sortOrder: regionData.sortOrder,
      }
    })
    regionCount++

    // Create cities for this region
    for (const cityData of regionData.cities) {
      const city = await prisma.city.create({
        data: {
          regionId: region.id,
          slug: cityData.slug,
          nameEn: cityData.nameEn,
          nameRu: cityData.nameRu,
          nameUz: cityData.nameUz,
          isCapital: cityData.isCapital || false,
          population: cityData.population,
          sortOrder: cityCount,
        }
      })
      cityCount++

      // Create districts for this city
      if (cityData.districts && cityData.districts.length > 0) {
        for (let i = 0; i < cityData.districts.length; i++) {
          const districtData = cityData.districts[i]
          await prisma.district.create({
            data: {
              cityId: city.id,
              slug: districtData.slug,
              nameEn: districtData.nameEn,
              nameRu: districtData.nameRu,
              nameUz: districtData.nameUz,
              sortOrder: i,
            }
          })
          districtCount++
        }
      }
    }
  }

  console.log(`\n=== Location Seeding Complete ===`)
  console.log(`Regions: ${regionCount}`)
  console.log(`Cities: ${cityCount}`)
  console.log(`Districts: ${districtCount}`)
}

// Export for use in main seed
export { seedLocations, uzbekistanLocations }

// Run if called directly
if (require.main === module) {
  seedLocations()
    .catch(e => { console.error(e); process.exit(1) })
    .finally(async () => await prisma.$disconnect())
}
