import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'
import type { ChartPoint } from '../../types'
import { makeTimeFmt } from '../../utils/chart'

interface Props { data: ChartPoint[] }

const PHASES = [
  { key: 'acL1', label: 'L1', color: 'rgb(var(--m3-primary))'  },
  { key: 'acL2', label: 'L2', color: 'rgb(var(--m3-tertiary))' },
  { key: 'acL3', label: 'L3', color: '#D946EF'                 },
]

export default function ACPhaseChart({ data }: Props) {
  const tickFmt = makeTimeFmt(data)

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 6, right: 4, bottom: 4, left: 0 }}>
        <CartesianGrid strokeDasharray="4 4" stroke="rgb(var(--m3-outline-variant))" strokeOpacity={0.3} vertical={false} />
        <XAxis
          dataKey="ts"
          type="number"
          scale="time"
          domain={['dataMin', 'dataMax']}
          tickCount={5}
          tickFormatter={tickFmt}
          tick={{ fill: 'rgb(var(--m3-on-surface-variant))', fontSize: 11 }}
          axisLine={{ stroke: 'rgb(var(--m3-outline-variant))' }}
          tickLine={false}
        />
        <YAxis
          domain={[220, 240]}
          tick={{ fill: 'rgb(var(--m3-on-surface-variant))', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={28}
          unit="V"
          tickCount={5}
        />
        <Tooltip
          formatter={(v: number, name: string) => [`${(v as number).toFixed(1)} V`, name]}
          contentStyle={{ background: 'rgb(var(--m3-surface-container-highest))', border: '1px solid rgb(var(--m3-outline-variant))', borderRadius: 16, fontSize: 12 }}
          labelFormatter={(ts: number) => new Date(ts).toLocaleTimeString()}
          labelStyle={{ color: 'rgb(var(--m3-on-surface-variant))' }}
          itemStyle={{ color: 'rgb(var(--m3-on-surface))' }}
        />
        {PHASES.map(p => (
          <Line key={p.key} type="monotone" dataKey={p.key} name={p.label}
            stroke={p.color} strokeWidth={2} dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }} isAnimationActive={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
