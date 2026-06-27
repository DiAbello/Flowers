export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: '2024-11-01',

  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
  ],

  pinia: {
    storesDirs: ['./app/stores/**'],
  },

  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light',
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.ts',
    exposeConfig: false,
  },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
    databaseUrl: process.env.DATABASE_URL,
    public: {
      appName: 'Floria',
      appUrl: process.env.APP_URL || 'http://localhost:3000',
    },
  },

  nitro: {
    experimental: {
      openAPI: true,
    },
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Floria — Интернет-магазин цветов',
      meta: [
        {
          name: 'description',
          content:
            'Свежие цветы с доставкой. Розы, тюльпаны, пионы, орхидеи и авторские букеты на любой случай.',
        },
        { name: 'theme-color', content: '#f43f5e' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Floria — Интернет-магазин цветов' },
        {
          property: 'og:description',
          content: 'Свежие цветы с доставкой. Авторские букеты на любой случай.',
        },
        { property: 'og:image', content: '/og-image.jpg' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap',
        },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  vite: {
    optimizeDeps: {
      include: ['@vueuse/core', 'pinia'],
    },
  },
})
