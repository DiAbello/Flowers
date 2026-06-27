<template>
  <div>
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>

    <div class="relative">
      <div
        v-if="$slots.prefix"
        class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
      >
        <slot name="prefix" />
      </div>

      <input
        :id="inputId"
        v-bind="$attrs"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="autocomplete"
        class="input-base"
        :class="[
          error ? 'input-error' : '',
          $slots.prefix ? 'pl-10' : '',
          type === 'password' ? 'pr-10' : '',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
      />

      <!-- Password toggle -->
      <button
        v-if="type === 'password'"
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        @click="showPassword = !showPassword"
      >
        <svg v-if="showPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
        <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>
    </div>

    <Transition enter-active-class="transition duration-150" enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0">
      <p v-if="error" class="mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
        <svg class="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        {{ error }}
      </p>
    </Transition>

    <p v-if="hint && !error" class="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    type?: string
    placeholder?: string
    error?: string
    hint?: string
    disabled?: boolean
    required?: boolean
    autocomplete?: string
  }>(),
  { type: 'text' },
)

defineEmits<{
  'update:modelValue': [value: string]
  blur: []
  focus: []
}>()

const showPassword = ref(false)
const inputId = `input-${Math.random().toString(36).slice(2)}`

const inputType = computed(() => {
  if (props.type === 'password') return showPassword.value ? 'text' : 'password'
  return props.type
})
</script>
