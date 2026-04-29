import React from 'react'
import { Heart, Shield, Zap, Github } from 'lucide-react'

import { ActiveTool } from '../types'

interface FooterProps {
  onToolChange: (tool: ActiveTool) => void
}

export default function Footer({ onToolChange }: FooterProps) {
  return (
    <footer className="w-full border-t dark-transition mt-auto" style={{ borderColor: 'var(--border-color)', background: 'var(--surface-card)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-bold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.03em' }}>
              <span style={{ color: 'var(--text-primary)' }}>Nex</span>
              <span style={{ color: '#B75D69' }}>PDF</span>
              <span style={{ color: '#774C60' }}>CoX</span>
            </span>
            <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>
              Free PDF tools. No signup. No server. Your files stay local.
            </p>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-5 text-xs" style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" style={{ color: '#B75D69' }} />
              <span>100% Client-Side</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" style={{ color: '#B75D69' }} />
              <span>No Registration</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" style={{ color: '#B75D69' }} />
              <span>Free Forever</span>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            <button onClick={() => onToolChange('about')} className="hover:underline" style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }}>About</button>
            <button onClick={() => onToolChange('privacy')} className="hover:underline" style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }}>Privacy</button>
            <button onClick={() => onToolChange('terms')} className="hover:underline" style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }}>Terms</button>
            <a href="https://github.com/sainived2026/NexPDFCoX" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1" style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }}>
              <Github className="w-3 h-3" /> GitHub
            </a>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t flex items-center justify-center text-xs text-center" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
          © {new Date().getFullYear()} NexPDFCoX · 100% Client-Side Processing · No files are ever uploaded
        </div>
      </div>
    </footer>
  )
}
