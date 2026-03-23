export type ToastType = 'success' | 'error' | 'info'

export function showToast(message: string, type: ToastType = 'info') {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('webcraft:toast', { detail: { message, type } }))
}
