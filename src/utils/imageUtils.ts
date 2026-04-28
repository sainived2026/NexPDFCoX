// ============================================================
//  Image Utilities — image processing and PDF creation
// ============================================================

import { PDFDocument, PageSizes } from 'pdf-lib'
import type { ImageToPDFSettings, PageSize, Orientation } from '../types'

// ── Margin values in points (1 inch = 72pt) ─────────────────
const MARGIN_VALUES = { none: 0, small: 18, medium: 36, large: 72 }

// ── Page size in points ──────────────────────────────────────
function getPageDimensions(
  pageSize: PageSize,
  orientation: Orientation,
  customWidth?: number,
  customHeight?: number
): [number, number] {
  let w: number, h: number
  if (pageSize === 'custom' && customWidth && customHeight) {
    w = customWidth * 2.834645669 // mm to pt
    h = customHeight * 2.834645669
  } else if (pageSize === 'letter') {
    ;[w, h] = PageSizes.Letter
  } else {
    ;[w, h] = PageSizes.A4
  }
  return orientation === 'landscape' ? [Math.max(w, h), Math.min(w, h)] : [Math.min(w, h), Math.max(w, h)]
}

// ── Load image as HTMLImageElement ───────────────────────────
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// ── File → base64 data URL ───────────────────────────────────
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target!.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// ── Detect orientation from image dimensions ─────────────────
export async function detectImageOrientation(src: string): Promise<'portrait' | 'landscape'> {
  try {
    const img = await loadImage(src)
    return img.width > img.height ? 'landscape' : 'portrait'
  } catch {
    return 'portrait'
  }
}

// ── Scale image to fit within bounds, maintaining aspect ratio
function scaleToFit(imgW: number, imgH: number, maxW: number, maxH: number): [number, number] {
  const scale = Math.min(maxW / imgW, maxH / imgH)
  return [imgW * scale, imgH * scale]
}

// ── Convert images array to PDF blob ────────────────────────
export async function imagesToPDF(
  files: File[],
  settings: ImageToPDFSettings,
  onProgress?: (p: number) => void
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const [pageW, pageH] = getPageDimensions(
    settings.pageSize,
    settings.orientation,
    settings.customWidth,
    settings.customHeight
  )
  const margin = MARGIN_VALUES[settings.margin]
  const contentW = pageW - margin * 2
  const contentH = pageH - margin * 2

  for (let i = 0; i < files.length; i++) {
    onProgress?.(Math.round((i / files.length) * 90))

    const file = files[i]
    const dataUrl = await fileToDataUrl(file)
    const img = await loadImage(dataUrl)

    let pdfImg
    const mime = file.type.toLowerCase()
    if (mime === 'image/png') {
      pdfImg = await pdfDoc.embedPng(await file.arrayBuffer())
    } else {
      // Convert to JPEG via canvas for WebP, GIF, etc.
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)

      const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.9)
      const jpegRes = await fetch(jpegDataUrl)
      const jpegBytes = await jpegRes.arrayBuffer()
      pdfImg = await pdfDoc.embedJpg(jpegBytes)
    }

    const page = pdfDoc.addPage([pageW, pageH])
    const [drawW, drawH] = scaleToFit(img.naturalWidth, img.naturalHeight, contentW, contentH)
    const x = margin + (contentW - drawW) / 2
    const y = margin + (contentH - drawH) / 2

    page.drawImage(pdfImg, { x, y, width: drawW, height: drawH })
  }

  onProgress?.(95)
  const bytes = await pdfDoc.save()
  onProgress?.(100)
  return bytes
}

// ── Create thumbnail from image file ────────────────────────
export function createImageThumbnail(file: File, maxSize = 200): Promise<string> {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = e => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ratio = Math.min(maxSize / img.width, maxSize / img.height)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      }
      img.onerror = () => resolve('')
      img.src = e.target!.result as string
    }
    reader.onerror = () => resolve('')
    reader.readAsDataURL(file)
  })
}
