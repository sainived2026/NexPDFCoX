// ── AdUnits.tsx ──────────────────────────────────────────────
// Google AdSense — all units are RESPONSIVE (format="auto")
// Publisher ID  : VITE_ADSENSE_PUBLISHER_ID
// Slot IDs      : VITE_AD_SLOT_HORIZONTAL / RECTANGLE / VERTICAL / RESPONSIVE
// All 4 ad units created in AdSense are the "Responsive" type.
// ────────────────────────────────────────────────────────────
import { useEffect, useRef } from 'react'

// Read from Vite env — configure in your .env file
const PUBLISHER_ID    = import.meta.env.VITE_ADSENSE_PUBLISHER_ID ?? 'pub-7050860488978143'
const SLOT_HORIZONTAL = import.meta.env.VITE_AD_SLOT_HORIZONTAL   ?? ''
const SLOT_RECTANGLE  = import.meta.env.VITE_AD_SLOT_RECTANGLE    ?? ''
const SLOT_VERTICAL   = import.meta.env.VITE_AD_SLOT_VERTICAL     ?? ''
const SLOT_LEFT_SIDE  = import.meta.env.VITE_AD_SLOT_LEFT_SIDEBAR ?? ''
const SLOT_RESPONSIVE = import.meta.env.VITE_AD_SLOT_RESPONSIVE   ?? ''

// Declare global adsbygoogle for TypeScript
declare global {
  interface Window {
    adsbygoogle?: object[]
  }
}

interface AdUnitProps {
  slot: string
  label?: string
  className?: string
  style?: React.CSSProperties
}

// All units use format="auto" since every ad is the Responsive type
function AdUnit({ slot, label = 'Advertisement', className = '', style }: AdUnitProps) {
  const pushed = useRef(false)

  useEffect(() => {
    // Push only once per mount, and only when a real slot ID is present
    if (pushed.current || !slot || slot.startsWith('YOUR_') || slot === '') return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      pushed.current = true
    } catch (e) {
      console.warn('[NexPDFCoX] AdSense push error:', e)
    }
  }, [slot])

  // Dev placeholder — shown when slot ID is not yet configured
  if (!slot || slot.startsWith('YOUR_') || slot === '') {
    return (
      <div
        className={`ad-unit ${className}`}
        style={style}
        aria-label={label}
        aria-hidden="true"
      >
        <span style={{ opacity: 0.45, letterSpacing: '0.08em', fontFamily: 'monospace', fontSize: 11 }}>
          AD PLACEHOLDER
        </span>
      </div>
    )
  }

  return (
    <div className={`ad-unit overflow-hidden ${className}`} style={style} aria-label={label}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={`ca-${PUBLISHER_ID}`}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}

// ── Horizontal placement — below header ──────────────────────
// Responsive ad — Google will choose the best size automatically
export function HorizontalAd() {
  return (
    <AdUnit
      slot={SLOT_HORIZONTAL}
      label="Advertisement (horizontal)"
      className="w-full"
      style={{ minHeight: '90px', display: 'block' }}
    />
  )
}

// ── Rectangle placement — in-content ─────────────────────────
// Responsive ad — typically renders around 300×250
export function RectangleAd() {
  return (
    <AdUnit
      slot={SLOT_RECTANGLE}
      label="Advertisement (in-content)"
      className="w-full"
      style={{ minHeight: '250px', display: 'block' }}
    />
  )
}

// ── Vertical placement — right sidebar (desktop only) ─────────
// Responsive ad — typically renders around 300×600
export function VerticalAd() {
  return (
    <AdUnit
      slot={SLOT_VERTICAL}
      label="Advertisement (right sidebar)"
      className="hidden xl:block w-full"
      style={{ minHeight: '250px', display: 'block' }}
    />
  )
}

// ── Left Sidebar placement — (large desktop only) ─────────────
export function LeftSidebarAd() {
  return (
    <AdUnit
      slot={SLOT_LEFT_SIDE}
      label="Advertisement (left sidebar)"
      className="hidden 2xl:block w-full"
      style={{ minHeight: '250px', display: 'block' }}
    />
  )
}

// ── Responsive placement — mobile / bottom ────────────────────
// Responsive ad — fills available width
export function ResponsiveAd() {
  return (
    <AdUnit
      slot={SLOT_RESPONSIVE}
      label="Advertisement (responsive)"
      className="w-full xl:hidden"
      style={{ minHeight: '100px', display: 'block' }}
    />
  )
}
