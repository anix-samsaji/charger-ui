import clsx from 'clsx'
import { useTheme } from '../hooks/useTheme'
import { useDashboard } from '../hooks/useDashboard'

const AMARON_LOGO = 'https://amaron.co.id/wp-content/uploads/2024/12/amaron-logo-hd-01-2048x616.png'

export default function TopBar() {
  const { toggleTheme, theme } = useTheme()
  const { station, paused } = useDashboard()

  return (
    <header className="sticky top-0 z-30 bg-surface border-b border-outline-variant/60 flex items-center w-full shrink-0 px-4 md:px-8 h-[64px] gap-3">

      {/* ── Logo image ── */}
      <div className="shrink-0 flex items-center h-8">
        <img
          src={AMARON_LOGO}
          alt="Amaron"
          className="h-full w-auto object-contain"
        />
      </div>

      {/* ── Station selector with E+ model badge ── */}
      <div className="flex items-center gap-1.5 bg-surface-container border border-outline-variant/40 rounded-full px-3 py-1.5 cursor-pointer hover:border-outline transition-colors ml-1">
        <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 16 }}>ev_station</span>
        {/* E+ model badge */}
        <span className="text-[10px] font-bold bg-primary text-on-primary px-1.5 py-0.5 rounded-full leading-none">E+</span>
        {/* Station ID always visible */}
        <span className="text-label-lg text-primary font-semibold">{station.id}</span>
        {/* Location only at lg+ */}
        <span className="hidden lg:inline text-on-surface-variant text-label-sm mx-0.5">·</span>
        <span className="hidden lg:inline text-label-sm text-on-surface-variant truncate max-w-[140px]">{station.location}</span>
        <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 16 }}>keyboard_arrow_down</span>
      </div>

      {/* ── Live pill ── */}
      <div className="hidden sm:flex items-center gap-1.5 ml-1">
        <div className="relative w-3 h-3 flex items-center justify-center">
          {!paused && <div className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" />}
          <div className={clsx(
            'relative w-2 h-2 rounded-full',
            paused ? 'bg-warning' : 'bg-primary',
          )} />
        </div>
        <span className={clsx(
          'text-label-md font-semibold tracking-wide',
          paused ? 'text-warning' : 'text-primary',
        )}>
          {paused ? 'PAUSED' : 'LIVE'}
        </span>
      </div>

      <div className="flex-1" />

      {/* ── Right actions ── */}
      <div className="flex items-center gap-1">
        <button className="relative w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error" />
        </button>

        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 22, fontVariationSettings: "'FILL' 1" }}>
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
      </div>
    </header>
  )
}
