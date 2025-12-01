import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Use the existing user ID
const USER_ID = "cmin4urgw0000v2x82uawj0yl"

// 20 properties across Samarkand, Tashkent, and Bukhara
// Bilingual: Russian titles/descriptions with Uzbek content
const properties = [
  // ========== SAMARKAND (7 properties) ==========
  {
    userId: USER_ID,
    title: "3-хонали квартира Регистон яқинида / 3-комнатная квартира у Регистана",
    description: `🇺🇿 O'zbek tilida:
Samarqandning tarixiy markazida joylashgan zamonaviy 3-xonali kvartira. Registon maydonigacha piyoda 10 daqiqa. Kvartira yevro ta'mirdan so'ng, yangi mebel va texnika bilan jihozlangan.

Xonalar: mehmonxona 25 m², yotoqxona 16 m², bolalar xonasi 12 m². Oshxona 10 m² - o'rnatilgan texnika bilan. Balkon Registon tomonga qaragan.

Yaqin-atrofda: maktab, bog'cha, supermarket, dorixona. Metro yo'q, lekin avtobus bekati 2 daqiqalik masofada.

🇷🇺 На русском:
Современная 3-комнатная квартира в историческом центре Самарканда. До площади Регистан — 10 минут пешком. Квартира после евроремонта, с новой мебелью и техникой.

Комнаты: гостиная 25 м², спальня 16 м², детская 12 м². Кухня 10 м² с встроенной техникой. Балкон с видом на Регистан.

Рядом: школа, детский сад, супермаркет, аптека. Метро нет, автобусная остановка в 2 минутах.`,
    price: 85000,
    propertyType: "APARTMENT",
    listingType: "SALE",
    status: "ACTIVE",
    address: "Регистон кўчаси 45, 12-хонадон",
    city: "Самарканд",
    state: "Самаркандская область",
    country: "Узбекистан",
    zipCode: "140100",
    district: "Регистон",
    latitude: 39.6547,
    longitude: 66.9758,
    bedrooms: 2,
    bathrooms: 1,
    area: 78,
    livingArea: 53,
    kitchenArea: 10,
    rooms: 3,
    yearBuilt: 2018,
    floor: 4,
    totalFloors: 9,
    ceilingHeight: 2.8,
    parking: 0,
    parkingType: "STREET",
    balcony: 1,
    buildingType: "BRICK",
    buildingClass: "COMFORT",
    renovation: "EURO",
    windowView: "PANORAMIC",
    bathroomType: "SEPARATE",
    furnished: "FULL",
    featured: true,
    verified: true,
    views: 456,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
    ],
    amenities: ["BALCONY", "AIR_CONDITIONING", "INTERNET", "FURNISHED"],
  },
  {
    userId: USER_ID,
    title: "Шоҳимардон маҳалласида ҳовли / Частный дом в махалле Шахимардан",
    description: `🇺🇿 O'zbek tilida:
An'anaviy o'zbek hovlisi zamonaviy qulayliklar bilan. Umumiy maydoni 350 m², er maydoni 6 sotix. Hovlida mevali daraxtlar, uzum tokzori va tamdirxona mavjud.

Uy 2 qavatli: birinchi qavatda katta mehmonxona, oshxona, hammom. Ikkinchi qavatda 4 ta yotoqxona, 2 ta hammom.

Suv, gaz, elektr - markaziy. Ichimlik suvi uchun quduq. Hovli devor bilan o'ralgan, eshik avtomatik.

🇷🇺 На русском:
Традиционный узбекский дом с современными удобствами. Общая площадь 350 м², участок 6 соток. Во дворе фруктовые деревья, виноградник и тандыр.

Дом 2-этажный: на первом этаже большая гостиная, кухня, санузел. На втором — 4 спальни, 2 санузла.

Вода, газ, электричество — центральные. Скважина для питьевой воды. Двор огорожен, ворота автоматические.`,
    price: 145000,
    propertyType: "HOUSE",
    listingType: "SALE",
    status: "ACTIVE",
    address: "Шоҳимардон маҳалласи 23",
    city: "Самарканд",
    state: "Самаркандская область",
    country: "Узбекистан",
    zipCode: "140100",
    district: "Шоҳимардон",
    latitude: 39.6612,
    longitude: 66.9623,
    bedrooms: 4,
    bathrooms: 3,
    area: 350,
    livingArea: 240,
    kitchenArea: 35,
    rooms: 7,
    yearBuilt: 2015,
    floor: 1,
    totalFloors: 2,
    ceilingHeight: 3.0,
    parking: 2,
    parkingType: "GARAGE",
    balcony: 2,
    buildingType: "BRICK",
    buildingClass: "COMFORT",
    hasGatedArea: true,
    renovation: "EURO",
    windowView: "COURTYARD",
    bathroomType: "MULTIPLE",
    furnished: "PARTIAL",
    featured: true,
    verified: true,
    views: 723,
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800",
    ],
    amenities: ["GARAGE", "GARDEN", "HEATING", "AIR_CONDITIONING", "INTERNET"],
  },
  {
    userId: USER_ID,
    title: "2-хонали квартира ижарага / 2-комнатная квартира в аренду",
    description: `🇺🇿 O'zbek tilida:
Samarqand markazida qulay kvartira oylik ijaraga. Universitet talabalari yoki yosh oilalar uchun ideal.

Kvartira ta'mirlangan, mebel va maishiy texnika bilan jihozlangan. Konditsioner, kir yuvish mashinasi, muzlatkich bor.

Kommunal to'lovlar narxga kiritilmagan (oyiga taxminan 200,000 so'm).

🇷🇺 На русском:
Удобная квартира в центре Самарканда в месячную аренду. Идеально для студентов университета или молодых семей.

Квартира отремонтирована, с мебелью и бытовой техникой. Есть кондиционер, стиральная машина, холодильник.

Коммунальные не включены (примерно 200,000 сум/мес).`,
    price: 350,
    propertyType: "APARTMENT",
    listingType: "RENT",
    status: "ACTIVE",
    address: "Гагарин кўчаси 78, 34-хонадон",
    city: "Самарканд",
    state: "Самаркандская область",
    country: "Узбекистан",
    zipCode: "140100",
    district: "Марказ",
    latitude: 39.6489,
    longitude: 66.9612,
    bedrooms: 1,
    bathrooms: 1,
    area: 52,
    livingArea: 38,
    kitchenArea: 8,
    rooms: 2,
    yearBuilt: 2010,
    floor: 3,
    totalFloors: 5,
    ceilingHeight: 2.7,
    balcony: 1,
    buildingType: "PANEL",
    buildingClass: "ECONOMY",
    renovation: "COSMETIC",
    windowView: "COURTYARD",
    bathroomType: "COMBINED",
    furnished: "FULL",
    verified: true,
    views: 312,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
    ],
    amenities: ["BALCONY", "AIR_CONDITIONING", "WASHING_MACHINE", "FURNISHED"],
  },
  {
    userId: USER_ID,
    title: "Янги 4-хонали квартира / Новая 4-комнатная квартира",
    description: `🇺🇿 O'zbek tilida:
2024-yilda qurilgan yangi uyda zamonaviy kvartira. Afrosiyob mahallasida, yashil hudud va bolalar maydonchalari bilan.

Kvartira "oq" holatda - devorlar tekislangan, pol stiryajka qilingan. O'zingiz xohlagancha ta'mir qilishingiz mumkin.

Lift, konsyerj xizmati, yopiq hovli. Avtomobil uchun er osti parkovi (1 joy narxga kiritilgan).

🇷🇺 На русском:
Современная квартира в новом доме 2024 года постройки. В районе Афросиаб с зелёными зонами и детскими площадками.

Квартира в состоянии «белый ключ» — стены выровнены, пол со стяжкой. Можете сделать ремонт по своему вкусу.

Лифт, консьерж, закрытый двор. Подземный паркинг (1 место включено в цену).`,
    price: 125000,
    propertyType: "APARTMENT",
    listingType: "SALE",
    status: "ACTIVE",
    address: "Афросиёб кўчаси 12, 67-хонадон",
    city: "Самарканд",
    state: "Самаркандская область",
    country: "Узбекистан",
    zipCode: "140100",
    district: "Афросиёб",
    latitude: 39.6723,
    longitude: 66.9534,
    bedrooms: 3,
    bathrooms: 2,
    area: 115,
    livingArea: 82,
    kitchenArea: 14,
    rooms: 4,
    yearBuilt: 2024,
    floor: 8,
    totalFloors: 12,
    ceilingHeight: 2.9,
    parking: 1,
    parkingType: "UNDERGROUND",
    balcony: 2,
    buildingType: "MONOLITHIC",
    buildingClass: "COMFORT",
    elevatorPassenger: 2,
    hasConcierge: true,
    hasGatedArea: true,
    renovation: "NONE",
    windowView: "PANORAMIC",
    bathroomType: "SEPARATE",
    furnished: "NONE",
    featured: true,
    verified: true,
    views: 567,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800",
    ],
    amenities: ["PARKING", "ELEVATOR", "SECURITY", "AIR_CONDITIONING"],
  },
  {
    userId: USER_ID,
    title: "Дўкон бинoси / Торговое помещение",
    description: `🇺🇿 O'zbek tilida:
Samarqand markazida savdo binosi. Siyob bozori yaqinida, odamlar oqimi yuqori joy.

Bino 2 qavatli: 1-qavat savdo zali 80 m², 2-qavat ombor va ofis 60 m². Alohida kirish, vitrinali derazalar.

Elektr quvvati 15 kVt, suv va kanalizatsiya bor. Xavfsizlik signalizatsiyasi o'rnatilgan.

🇷🇺 На русском:
Торговое помещение в центре Самарканда. Рядом с базаром Сиаб, высокая проходимость.

Здание 2-этажное: 1 этаж — торговый зал 80 м², 2 этаж — склад и офис 60 м². Отдельный вход, витринные окна.

Электричество 15 кВт, вода и канализация. Установлена охранная сигнализация.`,
    price: 180000,
    propertyType: "COMMERCIAL",
    listingType: "SALE",
    status: "ACTIVE",
    address: "Сиёб кўчаси 15",
    city: "Самарканд",
    state: "Самаркандская область",
    country: "Узбекистан",
    zipCode: "140100",
    district: "Сиёб",
    latitude: 39.6589,
    longitude: 66.9687,
    bathrooms: 1,
    area: 140,
    rooms: 4,
    yearBuilt: 2008,
    floor: 1,
    totalFloors: 2,
    ceilingHeight: 3.5,
    buildingType: "BRICK",
    buildingClass: "ECONOMY",
    renovation: "COSMETIC",
    windowView: "STREET",
    verified: true,
    views: 234,
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800",
    ],
    amenities: ["SECURITY", "INTERNET"],
  },
  {
    userId: USER_ID,
    title: "Студия квартира талабалар учун / Студия для студентов",
    description: `🇺🇿 O'zbek tilida:
Samarqand Davlat Universiteti yaqinida kichik, lekin qulay studio kvartira. Talabalar uchun ideal variant.

Umumiy maydoni 28 m²: yashash xonasi, oshxona zonasi va hammom. Mebel va texnika bilan to'liq jihozlangan.

Internet, konditsioner, kir yuvish mashinasi. Kommunal to'lovlar narxga kiritilgan.

🇷🇺 На русском:
Небольшая, но уютная студия рядом с Самаркандским государственным университетом. Идеальный вариант для студентов.

Общая площадь 28 м²: жилая зона, кухонный уголок и санузел. Полностью меблирована и оборудована техникой.

Интернет, кондиционер, стиральная машина. Коммунальные включены в стоимость.`,
    price: 200,
    propertyType: "APARTMENT",
    listingType: "RENT",
    status: "ACTIVE",
    address: "Университет кўчаси 34, 8-хонадон",
    city: "Самарканд",
    state: "Самаркандская область",
    country: "Узбекистан",
    zipCode: "140100",
    district: "Университет",
    latitude: 39.6534,
    longitude: 66.9456,
    bathrooms: 1,
    area: 28,
    livingArea: 22,
    kitchenArea: 4,
    rooms: 1,
    yearBuilt: 2019,
    floor: 2,
    totalFloors: 5,
    ceilingHeight: 2.7,
    buildingType: "BRICK",
    buildingClass: "ECONOMY",
    renovation: "EURO",
    windowView: "COURTYARD",
    bathroomType: "COMBINED",
    furnished: "FULL",
    verified: true,
    views: 445,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800",
    ],
    amenities: ["AIR_CONDITIONING", "INTERNET", "WASHING_MACHINE", "FURNISHED"],
  },
  {
    userId: USER_ID,
    title: "Элитная квартира Самарқандда / Элитная квартира в Самарканде",
    description: `🇺🇿 O'zbek tilida:
Samarqanddagi eng zamonaviy turar-joy majmuasida hashamatli kvartira. "Samarkand City" loyihasida, shahar markaziga yaqin.

Kvartira dizayner ta'miri bilan: import qilingan materiallar, mebel buyurtma asosida tayyorlangan. Aqlli uy tizimi - yorug'lik, konditsioner, pardalarni telefondan boshqarish.

5-yulduzli mehmonxona xizmatlari: basseyn, sport zali, spa, konsyerj 24/7.

🇷🇺 На русском:
Роскошная квартира в самом современном жилом комплексе Самарканда. Проект «Samarkand City», близко к центру города.

Квартира с дизайнерским ремонтом: импортные материалы, мебель на заказ. Система умный дом — управление светом, кондиционером, шторами с телефона.

Услуги 5-звёздочного отеля: бассейн, фитнес, спа, консьерж 24/7.`,
    price: 320000,
    propertyType: "APARTMENT",
    listingType: "SALE",
    status: "ACTIVE",
    address: "Samarkand City, 3-блок, 89-хонадон",
    city: "Самарканд",
    state: "Самаркандская область",
    country: "Узбекистан",
    zipCode: "140100",
    district: "Samarkand City",
    latitude: 39.6678,
    longitude: 66.9823,
    bedrooms: 3,
    bathrooms: 2,
    area: 145,
    livingArea: 105,
    kitchenArea: 20,
    rooms: 4,
    yearBuilt: 2023,
    floor: 15,
    totalFloors: 20,
    ceilingHeight: 3.2,
    parking: 2,
    parkingType: "UNDERGROUND",
    balcony: 2,
    buildingType: "MONOLITHIC",
    buildingClass: "ELITE",
    elevatorPassenger: 3,
    elevatorCargo: 1,
    hasConcierge: true,
    hasGatedArea: true,
    renovation: "DESIGNER",
    windowView: "PANORAMIC",
    bathroomType: "MULTIPLE",
    furnished: "FULL",
    featured: true,
    verified: true,
    views: 892,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    ],
    amenities: ["PARKING", "ELEVATOR", "SECURITY", "GYM", "POOL", "AIR_CONDITIONING", "INTERNET", "FURNISHED"],
  },

  // ========== TASHKENT (7 properties) ==========
  {
    userId: USER_ID,
    title: "Чилонзорда 3-хонали квартира / 3-комнатная в Чиланзаре",
    description: `🇺🇿 O'zbek tilida:
Toshkentning mashhur Chilonzor tumanida qulay kvartira. Metro bekati "Chilonzor" 5 daqiqalik piyoda masofada.

Kvartira yangi ta'mirlangan: laminat pol, stretch shiplar, zamonaviy santexnika. Barcha xonalarda konditsioner.

Yaqin-atrofda: maktab, bog'cha, Korzinka supermarketi, dorixona, bank.

🇷🇺 На русском:
Удобная квартира в популярном районе Чиланзар в Ташкенте. Станция метро «Чиланзар» в 5 минутах пешком.

Квартира с новым ремонтом: ламинат, натяжные потолки, современная сантехника. Кондиционеры во всех комнатах.

Рядом: школа, детский сад, супермаркет Korzinka, аптека, банк.`,
    price: 95000,
    propertyType: "APARTMENT",
    listingType: "SALE",
    status: "ACTIVE",
    address: "Чилонзор 7-мавзе, 15-уй, 45-хонадон",
    city: "Ташкент",
    state: "Ташкент",
    country: "Узбекистан",
    zipCode: "100115",
    district: "Чилонзор",
    nearestMetro: "Чилонзор",
    metroDistance: 5,
    latitude: 41.2867,
    longitude: 69.2045,
    bedrooms: 2,
    bathrooms: 1,
    area: 72,
    livingArea: 48,
    kitchenArea: 9,
    rooms: 3,
    yearBuilt: 2005,
    floor: 6,
    totalFloors: 9,
    ceilingHeight: 2.7,
    balcony: 1,
    loggia: 1,
    buildingType: "PANEL",
    buildingClass: "ECONOMY",
    elevatorPassenger: 1,
    hasGarbageChute: true,
    renovation: "EURO",
    windowView: "COURTYARD",
    bathroomType: "SEPARATE",
    furnished: "PARTIAL",
    verified: true,
    views: 634,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
    ],
    amenities: ["ELEVATOR", "BALCONY", "AIR_CONDITIONING", "INTERNET"],
  },
  {
    userId: USER_ID,
    title: "Юнусобод марказида пентхаус / Пентхаус в центре Юнусабада",
    description: `🇺🇿 O'zbek tilida:
Toshkentning eng nufuzli tumanlaridan biri - Yunusobodda hashamatli pentxaus. Shahar va tog'larga panoramik manzara.

2 qavatli kvartira: pastki qavatda katta mehmonxona, oshxona, mehmon xonasi. Yuqorida 3 yotoqxona, kabinet, terassa.

Shaxsiy lift, 2 ta avtomobil uchun garaj. Uy "aqlli uy" tizimi bilan jihozlangan.

🇷🇺 На русском:
Роскошный пентхаус в одном из самых престижных районов Ташкента — Юнусабаде. Панорамный вид на город и горы.

2-уровневая квартира: на нижнем этаже большая гостиная, кухня, гостевая комната. Наверху — 3 спальни, кабинет, терраса.

Персональный лифт, гараж на 2 авто. Дом оборудован системой «умный дом».`,
    price: 650000,
    propertyType: "APARTMENT",
    listingType: "SALE",
    status: "ACTIVE",
    address: "Юнусобод 11-мавзе, ЖК «Тошкент Сити»",
    city: "Ташкент",
    state: "Ташкент",
    country: "Узбекистан",
    zipCode: "100128",
    district: "Юнусобод",
    nearestMetro: "Юнусобод",
    metroDistance: 10,
    latitude: 41.3567,
    longitude: 69.2912,
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    livingArea: 200,
    kitchenArea: 35,
    rooms: 6,
    yearBuilt: 2022,
    floor: 24,
    totalFloors: 25,
    ceilingHeight: 3.5,
    parking: 2,
    parkingType: "UNDERGROUND",
    balcony: 2,
    buildingType: "MONOLITHIC",
    buildingClass: "ELITE",
    buildingName: "Тошкент Сити",
    elevatorPassenger: 4,
    elevatorCargo: 1,
    hasConcierge: true,
    hasGatedArea: true,
    renovation: "DESIGNER",
    windowView: "PANORAMIC",
    bathroomType: "MULTIPLE",
    furnished: "FULL",
    featured: true,
    verified: true,
    views: 1234,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    ],
    amenities: ["PARKING", "ELEVATOR", "SECURITY", "GYM", "POOL", "AIR_CONDITIONING", "HEATING", "INTERNET", "FURNISHED"],
  },
  {
    userId: USER_ID,
    title: "Мирзо Улуғбек туманида ижарага / Аренда в Мирзо-Улугбекском районе",
    description: `🇺🇿 O'zbek tilida:
Universitet va IT Park yaqinida zamonaviy kvartira ijaraga. IT mutaxassislari va talabalar uchun ideal.

Kvartira yangi, to'liq jihozlangan: smart TV, tezkor internet 100 Mbit/s, ish stoli. Oshxonada barcha texnika mavjud.

Yaqin-atrofda: IT Park, TATU, Metro "Buyuk Ipak Yo'li", Makro supermarketi.

🇷🇺 На русском:
Современная квартира в аренду рядом с университетом и IT Park. Идеально для IT-специалистов и студентов.

Квартира новая, полностью оборудована: смарт ТВ, быстрый интернет 100 Мбит/с, рабочий стол. На кухне вся техника.

Рядом: IT Park, ТАТУ, метро «Буюк Ипак Йули», супермаркет Makro.`,
    price: 600,
    propertyType: "APARTMENT",
    listingType: "RENT",
    status: "ACTIVE",
    address: "Мирзо Улуғбек тумани, Темир йўл кўчаси 56, 23-хонадон",
    city: "Ташкент",
    state: "Ташкент",
    country: "Узбекистан",
    zipCode: "100170",
    district: "Мирзо Улуғбек",
    nearestMetro: "Буюк Ипак Йўли",
    metroDistance: 8,
    latitude: 41.3234,
    longitude: 69.2945,
    bedrooms: 1,
    bathrooms: 1,
    area: 48,
    livingArea: 32,
    kitchenArea: 10,
    rooms: 2,
    yearBuilt: 2021,
    floor: 5,
    totalFloors: 9,
    ceilingHeight: 2.8,
    balcony: 1,
    buildingType: "MONOLITHIC",
    buildingClass: "COMFORT",
    elevatorPassenger: 1,
    renovation: "EURO",
    windowView: "STREET",
    bathroomType: "COMBINED",
    furnished: "FULL",
    featured: true,
    verified: true,
    views: 876,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800",
    ],
    amenities: ["ELEVATOR", "BALCONY", "AIR_CONDITIONING", "INTERNET", "FURNISHED", "CABLE_TV"],
  },
  {
    userId: USER_ID,
    title: "Сергели туманида янги уй / Новый дом в Сергели",
    description: `🇺🇿 O'zbek tilida:
Toshkent chekkasida, Sergeli tumanida yangi qurilgan uy. Tinch hudud, sof havo, tabiat qo'ynida.

Uy 220 m², er maydoni 4 sotix. 2 qavat: 4 yotoqxona, 2 hammom, katta mehmonxona, oshxona. Garaj 2 mashina uchun.

Markaziy gaz va suv. Hovlida mevali daraxtlar va gul bog'i.

🇷🇺 На русском:
Новый дом на окраине Ташкента, в районе Сергели. Тихий район, чистый воздух, на природе.

Дом 220 м², участок 4 сотки. 2 этажа: 4 спальни, 2 санузла, большая гостиная, кухня. Гараж на 2 машины.

Центральный газ и вода. Во дворе фруктовые деревья и цветник.`,
    price: 175000,
    propertyType: "HOUSE",
    listingType: "SALE",
    status: "ACTIVE",
    address: "Сергели тумани, Обод қишлоғи 45",
    city: "Ташкент",
    state: "Ташкент",
    country: "Узбекистан",
    zipCode: "100204",
    district: "Сергели",
    latitude: 41.2156,
    longitude: 69.2234,
    bedrooms: 4,
    bathrooms: 2,
    area: 220,
    livingArea: 165,
    kitchenArea: 20,
    rooms: 6,
    yearBuilt: 2023,
    floor: 1,
    totalFloors: 2,
    ceilingHeight: 2.9,
    parking: 2,
    parkingType: "GARAGE",
    balcony: 1,
    buildingType: "BRICK",
    buildingClass: "COMFORT",
    hasGatedArea: true,
    renovation: "EURO",
    windowView: "COURTYARD",
    bathroomType: "SEPARATE",
    furnished: "NONE",
    verified: true,
    views: 534,
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800",
    ],
    amenities: ["GARAGE", "GARDEN", "HEATING", "AIR_CONDITIONING"],
  },
  {
    userId: USER_ID,
    title: "Офис ижарага - Амир Темур / Офис в аренду - Амира Темура",
    description: `🇺🇿 O'zbek tilida:
Toshkent markazida, Amir Temur xiyobonida nufuzli ofis binosi. Kompaniyalar uchun ideal manzil.

Ofis 150 m²: ochiq makon + 3 ta alohida xona + yig'ilish xonasi. Zamonaviy ta'mir, konditsioner, tezkor internet.

Binoda: qabul xonasi, xavfsizlik 24/7, yerto'la parkovka. Metro "Amir Temur Xiyoboni" 3 daqiqa.

🇷🇺 На русском:
Престижный офис в центре Ташкента на проспекте Амира Темура. Идеальный адрес для компаний.

Офис 150 м²: open-space + 3 отдельных кабинета + переговорная. Современный ремонт, кондиционер, быстрый интернет.

В здании: ресепшн, охрана 24/7, подземный паркинг. Метро «Амир Темур Хиёбони» — 3 минуты.`,
    price: 2500,
    propertyType: "COMMERCIAL",
    listingType: "RENT",
    status: "ACTIVE",
    address: "Амир Темур шоҳ кўчаси 45, 5-қават",
    city: "Ташкент",
    state: "Ташкент",
    country: "Узбекистан",
    zipCode: "100000",
    district: "Мирабад",
    nearestMetro: "Амир Темур Хиёбони",
    metroDistance: 3,
    latitude: 41.3112,
    longitude: 69.2789,
    bathrooms: 2,
    area: 150,
    kitchenArea: 8,
    rooms: 5,
    yearBuilt: 2019,
    floor: 5,
    totalFloors: 12,
    ceilingHeight: 3.0,
    parking: 2,
    parkingType: "UNDERGROUND",
    buildingType: "MONOLITHIC",
    buildingClass: "BUSINESS",
    elevatorPassenger: 3,
    hasConcierge: true,
    hasGatedArea: true,
    renovation: "EURO",
    windowView: "STREET",
    bathroomType: "SEPARATE",
    furnished: "PARTIAL",
    featured: true,
    verified: true,
    views: 456,
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800",
    ],
    amenities: ["PARKING", "ELEVATOR", "SECURITY", "AIR_CONDITIONING", "INTERNET"],
  },
  {
    userId: USER_ID,
    title: "1-хонали студия Олмазорда / Студия в Алмазаре",
    description: `🇺🇿 O'zbek tilida:
Olmazor tumanida iqtisodiy narxdagi studiya kvartira. Yosh mutaxassislar yoki talabalar uchun qulay.

Kvartira 32 m²: yashash xonasi, oshxona zonasi, hammom. Ta'mirlangan, mebel va texnika bilan jihozlangan.

Metro "Olmazor" 7 daqiqa piyoda. Yaqinda bozor, supermarket, avtobus bekati.

🇷🇺 На русском:
Экономичная студия в районе Алмазар. Удобно для молодых специалистов или студентов.

Квартира 32 м²: жилая комната, кухонная зона, санузел. Отремонтирована, с мебелью и техникой.

Метро «Алмазар» — 7 минут пешком. Рядом базар, супермаркет, автобусная остановка.`,
    price: 45000,
    propertyType: "APARTMENT",
    listingType: "SALE",
    status: "ACTIVE",
    address: "Олмазор тумани, Чўпон Ота кўчаси 12, 5-хонадон",
    city: "Ташкент",
    state: "Ташкент",
    country: "Узбекистан",
    zipCode: "100054",
    district: "Олмазор",
    nearestMetro: "Олмазор",
    metroDistance: 7,
    latitude: 41.3345,
    longitude: 69.2123,
    bathrooms: 1,
    area: 32,
    livingArea: 24,
    kitchenArea: 5,
    rooms: 1,
    yearBuilt: 2015,
    floor: 3,
    totalFloors: 5,
    ceilingHeight: 2.7,
    buildingType: "BRICK",
    buildingClass: "ECONOMY",
    renovation: "COSMETIC",
    windowView: "COURTYARD",
    bathroomType: "COMBINED",
    furnished: "FULL",
    verified: true,
    views: 312,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800",
    ],
    amenities: ["AIR_CONDITIONING", "INTERNET", "FURNISHED"],
  },
  {
    userId: USER_ID,
    title: "Шайхантахурда 2-хонали квартира / 2-комнатная в Шайхантахуре",
    description: `🇺🇿 O'zbek tilida:
Toshkentning tarixiy markazida - Eski Shahar yaqinida joylashgan kvartira. Chorsu bozori va Xast Imom majmuasiga yaqin.

Kvartira kosmetik ta'mirlangan: plastik derazalar, yangi radiatorlar. Xonalar yorug' va keng.

Atrofda: tarixiy joylar, restoranlar, mehmonxonalar. Metro "Chorsu" 5 daqiqa.

🇷🇺 На русском:
Квартира в историческом центре Ташкента — рядом со Старым городом. Близко к базару Чорсу и комплексу Хаст Имам.

Квартира с косметическим ремонтом: пластиковые окна, новые радиаторы. Комнаты светлые и просторные.

Вокруг: исторические места, рестораны, гостиницы. Метро «Чорсу» — 5 минут.`,
    price: 65000,
    propertyType: "APARTMENT",
    listingType: "SALE",
    status: "ACTIVE",
    address: "Шайхантаҳур тумани, Зарқайнар кўчаси 78, 12-хонадон",
    city: "Ташкент",
    state: "Ташкент",
    country: "Узбекистан",
    zipCode: "100000",
    district: "Шайхантаҳур",
    nearestMetro: "Чорсу",
    metroDistance: 5,
    latitude: 41.3278,
    longitude: 69.2345,
    bedrooms: 1,
    bathrooms: 1,
    area: 55,
    livingArea: 38,
    kitchenArea: 8,
    rooms: 2,
    yearBuilt: 1985,
    floor: 4,
    totalFloors: 5,
    ceilingHeight: 2.6,
    balcony: 1,
    buildingType: "BRICK",
    buildingClass: "ECONOMY",
    renovation: "COSMETIC",
    windowView: "STREET",
    bathroomType: "COMBINED",
    furnished: "NONE",
    verified: true,
    views: 234,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    ],
    amenities: ["BALCONY", "HEATING"],
  },

  // ========== BUKHARA (6 properties) ==========
  {
    userId: USER_ID,
    title: "Ески шаҳар яқинида ҳовли / Дом у Старого города Бухары",
    description: `🇺🇿 O'zbek tilida:
Buxoroning tarixiy qismida an'anaviy o'zbek hovlisi. Labi Hovuz va Ark qal'asiga yaqin - turistik joy.

Hovli 400 m², er 5 sotix. Ichki hovli - o'zbek uslubida bezatilgan: ayvonlar, hovuz, bog'cha.

Uy 3 qavatli, 6 xona. Mehmonxona uchun yoki yashash uchun ideal. Barcha kommunikatsiyalar mavjud.

🇷🇺 На русском:
Традиционный узбекский дом в исторической части Бухары. Рядом с Ляби-Хауз и крепостью Арк — туристическое место.

Дом 400 м², участок 5 соток. Внутренний двор в узбекском стиле: айваны, бассейн, сад.

Дом 3-этажный, 6 комнат. Идеально для гостиницы или проживания. Все коммуникации есть.`,
    price: 250000,
    propertyType: "HOUSE",
    listingType: "SALE",
    status: "ACTIVE",
    address: "Лаби Ҳовуз кўчаси 23",
    city: "Бухоро",
    state: "Бухарская область",
    country: "Узбекистан",
    zipCode: "200100",
    district: "Ески шаҳар",
    latitude: 39.7745,
    longitude: 64.4156,
    bedrooms: 5,
    bathrooms: 3,
    area: 400,
    livingArea: 280,
    kitchenArea: 40,
    rooms: 8,
    yearBuilt: 2000,
    floor: 1,
    totalFloors: 3,
    ceilingHeight: 3.2,
    parking: 2,
    parkingType: "GARAGE",
    balcony: 3,
    buildingType: "BRICK",
    buildingClass: "COMFORT",
    hasGatedArea: true,
    renovation: "EURO",
    windowView: "COURTYARD",
    bathroomType: "MULTIPLE",
    furnished: "PARTIAL",
    featured: true,
    verified: true,
    views: 678,
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
    ],
    amenities: ["GARAGE", "GARDEN", "POOL", "HEATING", "AIR_CONDITIONING", "INTERNET"],
  },
  {
    userId: USER_ID,
    title: "2-хонали квартира Ғиждувон / 2-комнатная в Гиждуване",
    description: `🇺🇿 O'zbek tilida:
Buxoro viloyatining Gijduvon tumanida qulay kvartira. Mahalliy bozor va maktab yaqinida.

Kvartira ta'mirlangan, mebel bilan. Hovli bor - o'z taomingizni pishirishingiz mumkin.

Tinch tuman, yaxshi qo'shnilar. Buxoro shahriga avtobus 30 daqiqa.

🇷🇺 На русском:
Удобная квартира в Гиждуванском районе Бухарской области. Рядом местный базар и школа.

Квартира отремонтирована, с мебелью. Есть двор — можно готовить свою еду.

Тихий район, хорошие соседи. Автобус до Бухары — 30 минут.`,
    price: 35000,
    propertyType: "APARTMENT",
    listingType: "SALE",
    status: "ACTIVE",
    address: "Ғиждувон, Мустақиллик кўчаси 45, 8-хонадон",
    city: "Бухоро",
    state: "Бухарская область",
    country: "Узбекистан",
    zipCode: "200200",
    district: "Ғиждувон",
    latitude: 39.9456,
    longitude: 64.6823,
    bedrooms: 1,
    bathrooms: 1,
    area: 48,
    livingArea: 32,
    kitchenArea: 8,
    rooms: 2,
    yearBuilt: 1995,
    floor: 2,
    totalFloors: 4,
    ceilingHeight: 2.6,
    balcony: 1,
    buildingType: "BRICK",
    buildingClass: "ECONOMY",
    renovation: "COSMETIC",
    windowView: "COURTYARD",
    bathroomType: "COMBINED",
    furnished: "PARTIAL",
    verified: true,
    views: 123,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    ],
    amenities: ["BALCONY", "HEATING", "GARDEN"],
  },
  {
    userId: USER_ID,
    title: "Янги квартира Бухоро марказида / Новая квартира в центре Бухары",
    description: `🇺🇿 O'zbek tilida:
Buxoro shahrining zamonaviy qismida yangi kvartira. Savdo markazi va davlat idoralari yaqinida.

Kvartira yangi uyda 2023-yil qurilgan. Ta'mir "oq kalit" - o'zingiz dizayn qilishingiz mumkin.

Lift, parkovka hovlida. Markaziy gaz va suv.

🇷🇺 На русском:
Новая квартира в современной части города Бухары. Рядом торговый центр и госучреждения.

Квартира в новом доме 2023 года постройки. Ремонт «белый ключ» — можете сами сделать дизайн.

Лифт, парковка во дворе. Центральный газ и вода.`,
    price: 75000,
    propertyType: "APARTMENT",
    listingType: "SALE",
    status: "ACTIVE",
    address: "Бухоро шаҳри, Мустақиллик кўчаси 123, 45-хонадон",
    city: "Бухоро",
    state: "Бухарская область",
    country: "Узбекистан",
    zipCode: "200100",
    district: "Марказ",
    latitude: 39.7689,
    longitude: 64.4234,
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    livingArea: 58,
    kitchenArea: 12,
    rooms: 3,
    yearBuilt: 2023,
    floor: 6,
    totalFloors: 9,
    ceilingHeight: 2.8,
    parking: 1,
    parkingType: "STREET",
    balcony: 1,
    buildingType: "MONOLITHIC",
    buildingClass: "COMFORT",
    elevatorPassenger: 1,
    renovation: "NONE",
    windowView: "STREET",
    bathroomType: "SEPARATE",
    furnished: "NONE",
    verified: true,
    views: 345,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    ],
    amenities: ["ELEVATOR", "PARKING", "AIR_CONDITIONING"],
  },
  {
    userId: USER_ID,
    title: "Меҳмонхона учун бино / Здание под гостиницу",
    description: `🇺🇿 O'zbek tilida:
Buxoro tarixiy markazida mehmonxona uchun tayyor bino. Turistik marshrut ustida joylashgan.

Bino 3 qavatli, 12 xona (24 mehmon uchun). Har bir xonada hammom, konditsioner. 1-qavatda restoran joyi.

Hozir ishlayapti - daromad oqimi mavjud. Sotuvchi chet elga ketayotgani uchun sotmoqda.

🇷🇺 На русском:
Готовое здание под гостиницу в историческом центре Бухары. Расположено на туристическом маршруте.

Здание 3-этажное, 12 номеров (на 24 гостя). В каждом номере санузел, кондиционер. На 1 этаже место для ресторана.

Сейчас работает — есть поток дохода. Продавец уезжает за рубеж, поэтому продаёт.`,
    price: 450000,
    propertyType: "COMMERCIAL",
    listingType: "SALE",
    status: "ACTIVE",
    address: "Меҳтар Амбар кўчаси 12",
    city: "Бухоро",
    state: "Бухарская область",
    country: "Узбекистан",
    zipCode: "200100",
    district: "Ески шаҳар",
    latitude: 39.7756,
    longitude: 64.4189,
    bathrooms: 12,
    area: 650,
    rooms: 15,
    yearBuilt: 2010,
    floor: 1,
    totalFloors: 3,
    ceilingHeight: 3.0,
    parking: 3,
    parkingType: "STREET",
    buildingType: "BRICK",
    buildingClass: "COMFORT",
    renovation: "EURO",
    windowView: "STREET",
    bathroomType: "MULTIPLE",
    furnished: "FULL",
    featured: true,
    verified: true,
    views: 567,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    ],
    amenities: ["PARKING", "SECURITY", "AIR_CONDITIONING", "INTERNET", "FURNISHED"],
  },
  {
    userId: USER_ID,
    title: "Ижарага хона Бухорода / Комната в аренду в Бухаре",
    description: `🇺🇿 O'zbek tilida:
Buxoro markazida xona ijaraga. Talabalar yoki yolg'iz yashaydiganlar uchun qulay.

Xona 18 m², alohida kirish. Oshxona va hammom umumiy (faqat 2 kishi). Wi-Fi, konditsioner bor.

Uy egasi - keksa ayol, juda mehribon. Tinch, xavfsiz joy.

🇷🇺 На русском:
Комната в аренду в центре Бухары. Удобно для студентов или одиноких.

Комната 18 м², отдельный вход. Кухня и санузел общие (только 2 человека). Wi-Fi, кондиционер есть.

Хозяйка — пожилая женщина, очень добрая. Тихое, безопасное место.`,
    price: 100,
    propertyType: "APARTMENT",
    listingType: "RENT",
    status: "ACTIVE",
    address: "Бухоро, Ҳожи Нурободий кўчаси 56",
    city: "Бухоро",
    state: "Бухарская область",
    country: "Узбекистан",
    zipCode: "200100",
    district: "Марказ",
    latitude: 39.7712,
    longitude: 64.4201,
    bathrooms: 1,
    area: 18,
    livingArea: 18,
    rooms: 1,
    yearBuilt: 1980,
    floor: 1,
    totalFloors: 1,
    ceilingHeight: 2.7,
    buildingType: "BRICK",
    buildingClass: "ECONOMY",
    renovation: "COSMETIC",
    windowView: "COURTYARD",
    bathroomType: "COMBINED",
    furnished: "FULL",
    verified: true,
    views: 89,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    ],
    amenities: ["AIR_CONDITIONING", "INTERNET", "FURNISHED"],
  },
  {
    userId: USER_ID,
    title: "3-хонали квартира Когон / 3-комнатная в Когане",
    description: `🇺🇿 O'zbek tilida:
Buxoro viloyatining Kogon shahrida keng kvartira. Temir yo'l stantsiyasi va zavod yaqinida.

Kvartira keng - 95 m². Xonalar izolyatsiya qilingan. Katta balkonda o'tirish mumkin.

Narx arzon chunki Buxoro shahridan tashqarida. Lekin avtobus 20 daqiqada shaharga olib boradi.

🇷🇺 На русском:
Просторная квартира в городе Коган Бухарской области. Рядом ж/д станция и завод.

Квартира большая — 95 м². Комнаты изолированные. На большом балконе можно посидеть.

Цена низкая, потому что за городом Бухара. Но автобус за 20 минут довезёт до города.`,
    price: 42000,
    propertyType: "APARTMENT",
    listingType: "SALE",
    status: "ACTIVE",
    address: "Когон шаҳри, Навоий кўчаси 89, 23-хонадон",
    city: "Бухоро",
    state: "Бухарская область",
    country: "Узбекистан",
    zipCode: "200700",
    district: "Когон",
    latitude: 39.7234,
    longitude: 64.5567,
    bedrooms: 2,
    bathrooms: 1,
    area: 95,
    livingArea: 68,
    kitchenArea: 12,
    rooms: 3,
    yearBuilt: 1988,
    floor: 3,
    totalFloors: 5,
    ceilingHeight: 2.6,
    balcony: 1,
    loggia: 1,
    buildingType: "PANEL",
    buildingClass: "ECONOMY",
    elevatorPassenger: 1,
    hasGarbageChute: true,
    renovation: "COSMETIC",
    windowView: "STREET",
    bathroomType: "SEPARATE",
    furnished: "NONE",
    verified: true,
    views: 156,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
    ],
    amenities: ["ELEVATOR", "BALCONY", "HEATING"],
  },
]

async function main() {
  console.log('🏠 Добавление 20 объектов в Самарканде, Ташкенте и Бухаре...\n')
  console.log('🏠 Samarqand, Toshkent va Buxoroda 20 ta mulk qo\'shilmoqda...\n')

  const createdProperties: { id: string; title: string; price: number; city: string; listingType: string }[] = []

  for (const prop of properties) {
    const { images, amenities, ...propertyData } = prop

    // Check if property with same title exists
    const existing = await prisma.property.findFirst({
      where: { title: prop.title }
    })

    if (existing) {
      console.log(`⏭️  Пропущено / O'tkazib yuborildi: ${prop.title.substring(0, 40)}...`)
      createdProperties.push({
        id: existing.id,
        title: existing.title,
        price: existing.price,
        city: existing.city,
        listingType: existing.listingType
      })
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

    console.log(`✅ ${property.city}: ${property.title.substring(0, 45)}...`)
    createdProperties.push({
      id: property.id,
      title: property.title,
      price: property.price,
      city: property.city,
      listingType: property.listingType
    })
  }

  // Group by city
  const samarkand = createdProperties.filter(p => p.city === 'Самарканд')
  const tashkent = createdProperties.filter(p => p.city === 'Ташкент')
  const bukhara = createdProperties.filter(p => p.city === 'Бухоро')

  console.log('\n' + '═'.repeat(70))
  console.log('📋 СОЗДАННЫЕ ОБЪЕКТЫ / YARATILGAN MULKLAR:')
  console.log('═'.repeat(70))

  const formatPrice = (price: number, type: string) => {
    if (type === 'RENT') return `$${price}/oy - $${price}/мес`
    return price >= 10000 ? `$${(price / 1000).toFixed(0)}k` : `$${price}`
  }

  console.log('\n🏛️  САМАРКАНД / SAMARQAND:')
  samarkand.forEach((p, i) => {
    console.log(`   ${i + 1}. ${p.title.substring(0, 50)}...`)
    console.log(`      💰 ${formatPrice(p.price, p.listingType)}`)
    console.log(`      🔗 http://localhost:3001/properties/${p.id}`)
  })

  console.log('\n🏙️  ТАШКЕНТ / TOSHKENT:')
  tashkent.forEach((p, i) => {
    console.log(`   ${i + 1}. ${p.title.substring(0, 50)}...`)
    console.log(`      💰 ${formatPrice(p.price, p.listingType)}`)
    console.log(`      🔗 http://localhost:3001/properties/${p.id}`)
  })

  console.log('\n🕌  БУХОРО / BUXORO:')
  bukhara.forEach((p, i) => {
    console.log(`   ${i + 1}. ${p.title.substring(0, 50)}...`)
    console.log(`      💰 ${formatPrice(p.price, p.listingType)}`)
    console.log(`      🔗 http://localhost:3001/properties/${p.id}`)
  })

  console.log('\n' + '═'.repeat(70))
  console.log(`✅ Готово! / Tayyor! ${createdProperties.length} объектов / mulk.`)
  console.log(`   🏛️  Самарканд: ${samarkand.length}`)
  console.log(`   🏙️  Ташкент: ${tashkent.length}`)
  console.log(`   🕌  Бухоро: ${bukhara.length}`)
}

main()
  .catch((e) => {
    console.error('Ошибка / Xatolik:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
