<script setup lang="ts">
import TheNavbar from "~/components/layout/TheNavbar.vue";
import TheFooter from "~/components/layout/TheFooter.vue";
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <TheNavbar />
    <main class="flex-1">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>
