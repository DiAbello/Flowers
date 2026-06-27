<template>
  <AppModal
    v-model="modelValue"
    :title="isEdit ? 'Редактировать товар' : 'Новый товар'"
    max-width="lg"
    :close-on-backdrop="false"
  >
    <form class="space-y-5" @submit.prevent="handleSubmit">
      <div class="grid sm:grid-cols-2 gap-5">
        <AppInput
          v-model="form.name"
          label="Название"
          placeholder="Букет «Нежность»"
          required
          :error="errors.name"
          @blur="touch('name')"
          @input="autoSlug"
        />
        <AppInput
          v-model="form.slug"
          label="Slug (URL)"
          placeholder="neznost"
          required
          :error="errors.slug"
          @blur="touch('slug')"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
          Описание *
        </label>
        <textarea
          v-model="form.description"
          rows="4"
          placeholder="Описание букета..."
          class="input-base resize-none"
          :class="{ 'input-error': errors.description }"
          @blur="touch('description')"
        />
        <p v-if="errors.description" class="mt-1.5 text-xs text-red-500">{{ errors.description }}</p>
      </div>

      <div class="grid sm:grid-cols-2 gap-5">
        <AppInput
          v-model.number="form.price"
          label="Цена (₽)"
          type="number"
          placeholder="2500"
          required
          :error="errors.price"
          @blur="touch('price')"
        />
        <AppInput
          v-model.number="form.stock"
          label="Количество на складе"
          type="number"
          placeholder="10"
          required
          :error="errors.stock"
          @blur="touch('stock')"
        />
      </div>

      <!-- Images URLs -->
      <div>
        <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
          Фотографии (URL)
        </label>
        <div class="space-y-2">
          <div
            v-for="(_, i) in form.images"
            :key="i"
            class="flex gap-2"
          >
            <input
              v-model="form.images[i]"
              type="url"
              :placeholder="`URL фото ${i + 1}`"
              class="input-base flex-1"
            />
            <button
              v-if="form.images.length > 1"
              type="button"
              class="p-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              @click="removeImage(i)"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <p v-if="errors.images" class="mt-1.5 text-xs text-red-500">{{ errors.images }}</p>
        <button
          type="button"
          class="mt-2 btn-ghost text-sm"
          @click="form.images.push('')"
        >
          + Добавить фото
        </button>

        <!-- Preview -->
        <div v-if="validImages.length" class="flex gap-2 mt-3 overflow-x-auto pb-1">
          <img
            v-for="(img, i) in validImages"
            :key="i"
            :src="img"
            class="w-16 h-16 rounded-lg object-cover shrink-0 border border-zinc-200 dark:border-zinc-700"
            loading="lazy"
            @error="handleImgError"
          />
        </div>
      </div>

      <!-- Active toggle -->
      <div class="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          :aria-checked="form.isActive"
          class="relative w-11 h-6 rounded-full transition-colors"
          :class="form.isActive ? 'bg-primary-600' : 'bg-zinc-300 dark:bg-zinc-700'"
          @click="form.isActive = !form.isActive"
        >
          <span
            class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform"
            :class="form.isActive ? 'translate-x-5' : 'translate-x-0'"
          />
        </button>
        <label class="text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer" @click="form.isActive = !form.isActive">
          Товар активен
        </label>
      </div>

      <div v-if="serverError" class="rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3">
        {{ serverError }}
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <button type="button" class="btn-secondary" @click="$emit('update:modelValue', false)">
          Отмена
        </button>
        <button type="submit" class="btn-primary" :disabled="saving">
          <AppSpinner v-if="saving" size="sm" />
          {{ saving ? 'Сохраняем...' : (isEdit ? 'Сохранить' : 'Создать') }}
        </button>
      </div>
    </form>
  </AppModal>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/stores/products'
import { slugify } from '~/types'
import type { Product } from '~/types'
import AppInput from "~/components/ui/AppInput.vue";
import AppModal from "~/components/ui/AppModal.vue";

const props = defineProps<{
  modelValue: boolean
  product?: Product | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: [product: Product]
}>()

const modelValue = useVModel(props, 'modelValue', emit)
const productsStore = useProductsStore()
const notify = useNotify()

const saving = ref(false)
const serverError = ref('')
const isEdit = computed(() => !!props.product)

const form = reactive({
  name: '',
  slug: '',
  description: '',
  price: 0,
  stock: 0,
  images: [''],
  isActive: true,
})

watch(
  () => props.product,
  (p) => {
    if (p) {
      form.name = p.name
      form.slug = p.slug
      form.description = p.description
      form.price = Number(p.price)
      form.stock = p.stock
      form.images = [...p.images]
      form.isActive = p.isActive
    } else {
      form.name = ''
      form.slug = ''
      form.description = ''
      form.price = 0
      form.stock = 0
      form.images = ['']
      form.isActive = true
    }
    serverError.value = ''
  },
  { immediate: true },
)

const { errors, validate, touch } = useValidation(form, {
  name: [(v) => !!v || 'Введите название', (v) => (v as string).length >= 2 || 'Минимум 2 символа'],
  slug: [
    (v) => !!v || 'Введите slug',
    (v) => /^[a-z0-9-]+$/.test(v as string) || 'Только латинские буквы, цифры и дефис',
  ],
  description: [(v) => !!v || 'Введите описание', (v) => (v as string).length >= 10 || 'Минимум 10 символов'],
  price: [(v) => (v as number) > 0 || 'Цена должна быть больше 0'],
  stock: [(v) => (v as number) >= 0 || 'Количество не может быть отрицательным'],
})

const validImages = computed(() => form.images.filter((u) => u.startsWith('http')))

function autoSlug() {
  if (!isEdit.value) {
    form.slug = slugify(form.name)
  }
}

function removeImage(i: number) {
  form.images.splice(i, 1)
}

function handleImgError(e: Event) {
  (e.target as HTMLImageElement).style.display = 'none'
}

async function handleSubmit() {
  if (!validate()) return
  serverError.value = ''

  const filteredImages = form.images.filter((u) => u.trim().startsWith('http'))
  if (!filteredImages.length) {
    serverError.value = 'Добавьте хотя бы одно фото'
    return
  }

  saving.value = true
  try {
    let product: Product
    if (isEdit.value && props.product) {
      product = await productsStore.updateProduct(props.product.id, {
        ...form,
        images: filteredImages,
      })
    } else {
      product = await productsStore.createProduct({
        ...form,
        images: filteredImages,
      })
    }
    emit('saved', product)
    emit('update:modelValue', false)
    notify.success(isEdit.value ? 'Товар обновлён' : 'Товар создан')
  } catch (e: unknown) {
    const error = e as { statusMessage?: string }
    serverError.value = error.statusMessage || 'Ошибка при сохранении'
  } finally {
    saving.value = false
  }
}
</script>
