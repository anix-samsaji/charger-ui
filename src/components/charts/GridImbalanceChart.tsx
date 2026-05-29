import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts'
import type { ChartPoint } from '../../types'
import { makeTimeFmt } from '../../utils/chart'

interface Props { data: ChartPoint[] }

export default function GridImbalanceChart({ data }: Props) {
  const tickFmt = makeTimeFmt(data)

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 6, right: 4, bottom: 4, left: 0 }}>
        <defs>
          <linearGradient id="gImbal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgb(var(--m3-tertiary))" stopOpacity={0.28} />
            <stop offset="100%" stopColor="rgb(var(--m3-tertiary))" stopOpacity={0}    />
          </linearGradient>
        </defs>
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
          domain={[0, 5]}
          tick={{ fill: 'rgb(var(--m3-on-surface-variant))', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={28}
          unit="%"
          tickCount={5}
        />
        <Tooltip
          formatter={(v: number) => [`${(v as number).toFixed(2)}%`, 'Imbalance']}
          contentStyle={{ background: 'rgb(var(--m3-surface-container-highest))', border: '1px solid rgb(var(--m3-outline-variant))', borderRadius: 16, fontSize: 12 }}
          labelFormatter={(ts: number) => new Date(ts).toLocaleTimeString()}
          labelStyle={{ color: 'rgb(var(--m3-on-surface-variant))' }}
          itemStyle={{ color: 'rgb(var(--m3-on-surface))' }}
        />
        <ReferenceLine y={3} stroke="#F5A623" strokeDasharray="6 3" strokeOpacity={0.7}
          label={{ value: 'warn', position: 'insideRight', fontSize: 10, fill: '#F5A623' }} />
        <Area
          type="monotone"
          dataKey="gridImbal"
          stroke="rgb(var(--m3-tertiary))"
          strokeWidth={2}
          fill="url(#gImbal)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
