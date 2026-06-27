<template>
  <div>
    <HomeHeroSection />
    <HomeFeaturesSection />
    <HomeFeaturedProducts />
    <HomeAboutSection />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Floria — Свежие цветы с доставкой',
  description:
    'Авторские букеты из свежих цветов с доставкой по городу. Розы, пионы, тюльпаны, орхидеи и эксклюзивные композиции на любой случай.',
  ogTitle: 'Floria — Свежие цветы с доставкой',
  ogDescription: 'Авторские букеты из свежих цветов. Доставка в день заказа.',
  ogImage: '/og-image.jpg',
})
</script>
