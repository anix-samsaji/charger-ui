interface SparklineProps {
  data:   number[]
  color?: string
  height?: number
}

export default function Sparkline({ data, color = 'rgb(var(--m3-primary))', height = 24 }: SparklineProps) {
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const w = 80
  const h = height
  const step = w / (data.length - 1)

  const pts = data.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
  const d   = `M${pts.join(' L')}`
  const fill = `M${pts.join(' L')} L${(data.length - 1) * step},${h} L0,${h} Z`

  const gradId = `sg-${Math.random().toString(36).slice(2)}`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.32" />
          <stop offset="100%" stopColor={color} stopOpacity="0"    />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#${gradId})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
