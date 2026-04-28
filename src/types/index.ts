// ============================================================
//  NexPDFCoX — Global Type Definitions
// ============================================================

export type ActiveTool = 'pdf-to-image' | 'image-to-pdf' | 'compressor'

export type OutputFormat = 'jpg' | 'png' | 'webp'
export type DPI = 72 | 150 | 300
export type PageSize = 'a4' | 'letter' | 'custom'
export type Orientation = 'portrait' | 'landscape'
export type Margin = 'none' | 'small' | 'medium' | 'large'
export type CompressionLevel = 'light' | 'medium' | 'high' | 'maximum'

export interface UploadedFile {
  id: string
  file: File
  name: string
  size: number
  type: string
  preview?: string
  error?: string
}

export interface ConvertedImage {
  pageNumber: number
  dataUrl: string
  width: number
  height: number
  format: OutputFormat
}

export interface ProcessingState {
  isProcessing: boolean
  progress: number
  stage: string
  error: string | null
}

export interface PDFToImageSettings {
  format: OutputFormat
  quality: number
  dpi: DPI
  pageRange: string
  allPages: boolean
}

export interface ImageToPDFSettings {
  pageSize: PageSize
  orientation: Orientation
  margin: Margin
  compressionLevel: 'none' | 'medium' | 'high'
  customWidth?: number
  customHeight?: number
  outputFilename: string
}

export interface CompressionSettings {
  level: CompressionLevel
  removeMetadata: boolean
  removeFonts: boolean
}

export interface CompressionResult {
  originalSize: number
  compressedSize: number
  reduction: number
  dataBytes: Uint8Array
}

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

export interface AppPreferences {
  darkMode: boolean
  defaultFormat: OutputFormat
  defaultDPI: DPI
  defaultCompressionLevel: CompressionLevel
}
