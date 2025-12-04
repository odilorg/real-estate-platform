import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Uzbekistan Locations Data
const locations = {
  // Regions (Viloyatlar)
  regions: [
    { id: 'tashkent-region', name_ru: 'Ташкентская область', name_uz: 'Toshkent viloyati', name_en: 'Tashkent Region' },
    { id: 'samarkand-region', name_ru: 'Самаркандская область', name_uz: 'Samarqand viloyati', name_en: 'Samarkand Region' },
    { id: 'bukhara-region', name_ru: 'Бухарская область', name_uz: 'Buxoro viloyati', name_en: 'Bukhara Region' },
    { id: 'fergana-region', name_ru: 'Ферганская область', name_uz: 'Fargʻona viloyati', name_en: 'Fergana Region' },
    { id: 'andijan-region', name_ru: 'Андижанская область', name_uz: 'Andijon viloyati', name_en: 'Andijan Region' },
    { id: 'namangan-region', name_ru: 'Наманганская область', name_uz: 'Namangan viloyati', name_en: 'Namangan Region' },
    { id: 'kashkadarya-region', name_ru: 'Кашкадарьинская область', name_uz: 'Qashqadaryo viloyati', name_en: 'Kashkadarya Region' },
    { id: 'surkhandarya-region', name_ru: 'Сурхандарьинская область', name_uz: 'Surxondaryo viloyati', name_en: 'Surkhandarya Region' },
    { id: 'khorezm-region', name_ru: 'Хорезмская область', name_uz: 'Xorazm viloyati', name_en: 'Khorezm Region' },
    { id: 'navoi-region', name_ru: 'Навоийская область', name_uz: 'Navoiy viloyati', name_en: 'Navoi Region' },
    { id: 'jizzakh-region', name_ru: 'Джизакская область', name_uz: 'Jizzax viloyati', name_en: 'Jizzakh Region' },
    { id: 'syrdarya-region', name_ru: 'Сырдарьинская область', name_uz: 'Sirdaryo viloyati', name_en: 'Syrdarya Region' },
    { id: 'karakalpakstan', name_ru: 'Республика Каракалпакстан', name_uz: 'Qoraqalpogʻiston Respublikasi', name_en: 'Karakalpakstan' },
  ],

  // Major Cities
  cities: [
    // Tashkent City (Special status - not under a region)
    { id: 'tashkent', name_ru: 'Ташкент', name_uz: 'Toshkent', name_en: 'Tashkent', parentId: null, isPopular: true, population: 2500000, lat: 41.2995, lng: 69.2401 },

    // Tashkent Region Cities
    { id: 'chirchik', name_ru: 'Чирчик', name_uz: 'Chirchiq', name_en: 'Chirchik', parentId: 'tashkent-region', population: 150000, lat: 41.4689, lng: 69.5822 },
    { id: 'almalyk', name_ru: 'Алмалык', name_uz: 'Olmaliq', name_en: 'Almalyk', parentId: 'tashkent-region', population: 125000, lat: 40.8453, lng: 69.5997 },
    { id: 'angren', name_ru: 'Ангрен', name_uz: 'Angren', name_en: 'Angren', parentId: 'tashkent-region', population: 100000, lat: 41.0167, lng: 70.1439 },
    { id: 'nurafshon', name_ru: 'Нурафшон', name_uz: 'Nurafshon', name_en: 'Nurafshon', parentId: 'tashkent-region', population: 50000, lat: 41.0500, lng: 69.2333 },

    // Samarkand Region
    { id: 'samarkand', name_ru: 'Самарканд', name_uz: 'Samarqand', name_en: 'Samarkand', parentId: 'samarkand-region', isPopular: true, population: 550000, lat: 39.6542, lng: 66.9597 },
    { id: 'kattakurgan', name_ru: 'Каттакурган', name_uz: 'Kattaqoʻrgʻon', name_en: 'Kattakurgan', parentId: 'samarkand-region', population: 85000, lat: 39.8983, lng: 66.2561 },

    // Bukhara Region
    { id: 'bukhara', name_ru: 'Бухара', name_uz: 'Buxoro', name_en: 'Bukhara', parentId: 'bukhara-region', isPopular: true, population: 280000, lat: 39.7681, lng: 64.4556 },
    { id: 'kogon', name_ru: 'Каган', name_uz: 'Kogon', name_en: 'Kogon', parentId: 'bukhara-region', population: 75000, lat: 39.7250, lng: 64.5500 },

    // Fergana Region
    { id: 'fergana', name_ru: 'Фергана', name_uz: 'Fargʻona', name_en: 'Fergana', parentId: 'fergana-region', isPopular: true, population: 350000, lat: 40.3842, lng: 71.7889 },
    { id: 'margilan', name_ru: 'Маргилан', name_uz: 'Marg\'ilon', name_en: 'Margilan', parentId: 'fergana-region', population: 215000, lat: 40.4703, lng: 71.7244 },
    { id: 'kokand', name_ru: 'Коканд', name_uz: 'Qoʻqon', name_en: 'Kokand', parentId: 'fergana-region', isPopular: true, population: 230000, lat: 40.5286, lng: 70.9425 },
    { id: 'kuvasoy', name_ru: 'Кувасай', name_uz: 'Quvasoy', name_en: 'Kuvasoy', parentId: 'fergana-region', population: 70000, lat: 40.3036, lng: 71.9753 },

    // Andijan Region
    { id: 'andijan', name_ru: 'Андижан', name_uz: 'Andijon', name_en: 'Andijan', parentId: 'andijan-region', isPopular: true, population: 425000, lat: 40.7833, lng: 72.3333 },
    { id: 'asaka', name_ru: 'Асака', name_uz: 'Asaka', name_en: 'Asaka', parentId: 'andijan-region', population: 55000, lat: 40.6414, lng: 72.2392 },

    // Namangan Region
    { id: 'namangan', name_ru: 'Наманган', name_uz: 'Namangan', name_en: 'Namangan', parentId: 'namangan-region', isPopular: true, population: 500000, lat: 40.9983, lng: 71.6726 },
    { id: 'chust', name_ru: 'Чуст', name_uz: 'Chust', name_en: 'Chust', parentId: 'namangan-region', population: 60000, lat: 41.0000, lng: 71.2333 },

    // Kashkadarya Region
    { id: 'karshi', name_ru: 'Карши', name_uz: 'Qarshi', name_en: 'Karshi', parentId: 'kashkadarya-region', isPopular: true, population: 280000, lat: 38.8608, lng: 65.7981 },
    { id: 'shahrisabz', name_ru: 'Шахрисабз', name_uz: 'Shahrisabz', name_en: 'Shahrisabz', parentId: 'kashkadarya-region', population: 100000, lat: 39.0519, lng: 66.8339 },

    // Surkhandarya Region
    { id: 'termez', name_ru: 'Термез', name_uz: 'Termiz', name_en: 'Termez', parentId: 'surkhandarya-region', population: 150000, lat: 37.2242, lng: 67.2783 },
    { id: 'denov', name_ru: 'Денау', name_uz: 'Denov', name_en: 'Denov', parentId: 'surkhandarya-region', population: 55000, lat: 38.2667, lng: 67.8833 },

    // Khorezm Region
    { id: 'urgench', name_ru: 'Ургенч', name_uz: 'Urganch', name_en: 'Urgench', parentId: 'khorezm-region', isPopular: true, population: 150000, lat: 41.5500, lng: 60.6333 },
    { id: 'khiva', name_ru: 'Хива', name_uz: 'Xiva', name_en: 'Khiva', parentId: 'khorezm-region', population: 60000, lat: 41.3775, lng: 60.3639 },

    // Navoi Region
    { id: 'navoi', name_ru: 'Навои', name_uz: 'Navoiy', name_en: 'Navoi', parentId: 'navoi-region', population: 130000, lat: 40.0844, lng: 65.3792 },
    { id: 'zarafshon', name_ru: 'Зарафшан', name_uz: 'Zarafshon', name_en: 'Zarafshan', parentId: 'navoi-region', population: 70000, lat: 41.5667, lng: 64.1833 },

    // Jizzakh Region
    { id: 'jizzakh', name_ru: 'Джизак', name_uz: 'Jizzax', name_en: 'Jizzakh', parentId: 'jizzakh-region', population: 170000, lat: 40.1158, lng: 67.8422 },

    // Syrdarya Region
    { id: 'guliston', name_ru: 'Гулистан', name_uz: 'Guliston', name_en: 'Gulistan', parentId: 'syrdarya-region', population: 80000, lat: 40.4833, lng: 68.7833 },

    // Karakalpakstan
    { id: 'nukus', name_ru: 'Нукус', name_uz: 'Nukus', name_en: 'Nukus', parentId: 'karakalpakstan', isPopular: true, population: 310000, lat: 42.4628, lng: 59.6022 },
  ],

  // Tashkent Districts (Tumanlar)
  tashkentDistricts: [
    { id: 'yunusabad', name_ru: 'Юнусабадский район', name_uz: 'Yunusobod tumani', name_en: 'Yunusabad District', isPopular: true },
    { id: 'mirzo-ulugbek', name_ru: 'Мирзо-Улугбекский район', name_uz: 'Mirzo Ulugʻbek tumani', name_en: 'Mirzo Ulugbek District', isPopular: true },
    { id: 'sergeli', name_ru: 'Сергелийский район', name_uz: 'Sergeli tumani', name_en: 'Sergeli District' },
    { id: 'chilanzar', name_ru: 'Чиланзарский район', name_uz: 'Chilonzor tumani', name_en: 'Chilanzar District', isPopular: true },
    { id: 'shaykhantakhur', name_ru: 'Шайхантаурский район', name_uz: 'Shayxontohur tumani', name_en: 'Shaykhantakhur District' },
    { id: 'almazar', name_ru: 'Алмазарский район', name_uz: 'Olmazor tumani', name_en: 'Almazar District' },
    { id: 'bektemir', name_ru: 'Бектемирский район', name_uz: 'Bektemir tumani', name_en: 'Bektemir District' },
    { id: 'mirabad', name_ru: 'Мирабадский район', name_uz: 'Mirobod tumani', name_en: 'Mirabad District', isPopular: true },
    { id: 'yakkasaray', name_ru: 'Яккасарайский район', name_uz: 'Yakkasaroy tumani', name_en: 'Yakkasaray District', isPopular: true },
    { id: 'uchtepa', name_ru: 'Учтепинский район', name_uz: 'Uchtepa tumani', name_en: 'Uchtepa District' },
    { id: 'yashnabad', name_ru: 'Яшнабадский район', name_uz: 'Yashnobod tumani', name_en: 'Yashnabad District' },
  ],

  // Tashkent Metro Stations
  tashkentMetro: [
    // Chilanzar Line (Blue)
    { id: 'metro-chilanzar', name_ru: 'Чиланзар', name_uz: 'Chilonzor', name_en: 'Chilanzar' },
    { id: 'metro-mirzo-ulugbek', name_ru: 'Мирзо Улугбек', name_uz: 'Mirzo Ulugʻbek', name_en: 'Mirzo Ulugbek' },
    { id: 'metro-novza', name_ru: 'Новза', name_uz: 'Novza', name_en: 'Novza' },
    { id: 'metro-miliy-bog', name_ru: 'Миллий Бог', name_uz: 'Milliy bogʻ', name_en: 'Milliy Bog' },
    { id: 'metro-hamid-olimjon', name_ru: 'Хамид Олимжон', name_uz: 'Hamid Olimjon', name_en: 'Hamid Olimjon' },
    { id: 'metro-pushkin', name_ru: 'Пушкин', name_uz: 'Pushkin', name_en: 'Pushkin' },
    { id: 'metro-buyuk-ipak-yuli', name_ru: 'Буюк Ипак Йули', name_uz: 'Buyuk Ipak yoʻli', name_en: 'Buyuk Ipak Yoli' },
    { id: 'metro-paxtakor', name_ru: 'Пахтакор', name_uz: 'Paxtakor', name_en: 'Paxtakor' },
    { id: 'metro-amir-temur', name_ru: 'Амир Темур Хиёбони', name_uz: 'Amir Temur Xiyoboni', name_en: 'Amir Temur Khiyoboni', isPopular: true },
    { id: 'metro-mustakillik', name_ru: 'Мустакиллик Майдони', name_uz: 'Mustaqillik Maydoni', name_en: 'Mustaqillik Maydoni' },
    { id: 'metro-toshkent', name_ru: 'Тошкент', name_uz: 'Toshkent', name_en: 'Tashkent' },

    // Uzbekistan Line (Red)
    { id: 'metro-olmazar', name_ru: 'Олмазор', name_uz: 'Olmazor', name_en: 'Olmazar' },
    { id: 'metro-beruniy', name_ru: 'Беруний', name_uz: 'Beruniy', name_en: 'Beruniy' },
    { id: 'metro-tinchlik', name_ru: 'Тинчлик', name_uz: 'Tinchlik', name_en: 'Tinchlik' },
    { id: 'metro-chorsu', name_ru: 'Чорсу', name_uz: 'Chorsu', name_en: 'Chorsu' },
    { id: 'metro-gafur-gulom', name_ru: 'Гафур Гулом', name_uz: 'Gʻafur Gʻulom', name_en: 'Gafur Gulom' },
    { id: 'metro-alisher-navoiy', name_ru: 'Алишер Навоий', name_uz: 'Alisher Navoiy', name_en: 'Alisher Navoi' },
    { id: 'metro-oybek', name_ru: 'Ойбек', name_uz: 'Oybek', name_en: 'Oybek' },
    { id: 'metro-kosmonavtlar', name_ru: 'Космонавтлар', name_uz: 'Kosmonavtlar', name_en: 'Kosmonavtlar' },
    { id: 'metro-minor', name_ru: 'Минор', name_uz: 'Minor', name_en: 'Minor', isPopular: true },
    { id: 'metro-bodomzor', name_ru: 'Бодомзор', name_uz: 'Bodomzor', name_en: 'Bodomzor' },

    // Yunusobod Line (Green)
    { id: 'metro-shahriston', name_ru: 'Шахристон', name_uz: 'Shahriston', name_en: 'Shahriston' },
    { id: 'metro-turkiston', name_ru: 'Туркистон', name_uz: 'Turkiston', name_en: 'Turkiston' },
    { id: 'metro-yunusobod', name_ru: 'Юнусобод', name_uz: 'Yunusobod', name_en: 'Yunusabad', isPopular: true },
  ],

  // Popular Residential Complexes in Tashkent
  residentialComplexes: [
    { id: 'rc-tashkent-city', name_ru: 'Tashkent City', name_uz: 'Tashkent City', name_en: 'Tashkent City', isPopular: true },
    { id: 'rc-next', name_ru: 'NEXT', name_uz: 'NEXT', name_en: 'NEXT', isPopular: true },
    { id: 'rc-mirabad-plaza', name_ru: 'Mirabad Plaza', name_uz: 'Mirabad Plaza', name_en: 'Mirabad Plaza' },
    { id: 'rc-magic-city', name_ru: 'Magic City', name_uz: 'Magic City', name_en: 'Magic City' },
    { id: 'rc-grand-mir', name_ru: 'Grand Mir', name_uz: 'Grand Mir', name_en: 'Grand Mir' },
    { id: 'rc-ucell-tower', name_ru: 'Ucell Tower', name_uz: 'Ucell Tower', name_en: 'Ucell Tower' },
    { id: 'rc-premium-park', name_ru: 'Premium Park', name_uz: 'Premium Park', name_en: 'Premium Park' },
    { id: 'rc-compass', name_ru: 'Compass', name_uz: 'Compass', name_en: 'Compass' },
    { id: 'rc-novza', name_ru: 'ЖК Новза', name_uz: 'Novza TM', name_en: 'Novza RC' },
  ],
}

async function seedLocations() {
  console.log('Seeding locations...')

  // Clear existing locations
  await prisma.location.deleteMany({})
  console.log('Cleared existing locations')

  // Seed Regions
  console.log('Seeding regions...')
  for (const region of locations.regions) {
    await prisma.location.create({
      data: {
        id: region.id,
        type: 'REGION',
        name_ru: region.name_ru,
        name_uz: region.name_uz,
        name_en: region.name_en,
        parentId: null,
      },
    })
  }
  console.log(`Created ${locations.regions.length} regions`)

  // Seed Cities
  console.log('Seeding cities...')
  for (const city of locations.cities) {
    await prisma.location.create({
      data: {
        id: city.id,
        type: 'CITY',
        name_ru: city.name_ru,
        name_uz: city.name_uz,
        name_en: city.name_en,
        parentId: city.parentId,
        latitude: city.lat,
        longitude: city.lng,
        population: city.population,
        isPopular: city.isPopular || false,
      },
    })
  }
  console.log(`Created ${locations.cities.length} cities`)

  // Seed Tashkent Districts
  console.log('Seeding Tashkent districts...')
  for (const district of locations.tashkentDistricts) {
    await prisma.location.create({
      data: {
        id: district.id,
        type: 'DISTRICT',
        name_ru: district.name_ru,
        name_uz: district.name_uz,
        name_en: district.name_en,
        parentId: 'tashkent',
        isPopular: district.isPopular || false,
      },
    })
  }
  console.log(`Created ${locations.tashkentDistricts.length} Tashkent districts`)

  // Seed Tashkent Metro
  console.log('Seeding Tashkent metro stations...')
  for (const metro of locations.tashkentMetro) {
    await prisma.location.create({
      data: {
        id: metro.id,
        type: 'METRO',
        name_ru: metro.name_ru,
        name_uz: metro.name_uz,
        name_en: metro.name_en,
        parentId: 'tashkent',
        isPopular: metro.isPopular || false,
      },
    })
  }
  console.log(`Created ${locations.tashkentMetro.length} metro stations`)

  // Seed Residential Complexes
  console.log('Seeding residential complexes...')
  for (const rc of locations.residentialComplexes) {
    await prisma.location.create({
      data: {
        id: rc.id,
        type: 'RESIDENTIAL_COMPLEX',
        name_ru: rc.name_ru,
        name_uz: rc.name_uz,
        name_en: rc.name_en,
        parentId: 'tashkent',
        isPopular: rc.isPopular || false,
      },
    })
  }
  console.log(`Created ${locations.residentialComplexes.length} residential complexes`)

  const totalCount = await prisma.location.count()
  console.log(`\nTotal locations seeded: ${totalCount}`)
}

seedLocations()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

export { seedLocations }
