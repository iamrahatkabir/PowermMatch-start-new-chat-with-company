'use client'
/**
 * Full-screen image preview for email images. ← → to browse, Esc to close.
 *
 * Props:     images [{ id, name, size, url }], index (the image shown)
 * Callbacks: onClose() · onDownload(image) · onIndexChange(i)
 */
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, Download, X } from 'lucide-react'
import { formatSize } from './attachments'

export function ImagePreview({ images, index = 0, onClose, onDownload, onIndexChange }) {
  const go = (step) => onIndexChange?.((index + step + images.length) % images.length)

  // Latest props for the key listener added on mount
  const latest = useRef({ go, onClose })
  latest.current = { go, onClose }

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') latest.current.onClose?.()
      else if (e.key === 'ArrowRight') latest.current.go(1)
      else if (e.key === 'ArrowLeft') latest.current.go(-1)
      else return
      e.stopPropagation()
    }
    // Capture phase so the lab's ← → version switcher doesn't react while the preview is open
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [])

  const close = (e) => { if (e.target === e.currentTarget) onClose?.() }

  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-900/90" onClick={close}>
      <div className="flex items-center gap-3 px-6 py-4 text-sm text-white">
        <span className="min-w-0 truncate font-medium">{images[index].name}</span>
        <span className="shrink-0 text-gray-300">{formatSize(images[index].size)} • {index + 1} of {images.length}</span>
        <button type="button" className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-2 font-medium hover:bg-white/10" onClick={() => onDownload?.(images[index])}>
          <Download size={16} />Download
        </button>
        <button type="button" className="flex size-9 items-center justify-center rounded-lg hover:bg-white/10" title="Close" onClick={() => onClose?.()}><X size={20} /></button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-20 pb-10" onClick={close}>
        <img src={images[index].url} alt={images[index].name} className="max-h-full max-w-full rounded-lg object-contain" />
        {images.length > 1 && (
          <>
            <button type="button" className="absolute left-6 flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20" title="Previous" onClick={() => go(-1)}><ChevronLeft size={22} /></button>
            <button type="button" className="absolute right-6 flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20" title="Next" onClick={() => go(1)}><ChevronRight size={22} /></button>
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}
