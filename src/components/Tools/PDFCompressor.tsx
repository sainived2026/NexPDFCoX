import React, { useState, useCallback } from 'react'
import { Minimize2, Download, FileText, ArrowDown } from 'lucide-react'
import { saveAs } from 'file-saver'
import DragDropZone from '../Upload/DragDropZone'
import { useToast } from '../Toast'
import { formatFileSize, getPDFThumbnail, genId } from '../../utils/pdfUtils'
import type { UploadedFile, CompressionLevel, CompressionSettings, ProcessingState } from '../../types'

const LEVELS: { id: CompressionLevel; label: string; desc: string; est: string; color: string }[] = [
  { id: 'light',   label: '☁ Light',   desc: 'Best quality',   est: '~15% smaller', color: '#10b981' },
  { id: 'medium',  label: '⚖ Medium',  desc: 'Balanced',       est: '~40% smaller', color: '#f59e0b' },
  { id: 'high',    label: '🔥 High',    desc: 'Smaller file',   est: '~65% smaller', color: '#ef4444' },
  { id: 'maximum', label: '⚡ Max',    desc: 'Extreme',         est: '~85% smaller', color: '#8b5cf6' },
]

const DEFAULT_SETTINGS: CompressionSettings = {
  level: 'medium',
  removeMetadata: true,
  removeFonts: false,
}

export default function PDFCompressor() {
  const { showToast } = useToast()
  const [file, setFile] = useState<(UploadedFile & { thumb?: string }) | null>(null)
  const [settings, setSettings] = useState<CompressionSettings>(DEFAULT_SETTINGS)
  const [processing, setProcessing] = useState<ProcessingState>({ isProcessing: false, progress: 0, stage: '', error: null })
  const [result, setResult] = useState<{ compressedSize: number; reduction: number; dataBytes: Uint8Array } | null>(null)

  const handleFile = useCallback(async (dropped: File[]) => {
    const f = dropped[0]
    if (!f || f.type !== 'application/pdf') { showToast('error', 'Please upload a PDF file.'); return }
    if (f.size > 100 * 1024 * 1024) { showToast('error', 'File exceeds 100MB limit.'); return }

    const id = genId()
    const uf: UploadedFile & { thumb?: string } = { id, file: f, name: f.name, size: f.size, type: f.type }
    setFile(uf)
    setResult(null)

    getPDFThumbnail(f).then(thumb => setFile(prev => prev ? { ...prev, thumb } : null))
    showToast('info', `Loaded: ${f.name} (${formatFileSize(f.size)})`)
  }, [showToast])

  const handleCompress = async () => {
    if (!file) { showToast('warning', 'Please upload a PDF file first.'); return }

    setProcessing({ isProcessing: true, progress: 0, stage: 'Initialising compressor…', error: null })
    setResult(null)

    try {
      setProcessing(p => ({ ...p, stage: 'Analysing PDF structure…' }))
      const { compressPDF } = await import('../../utils/pdfUtils')
      const res = await compressPDF(file.file, settings.level, settings.removeMetadata, settings.removeFonts, p => {
        setProcessing(prev => ({ ...prev, progress: p, stage: p < 50 ? 'Analysing PDF…' : p < 80 ? 'Compressing…' : 'Finalising…' }))
      })

      setResult({ compressedSize: res.compressedSize, reduction: res.reduction, dataBytes: res.dataBytes })
      setProcessing({ isProcessing: false, progress: 100, stage: 'Done!', error: null })
      showToast('success', `PDF compressed! ${res.reduction}% smaller — from ${formatFileSize(res.originalSize)} to ${formatFileSize(res.compressedSize)}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Compression failed'
      setProcessing({ isProcessing: false, progress: 0, stage: '', error: msg })
      showToast('error', `Compression failed: ${msg}`)
    }
  }

  const handleDownload = () => {
    if (!result || !file) return
    const blob = new Blob([result.dataBytes], { type: 'application/pdf' })
    const name = file.name.replace(/\.pdf$/i, '-compressed.pdf')
    saveAs(blob, name)
    showToast('success', 'Compressed PDF downloaded!')
  }

  const s = settings
  const currentLevel = LEVELS.find(l => l.id === s.level)

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(183,93,105,0.2), rgba(119,76,96,0.15))', border: '1px solid rgba(183,93,105,0.25)' }}>
          <Minimize2 className="w-5 h-5" style={{ color: '#B75D69' }} />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>
            PDF Compressor
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Reduce PDF file size up to 85%
          </p>
        </div>
      </div>

      {/* Upload */}
      <DragDropZone
        id="compressor-dropzone"
        accept={{ 'application/pdf': ['.pdf'] }}
        onFiles={handleFile}
        multiple={false}
        maxSize={100 * 1024 * 1024}
        label="Drag & drop a PDF to compress"
        sublabel="Up to 100MB supported"
      />

      {/* File info */}
      {file && (
        <div className="flex items-center gap-4 p-4 rounded-xl animate-fade-in"
          style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border-color)' }}>
          {file.thumb ? (
            <img src={file.thumb} alt="PDF preview" className="w-12 h-14 object-cover rounded-lg" style={{ border: '1px solid rgba(183,93,105,0.2)' }} />
          ) : (
            <div className="w-12 h-14 rounded-lg flex items-center justify-center" style={{ background: 'rgba(183,93,105,0.1)' }}>
              <FileText className="w-6 h-6" style={{ color: '#B75D69' }} />
            </div>
          )}
          <div className="flex-1">
            <p className="font-semibold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>{file.name}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Original size: <strong style={{ color: '#B75D69' }}>{formatFileSize(file.size)}</strong></p>
          </div>
          {result && (
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#10b981' }}>
                -{result.reduction}%
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {formatFileSize(result.compressedSize)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Before / After Stats */}
      {result && file && (
        <div className="grid grid-cols-2 gap-3 animate-slide-up">
          <div className="stat-card">
            <p className="section-label">Original</p>
            <p className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>{formatFileSize(file.size)}</p>
          </div>
          <div className="stat-card" style={{ borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.05)' }}>
            <p className="section-label" style={{ color: '#10b981' }}>Compressed</p>
            <p className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#10b981' }}>{formatFileSize(result.compressedSize)}</p>
          </div>
        </div>
      )}

      {/* Compression Level Selector */}
      <div className="glass-card p-5 flex flex-col gap-5">
        <p className="section-label">Compression Level</p>
        <div className="grid grid-cols-2 gap-2">
          {LEVELS.map(l => (
            <button
              key={l.id}
              id={`compression-level-${l.id}`}
              onClick={() => setSettings(p => ({ ...p, level: l.id }))}
              className={`comp-level-btn ${s.level === l.id ? 'selected' : ''}`}
              aria-pressed={s.level === l.id}
            >
              <span className="text-sm">{l.label}</span>
              <span className="text-xs" style={{ color: s.level === l.id ? '#B75D69' : 'var(--text-muted)', fontFamily: "'DM Sans'" }}>{l.desc}</span>
              <span className="badge badge-rose text-[10px] self-start">{l.est}</span>
            </button>
          ))}
        </div>

        {/* Advanced options */}
        <div className="divider" />
        <p className="section-label">Advanced Options</p>

        <label className="flex items-center gap-3 cursor-pointer settings-toggle" htmlFor="remove-metadata">
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>Strip metadata</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Removes author, creation date, title (privacy)</p>
          </div>
          <input type="checkbox" id="remove-metadata" checked={s.removeMetadata}
            onChange={e => setSettings(p => ({ ...p, removeMetadata: e.target.checked }))} />
        </label>

        <label className="flex items-center gap-3 cursor-pointer settings-toggle" htmlFor="remove-fonts">
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>Remove embedded fonts</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Reduces size — may change text appearance</p>
          </div>
          <input type="checkbox" id="remove-fonts" checked={s.removeFonts}
            onChange={e => setSettings(p => ({ ...p, removeFonts: e.target.checked }))} />
        </label>
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

      {/* Buttons */}
      <div className="flex flex-col gap-3">
        <button
          id="compress-pdf-btn"
          onClick={handleCompress}
          disabled={processing.isProcessing || !file}
          className="btn-primary w-full py-4 text-base"
          aria-label="Compress PDF"
        >
          {processing.isProcessing ? (
            <><span className="animate-spin-slow inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full" /> Compressing…</>
          ) : (
            <><Minimize2 className="w-5 h-5" /> Compress PDF {currentLevel && <span className="badge badge-blush ml-1">{currentLevel.est}</span>}</>
          )}
        </button>

        {result && (
          <button
            id="download-compressed-btn"
            onClick={handleDownload}
            className="btn-secondary w-full py-3 animate-fade-in"
            aria-label="Download compressed PDF"
            style={{ borderColor: 'rgba(16,185,129,0.4)', color: '#10b981', background: 'rgba(16,185,129,0.06)' }}
          >
            <Download className="w-4 h-4" />
            Download Compressed PDF ({formatFileSize(result.compressedSize)})
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
