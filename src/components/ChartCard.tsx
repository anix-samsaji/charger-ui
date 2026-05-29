import clsx from 'clsx'
import type { DashboardMode } from '../types'

interface ChartCardProps {
  title:    string
  mode:     DashboardMode
  window?:  string
  legend?:  { label: string; color: string }[]
  children: React.ReactNode
  colSpan?: 1 | 2
}

export default function ChartCard({ title, mode, window, legend, children, colSpan = 1 }: ChartCardProps) {
  const modeTag = mode === 'live'
    ? `LIVE${window ? ' · ' + window : ''}`
    : 'HISTORICAL'

  return (
    <div className={clsx(
      'flex flex-col h-full rounded-2xl border border-outline-variant/20',
      'bg-surface-container-low overflow-hidden',
      'transition-colors duration-200',
      'hover:border-outline/50 hover:bg-surface-container',
      colSpan === 2 && 'sm:col-span-2',
    )}>
      {/* header — fixed height, never shrinks */}
      <div className="shrink-0 flex items-center justify-between px-4 pt-3 pb-2 gap-2 flex-wrap">
        <h3 className="text-[13px] font-semibold text-on-surface">{title}</h3>
        <div className="flex items-center gap-2 ml-auto">
          {legend?.map(l => (
            <div key={l.label} className="flex items-center gap-1">
              <span className="inline-block w-3 h-0.5 rounded-full" style={{ background: l.color }} />
              <span className="text-[10px] text-on-surface-variant">{l.label}</span>
            </div>
          ))}
          <span className={clsx(
            'text-[10px] px-2 py-0.5 rounded-full font-semibold tracking-wide',
            mode === 'live'
              ? 'bg-primary/10 text-primary'
              : 'bg-tertiary/10 text-tertiary',
          )}>
            {modeTag}
          </span>
          <button className="p-0.5 rounded-full text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>more_vert</span>
          </button>
        </div>
      </div>

      {/* chart body — flex-1 + min-h-0 so it takes exactly remaining pixels */}
      <div className="flex-1 min-h-0 px-1 pb-2">
        {children}
      </div>
    </div>
  )
}
