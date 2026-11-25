// PROTOTYPE ONLY: makes Download buttons save something. The real app downloads the file from its URL.

function save(blob, name) {
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: name })
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

export async function fakeDownload(file) {
  try {
    if (file.url) return save(await (await fetch(file.url)).blob(), file.name)
  } catch {
    // image host unreachable → fall through to a placeholder file
  }
  save(new Blob([`Dummy file: ${file.name}`], { type: 'text/plain' }), file.name)
}

