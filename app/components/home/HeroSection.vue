<template>
  <section class="relative min-h-[90vh] flex items-center overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0">
      <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
    </div>

    <!-- Content -->
    <div class="relative container-shop py-20">
      <div class="max-w-xl text-white">

        <!-- Badge -->
        <div
          class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-6 border border-white/20 transition-[opacity,transform] duration-500 ease-out"
          :class="revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
          :style="revealed ? { transitionDelay: '0ms' } : {}"
        >
          <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Свежие цветы в наличии
        </div>

        <!-- Heading -->
        <h1
          class="font-serif text-5xl sm:text-6xl md:text-7xl font-semibold leading-tight mb-6 transition-[opacity,transform] duration-500 ease-out"
          :class="revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
          :style="revealed ? { transitionDelay: '80ms' } : {}"
        >
          Цветы, которые
          <span class="text-primary-300">говорят</span>
          за вас
        </h1>

        <!-- Description -->
        <p
          class="text-lg text-white/80 leading-relaxed mb-8 transition-[opacity,transform] duration-500 ease-out"
          :class="revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
          :style="revealed ? { transitionDelay: '160ms' } : {}"
        >
          Авторские букеты из самых свежих цветов. Создаём эмоции, дарим радость.
          Доставка в день заказа.
        </p>

        <!-- CTA buttons -->
        <div
          class="flex flex-col sm:flex-row gap-4 transition-[opacity,transform] duration-500 ease-out"
          :class="revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
          :style="revealed ? { transitionDelay: '240ms' } : {}"
        >
          <NuxtLink to="/catalog" class="btn-primary text-base px-8 py-4 shadow-glow">
            Перейти в каталог
          </NuxtLink>
          <button
            class="inline-flex items-center gap-3 px-6 py-4 text-white border border-white/30 rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm"
            @click="scrollToSection"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Узнать больше
          </button>
        </div>

        <!-- Stats -->
        <div
          class="flex gap-8 mt-12 pt-8 border-t border-white/20 transition-[opacity,transform] duration-500 ease-out"
          :class="revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
          :style="revealed ? { transitionDelay: '320ms' } : {}"
        >
          <div v-for="stat in stats" :key="stat.label">
            <div class="text-3xl font-serif font-bold text-primary-300">{{ stat.value }}</div>
            <div class="text-sm text-white/60 mt-0.5">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
      <svg class="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
const revealed = ref(false)

onMounted(() => {
  // Ждём завершения page-transition (250ms) перед запуском hero-анимаций,
  // чтобы исключить конфликт двух одновременных трансформаций.
  setTimeout(() => { revealed.value = true }, 260)
})

// При размонтировании сбрасываем флаг, чтобы при возврате анимация прошла снова
onUnmounted(() => { revealed.value = false })

const stats = [
  { value: '5000+', label: 'Букетов создано' },
  { value: '4.9★', label: 'Средний рейтинг' },
  { value: '2 ч', label: 'Доставка' },
]

function scrollToSection() {
  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
}
</script>
