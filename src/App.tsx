import React, { useState, Suspense } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import { ToastProvider } from './components/Toast'
import { HorizontalAd, RectangleAd, VerticalAd, ResponsiveAd } from './components/AdUnits'
import { useDarkMode } from './hooks/useDarkMode'
import type { ActiveTool } from './types'

// Lazy-load heavy tool components
const PDFToImage   = React.lazy(() => import('./components/Tools/PDFToImage'))
const ImageToPDF   = React.lazy(() => import('./components/Tools/ImageToPDF'))
const PDFCompressor = React.lazy(() => import('./components/Tools/PDFCompressor'))

import { AboutPage, PrivacyPage, TermsPage } from './components/Pages/StaticPages'

function ToolSkeleton() {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      <div className="h-10 rounded-xl w-2/3" style={{ background: 'var(--surface-subtle)' }} />
      <div className="h-52 rounded-2xl" style={{ background: 'var(--surface-subtle)' }} />
      <div className="h-32 rounded-xl" style={{ background: 'var(--surface-subtle)' }} />
      <div className="h-12 rounded-xl" style={{ background: 'var(--surface-subtle)' }} />
    </div>
  )
}

function App() {
  const [activeTool, setActiveTool] = useState<ActiveTool>('pdf-to-image')
  const { darkMode, toggle } = useDarkMode()

  const handleToolChange = (tool: ActiveTool) => {
    setActiveTool(tool)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col dark-transition mesh-bg">
        
        {/* Header */}
        <Header
          activeTool={activeTool}
          onToolChange={handleToolChange}
          darkMode={darkMode}
          onToggleDark={toggle}
        />

        {/* Horizontal Ad — below header */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4">
          <HorizontalAd />
        </div>

        {/* Main Layout */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            
            {/* Tool Area */}
            <div className="flex-1 min-w-0">
              <div className="glass-card p-6 md:p-8">
                <Suspense fallback={<ToolSkeleton />}>
                  {activeTool === 'pdf-to-image'  && <PDFToImage />}
                  {activeTool === 'image-to-pdf'  && <ImageToPDF />}
                  {activeTool === 'compressor'    && <PDFCompressor />}
                  {activeTool === 'about'         && <AboutPage />}
                  {activeTool === 'privacy'       && <PrivacyPage />}
                  {activeTool === 'terms'         && <TermsPage />}
                </Suspense>
              </div>

              {/* In-content Rectangle Ad + Info */}
              <div className="mt-8 flex flex-col md:flex-row gap-6 items-start">
                <div className="flex justify-center w-full md:w-auto">
                  <RectangleAd />
                </div>
                <div className="flex-1 glass-card p-6">
                  <h2 className="text-lg font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>
                    Why NexPDFCoX?
                  </h2>
                  <ul className="flex flex-col gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {[
                      '🔒 100% client-side — files never leave your device',
                      '⚡ Instant processing — no server, no wait',
                      '🆓 Completely free — no registration required',
                      '📱 Mobile-friendly — works on any device',
                      '🗑️ Auto-deleted — privacy-first design',
                    ].map(item => (
                      <li key={item} className="flex items-start gap-2">
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Responsive Mobile Ad */}
              <div className="mt-6">
                <ResponsiveAd />
              </div>
            </div>

            {/* Right Sidebar — desktop only */}
            <aside className="hidden xl:flex flex-col gap-6 w-[300px] flex-shrink-0">
              <VerticalAd />
              {/* Tool tips card */}
              <div className="glass-card p-5">
                <h3 className="font-semibold text-sm mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>
                  💡 Pro Tips
                </h3>
                <div className="flex flex-col gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {activeTool === 'pdf-to-image' && <>
                    <p>📌 Use <strong style={{ color: '#B75D69' }}>300 DPI</strong> for print-quality images</p>
                    <p>📌 <strong style={{ color: '#B75D69' }}>WebP</strong> gives the smallest file size</p>
                    <p>📌 Specify page ranges like <code style={{ color: '#B75D69', fontFamily: "'JetBrains Mono'" }}>1-3,5,7-9</code></p>
                  </>}
                  {activeTool === 'image-to-pdf' && <>
                    <p>📌 Drag images in the grid to <strong style={{ color: '#B75D69' }}>reorder pages</strong></p>
                    <p>📌 Use <strong style={{ color: '#B75D69' }}>A4 landscape</strong> for wide images</p>
                    <p>📌 Set <strong style={{ color: '#B75D69' }}>no margin</strong> for edge-to-edge prints</p>
                  </>}
                  {activeTool === 'compressor' && <>
                    <p>📌 <strong style={{ color: '#B75D69' }}>Medium</strong> is ideal for sharing</p>
                    <p>📌 Enable <strong style={{ color: '#B75D69' }}>Strip metadata</strong> for privacy</p>
                    <p>📌 <strong style={{ color: '#B75D69' }}>Maximum</strong> best for email attachments</p>
                  </>}
                </div>
              </div>
            </aside>
          </div>
        </main>

        <Footer onToolChange={handleToolChange} />
      </div>
    </ToastProvider>
  )
}

export default App
