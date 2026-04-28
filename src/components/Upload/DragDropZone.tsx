import React, { useCallback } from 'react'
import { useDropzone, type DropzoneOptions } from 'react-dropzone'
import { Upload, FolderOpen, AlertCircle } from 'lucide-react'

interface DragDropZoneProps {
  accept: DropzoneOptions['accept']
  onFiles: (files: File[]) => void
  multiple?: boolean
  maxSize?: number
  label?: string
  sublabel?: string
  disabled?: boolean
  icon?: React.ReactNode
  id?: string
}

export default function DragDropZone({
  accept, onFiles, multiple = false, maxSize, label, sublabel,
  disabled = false, icon, id = 'drop-zone'
}: DragDropZoneProps) {

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length) onFiles(accepted)
  }, [onFiles])

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop, accept, multiple, maxSize, disabled
  })

  const hasError = fileRejections.length > 0

  return (
    <div className="flex flex-col gap-3">
      <div
        {...getRootProps()}
        id={id}
        role="button"
        aria-label={label || 'Upload files'}
        tabIndex={0}
        className={`upload-zone ${isDragActive ? 'active' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} aria-label="File input" />

        {/* Animated upload icon */}
        <div className={`mb-4 flex items-center justify-center ${isDragActive ? 'animate-bounce' : 'animate-float'}`}>
          {icon || (
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(183,93,105,0.15), rgba(119,76,96,0.1))', border: '1px solid rgba(183,93,105,0.2)' }}>
              <Upload className="w-7 h-7" style={{ color: '#B75D69' }} />
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="font-semibold text-base mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>
            {isDragActive ? 'Drop files here…' : (label || 'Drag & drop files here')}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {sublabel || 'or'}
          </p>
          <button
            type="button"
            onClick={e => { e.stopPropagation() }}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{
              background: 'rgba(183,93,105,0.12)',
              color: '#B75D69',
              border: '1px solid rgba(183,93,105,0.3)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            <FolderOpen className="w-4 h-4" />
            Browse Files
          </button>
        </div>

        {maxSize && (
          <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
            Max size: {maxSize / (1024 * 1024)}MB
          </p>
        )}
      </div>

      {hasError && (
        <div className="flex items-start gap-2 p-3 rounded-xl text-sm animate-fade-in"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            {fileRejections.map(({ file, errors }) => (
              <div key={file.name}>
                <span className="font-medium">{file.name}:</span>{' '}
                {errors.map(e => e.message).join(', ')}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
