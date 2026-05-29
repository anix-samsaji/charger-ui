import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import { useDashboard } from '../hooks/useDashboard'
import type { LiveWindow, RefreshRate, Aggregation } from '../types'

const LIVE_WINDOWS:  { label: string; value: LiveWindow  }[] = [
  { label: '5 min',    value: '5m'      },
  { label: '15 min',   value: '15m'     },
  { label: '1 hr',     value: '1h'      },
  { label: 'Session',  value: 'session' },
]
const REFRESH_RATES: { label: string; value: RefreshRate }[] = [
  { label: '1s',  value: '1s'  },
  { label: '5s',  value: '5s'  },
  { label: '10s', value: '10s' },
  { label: '30s', value: '30s' },
]
const AGGREGATIONS: { label: string; value: Aggregation }[] = [
  { label: 'Raw',   value: 'raw'  },
  { label: '1 min', value: '1min' },
  { label: '5 min', value: '5min' },
  { label: '1 hr',  value: '1hr'  },
  { label: '1 day', value: '1day' },
]

export default function LiveHistoricalToggle() {
  const {
    mode, setMode,
    liveWindow, setLiveWindow,
    refreshRate, setRefreshRate,
    aggregation, setAggregation,
    paused, setPaused,
    histFrom, setHistFrom,
    histTo, setHistTo,
  } = useDashboard()

  return (
    <div className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl p-3 flex flex-col gap-3">

      {/* ── Row 1: mode toggle + contextual controls ── */}
      <div className="flex flex-wrap items-center gap-3">

        {/* Mode toggle */}
        <div className="flex bg-surface-container rounded-full p-1 border border-outline-variant/40 shrink-0">
          <button
            onClick={() => setMode('live')}
            className={clsx(
              'flex items-center gap-1.5 px-4 py-1.5 rounded-full text-label-lg font-medium transition-all duration-200',
              mode === 'live'
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface',
            )}
          >
            <span className={clsx(
              'w-2 h-2 rounded-full transition-colors shrink-0',
              mode === 'live' ? 'bg-primary animate-pulse' : 'bg-on-surface-variant',
            )} />
            LIVE
          </button>
          <button
            onClick={() => setMode('historical')}
            className={clsx(
              'flex items-center gap-1.5 px-4 py-1.5 rounded-full text-label-lg font-medium transition-all duration-200',
              mode === 'historical'
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface',
            )}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>bar_chart</span>
            HISTORICAL
          </button>
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-outline-variant/50 hidden sm:block" />

        {/* ── Contextual controls (animated swap) ── */}
        <AnimatePresence mode="wait">
          {mode === 'live' && (
            <motion.div
              key="live"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
              className="flex flex-wrap items-center gap-2"
            >
              {/* Window chips */}
              <div className="flex bg-surface-container rounded-full p-0.5 border border-outline-variant/40 gap-0.5">
                {LIVE_WINDOWS.map(w => (
                  <button
                    key={w.value}
                    onClick={() => setLiveWindow(w.value)}
                    className={clsx(
                      'px-3 py-1 rounded-full text-label-sm transition-all duration-200',
                      liveWindow === w.value
                        ? 'bg-primary/15 text-primary font-semibold'
                        : 'text-on-surface-variant hover:text-on-surface',
                    )}
                  >
                    {w.label}
                  </button>
                ))}
              </div>

              {/* Refresh rate */}
              <select
                value={refreshRate}
                onChange={e => setRefreshRate(e.target.value as RefreshRate)}
                className="text-label-sm bg-surface-container border border-outline-variant/40 rounded-full px-3 py-1.5 text-on-surface outline-none cursor-pointer hover:border-outline transition-colors"
              >
                {REFRESH_RATES.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>

              {/* Pause */}
              <button
                onClick={() => setPaused(!paused)}
                className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                  paused
                    ? 'bg-warning/15 text-warning'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border border-outline-variant/40',
                )}
                title={paused ? 'Resume' : 'Pause'}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 17 }}>
                  {paused ? 'play_arrow' : 'pause'}
                </span>
              </button>
            </motion.div>
          )}

          {mode === 'historical' && (
            <motion.div
              key="hist"
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
              className="flex flex-wrap items-center gap-2"
            >
              {/* Date range */}
              <div className="flex items-center gap-1.5 bg-surface-container border border-outline-variant/40 rounded-full px-3 py-1.5">
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 15 }}>calendar_today</span>
                <input
                  type="date"
                  value={histFrom.split('T')[0]}
                  onChange={e => setHistFrom(e.target.value)}
                  className="text-label-sm bg-transparent text-on-surface outline-none w-[112px] cursor-pointer"
                />
                <span className="text-on-surface-variant text-label-sm">→</span>
                <input
                  type="date"
                  value={histTo.split('T')[0]}
                  onChange={e => setHistTo(e.target.value)}
                  className="text-label-sm bg-transparent text-on-surface outline-none w-[112px] cursor-pointer"
                />
              </div>

              {/* Presets */}
              {['Today', '7d', '30d'].map(p => (
                <button
                  key={p}
                  className="text-label-sm px-3 py-1.5 rounded-full border border-outline-variant/40 text-on-surface-variant hover:text-on-surface hover:border-outline transition-colors"
                >
                  {p}
                </button>
              ))}

              {/* Aggregation */}
              <select
                value={aggregation}
                onChange={e => setAggregation(e.target.value as Aggregation)}
                className="text-label-sm bg-surface-container border border-outline-variant/40 rounded-full px-3 py-1.5 text-on-surface outline-none cursor-pointer hover:border-outline transition-colors"
              >
                {AGGREGATIONS.map(a => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>

              {/* Export */}
              <button className="flex items-center gap-1 text-label-sm px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/40 text-on-surface-variant hover:text-on-surface hover:border-outline transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>download</span>
                Export
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
