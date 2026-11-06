import { onBeforeUnmount, onMounted } from 'vue'

// Keyboard for email detail modals: Esc closes. Listens in the capture phase and stops ← → so the
// lab's version switcher doesn't react while a modal is open. While an image preview is open
// (isBusy() true), the preview handles the keys itself.
export function useModalKeys(close, isBusy = () => false) {
  function onKey(e) {
    if (isBusy()) return
    if (e.key === 'Escape') close()
    else if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return
    e.stopPropagation()
  }
  onMounted(() => window.addEventListener('keydown', onKey, true))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKey, true))
}
