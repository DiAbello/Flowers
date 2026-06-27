<template>
  <span class="badge" :class="variantClass">
    <slot />
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary'
  }>(),
  { variant: 'default' },
)

const variantClass = computed(() => {
  const map = {
    default: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
    primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  }
  return map[props.variant]
})
</script>
