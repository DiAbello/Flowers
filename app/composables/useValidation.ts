import { ref, computed } from 'vue'

type Rules<T> = {
  [K in keyof T]?: Array<(value: T[K]) => string | true>
}

export function useValidation<T extends Record<string, unknown>>(
  fields: T,
  rules: Rules<T>,
) {
  const errors = ref<Partial<Record<keyof T, string>>>({})
  const touched = ref<Partial<Record<keyof T, boolean>>>({})

  function validateField(key: keyof T): boolean {
    const fieldRules = rules[key] ?? []
    for (const rule of fieldRules) {
      const result = rule(fields[key] as T[typeof key])
      if (result !== true) {
        errors.value[key] = result
        return false
      }
    }
    delete errors.value[key]
    return true
  }

  function touch(key: keyof T) {
    touched.value[key] = true
    validateField(key)
  }

  function validate(): boolean {
    let valid = true
    for (const key of Object.keys(rules) as Array<keyof T>) {
      touched.value[key] = true
      if (!validateField(key)) valid = false
    }
    return valid
  }

  function reset() {
    errors.value = {}
    touched.value = {}
  }

  const hasErrors = computed(() => Object.keys(errors.value).length > 0)

  function setServerErrors(serverErrors: Record<string, string[]>) {
    for (const [key, messages] of Object.entries(serverErrors)) {
      (errors.value as Record<string, string>)[key] = messages[0]
    }
  }

  return { errors, touched, validate, touch, reset, hasErrors, setServerErrors }
}
