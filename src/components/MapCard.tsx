import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { motion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'
import type { Station } from '../types'

// Fix Vite + Leaflet broken default icon URLs (must be at module level)
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({ iconUrl: '', iconRetinaUrl: '', shadowUrl: '' })

const TILES = {
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  dark:  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
}

function makeIcon(isDark: boolean) {
  const bg   = isDark ? '#7EE352' : '#3DA814'
  const fg   = isDark ? '#0A2900' : '#ffffff'
  return L.divIcon({
    html: `
      <div style="position:relative;width:48px;height:48px">
        <div style="
          position:absolute;inset:0;border-radius:50%;
          background:${bg};opacity:.35;
          animation:mapRipple 2s ease-out infinite;
          pointer-events:none;
        "></div>
        <div style="
          position:absolute;inset:5px;border-radius:50%;
          background:${bg};
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 4px 16px rgba(0,0,0,.45);
          z-index:1;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="${fg}">
            <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
          </svg>
        </div>
      </div>`,
    className: '',
    iconSize:    [48, 48],
    iconAnchor:  [24, 24],
    popupAnchor: [0, -30],
  })
}

function directionsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}

interface Props { station: Station }

export default function MapCard({ station }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<L.Map | null>(null)
  const tileRef      = useRef<L.TileLayer | null>(null)
  const { theme }    = useTheme()
  const isDark       = theme === 'dark'

  /* ── initialise once ── */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center:           [station.lat, station.lng],
      zoom:             14,
      zoomControl:      false,
      attributionControl: false,
      scrollWheelZoom:  true,
    })

    tileRef.current = L.tileLayer(TILES[isDark ? 'dark' : 'light'], {
      subdomains: 'abcd',
      maxZoom:    20,
    }).addTo(map)

    const popup = L.popup({ closeButton: true, maxWidth: 260 }).setContent(`
      <div class="lf-popup">
        <p class="lf-popup-name">${station.name}</p>
        <p class="lf-popup-loc">${station.location}</p>
        <a class="lf-popup-btn"
           href="${directionsUrl(station.lat, station.lng)}"
           target="_blank" rel="noopener">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.71 11.29l-9-9a1 1 0 0 0-1.42 0l-9 9a1 1 0 0 0 0 1.42l9 9a1 1 0 0 0 1.42 0l9-9a1 1 0 0 0 0-1.42zM14 14.5V12h-4v3H8v-4a1 1 0 0 1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/>
          </svg>
          Get Directions
        </a>
      </div>
    `)

    L.marker([station.lat, station.lng], { icon: makeIcon(isDark) })
      .addTo(map)
      .bindPopup(popup)

    // Force Leaflet to recalculate container size after first paint
    setTimeout(() => map.invalidateSize(), 150)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      tileRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ── swap tile layer when theme changes ── */
  useEffect(() => {
    const map  = mapRef.current
    const tile = tileRef.current
    if (!map || !tile) return

    tile.remove()
    tileRef.current = L.tileLayer(TILES[isDark ? 'dark' : 'light'], {
      subdomains: 'abcd',
      maxZoom:    20,
    }).addTo(map)

    // Re-attach popup with updated marker icon on theme change
    map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        layer.setIcon(makeIcon(isDark))
      }
    })
  }, [isDark])

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.18, duration: 0.5, ease: [0.2, 0, 0, 1] }}
      className="relative flex flex-col rounded-2xl overflow-hidden border border-outline-variant/15 h-full min-h-[380px]"
    >
      {/* Leaflet map fills entire card */}
      <div ref={containerRef} className="absolute inset-0 z-0" />

      {/* ── Map controls — top right ── */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1.5">
        {([
          { icon: 'add',         action: () => mapRef.current?.zoomIn()  },
          { icon: 'remove',      action: () => mapRef.current?.zoomOut() },
          { icon: 'my_location', action: () => mapRef.current?.setView([station.lat, station.lng], 14) },
        ] as const).map(({ icon, action }) => (
          <button
            key={icon}
            onClick={action}
            className="
              w-9 h-9 rounded-full
              bg-surface/85 backdrop-blur-xl
              border border-outline-variant/30
              flex items-center justify-center
              text-on-surface hover:text-primary
              transition-colors shadow-sm
            "
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{icon}</span>
          </button>
        ))}
      </div>

      {/* ── Bottom info sheet ── */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-surface/92 backdrop-blur-xl border-t border-outline-variant/25 p-4 rounded-b-2xl">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <p className="text-label-lg text-on-surface font-semibold truncate">{station.name}</p>
            <p className="text-[11px] text-on-surface-variant mt-0.5 truncate">{station.location}</p>
            <p className="text-[10px] text-on-surface-variant mt-0.5">
              {station.lat.toFixed(4)}°N · {station.lng.toFixed(4)}°E
            </p>
          </div>
          <span className="inline-flex items-center gap-1 bg-primary/12 text-primary text-[11px] px-2.5 py-1 rounded-full shrink-0 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Active
          </span>
        </div>

        <a
          href={directionsUrl(station.lat, station.lng)}
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex items-center justify-center gap-2
            w-full bg-primary text-on-primary
            text-label-sm font-semibold py-2.5 rounded-full
            hover:opacity-90 transition-opacity
          "
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.71 11.29l-9-9a1 1 0 0 0-1.42 0l-9 9a1 1 0 0 0 0 1.42l9 9a1 1 0 0 0 1.42 0l9-9a1 1 0 0 0 0-1.42zM14 14.5V12h-4v3H8v-4a1 1 0 0 1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/>
          </svg>
          Get Directions
        </a>
      </div>
    </motion.div>
  )
}
