import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts'
import type { ChartPoint } from '../../types'
import { makeTimeFmt } from '../../utils/chart'

interface Props { data: ChartPoint[] }

const SERIES = [
  { key: 'gunRed',   label: 'GUN Red',  color: 'rgb(var(--m3-error))'   },
  { key: 'gunBlack', label: 'GUN Black', color: '#F5A623'                },
  { key: 'rect1',    label: 'Rect 1',    color: 'rgb(var(--m3-primary))' },
]

export default function ThermalChart({ data }: Props) {
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
          domain={[25, 70]}
          tick={{ fill: 'rgb(var(--m3-on-surface-variant))', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={28}
          unit="°"
          tickCount={5}
        />
        <Tooltip
          formatter={(v: number, name: string) => [`${(v as number).toFixed(1)}°C`, name]}
          contentStyle={{ background: 'rgb(var(--m3-surface-container-highest))', border: '1px solid rgb(var(--m3-outline-variant))', borderRadius: 16, fontSize: 12 }}
          labelFormatter={(ts: number) => new Date(ts).toLocaleTimeString()}
          labelStyle={{ color: 'rgb(var(--m3-on-surface-variant))' }}
          itemStyle={{ color: 'rgb(var(--m3-on-surface))' }}
        />
        <ReferenceLine y={45} stroke="#F5A623" strokeDasharray="6 3" strokeOpacity={0.7}
          label={{ value: '45°', position: 'insideRight', fontSize: 10, fill: '#F5A623' }} />
        <ReferenceLine y={55} stroke="rgb(var(--m3-error))" strokeDasharray="6 3" strokeOpacity={0.7}
          label={{ value: '55°', position: 'insideRight', fontSize: 10, fill: 'rgb(var(--m3-error))' }} />
        {SERIES.map(s => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
