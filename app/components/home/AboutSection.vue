<template>
  <section class="py-20 md:py-28 bg-zinc-50 dark:bg-zinc-900/50 overflow-hidden">
    <div class="container-shop">
      <div class="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <!-- Images collage -->
        <div class="relative">
          <div class="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1582482703027-96c7e47c7b3d?w=400&q=80"
              alt="Флористы за работой"
              class="rounded-2xl aspect-square object-cover w-full"
              loading="lazy"
            />
            <img
              src="https://images.unsplash.com/photo-1545830678-b3a0f6e9a0b8?w=400&q=80"
              alt="Букет цветов"
              class="rounded-2xl aspect-square object-cover w-full mt-8"
              loading="lazy"
            />
          </div>
          <!-- Floating badge -->
          <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-900 rounded-2xl shadow-card border border-zinc-100 dark:border-zinc-800 px-5 py-3 text-center">
            <div class="text-2xl font-serif font-bold text-primary-600 dark:text-primary-400">6 лет</div>
            <div class="text-xs text-zinc-500 dark:text-zinc-400">делаем мир красивее</div>
          </div>
        </div>

        <!-- Text -->
        <div>
          <span class="text-primary-600 dark:text-primary-400 font-medium text-sm tracking-wider uppercase">
            О нас
          </span>
          <h2 class="text-3xl md:text-4xl font-serif font-semibold text-zinc-900 dark:text-zinc-100 mt-3 mb-6 leading-tight">
            Создаём красоту<br />с 2018 года
          </h2>
          <div class="space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <p>
              Floria — это команда профессиональных флористов, влюблённых в своё дело.
              Мы работаем с лучшими поставщиками из Нидерландов, Эквадора и Кении.
            </p>
            <p>
              Каждый букет — это диалог. Мы слушаем вас и создаём цветочные истории,
              которые передают нужные эмоции: любовь, благодарность, восхищение.
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4 mt-8">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="card p-4 text-center"
            >
              <div class="text-2xl font-serif font-bold text-primary-600 dark:text-primary-400">
                {{ stat.value }}
              </div>
              <div class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{{ stat.label }}</div>
            </div>
          </div>

          <NuxtLink to="/catalog" class="btn-primary mt-8 inline-flex">
            Выбрать букет
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const stats = [
  { value: '5000+', label: 'Счастливых клиентов' },
  { value: '200+', label: 'Видов букетов' },
  { value: '4.9/5', label: 'Средний рейтинг' },
  { value: '2 часа', label: 'Среднее время доставки' },
]
</script>
