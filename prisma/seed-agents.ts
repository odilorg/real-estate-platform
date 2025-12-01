import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('👤 Создание агентов / Agentlar yaratilmoqda...\n')

  // Create 3 agent users with hashed passwords
  const password = await hash('agent123', 12)

  // Agent 1 - Samarkand specialist
  const agent1User = await prisma.user.upsert({
    where: { email: 'aziz.karimov@realestate.uz' },
    update: {},
    create: {
      email: 'aziz.karimov@realestate.uz',
      name: 'Азиз Каримов',
      password,
      role: 'AGENT',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    },
  })

  const agent1 = await prisma.agent.upsert({
    where: { userId: agent1User.id },
    update: {},
    create: {
      userId: agent1User.id,
      firstName: 'Азиз',
      lastName: 'Каримов',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
      bio: `🇺🇿 Samarqand bo'yicha ko'chmas mulk mutaxassisi. 8 yillik tajriba. Kvartiralar, hovlilar va tijorat binolari bilan ishlayman.

🇷🇺 Специалист по недвижимости Самарканда. 8 лет опыта. Работаю с квартирами, частными домами и коммерческой недвижимостью.`,
      phone: '+998901234567',
      email: 'aziz.karimov@realestate.uz',
      whatsapp: '+998901234567',
      telegram: '@aziz_realtor',
      licenseNumber: 'SAM-2016-0845',
      specializations: JSON.stringify(['residential', 'commercial', 'houses']),
      languages: JSON.stringify(['uz', 'ru', 'en']),
      areasServed: JSON.stringify(['Самарканд', 'Samarqand']),
      yearsExperience: 8,
      totalDeals: 156,
      verified: true,
      superAgent: true,
      responseTime: 'fast',
      rating: 4.9,
      reviewCount: 47,
    },
  })

  console.log(`✅ Агент 1: ${agent1User.name} (${agent1User.email})`)

  // Agent 2 - Tashkent specialist
  const agent2User = await prisma.user.upsert({
    where: { email: 'malika.rahimova@realestate.uz' },
    update: {},
    create: {
      email: 'malika.rahimova@realestate.uz',
      name: 'Малика Рахимова',
      password,
      role: 'AGENT',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    },
  })

  const agent2 = await prisma.agent.upsert({
    where: { userId: agent2User.id },
    update: {},
    create: {
      userId: agent2User.id,
      firstName: 'Малика',
      lastName: 'Рахимова',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      bio: `🇺🇿 Toshkentda premium va biznes-klass ko'chmas mulk bo'yicha mutaxassis. Yuqori darajadagi xizmat va individual yondashuv.

🇷🇺 Эксперт по премиальной и бизнес-недвижимости в Ташкенте. Высокий уровень сервиса и индивидуальный подход к каждому клиенту.`,
      phone: '+998977654321',
      email: 'malika.rahimova@realestate.uz',
      whatsapp: '+998977654321',
      telegram: '@malika_estate',
      licenseNumber: 'TAS-2018-1234',
      specializations: JSON.stringify(['luxury', 'business', 'penthouses']),
      languages: JSON.stringify(['uz', 'ru', 'en', 'tr']),
      areasServed: JSON.stringify(['Ташкент', 'Toshkent', 'Юнусабад', 'Мирабад']),
      yearsExperience: 6,
      totalDeals: 89,
      verified: true,
      superAgent: true,
      responseTime: 'fast',
      rating: 4.8,
      reviewCount: 32,
    },
  })

  console.log(`✅ Агент 2: ${agent2User.name} (${agent2User.email})`)

  // Agent 3 - Bukhara specialist
  const agent3User = await prisma.user.upsert({
    where: { email: 'jahongir.saidov@realestate.uz' },
    update: {},
    create: {
      email: 'jahongir.saidov@realestate.uz',
      name: 'Жаҳонгир Саидов',
      password,
      role: 'AGENT',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    },
  })

  const agent3 = await prisma.agent.upsert({
    where: { userId: agent3User.id },
    update: {},
    create: {
      userId: agent3User.id,
      firstName: 'Жаҳонгир',
      lastName: 'Саидов',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      bio: `🇺🇿 Buxoro viloyati bo'yicha ko'chmas mulk agenti. Tarixiy binolar, mehmonxonalar va investitsiya loyihalari bo'yicha mutaxassis.

🇷🇺 Агент по недвижимости Бухарской области. Специализируюсь на исторических зданиях, гостиницах и инвестиционных проектах.`,
      phone: '+998936543210',
      email: 'jahongir.saidov@realestate.uz',
      whatsapp: '+998936543210',
      telegram: '@jahongir_bukhara',
      licenseNumber: 'BUX-2019-0567',
      specializations: JSON.stringify(['historical', 'hotels', 'investment']),
      languages: JSON.stringify(['uz', 'ru']),
      areasServed: JSON.stringify(['Бухоро', 'Buxoro', 'Когон', 'Ғиждувон']),
      yearsExperience: 5,
      totalDeals: 45,
      verified: true,
      superAgent: false,
      responseTime: 'medium',
      rating: 4.6,
      reviewCount: 18,
    },
  })

  console.log(`✅ Агент 3: ${agent3User.name} (${agent3User.email})`)

  // Now reassign some properties to these agents
  console.log('\n📝 Переназначение объектов агентам / Mulklarni agentlarga biriktirish...\n')

  // Get properties by city
  const samarkandProps = await prisma.property.findMany({
    where: { city: 'Самарканд' },
    take: 4,
  })

  const tashkentProps = await prisma.property.findMany({
    where: { city: 'Ташкент' },
    take: 4,
  })

  const bukharaProps = await prisma.property.findMany({
    where: { city: 'Бухоро' },
    take: 4,
  })

  // Assign Samarkand properties to Agent 1
  for (const prop of samarkandProps) {
    await prisma.property.update({
      where: { id: prop.id },
      data: { userId: agent1User.id },
    })
    console.log(`   🏛️ ${prop.title.substring(0, 40)}... → Азиз Каримов`)
  }

  // Assign Tashkent properties to Agent 2
  for (const prop of tashkentProps) {
    await prisma.property.update({
      where: { id: prop.id },
      data: { userId: agent2User.id },
    })
    console.log(`   🏙️ ${prop.title.substring(0, 40)}... → Малика Рахимова`)
  }

  // Assign Bukhara properties to Agent 3
  for (const prop of bukharaProps) {
    await prisma.property.update({
      where: { id: prop.id },
      data: { userId: agent3User.id },
    })
    console.log(`   🕌 ${prop.title.substring(0, 40)}... → Жаҳонгир Саидов`)
  }

  console.log('\n' + '═'.repeat(70))
  console.log('📋 СОЗДАННЫЕ АГЕНТЫ / YARATILGAN AGENTLAR:')
  console.log('═'.repeat(70))

  console.log(`
1. 🏛️ Азиз Каримов (Samarqand)
   📧 aziz.karimov@realestate.uz
   📱 +998901234567
   ⭐ 4.9 (47 отзывов)
   🏆 Super Agent
   🔗 http://localhost:3001/agents/${agent1.id}

2. 🏙️ Малика Рахимова (Toshkent)
   📧 malika.rahimova@realestate.uz
   📱 +998977654321
   ⭐ 4.8 (32 отзыва)
   🏆 Super Agent
   🔗 http://localhost:3001/agents/${agent2.id}

3. 🕌 Жаҳонгир Саидов (Buxoro)
   📧 jahongir.saidov@realestate.uz
   📱 +998936543210
   ⭐ 4.6 (18 отзывов)
   🔗 http://localhost:3001/agents/${agent3.id}
`)

  console.log('═'.repeat(70))
  console.log('✅ Готово! / Tayyor!')
  console.log('🔑 Пароль для всех агентов / Barcha agentlar uchun parol: agent123')
}

main()
  .catch((e) => {
    console.error('Ошибка / Xatolik:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
