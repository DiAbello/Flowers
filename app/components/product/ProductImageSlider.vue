<template>
  <div class="space-y-3">
    <!-- Main image -->
    <div
      ref="sliderRef"
      class="relative overflow-hidden rounded-2xl aspect-[4/3] bg-zinc-100 dark:bg-zinc-800 cursor-zoom-in"
    >
      <img
        :src="images[currentIndex]"
        :alt="`${name} — фото ${currentIndex + 1}`"
        class="w-full h-full object-cover transition-opacity duration-300"
        loading="eager"
        @error="handleImgError"
      />

      <!-- Navigation arrows -->
      <div v-if="images.length > 1">
        <button
          class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          @click="prevImage"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          @click="nextImage"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Counter -->
      <div v-if="images.length > 1" class="absolute bottom-3 right-3 px-2.5 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">
        {{ currentIndex + 1 }} / {{ images.length }}
      </div>
    </div>

    <!-- Thumbnails -->
    <div v-if="images.length > 1" class="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
      <button
        v-for="(img, i) in images"
        :key="i"
        class="shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all"
        :class="i === currentIndex
          ? 'border-primary-500 shadow-glow'
          : 'border-transparent opacity-60 hover:opacity-100'"
        @click="currentIndex = i"
      >
        <img
          :src="img"
          :alt="`${name} — thumbnail ${i + 1}`"
          class="w-full h-full object-cover"
          loading="lazy"
          @error="handleImgError"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSwipe } from '@vueuse/core'

const props = defineProps<{ images: string[]; name: string }>()

const currentIndex = ref(0)
const sliderRef = ref<HTMLElement | null>(null)

useSwipe(sliderRef, {
  onSwipeEnd(_, direction) {
    if (direction === 'left') nextImage()
    if (direction === 'right') prevImage()
  },
})

function nextImage() {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

function prevImage() {
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}

function handleImgError(e: Event) {
  (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/flower/800/600'
}
</script>
