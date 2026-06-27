<template>
  <section id="features" class="py-20 md:py-28 bg-zinc-50 dark:bg-zinc-900/50">
    <div class="container-shop">
      <div class="text-center mb-14">
        <h2 class="text-3xl md:text-4xl font-serif font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Почему выбирают нас
        </h2>
        <p class="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Мы создаём букеты с душой. Каждый цветок — тщательно отобран, каждый букет — упакован с заботой.
        </p>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <div
          v-for="(feature, i) in features"
          :key="feature.title"
          class="card p-6 text-center group hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300"
          :style="`animation-delay: ${i * 0.1}s`"
        >
          <div class="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            {{ feature.icon }}
          </div>
          <h3 class="font-serif font-semibold text-zinc-900 dark:text-zinc-100 mb-2 text-lg">
            {{ feature.title }}
          </h3>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const features = [
  {
    icon: '🚚',
    title: 'Доставка в день',
    description: 'При заказе до 14:00 доставим в тот же день. Работаем по всему городу.',
  },
  {
    icon: '🌿',
    title: 'Только свежее',
    description: 'Цветы поступают напрямую с плантаций. Гарантируем свежесть каждого букета.',
  },
  {
    icon: '🎨',
    title: 'Авторский дизайн',
    description: 'Каждый букет — это произведение искусства, созданное с любовью и вкусом.',
  },
  {
    icon: '💝',
    title: 'Красивая упаковка',
    description: 'Фирменная упаковка и открытка с пожеланиями в подарок к каждому заказу.',
  },
]
</script>
