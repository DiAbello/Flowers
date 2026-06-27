<template>
  <footer class="bg-zinc-900 dark:bg-zinc-950 text-zinc-300 mt-20">
    <div class="container-shop py-12 md:py-16">
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-10">
        <!-- Brand -->
        <div class="lg:col-span-2">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-2xl">🌸</span>
            <span class="font-serif text-xl font-semibold text-white">Floria</span>
          </div>
          <p class="text-sm text-zinc-400 leading-relaxed max-w-xs">
            Свежие цветы, авторские букеты и тёплые эмоции — с доставкой по городу. Работаем с 2018 года.
          </p>
          <div class="flex gap-3 mt-5">
            <a
              v-for="social in socials"
              :key="social.name"
              :href="social.href"
              :aria-label="social.name"
              class="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
            >
              <span class="text-sm">{{ social.icon }}</span>
            </a>
          </div>
        </div>

        <!-- Navigation -->
        <div>
          <h3 class="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
            Магазин
          </h3>
          <ul class="space-y-2.5">
            <li v-for="link in shopLinks" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="text-sm text-zinc-400 hover:text-primary-400 transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
            Контакты
          </h3>
          <ul class="space-y-2.5 text-sm text-zinc-400">
            <li class="flex items-center gap-2">
              <span>📞</span>
              <a href="tel:+78001234567" class="hover:text-primary-400 transition-colors">
                +7 (800) 123-45-67
              </a>
            </li>
            <li class="flex items-center gap-2">
              <span>📧</span>
              <a href="mailto:hello@floria.ru" class="hover:text-primary-400 transition-colors">
                hello@floria.ru
              </a>
            </li>
            <li class="flex items-center gap-2">
              <span>🕐</span>
              <span>Пн–Вс: 8:00–22:00</span>
            </li>
            <li class="flex items-center gap-2">
              <span>📍</span>
              <span>Москва, Цветочная ул., 1</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-zinc-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
        <span>© {{ new Date().getFullYear() }} Floria. Все права защищены.</span>
        <div class="flex gap-4">
          <a href="#" class="hover:text-zinc-300 transition-colors">Политика конфиденциальности</a>
          <a href="#" class="hover:text-zinc-300 transition-colors">Оферта</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const socials = [
  { name: 'Instagram', href: '#', icon: '📸' },
  { name: 'VK', href: '#', icon: '💬' },
  { name: 'Telegram', href: '#', icon: '✈️' },
]

const shopLinks = [
  { to: '/catalog', label: 'Каталог' },
  { to: '/cart', label: 'Корзина' },
  { to: '/auth/login', label: 'Личный кабинет' },
]
</script>
