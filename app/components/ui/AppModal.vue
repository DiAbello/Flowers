<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="closeOnBackdrop && $emit('update:modelValue', false)"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        <!-- Modal -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="scale-95 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-95 opacity-0"
        >
          <div
            v-if="modelValue"
            class="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-card w-full border border-zinc-100 dark:border-zinc-800"
            :class="maxWidthClass"
          >
            <!-- Header -->
            <div v-if="title" class="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
              <h2 class="text-xl font-serif font-semibold text-zinc-900 dark:text-zinc-100">
                {{ title }}
              </h2>
              <button
                class="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                @click="$emit('update:modelValue', false)"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="p-6">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="px-6 pb-6">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useScrollLock } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    closeOnBackdrop?: boolean
  }>(),
  { maxWidth: 'md', closeOnBackdrop: true },
)

defineEmits<{ 'update:modelValue': [value: boolean] }>()

const maxWidthClass = computed(() => {
  const map = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }
  return map[props.maxWidth]
})

const isLocked = useScrollLock(document?.body ?? null)
watch(() => props.modelValue, (val) => { isLocked.value = val })
</script>
