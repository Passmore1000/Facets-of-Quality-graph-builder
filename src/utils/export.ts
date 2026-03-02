/**
 * Exports the SVG element with the given id as an SVG file download.
 */
export function exportSVG(svgId: string, filename: string) {
  const el = document.getElementById(svgId) as SVGSVGElement | null
  if (!el) return

  const serializer = new XMLSerializer()
  const svgStr = serializer.serializeToString(el)
  const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
  triggerDownload(URL.createObjectURL(blob), `${filename}.svg`)
}

/**
 * Exports the SVG element with the given id as a PNG file download.
 */
export function exportPNG(svgId: string, filename: string, scale = 2) {
  const el = document.getElementById(svgId) as SVGSVGElement | null
  if (!el) return

  const { width, height } = el.getBoundingClientRect()
  const serializer = new XMLSerializer()
  const svgStr = serializer.serializeToString(el)

  const img = new Image()
  const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)

  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = width * scale
    canvas.height = height * scale
    const ctx = canvas.getContext('2d')!
    ctx.scale(scale, scale)

    // White background
    ctx.fillStyle = '#f0f2f5'
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(img, 0, 0, width, height)

    URL.revokeObjectURL(url)
    canvas.toBlob((blob) => {
      if (blob) triggerDownload(URL.createObjectURL(blob), `${filename}.png`)
    }, 'image/png')
  }

  img.src = url
}

function triggerDownload(href: string, filename: string) {
  const a = document.createElement('a')
  a.href = href
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
