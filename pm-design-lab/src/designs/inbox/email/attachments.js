// Plain-JS helpers for email attachments (no Vue). Shared by EmailMessage and EmailAttachments.
//
// Attachment shape:
//   { id, name, size (bytes), url?, status? }
//   status: undefined (available) | 'expired' (removed after the retention period) | 'blocked' (failed the virus scan)

const IMAGE = /\.(jpe?g|png|gif|webp|heic)$/i

export const isImage = (a) => IMAGE.test(a.name)
export const isAvailable = (a) => !a.status

export function extension(name) {
  const ext = name.split('.').pop()
  return ext === name ? 'FILE' : ext.toUpperCase()
}

// File kind → icon tile colors in EmailAttachments
export function kind(name) {
  const ext = extension(name)
  if (ext === 'PDF') return 'pdf'
  if (['DOC', 'DOCX', 'TXT', 'RTF'].includes(ext)) return 'doc'
  if (['XLS', 'XLSX', 'CSV'].includes(ext)) return 'sheet'
  if (['ZIP', 'RAR', '7Z'].includes(ext)) return 'archive'
  if (IMAGE.test(name)) return 'image'
  return 'file'
}

export function formatSize(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`
}

export const STATUS_TEXT = {
  expired: 'No longer available',
  blocked: 'Blocked: may be unsafe',
}
