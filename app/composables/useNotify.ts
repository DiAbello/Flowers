import { useNotificationsStore } from '~/stores/notifications'

export function useNotify() {
  const store = useNotificationsStore()
  return {
    success: store.success.bind(store),
    error: store.error.bind(store),
    warning: store.warning.bind(store),
    info: store.info.bind(store),
  }
}
