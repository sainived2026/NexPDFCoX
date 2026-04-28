import React from 'react'
import { Sun, Moon, FileText } from 'lucide-react'
import type { ActiveTool } from '../types'

interface HeaderProps {
  activeTool: ActiveTool
  onToolChange: (tool: ActiveTool) => void
  darkMode: boolean
  onToggleDark: () => void
}

const TOOLS: { id: ActiveTool; label: string; short: string }[] = [
  { id: 'pdf-to-image', label: 'PDF → Image',   short: 'PDF→IMG' },
  { id: 'image-to-pdf', label: 'Image → PDF',   short: 'IMG→PDF' },
  { id: 'compressor',   label: 'PDF Compressor', short: 'Compress' },
]

export default function Header({ activeTool, onToolChange, darkMode, onToggleDark }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full dark-transition" style={{ background: 'var(--surface-card)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #372549 0%, #1A1423 100%)' }}>
                <FileText className="w-4 h-4" style={{ color: '#B75D69' }} />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full flex items-center justify-center"
                style={{ background: '#B75D69' }}>
                <span className="text-white font-bold" style={{ fontSize: '7px', fontFamily: "'Space Grotesk', sans-serif" }}>X</span>
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-base tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.03em' }}>
                <span style={{ color: 'var(--text-primary)' }}>Nex</span>
                <span style={{ color: '#B75D69' }}>PDF</span>
                <span style={{ color: '#774C60' }}>CoX</span>
              </span>
              <span className="text-[9px] tracking-widest uppercase" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                PDF Tools Suite
              </span>
            </div>
          </div>

          {/* Tab Navigation — Desktop */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center" aria-label="PDF Tools Navigation">
            {TOOLS.map(tool => (
              <button
                key={tool.id}
                id={`tab-${tool.id}`}
                role="tab"
                aria-selected={activeTool === tool.id}
                onClick={() => onToolChange(tool.id)}
                className={`tab-item ${activeTool === tool.id ? 'active' : ''}`}
              >
                {tool.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onToggleDark}
              id="dark-mode-toggle"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 btn-ghost"
              style={{ border: '1px solid var(--border-color)' }}
            >
              {darkMode
                ? <Sun  className="w-4 h-4" style={{ color: '#EACDC2' }} />
                : <Moon className="w-4 h-4" style={{ color: '#774C60' }} />
              }
            </button>
          </div>
        </div>

        {/* Tab Navigation — Mobile */}
        <nav className="md:hidden flex items-center gap-1 pb-2 overflow-x-auto" aria-label="PDF Tools Navigation Mobile">
          {TOOLS.map(tool => (
            <button
              key={tool.id}
              id={`tab-mobile-${tool.id}`}
              role="tab"
              aria-selected={activeTool === tool.id}
              onClick={() => onToolChange(tool.id)}
              className={`tab-item flex-shrink-0 ${activeTool === tool.id ? 'active' : ''}`}
            >
              {tool.short}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
