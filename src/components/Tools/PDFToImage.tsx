import React, { useState, useCallback } from 'react'
import { FileImage, Download, Settings, X, ChevronDown, ChevronUp } from 'lucide-react'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import DragDropZone from '../Upload/DragDropZone'
import { useToast } from '../Toast'
import { formatFileSize, genId } from '../../utils/pdfUtils'
import type { UploadedFile, OutputFormat, DPI, PDFToImageSettings, ProcessingState } from '../../types'

const FORMAT_OPTS: { id: OutputFormat; label: string; ext: string }[] = [
  { id: 'jpg', label: 'JPG', ext: '.jpg' },
  { id: 'png', label: 'PNG', ext: '.png' },
  { id: 'webp', label: 'WebP', ext: '.webp' },
]

const DPI_OPTS: DPI[] = [72, 150, 300]

const DEFAULT_SETTINGS: PDFToImageSettings = {
  format: 'jpg',
  quality: 85,
  dpi: 150,
  pageRange: '',
  allPages: true,
}

export default function PDFToImage() {
  const { showToast } = useToast()
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [settings, setSettings] = useState<PDFToImageSettings>(DEFAULT_SETTINGS)
  const [processing, setProcessing] = useState<ProcessingState>({ isProcessing: false, progress: 0, stage: '', error: null })
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({})

  const handleFiles = useCallback(async (dropped: File[]) => {
    const pdfFiles = dropped.filter(f => f.type === 'application/pdf')
    if (!pdfFiles.length) { showToast('error', 'Please upload PDF files only.'); return }

    const newFiles: UploadedFile[] = pdfFiles.map(f => ({
      id: genId(), file: f, name: f.name, size: f.size, type: f.type,
      error: f.size > 50 * 1024 * 1024 ? 'File exceeds 50MB limit' : undefined,
    }))

    setFiles(prev => [...prev, ...newFiles.filter(f => !f.error)])

    // Generate thumbnails
    const { getPDFThumbnail } = await import('../../utils/pdfUtils')
    for (const uf of newFiles) {
      if (!uf.error) {
        getPDFThumbnail(uf.file).then(thumb => {
          setThumbnails(prev => ({ ...prev, [uf.id]: thumb }))
        })
      }
    }

    const errors = newFiles.filter(f => f.error)
    if (errors.length) showToast('error', errors.map(f => `${f.name}: ${f.error}`).join('; '))
    else showToast('info', `${pdfFiles.length} PDF${pdfFiles.length > 1 ? 's' : ''} loaded`)
  }, [showToast])

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
    setThumbnails(prev => { const n = { ...prev }; delete n[id]; return n })
  }

  const handleConvert = async () => {
    if (!files.length) { showToast('warning', 'Please upload at least one PDF file.'); return }

    setProcessing({ isProcessing: true, progress: 0, stage: 'Loading libraries…', error: null })

    try {
      const { loadPDFDocument, renderPageToCanvas, canvasToBlob, parsePageRange } = await import('../../utils/pdfUtils')
      const zip = new JSZip()
      let totalDone = 0
      let totalPages = 0

      // Count total pages
      for (const uf of files) {
        const pdf = await loadPDFDocument(uf.file)
        const pages = settings.allPages ? pdf.numPages : parsePageRange(settings.pageRange, pdf.numPages).length
        totalPages += pages
      }

      setProcessing(p => ({ ...p, stage: 'Converting pages…' }))

      for (const uf of files) {
        const pdf = await loadPDFDocument(uf.file)
        const pages = settings.allPages
          ? Array.from({ length: pdf.numPages }, (_, i) => i + 1)
          : parsePageRange(settings.pageRange, pdf.numPages)

        const baseName = uf.name.replace(/\.pdf$/i, '')

        for (const pageNum of pages) {
          const canvas = await renderPageToCanvas(pdf, pageNum, settings.dpi)
          const blob = await canvasToBlob(canvas, settings.format, settings.quality)
          zip.file(`${baseName}_page${pageNum}${FORMAT_OPTS.find(f => f.id === settings.format)!.ext}`, blob)
          totalDone++
          setProcessing(p => ({ ...p, progress: Math.round((totalDone / totalPages) * 100) }))
        }
      }

      setProcessing(p => ({ ...p, stage: 'Packaging ZIP…', progress: 95 }))
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      saveAs(zipBlob, 'nexpdfcox-images.zip')
      setProcessing({ isProcessing: false, progress: 100, stage: 'Done!', error: null })
      showToast('success', `Converted ${totalPages} page${totalPages > 1 ? 's' : ''} successfully! ZIP downloaded.`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Conversion failed'
      setProcessing({ isProcessing: false, progress: 0, stage: '', error: msg })
      showToast('error', `Conversion failed: ${msg}`)
    }
  }

  const s = settings
  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(183,93,105,0.2), rgba(119,76,96,0.15))', border: '1px solid rgba(183,93,105,0.25)' }}>
          <FileImage className="w-5 h-5" style={{ color: '#B75D69' }} />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>
            PDF to Image
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Convert PDF pages to JPG, PNG, or WebP
          </p>
        </div>
      </div>

      {/* Upload */}
      <DragDropZone
        id="pdf-to-image-dropzone"
        accept={{ 'application/pdf': ['.pdf'] }}
        onFiles={handleFiles}
        multiple
        maxSize={50 * 1024 * 1024}
        label="Drag & drop PDF files here"
        sublabel="Supports multi-page PDFs up to 50MB each"
      />

      {/* File list */}
      {files.length > 0 && (
        <div className="flex flex-col gap-2 animate-fade-in">
          <p className="section-label">Loaded Files ({files.length})</p>
          <div className="flex flex-col gap-2">
            {files.map(uf => (
              <div key={uf.id} className="flex items-center gap-3 p-3 rounded-xl dark-transition"
                style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border-color)' }}>
                {thumbnails[uf.id] ? (
                  <img src={thumbnails[uf.id]} alt="PDF preview" className="w-10 h-12 object-cover rounded-lg" style={{ border: '1px solid rgba(183,93,105,0.2)' }} />
                ) : (
                  <div className="w-10 h-12 rounded-lg flex items-center justify-center" style={{ background: 'rgba(183,93,105,0.1)' }}>
                    <FileImage className="w-5 h-5" style={{ color: '#B75D69' }} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>{uf.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{formatFileSize(uf.size)}</p>
                </div>
                <button onClick={() => removeFile(uf.id)} aria-label={`Remove ${uf.name}`}
                  className="btn-ghost p-1.5 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Panel */}
      <div className="glass-card p-5 flex flex-col gap-5">
        <p className="section-label">Output Settings</p>

        {/* Format selector */}
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)', fontFamily: "'Space Grotesk', sans-serif" }}>Format</p>
          <div className="flex gap-2" role="radiogroup" aria-label="Output format">
            {FORMAT_OPTS.map(f => (
              <button
                key={f.id}
                role="radio"
                aria-checked={s.format === f.id}
                id={`format-${f.id}`}
                onClick={() => setSettings(p => ({ ...p, format: f.id }))}
                className={`radio-option flex-1 justify-center text-sm ${s.format === f.id ? 'selected' : ''}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* DPI */}
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)', fontFamily: "'Space Grotesk', sans-serif" }}>Resolution (DPI)</p>
          <div className="flex gap-2" role="radiogroup" aria-label="Output DPI">
            {DPI_OPTS.map(d => (
              <button
                key={d}
                role="radio"
                aria-checked={s.dpi === d}
                id={`dpi-${d}`}
                onClick={() => setSettings(p => ({ ...p, dpi: d as DPI }))}
                className={`radio-option flex-1 justify-center text-sm ${s.dpi === d ? 'selected' : ''}`}
              >
                {d} DPI
              </button>
            ))}
          </div>
        </div>

        {/* Quality (hidden for PNG) */}
        {s.format !== 'png' && (
          <div>
            <div className="flex justify-between mb-2">
              <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)', fontFamily: "'Space Grotesk', sans-serif" }}>Quality</p>
              <span className="text-xs font-semibold" style={{ color: '#B75D69', fontFamily: "'JetBrains Mono', monospace" }}>{s.quality}%</span>
            </div>
            <input
              type="range" min={10} max={100} step={5}
              value={s.quality}
              aria-label="Image quality"
              onChange={e => setSettings(p => ({ ...p, quality: Number(e.target.value) }))}
            />
          </div>
        )}

        {/* Advanced */}
        <button
          onClick={() => setShowAdvanced(p => !p)}
          className="flex items-center gap-2 text-xs font-semibold"
          style={{ color: 'var(--text-muted)', fontFamily: "'Space Grotesk', sans-serif" }}
          aria-expanded={showAdvanced}
        >
          <Settings className="w-3.5 h-3.5" />
          Advanced Options
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showAdvanced && (
          <div className="flex flex-col gap-3 animate-fade-in">
            <div className="divider" />
            <label className="flex items-center gap-3 cursor-pointer settings-toggle" htmlFor="all-pages-toggle">
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>Convert all pages</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Toggle to select specific page range</p>
              </div>
              <input type="checkbox" id="all-pages-toggle" checked={s.allPages}
                onChange={e => setSettings(p => ({ ...p, allPages: e.target.checked }))} />
            </label>

            {!s.allPages && (
              <div>
                <label className="section-label" htmlFor="page-range-input">Page Range</label>
                <input
                  id="page-range-input"
                  type="text"
                  className="input-field"
                  placeholder="e.g. 1-5, 8, 10-15"
                  value={s.pageRange}
                  onChange={e => setSettings(p => ({ ...p, pageRange: e.target.value }))}
                  aria-describedby="page-range-hint"
                />
                <p id="page-range-hint" className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
                  Separate pages with commas. Use dash for ranges.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress */}
      {processing.isProcessing && (
        <div className="flex flex-col gap-2 animate-fade-in">
          <div className="flex justify-between text-xs" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-secondary)' }}>
            <span>{processing.stage}</span>
            <span style={{ color: '#B75D69' }}>{processing.progress}%</span>
          </div>
          <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${processing.progress}%` }} /></div>
        </div>
      )}

      {/* CTA */}
      <button
        id="convert-pdf-to-image-btn"
        onClick={handleConvert}
        disabled={processing.isProcessing || files.length === 0}
        className="btn-primary w-full py-4 text-base"
        aria-label="Convert PDF to images"
      >
        {processing.isProcessing ? (
          <><span className="animate-spin-slow inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full" /> Converting…</>
        ) : (
          <><Download className="w-5 h-5" /> Convert & Download ZIP</>
        )}
      </button>
    </div>
  )
}
