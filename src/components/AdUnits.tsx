// ── AdUnits.tsx ──────────────────────────────────────────────
// Google AdSense — all IDs sourced from .env variables
// Publisher ID  : VITE_ADSENSE_PUBLISHER_ID
// Slot IDs      : VITE_AD_SLOT_HORIZONTAL / RECTANGLE / VERTICAL / RESPONSIVE
// ────────────────────────────────────────────────────────────
import { useEffect, useRef } from 'react'

// Read from Vite env — configure in your .env file
const PUBLISHER_ID = import.meta.env.VITE_ADSENSE_PUBLISHER_ID ?? 'pub-7050860488978143'
const SLOT_HORIZONTAL = import.meta.env.VITE_AD_SLOT_HORIZONTAL ?? ''
const SLOT_RECTANGLE  = import.meta.env.VITE_AD_SLOT_RECTANGLE  ?? ''
const SLOT_VERTICAL   = import.meta.env.VITE_AD_SLOT_VERTICAL   ?? ''
const SLOT_RESPONSIVE = import.meta.env.VITE_AD_SLOT_RESPONSIVE ?? ''

// Declare global adsbygoogle for TypeScript
declare global {
  interface Window {
    adsbygoogle?: object[]
  }
}

interface AdUnitProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal'
  className?: string
  label?: string
  style?: React.CSSProperties
}

function AdUnit({ slot, format = 'auto', className = '', label = 'Advertisement', style }: AdUnitProps) {
  const pushed = useRef(false)

  useEffect(() => {
    // Only push once per mount, and only when slot ID is configured
    if (pushed.current || !slot || slot.startsWith('YOUR_')) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      pushed.current = true
    } catch (e) {
      console.warn('[NexPDFCoX] AdSense push failed:', e)
    }
  }, [slot])

  // Show placeholder in dev when slot ID not configured
  if (!slot || slot.startsWith('YOUR_')) {
    return (
      <div className={`ad-unit ${className}`} style={style} aria-label={label} aria-hidden="true">
        <span style={{ opacity: 0.5, letterSpacing: '0.08em' }}>AD · {format.toUpperCase()}</span>
      </div>
    )
  }

  return (
    <div className={`ad-unit overflow-hidden ${className}`} style={style} aria-label={label}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%' }}
        data-ad-client={`ca-${PUBLISHER_ID}`}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}

// ── Horizontal banner (728×90) — below header ────────────────
export function HorizontalAd() {
  return (
    <AdUnit
      slot={SLOT_HORIZONTAL}
      format="horizontal"
      label="Horizontal advertisement"
      className="w-full"
      style={{ minHeight: '90px' }}
    />
  )
}

// ── Rectangle (300×250) — in-content ────────────────────────
export function RectangleAd() {
  return (
    <AdUnit
      slot={SLOT_RECTANGLE}
      format="rectangle"
      label="Rectangle advertisement"
      style={{ width: '300px', height: '250px', minWidth: '300px' }}
    />
  )
}

// ── Vertical banner (300×600) — right sidebar ────────────────
export function VerticalAd() {
  return (
    <AdUnit
      slot={SLOT_VERTICAL}
      format="vertical"
      label="Vertical advertisement"
      className="hidden xl:flex"
      style={{ width: '300px', minHeight: '600px' }}
    />
  )
}

// ── Responsive ad — mobile ───────────────────────────────────
export function ResponsiveAd() {
  return (
    <AdUnit
      slot={SLOT_RESPONSIVE}
      format="auto"
      label="Responsive advertisement"
      className="w-full xl:hidden"
      style={{ minHeight: '100px' }}
    />
  )
}
