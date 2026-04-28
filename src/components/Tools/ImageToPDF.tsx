import React, { useState, useCallback, useRef } from 'react'
import { Images, GripVertical, X, Plus, Download, FileText } from 'lucide-react'
import { saveAs } from 'file-saver'
import DragDropZone from '../Upload/DragDropZone'
import { useToast } from '../Toast'
import { formatFileSize, genId } from '../../utils/pdfUtils'
import { createImageThumbnail, imagesToPDF } from '../../utils/imageUtils'
import type { UploadedFile, ImageToPDFSettings, ProcessingState, PageSize, Orientation, Margin } from '../../types'

const DEFAULT_SETTINGS: ImageToPDFSettings = {
  pageSize: 'a4',
  orientation: 'portrait',
  margin: 'medium',
  compressionLevel: 'medium',
  outputFilename: 'nexpdfcox-merged.pdf',
}

const PAGE_SIZES: { id: PageSize; label: string }[] = [
  { id: 'a4', label: 'A4' },
  { id: 'letter', label: 'Letter' },
  { id: 'custom', label: 'Custom' },
]

const MARGINS: { id: Margin; label: string; desc: string }[] = [
  { id: 'none', label: 'None', desc: '0"' },
  { id: 'small', label: 'Small', desc: '0.25"' },
  { id: 'medium', label: 'Medium', desc: '0.5"' },
  { id: 'large', label: 'Large', desc: '1"' },
]

export default function ImageToPDF() {
  const { showToast } = useToast()
  const [files, setFiles] = useState<Array<UploadedFile & { thumb?: string }>>([])
  const [settings, setSettings] = useState<ImageToPDFSettings>(DEFAULT_SETTINGS)
  const [processing, setProcessing] = useState<ProcessingState>({ isProcessing: false, progress: 0, stage: '', error: null })
  const dragItem = useRef<number | null>(null)
  const dragOver = useRef<number | null>(null)

  const handleFiles = useCallback(async (dropped: File[]) => {
    const imgFiles = dropped.filter(f => /image\/(jpeg|png|webp|gif|bmp)/.test(f.type))
    if (!imgFiles.length) { showToast('error', 'Please upload image files (JPG, PNG, WebP, GIF).'); return }

    const newFiles = imgFiles.map(f => ({
      id: genId(), file: f, name: f.name, size: f.size, type: f.type,
    }))

    setFiles(prev => [...prev, ...newFiles])

    // Generate thumbnails
    for (const uf of newFiles) {
      createImageThumbnail(uf.file).then(thumb => {
        setFiles(prev => prev.map(f => f.id === uf.id ? { ...f, thumb } : f))
      })
    }

    showToast('info', `${imgFiles.length} image${imgFiles.length > 1 ? 's' : ''} added`)
  }, [showToast])

  const removeFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id))

  // Drag-to-reorder handlers
  const handleDragStart = (i: number) => { dragItem.current = i }
  const handleDragEnter = (i: number) => { dragOver.current = i }
  const handleDragEnd = () => {
    const from = dragItem.current
    const to = dragOver.current
    if (from === null || to === null || from === to) return
    setFiles(prev => {
      const arr = [...prev]
      const [item] = arr.splice(from, 1)
      arr.splice(to, 0, item)
      return arr
    })
    dragItem.current = null; dragOver.current = null
  }

  const handleCreate = async () => {
    if (!files.length) { showToast('warning', 'Please add at least one image.'); return }

    setProcessing({ isProcessing: true, progress: 5, stage: 'Initialising…', error: null })
    try {
      setProcessing(p => ({ ...p, stage: 'Building PDF…' }))
      const bytes = await imagesToPDF(files.map(f => f.file), settings, p => {
        setProcessing(prev => ({ ...prev, progress: p }))
      })

      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })
      saveAs(blob, settings.outputFilename || 'output.pdf')
      setProcessing({ isProcessing: false, progress: 100, stage: 'Done!', error: null })
      showToast('success', `PDF created with ${files.length} image${files.length > 1 ? 's' : ''}! Downloaded.`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'PDF creation failed'
      setProcessing({ isProcessing: false, progress: 0, stage: '', error: msg })
      showToast('error', `Failed: ${msg}`)
    }
  }

  const s = settings
  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(183,93,105,0.2), rgba(119,76,96,0.15))', border: '1px solid rgba(183,93,105,0.25)' }}>
          <Images className="w-5 h-5" style={{ color: '#B75D69' }} />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>
            Image to PDF
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Merge images into a single PDF document
          </p>
        </div>
      </div>

      {/* Upload */}
      <DragDropZone
        id="image-to-pdf-dropzone"
        accept={{ 'image/jpeg': [], 'image/png': [], 'image/webp': [], 'image/gif': [], 'image/bmp': [] }}
        onFiles={handleFiles}
        multiple
        label="Drag & drop images here"
        sublabel="JPG, PNG, WebP, GIF supported • drag to reorder"
      />

      {/* Image Grid + Reorder */}
      {files.length > 0 && (
        <div className="flex flex-col gap-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="section-label">{files.length} Image{files.length > 1 ? 's' : ''} · Drag to reorder</p>
            <button
              onClick={() => document.getElementById('image-to-pdf-dropzone')?.click()}
              className="btn-ghost text-xs"
              aria-label="Add more images"
            >
              <Plus className="w-3.5 h-3.5" /> Add More
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {files.map((uf, i) => (
              <div
                key={uf.id}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragEnter={() => handleDragEnter(i)}
                onDragEnd={handleDragEnd}
                className="image-thumb group"
                title={uf.name}
                aria-label={`Image ${i + 1}: ${uf.name}`}
              >
                {uf.thumb
                  ? <img src={uf.thumb} alt={uf.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(183,93,105,0.1)' }}><FileText className="w-5 h-5" style={{ color: '#B75D69' }} /></div>
                }
                {/* Order badge */}
                <div className="absolute top-1 left-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ background: 'rgba(55,37,73,0.85)', fontFamily: "'JetBrains Mono'" }}>{i + 1}</div>
                {/* Drag handle */}
                <div className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-3 h-3" style={{ color: '#EACDC2' }} />
                </div>
                <button className="remove-btn" onClick={() => removeFile(uf.id)} aria-label={`Remove ${uf.name}`}>
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          {/* Total size */}
          <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
            Total: {formatFileSize(files.reduce((a, f) => a + f.size, 0))}
          </p>
        </div>
      )}

      {/* Settings */}
      <div className="glass-card p-5 flex flex-col gap-5">
        <p className="section-label">PDF Settings</p>

        {/* Page Size */}
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)', fontFamily: "'Space Grotesk', sans-serif" }}>Page Size</p>
          <div className="flex gap-2">
            {PAGE_SIZES.map(ps => (
              <button key={ps.id} id={`page-size-${ps.id}`}
                onClick={() => setSettings(p => ({ ...p, pageSize: ps.id }))}
                className={`radio-option flex-1 justify-center text-sm ${s.pageSize === ps.id ? 'selected' : ''}`}>
                {ps.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orientation */}
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)', fontFamily: "'Space Grotesk', sans-serif" }}>Orientation</p>
          <div className="flex gap-2">
            {(['portrait', 'landscape'] as Orientation[]).map(o => (
              <button key={o} id={`orientation-${o}`}
                onClick={() => setSettings(p => ({ ...p, orientation: o }))}
                className={`radio-option flex-1 justify-center text-sm capitalize ${s.orientation === o ? 'selected' : ''}`}>
                {o}
              </button>
            ))}
          </div>
        </div>

        {/* Margins */}
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)', fontFamily: "'Space Grotesk', sans-serif" }}>Margins</p>
          <div className="grid grid-cols-4 gap-2">
            {MARGINS.map(m => (
              <button key={m.id} id={`margin-${m.id}`}
                onClick={() => setSettings(p => ({ ...p, margin: m.id }))}
                className={`comp-level-btn text-center items-center ${s.margin === m.id ? 'selected' : ''}`}>
                <span>{m.label}</span>
                <span className="text-[10px]" style={{ opacity: 0.65, fontFamily: "'JetBrains Mono'" }}>{m.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Output filename */}
        <div>
          <label htmlFor="output-filename" className="section-label">Output Filename</label>
          <input
            id="output-filename"
            type="text"
            className="input-field"
            value={s.outputFilename}
            onChange={e => setSettings(p => ({ ...p, outputFilename: e.target.value }))}
            placeholder="output.pdf"
          />
        </div>
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
        id="create-pdf-btn"
        onClick={handleCreate}
        disabled={processing.isProcessing || files.length === 0}
        className="btn-primary w-full py-4 text-base"
        aria-label="Create PDF from images"
      >
        {processing.isProcessing ? (
          <><span className="animate-spin-slow inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full" /> Creating PDF…</>
        ) : (
          <><Download className="w-5 h-5" /> Create & Download PDF</>
        )}
      </button>
    </div>
  )
}
