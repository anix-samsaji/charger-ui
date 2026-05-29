import { useEffect } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import clsx from 'clsx'
import Sparkline from './Sparkline'

type Status = 'normal' | 'warning' | 'critical' | 'idle'

interface KPICardProps {
  title:       string
  value:       number | string
  unit?:       string
  sparkline?:  number[]
  trend?:      number
  status?:     Status
  variant?:    'circular' | 'cost' | 'efficiency' | 'default'
  sessionPct?: number
  costNote?:   string
  effLabel?:   string
  delay?:      number
}

const statusStyles: Record<Status, string> = {
  normal:   '',
  warning:  'border-l-[3px] !border-l-warning',
  critical: 'border-l-[3px] !border-l-error',
  idle:     'opacity-55',
}

const statusPip: Record<Status, string> = {
  normal:   'bg-primary',
  warning:  'bg-warning',
  critical: 'bg-error',
  idle:     'bg-on-surface-variant',
}

function AnimatedNumber({ value }: { value: number }) {
  const spring  = useSpring(value, { stiffness: 80, damping: 20 })
  const display = useTransform(spring, (v) =>
    v >= 1000
      ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 })
      : v.toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 3 }),
  )
  useEffect(() => { spring.set(value) }, [value, spring])
  return <motion.span className="tnum">{display}</motion.span>
}

function CircularProgress({ pct }: { pct: number }) {
  const r    = 16
  const circ = 2 * Math.PI * r
  const off  = circ * (1 - pct)
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" className="shrink-0">
      <circle cx="20" cy="20" r={r} fill="none" stroke="rgb(var(--m3-outline-variant))" strokeWidth="3" />
      <circle
        cx="20" cy="20" r={r}
        fill="none"
        stroke="rgb(var(--m3-primary))"
        strokeWidth="3"
        strokeDasharray={circ}
        strokeDashoffset={off}
        strokeLinecap="round"
        transform="rotate(-90 20 20)"
        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.2,0,0,1)' }}
      />
    </svg>
  )
}

export default function KPICard({
  title, value, unit, sparkline, trend, status = 'normal',
  variant = 'default', sessionPct, costNote, effLabel, delay = 0,
}: KPICardProps) {
  const numVal = typeof value === 'number' ? value : parseFloat(value as string)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: status === 'idle' ? 0.55 : 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.5, ease: [0.2, 0, 0, 1] }}
      className={clsx(
        'relative flex flex-col justify-between rounded-2xl p-4',
        'bg-surface-container-low border border-outline-variant/15',
        'overflow-hidden group cursor-default select-none',
        statusStyles[status],
      )}
    >
      {/* hover state layer */}
      <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-[0.05] transition-opacity duration-200 pointer-events-none rounded-2xl" />

      {/* header */}
      <div className="flex items-start justify-between gap-1 mb-2">
        <span className="text-[10px] font-medium text-on-surface-variant uppercase tracking-[0.6px] leading-tight">
          {title}
        </span>
        {status === 'idle' ? (
          <span className="text-[10px] text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded-full shrink-0">IDLE</span>
        ) : (
          <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0 mt-0.5', statusPip[status],
            status === 'normal' && 'animate-pulse',
          )} />
        )}
      </div>

      {/* value block */}
      <div className="flex items-center gap-2">
        {variant === 'circular' && sessionPct !== undefined && (
          <CircularProgress pct={sessionPct} />
        )}
        <div className="flex flex-col min-w-0">
          <div className={clsx(
            /* responsive font: smaller on narrow cards, larger on wide */
            'font-display tnum leading-none text-[22px] sm:text-[26px] lg:text-[30px] xl:text-[34px]',
            status === 'critical' ? 'text-error' :
            status === 'warning'  ? 'text-warning' :
            'text-primary',
          )}>
            {typeof value === 'number'
              ? <AnimatedNumber value={numVal} />
              : <span className="truncate">{value}</span>
            }
            {unit && (
              <span className="text-[13px] text-on-surface-variant ml-1 font-sans font-normal">{unit}</span>
            )}
          </div>
          {variant === 'cost' && costNote && (
            <span className="text-[10px] text-on-surface-variant mt-0.5">{costNote}</span>
          )}
          {variant === 'efficiency' && effLabel && (
            <span className={clsx(
              'text-[10px] mt-0.5 font-semibold',
              effLabel === 'Excellent' ? 'text-primary' :
              effLabel === 'Good'      ? 'text-tertiary' :
              'text-warning',
            )}>{effLabel}</span>
          )}
        </div>
      </div>

      {/* sparkline */}
      {sparkline && sparkline.length > 2 && (
        <div className="mt-2 -mx-0.5">
          <Sparkline
            data={sparkline}
            color={
              status === 'critical' ? 'rgb(var(--m3-error))' :
              status === 'warning'  ? '#F5A623' :
              'rgb(var(--m3-primary))'
            }
            height={20}
          />
        </div>
      )}

      {/* trend chip */}
      {trend !== undefined && status !== 'idle' && (
        <div className={clsx(
          'inline-flex items-center gap-0.5 text-[10px] mt-1.5 px-1.5 py-0.5 rounded-full self-start font-medium',
          trend >= 0 ? 'text-primary bg-primary/10' : 'text-error bg-error/10',
        )}>
          <span>{trend >= 0 ? '▲' : '▼'}</span>
          <span>{Math.abs(trend).toFixed(1)}%</span>
        </div>
      )}
    </motion.div>
  )
}
