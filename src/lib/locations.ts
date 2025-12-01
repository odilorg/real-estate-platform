/**
 * Uzbekistan Locations Data
 * Hierarchical structure: Region → City → District → Metro stations
 */

export interface MetroStation {
  id: string
  name: {
    ru: string
    uz: string
  }
  line: string // Metro line color/name
}

export interface District {
  id: string
  name: {
    ru: string
    uz: string
  }
  metros?: MetroStation[]
}

export interface City {
  id: string
  name: {
    ru: string
    uz: string
  }
  districts: District[]
  hasMetro?: boolean
}

export interface Region {
  id: string
  name: {
    ru: string
    uz: string
  }
  cities: City[]
}

// Tashkent Metro Stations by Line
const tashkentMetroStations: Record<string, MetroStation[]> = {
  // Chilanzar Line (Red/Chilonzor)
  chilanzar: [
    { id: 'sabir_rahimov', name: { ru: 'Сабир Рахимов', uz: 'Sabir Rahimov' }, line: 'chilanzar' },
    { id: 'olmazar', name: { ru: 'Олмазор', uz: 'Olmazor' }, line: 'chilanzar' },
    { id: 'pushkin', name: { ru: 'Пушкин', uz: 'Pushkin' }, line: 'chilanzar' },
    { id: 'hamid_olimjon', name: { ru: 'Хамид Олимжон', uz: 'Hamid Olimjon' }, line: 'chilanzar' },
    { id: 'chilanzar', name: { ru: 'Чиланзар', uz: 'Chilonzor' }, line: 'chilanzar' },
    { id: 'mirzo_ulugbek', name: { ru: 'Мирзо Улугбек', uz: 'Mirzo Ulug\'bek' }, line: 'chilanzar' },
    { id: 'novza', name: { ru: 'Новза', uz: 'Novza' }, line: 'chilanzar' },
    { id: 'milliy_bog', name: { ru: 'Миллий Бог', uz: 'Milliy Bog\'' }, line: 'chilanzar' },
  ],
  // Uzbekistan Line (Blue/O'zbekiston)
  uzbekistan: [
    { id: 'buyuk_ipak_yoli', name: { ru: 'Буюк Ипак Йули', uz: 'Buyuk Ipak Yo\'li' }, line: 'uzbekistan' },
    { id: 'tinchlik', name: { ru: 'Тинчлик', uz: 'Tinchlik' }, line: 'uzbekistan' },
    { id: 'chorsu', name: { ru: 'Чорсу', uz: 'Chorsu' }, line: 'uzbekistan' },
    { id: 'gafur_gulom', name: { ru: 'Гафур Гулом', uz: 'G\'afur G\'ulom' }, line: 'uzbekistan' },
    { id: 'alisher_navoi', name: { ru: 'Алишер Навои', uz: 'Alisher Navoiy' }, line: 'uzbekistan' },
    { id: 'paxtakor', name: { ru: 'Пахтакор', uz: 'Paxtakor' }, line: 'uzbekistan' },
    { id: 'mustaqillik', name: { ru: 'Мустакиллик', uz: 'Mustaqillik' }, line: 'uzbekistan' },
    { id: 'amir_temur', name: { ru: 'Амир Темур Хиёбони', uz: 'Amir Temur Xiyoboni' }, line: 'uzbekistan' },
    { id: 'yunus_rajabiy', name: { ru: 'Юнус Раджабий', uz: 'Yunus Rajabiy' }, line: 'uzbekistan' },
    { id: 'minor', name: { ru: 'Минор', uz: 'Minor' }, line: 'uzbekistan' },
  ],
  // Yunusabad Line (Green/Yunusobod)
  yunusabad: [
    { id: 'ming_urik', name: { ru: 'Минг Урик', uz: 'Ming O\'rik' }, line: 'yunusabad' },
    { id: 'shahriston', name: { ru: 'Шахристон', uz: 'Shahriston' }, line: 'yunusabad' },
    { id: 'bodomzor', name: { ru: 'Бодомзор', uz: 'Bodomzor' }, line: 'yunusabad' },
    { id: 'abdulla_qodiriy', name: { ru: 'Абдулла Кодирий', uz: 'Abdulla Qodiriy' }, line: 'yunusabad' },
    { id: 'yunusobod', name: { ru: 'Юнусобод', uz: 'Yunusobod' }, line: 'yunusabad' },
    { id: 'turkiston', name: { ru: 'Туркистон', uz: 'Turkiston' }, line: 'yunusabad' },
  ],
  // Circle Line (Yellow/Halqa)
  circle: [
    { id: 'dustlik', name: { ru: 'Дустлик', uz: 'Do\'stlik' }, line: 'circle' },
    { id: 'sergeli', name: { ru: 'Сергели', uz: 'Sergeli' }, line: 'circle' },
    { id: 'oltin_tepa', name: { ru: 'Олтин Тепа', uz: 'Oltin Tepa' }, line: 'circle' },
    { id: 'yangi_hayot', name: { ru: 'Янги Хаёт', uz: 'Yangi Hayot' }, line: 'circle' },
    { id: 'qoyliq', name: { ru: 'Куйлик', uz: 'Qo\'yliq' }, line: 'circle' },
    { id: 'toshkent', name: { ru: 'Ташкент', uz: 'Toshkent' }, line: 'circle' },
    { id: 'mashinasozlar', name: { ru: 'Машинасозлар', uz: 'Mashinasozlar' }, line: 'circle' },
  ],
}

// All metro stations flat list
export const allMetroStations: MetroStation[] = [
  ...tashkentMetroStations.chilanzar,
  ...tashkentMetroStations.uzbekistan,
  ...tashkentMetroStations.yunusabad,
  ...tashkentMetroStations.circle,
]

// Tashkent Districts with their metro stations
const tashkentDistricts: District[] = [
  {
    id: 'bektemir',
    name: { ru: 'Бектемирский район', uz: 'Bektemir tumani' },
    metros: [],
  },
  {
    id: 'chilanzar',
    name: { ru: 'Чиланзарский район', uz: 'Chilonzor tumani' },
    metros: tashkentMetroStations.chilanzar.filter(m =>
      ['chilanzar', 'novza', 'milliy_bog'].includes(m.id)
    ),
  },
  {
    id: 'yashnobod',
    name: { ru: 'Яшнободский район', uz: 'Yashnobod tumani' },
    metros: tashkentMetroStations.circle.filter(m =>
      ['dustlik', 'toshkent'].includes(m.id)
    ),
  },
  {
    id: 'mirobod',
    name: { ru: 'Мирабадский район', uz: 'Mirobod tumani' },
    metros: [
      ...tashkentMetroStations.uzbekistan.filter(m =>
        ['amir_temur', 'yunus_rajabiy', 'mustaqillik'].includes(m.id)
      ),
    ],
  },
  {
    id: 'mirzo_ulugbek',
    name: { ru: 'Мирзо-Улугбекский район', uz: 'Mirzo Ulug\'bek tumani' },
    metros: tashkentMetroStations.chilanzar.filter(m =>
      ['mirzo_ulugbek', 'novza'].includes(m.id)
    ),
  },
  {
    id: 'sergeli',
    name: { ru: 'Сергелийский район', uz: 'Sergeli tumani' },
    metros: tashkentMetroStations.circle.filter(m =>
      ['sergeli', 'oltin_tepa'].includes(m.id)
    ),
  },
  {
    id: 'olmazor',
    name: { ru: 'Олмазорский район', uz: 'Olmazor tumani' },
    metros: tashkentMetroStations.chilanzar.filter(m =>
      ['sabir_rahimov', 'olmazar', 'pushkin'].includes(m.id)
    ),
  },
  {
    id: 'shaykhontohur',
    name: { ru: 'Шайхантаурский район', uz: 'Shayxontohur tumani' },
    metros: [
      ...tashkentMetroStations.uzbekistan.filter(m =>
        ['chorsu', 'gafur_gulom', 'alisher_navoi'].includes(m.id)
      ),
      ...tashkentMetroStations.yunusabad.filter(m =>
        ['ming_urik', 'shahriston'].includes(m.id)
      ),
    ],
  },
  {
    id: 'uchtepa',
    name: { ru: 'Учтепинский район', uz: 'Uchtepa tumani' },
    metros: tashkentMetroStations.uzbekistan.filter(m =>
      ['buyuk_ipak_yoli', 'tinchlik'].includes(m.id)
    ),
  },
  {
    id: 'yakkasaray',
    name: { ru: 'Яккасарайский район', uz: 'Yakkasaroy tumani' },
    metros: tashkentMetroStations.uzbekistan.filter(m =>
      ['mustaqillik', 'paxtakor'].includes(m.id)
    ),
  },
  {
    id: 'yunusabad',
    name: { ru: 'Юнусабадский район', uz: 'Yunusobod tumani' },
    metros: tashkentMetroStations.yunusabad.filter(m =>
      ['bodomzor', 'abdulla_qodiriy', 'yunusobod', 'turkiston', 'minor'].includes(m.id)
    ),
  },
  {
    id: 'yangihayot',
    name: { ru: 'Янгихаётский район', uz: 'Yangihayot tumani' },
    metros: tashkentMetroStations.circle.filter(m =>
      ['yangi_hayot', 'qoyliq'].includes(m.id)
    ),
  },
]

// Main Regions Data
export const regions: Region[] = [
  {
    id: 'tashkent_city',
    name: { ru: 'Ташкент', uz: 'Toshkent shahri' },
    cities: [
      {
        id: 'tashkent',
        name: { ru: 'Ташкент', uz: 'Toshkent' },
        districts: tashkentDistricts,
        hasMetro: true,
      },
    ],
  },
  {
    id: 'tashkent_region',
    name: { ru: 'Ташкентская область', uz: 'Toshkent viloyati' },
    cities: [
      {
        id: 'nurafshon',
        name: { ru: 'Нурафшон', uz: 'Nurafshon' },
        districts: [
          { id: 'nurafshon_center', name: { ru: 'Центр', uz: 'Markaz' } },
        ],
      },
      {
        id: 'olmaliq',
        name: { ru: 'Алмалык', uz: 'Olmaliq' },
        districts: [
          { id: 'olmaliq_center', name: { ru: 'Центр', uz: 'Markaz' } },
        ],
      },
      {
        id: 'angren',
        name: { ru: 'Ангрен', uz: 'Angren' },
        districts: [
          { id: 'angren_center', name: { ru: 'Центр', uz: 'Markaz' } },
        ],
      },
      {
        id: 'chirchiq',
        name: { ru: 'Чирчик', uz: 'Chirchiq' },
        districts: [
          { id: 'chirchiq_center', name: { ru: 'Центр', uz: 'Markaz' } },
        ],
      },
      {
        id: 'bekobod',
        name: { ru: 'Бекабад', uz: 'Bekobod' },
        districts: [
          { id: 'bekobod_center', name: { ru: 'Центр', uz: 'Markaz' } },
        ],
      },
    ],
  },
  {
    id: 'samarkand_region',
    name: { ru: 'Самаркандская область', uz: 'Samarqand viloyati' },
    cities: [
      {
        id: 'samarkand',
        name: { ru: 'Самарканд', uz: 'Samarqand' },
        districts: [
          { id: 'samarkand_center', name: { ru: 'Центральный', uz: 'Markaziy' } },
          { id: 'siab', name: { ru: 'Сиабский', uz: 'Siob' } },
          { id: 'jomboy', name: { ru: 'Джамбайский', uz: 'Jomboy' } },
          { id: 'oqdaryo', name: { ru: 'Акдарьинский', uz: 'Oqdaryo' } },
        ],
      },
      {
        id: 'kattaqorgon',
        name: { ru: 'Каттакурган', uz: 'Kattaqo\'rg\'on' },
        districts: [
          { id: 'kattaqorgon_center', name: { ru: 'Центр', uz: 'Markaz' } },
        ],
      },
    ],
  },
  {
    id: 'bukhara_region',
    name: { ru: 'Бухарская область', uz: 'Buxoro viloyati' },
    cities: [
      {
        id: 'bukhara',
        name: { ru: 'Бухара', uz: 'Buxoro' },
        districts: [
          { id: 'bukhara_center', name: { ru: 'Центральный', uz: 'Markaziy' } },
          { id: 'kogon', name: { ru: 'Когон', uz: 'Kogon' } },
        ],
      },
    ],
  },
  {
    id: 'fergana_region',
    name: { ru: 'Ферганская область', uz: 'Farg\'ona viloyati' },
    cities: [
      {
        id: 'fergana',
        name: { ru: 'Фергана', uz: 'Farg\'ona' },
        districts: [
          { id: 'fergana_center', name: { ru: 'Центральный', uz: 'Markaziy' } },
        ],
      },
      {
        id: 'margilan',
        name: { ru: 'Маргилан', uz: 'Marg\'ilon' },
        districts: [
          { id: 'margilan_center', name: { ru: 'Центр', uz: 'Markaz' } },
        ],
      },
      {
        id: 'qoqon',
        name: { ru: 'Коканд', uz: 'Qo\'qon' },
        districts: [
          { id: 'qoqon_center', name: { ru: 'Центр', uz: 'Markaz' } },
        ],
      },
    ],
  },
  {
    id: 'andijan_region',
    name: { ru: 'Андижанская область', uz: 'Andijon viloyati' },
    cities: [
      {
        id: 'andijan',
        name: { ru: 'Андижан', uz: 'Andijon' },
        districts: [
          { id: 'andijan_center', name: { ru: 'Центральный', uz: 'Markaziy' } },
        ],
      },
    ],
  },
  {
    id: 'namangan_region',
    name: { ru: 'Наманганская область', uz: 'Namangan viloyati' },
    cities: [
      {
        id: 'namangan',
        name: { ru: 'Наманган', uz: 'Namangan' },
        districts: [
          { id: 'namangan_center', name: { ru: 'Центральный', uz: 'Markaziy' } },
        ],
      },
    ],
  },
  {
    id: 'khorezm_region',
    name: { ru: 'Хорезмская область', uz: 'Xorazm viloyati' },
    cities: [
      {
        id: 'urgench',
        name: { ru: 'Ургенч', uz: 'Urganch' },
        districts: [
          { id: 'urgench_center', name: { ru: 'Центр', uz: 'Markaz' } },
        ],
      },
      {
        id: 'khiva',
        name: { ru: 'Хива', uz: 'Xiva' },
        districts: [
          { id: 'khiva_center', name: { ru: 'Центр', uz: 'Markaz' } },
        ],
      },
    ],
  },
  {
    id: 'navoi_region',
    name: { ru: 'Навоийская область', uz: 'Navoiy viloyati' },
    cities: [
      {
        id: 'navoi',
        name: { ru: 'Навои', uz: 'Navoiy' },
        districts: [
          { id: 'navoi_center', name: { ru: 'Центр', uz: 'Markaz' } },
        ],
      },
    ],
  },
  {
    id: 'kashkadarya_region',
    name: { ru: 'Кашкадарьинская область', uz: 'Qashqadaryo viloyati' },
    cities: [
      {
        id: 'qarshi',
        name: { ru: 'Карши', uz: 'Qarshi' },
        districts: [
          { id: 'qarshi_center', name: { ru: 'Центр', uz: 'Markaz' } },
        ],
      },
    ],
  },
  {
    id: 'surxondaryo_region',
    name: { ru: 'Сурхандарьинская область', uz: 'Surxondaryo viloyati' },
    cities: [
      {
        id: 'termiz',
        name: { ru: 'Термез', uz: 'Termiz' },
        districts: [
          { id: 'termiz_center', name: { ru: 'Центр', uz: 'Markaz' } },
        ],
      },
    ],
  },
  {
    id: 'jizzakh_region',
    name: { ru: 'Джизакская область', uz: 'Jizzax viloyati' },
    cities: [
      {
        id: 'jizzakh',
        name: { ru: 'Джизак', uz: 'Jizzax' },
        districts: [
          { id: 'jizzakh_center', name: { ru: 'Центр', uz: 'Markaz' } },
        ],
      },
    ],
  },
  {
    id: 'syrdarya_region',
    name: { ru: 'Сырдарьинская область', uz: 'Sirdaryo viloyati' },
    cities: [
      {
        id: 'guliston',
        name: { ru: 'Гулистан', uz: 'Guliston' },
        districts: [
          { id: 'guliston_center', name: { ru: 'Центр', uz: 'Markaz' } },
        ],
      },
    ],
  },
  {
    id: 'karakalpakstan',
    name: { ru: 'Республика Каракалпакстан', uz: 'Qoraqalpog\'iston Respublikasi' },
    cities: [
      {
        id: 'nukus',
        name: { ru: 'Нукус', uz: 'Nukus' },
        districts: [
          { id: 'nukus_center', name: { ru: 'Центр', uz: 'Markaz' } },
        ],
      },
    ],
  },
]

// Helper functions
export function getRegionById(regionId: string): Region | undefined {
  return regions.find(r => r.id === regionId)
}

export function getCitiesByRegion(regionId: string): City[] {
  const region = getRegionById(regionId)
  return region?.cities || []
}

export function getCityById(regionId: string, cityId: string): City | undefined {
  const cities = getCitiesByRegion(regionId)
  return cities.find(c => c.id === cityId)
}

export function getDistrictsByCity(regionId: string, cityId: string): District[] {
  const city = getCityById(regionId, cityId)
  return city?.districts || []
}

export function getDistrictById(regionId: string, cityId: string, districtId: string): District | undefined {
  const districts = getDistrictsByCity(regionId, cityId)
  return districts.find(d => d.id === districtId)
}

export function getMetrosByDistrict(regionId: string, cityId: string, districtId: string): MetroStation[] {
  const district = getDistrictById(regionId, cityId, districtId)
  return district?.metros || []
}

export function getMetrosByCity(regionId: string, cityId: string): MetroStation[] {
  const city = getCityById(regionId, cityId)
  if (!city?.hasMetro) return []

  const allMetros: MetroStation[] = []
  city.districts.forEach(d => {
    if (d.metros) {
      d.metros.forEach(m => {
        if (!allMetros.find(existing => existing.id === m.id)) {
          allMetros.push(m)
        }
      })
    }
  })
  return allMetros
}

export function cityHasMetro(regionId: string, cityId: string): boolean {
  const city = getCityById(regionId, cityId)
  return city?.hasMetro || false
}

// Get name by locale
export function getLocalizedName(item: { name: { ru: string; uz: string } }, locale: string): string {
  return locale === 'uz' ? item.name.uz : item.name.ru
}
