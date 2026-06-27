# 🌸 Floria — Интернет-магазин цветов

Production-ready интернет-магазин цветов на Nuxt 4 + Nitro + PostgreSQL + Prisma.

## Стек технологий

- **Frontend**: Nuxt 4 (SSR), Vue 3 Composition API, TypeScript
- **Styling**: TailwindCSS v3, тёмная тема
- **State**: Pinia + pinia-plugin-persistedstate
- **Backend**: Nitro (встроен в Nuxt), REST API
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT (httpOnly cookies)
- **Utils**: VueUse

---

## Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка окружения

```bash
cp .env
```

Заполнить `.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/flowers_db"
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
APP_URL="http://localhost:3000"
```

### 3. PostgreSQL

Убедитесь что PostgreSQL запущен и база данных создана:

```sql
CREATE DATABASE flowers_db;
```

### 4. Prisma — миграция и seed

```bash
# Применить схему к БД
npm run db:push

# Сгенерировать Prisma Client
npm run db:generate

# Заполнить тестовыми данными
npm run db:seed
```

### 5. Запуск

```bash
npm run dev
```

Откройте: http://localhost:3000

---

## Тестовые аккаунты (после seed)

| Роль | Email | Пароль |
|------|-------|--------|
| Admin | admin@floria.ru | admin123 |
| User | user@floria.ru | user123 |

---

## Структура проекта

```
flowers/
├── prisma/
│   ├── schema.prisma          # Схема БД (User, Product, Order, OrderItem)
│   └── seed.ts                # Тестовые данные
├── server/
│   ├── api/
│   │   ├── auth/              # POST /register, /login, /logout, GET /me
│   │   ├── products/          # CRUD товаров
│   │   └── orders/            # CRUD заказов
│   ├── middleware/
│   │   └── 01.auth.ts         # JWT-парсинг из cookie
│   └── utils/
│       ├── prisma.ts          # Singleton Prisma Client
│       ├── jwt.ts             # sign/verify JWT
│       ├── hash.ts            # bcrypt hash/compare
│       └── response.ts        # Хелперы ответов (requireAuth, requireAdmin)
├── app/
│   ├── assets/css/            # TailwindCSS + кастомные стили
│   ├── components/
│   │   ├── admin/             # ProductTable, ProductFormModal, OrdersTable
│   │   ├── auth/              # AuthModal
│   │   ├── cart/              # CartItem
│   │   ├── home/              # Hero, Features, FeaturedProducts, About
│   │   ├── layout/            # TheNavbar, TheFooter, MobileMenu, NotificationContainer
│   │   ├── product/           # ProductCard, ProductGrid, ProductSkeleton, ProductImageSlider
│   │   └── ui/                # AppInput, AppModal, AppSpinner, AppBadge
│   ├── composables/
│   │   ├── useNotify.ts       # Хелпер уведомлений
│   │   ├── useOrders.ts       # Хелпер работы с заказами
│   │   └── useValidation.ts   # Валидация форм
│   ├── layouts/
│   │   ├── default.vue        # Navbar + Footer
│   │   └── admin.vue          # Админ-шапка
│   ├── middleware/
│   │   ├── admin.ts           # Только ADMIN
│   │   ├── auth.ts            # Только авторизованные
│   │   └── guest.ts           # Только гости
│   ├── pages/
│   │   ├── index.vue          # Главная
│   │   ├── catalog.vue        # Каталог с поиском/сортировкой/пагинацией
│   │   ├── product/[id].vue   # Карточка товара
│   │   ├── cart.vue           # Корзина + оформление
│   │   ├── auth/login.vue     # Вход
│   │   ├── auth/register.vue  # Регистрация
│   │   └── admin/index.vue    # Панель управления
│   ├── stores/
│   │   ├── auth.ts            # Пользователь, login/register/logout
│   │   ├── cart.ts            # Корзина (персистентная)
│   │   ├── notifications.ts   # Toast-уведомления
│   │   └── products.ts        # Продукты (admin CRUD)
│   ├── types/index.ts         # TypeScript типы
│   ├── app.vue
│   └── error.vue
├── public/
│   ├── favicon.svg
│   └── robots.txt
├── .env.example
├── nuxt.config.ts
├── tailwind.config.ts
└── package.json
```

---

## API Routes

### Auth
| Method | Route | Auth | Описание |
|--------|-------|------|----------|
| POST | `/api/auth/register` | — | Регистрация |
| POST | `/api/auth/login` | — | Вход (устанавливает httpOnly cookie) |
| POST | `/api/auth/logout` | — | Выход (удаляет cookie) |
| GET | `/api/auth/me` | ✅ | Текущий пользователь |

### Products
| Method | Route | Auth | Описание |
|--------|-------|------|----------|
| GET | `/api/products` | — | Список (поиск, сортировка, пагинация) |
| GET | `/api/products/:id` | — | Один товар |
| POST | `/api/products` | ADMIN | Создать |
| PUT | `/api/products/:id` | ADMIN | Обновить |
| DELETE | `/api/products/:id` | ADMIN | Удалить |

### Orders
| Method | Route | Auth | Описание |
|--------|-------|------|----------|
| GET | `/api/orders` | ✅ | Список (админ видит все, юзер — свои) |
| POST | `/api/orders` | ✅ | Создать заказ |
| PUT | `/api/orders/:id` | ADMIN | Обновить статус |
| DELETE | `/api/orders/:id` | ADMIN | Удалить |

---

## Функциональность

### Публичная часть
- Главная страница: Hero, преимущества, популярные товары, о нас
- Каталог: сетка, поиск, сортировка, пагинация
- Карточка товара: галерея со слайдером, описание, выбор количества

### Авторизация
- Регистрация с валидацией
- Вход с JWT (httpOnly cookie, 7 дней)
- Автоматический редирект после входа
- Защита роутов middleware

### Корзина
- Персистентная (localStorage)
- +/- количество, удаление
- Оформление с указанием телефона и комментария

### Безопасность
- Пароли хешируются через bcrypt (12 rounds)
- JWT в httpOnly cookie (недоступен JS)
- Серверная валидация через zod
- Защита admin API через middleware
- Мягкое удаление продуктов (если есть заказы)

### Админ панель
- Управление товарами: таблица, поиск, CRUD
- Управление заказами: просмотр, изменение статуса, удаление
- При отмене заказа — автоматический возврат товара на склад

---

## Изображения

Товары используют Unsplash URLs. Замените их на свои через панель управления.

Рекомендуемые хранилища для production:
- **Cloudinary** (бесплатный tier)
- **AWS S3 + CloudFront**
- **Uploadthing**

---

## Production деплой

```bash
npm run build
node .output/server/index.mjs
```

Переменные окружения для production:
```env
NODE_ENV=production
DATABASE_URL=...
JWT_SECRET=...  # минимум 32 символа
APP_URL=https://yourdomain.com
```
