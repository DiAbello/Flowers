import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const products = [
  {
    name: 'Букет «Нежность»',
    slug: 'neznost',
    description:
      'Воздушный букет из 15 розовых пионов с зеленью эвкалипта. Символ нежности и заботы — идеален для день рождения, годовщины или просто потому что.',
    price: 4500,
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1559181567-c3190ca9d5db?w=800&q=80',
      'https://images.unsplash.com/photo-1490750967868-88df5691cc99?w=800&q=80',
    ],
  },
  {
    name: 'Красные розы «Страсть»',
    slug: 'krasnye-rozy-strast',
    description:
      'Классический букет из 25 бархатных красных роз сорта Explorer. Длина стебля 60 см. Неподвластная времени классика для самых ярких признаний.',
    price: 6200,
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1548460690-0e9e0ed35f3a?w=800&q=80',
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80',
    ],
  },
  {
    name: 'Тюльпаны «Весна»',
    slug: 'tyulpany-vesna',
    description:
      'Яркий весенний букет из 21 разноцветного тюльпана. Голландские тюльпаны высшего сорта — лёгкие, свежие и полные жизни.',
    price: 2800,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1521747116042-5a810fda9664?w=800&q=80',
      'https://images.unsplash.com/photo-1462530260150-162092dbf011?w=800&q=80',
    ],
  },
  {
    name: 'Орхидея «Элегантность»',
    slug: 'orkhideya-elegantnost',
    description:
      'Изысканная орхидея фаленопсис в керамическом кашпо. Живёт до 6 месяцев при правильном уходе. Роскошный подарок для ценителей прекрасного.',
    price: 3900,
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1615900119312-2acd3a71f3aa?w=800&q=80',
      'https://images.unsplash.com/photo-1584409552834-2c1a55ec7059?w=800&q=80',
    ],
  },
  {
    name: 'Подсолнухи «Лето»',
    slug: 'podsolnukhi-leto',
    description:
      'Жизнерадостный букет из 11 крупных подсолнухов с зеленью. Заряжает энергией и поднимает настроение в любую погоду.',
    price: 2400,
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1470509037663-253d2d33affe?w=800&q=80',
      'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800&q=80',
    ],
  },
  {
    name: 'Лилии «Аромат»',
    slug: 'lilii-aromat',
    description:
      'Роскошный букет из 7 белоснежных лилий Oriental с насыщенным ароматом. Торжественно, благородно, незабываемо.',
    price: 3200,
    stock: 10,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1524601500432-1e1a4c71d692?w=800&q=80',
    ],
  },
  {
    name: 'Авторский букет «Садовая история»',
    slug: 'avtorskiy-sadovaya-istoriya',
    description:
      'Авторская композиция из сезонных цветов: ранункулюсы, анемоны, астранция и ароматные травы. Каждый букет создаётся вручную и уникален.',
    price: 7800,
    stock: 5,
    images: [
      'https://images.unsplash.com/photo-1487530811015-780be6b5f0be?w=800&q=80',
      'https://images.unsplash.com/photo-1582005450386-46c04c40f8e1?w=800&q=80',
    ],
  },
  {
    name: 'Ромашки «Простота»',
    slug: 'romashki-prostota',
    description:
      'Нежный полевой букет из 31 ромашки с колосьями пшеницы. Лёгкий, искренний и очень тёплый — как объятия близкого человека.',
    price: 1800,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1592409937895-95f19bbf52e6?w=800&q=80',
      'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=800&q=80',
    ],
  },
  {
    name: 'Хризантемы «Осень»',
    slug: 'khrizantemy-osen',
    description:
      'Пышный букет из кустовых хризантем в тёплых осенних тонах. Долгостоящие — радуют до 3 недель при должном уходе.',
    price: 2600,
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800&q=80',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    ],
  },
  {
    name: 'Пионовидные розы «Мечта»',
    slug: 'pionovidnye-rozy-mechta',
    description:
      'Невероятно пышные пионовидные розы сорта David Austin в оттенках персика и крема. Романтика в каждом лепестке.',
    price: 8500,
    stock: 7,
    images: [
      'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=800&q=80',
      'https://images.unsplash.com/photo-1455582916367-25f75bfc6710?w=800&q=80',
    ],
  },
  {
    name: 'Фрезия «Первый снег»',
    slug: 'freziya-pervyy-sneg',
    description:
      'Хрупкий букет из белоснежных фрезий с тончайшим ванильным ароматом. Чистота, изящество и утончённая красота.',
    price: 3100,
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1567696153798-9111f9cd3d0d?w=800&q=80',
      'https://images.unsplash.com/photo-1455838825069-a2b3f73dd7da?w=800&q=80',
    ],
  },
  {
    name: 'Герберы «Радость»',
    slug: 'gerbery-radost',
    description:
      'Яркий разноцветный букет из 19 герберов. Заряд позитива и хорошего настроения — отличный подарок для любого события.',
    price: 2200,
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&q=80',
      'https://images.unsplash.com/photo-1586280268958-9483002d016a?w=800&q=80',
    ],
  },
]

async function main() {
  console.log('🌸 Seeding database...')

  // Admin user
  const adminHash = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@floria.ru' },
    update: {},
    create: {
      name: 'Администратор',
      email: 'admin@floria.ru',
      passwordHash: adminHash,
      role: Role.ADMIN,
    },
  })
  console.log('✅ Admin created:', admin.email)

  // Test user
  const userHash = await bcrypt.hash('user123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'user@floria.ru' },
    update: {},
    create: {
      name: 'Иван Петров',
      email: 'user@floria.ru',
      passwordHash: userHash,
      role: Role.USER,
    },
  })
  console.log('✅ Test user created:', user.email)

  // Products
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        price: product.price,
      },
    })
  }
  console.log(`✅ ${products.length} products seeded`)

  // Sample order
  const firstProduct = await prisma.product.findFirst({ where: { slug: 'neznost' } })
  if (firstProduct) {
    const existing = await prisma.order.findFirst({ where: { userId: user.id } })
    if (!existing) {
      await prisma.order.create({
        data: {
          userId: user.id,
          phone: '+7 (999) 123-45-67',
          comment: 'Позвоните за 30 минут до доставки',
          totalPrice: firstProduct.price,
          status: 'CONFIRMED',
          items: {
            create: {
              productId: firstProduct.id,
              quantity: 1,
              price: firstProduct.price,
            },
          },
        },
      })
      console.log('✅ Sample order created')
    }
  }

  console.log('🌸 Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
