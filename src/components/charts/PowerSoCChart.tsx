import {
  ResponsiveContainer, ComposedChart, Area, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'
import type { ChartPoint } from '../../types'
import { makeTimeFmt } from '../../utils/chart'

interface Props { data: ChartPoint[] }

const TOOLTIP_STYLE = {
  background: 'rgb(var(--m3-surface-container-highest))',
  border: '1px solid rgb(var(--m3-outline-variant))',
  borderRadius: 16,
  fontSize: 12,
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  const time = new Date(label)
  const ts = `${String(time.getHours()).padStart(2,'0')}:${String(time.getMinutes()).padStart(2,'0')}:${String(time.getSeconds()).padStart(2,'0')}`
  return (
    <div className="bg-surface-container-highest border border-outline-variant rounded-2xl p-3 shadow-xl">
      <p className="text-[11px] text-on-surface-variant mb-1.5">{ts}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-[12px]">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-on-surface tnum">
            {p.dataKey === 'power' ? `${p.value} kW` : `${p.value}%`}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function PowerSoCChart({ data }: Props) {
  const tickFmt = makeTimeFmt(data)

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 6, right: 4, bottom: 4, left: 0 }}>
        <defs>
          <linearGradient id="gPower" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgb(var(--m3-primary))" stopOpacity={0.28} />
            <stop offset="100%" stopColor="rgb(var(--m3-primary))" stopOpacity={0}    />
          </linearGradient>
          <linearGradient id="gSoC" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgb(var(--m3-tertiary))" stopOpacity={0.18} />
            <stop offset="100%" stopColor="rgb(var(--m3-tertiary))" stopOpacity={0}    />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="4 4"
          stroke="rgb(var(--m3-outline-variant))"
          strokeOpacity={0.3}
          vertical={false}
        />
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
          yAxisId="power"
          domain={[0, 160]}
          tick={{ fill: 'rgb(var(--m3-on-surface-variant))', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={40}
          unit=" kW"
          tickCount={5}
        />
        <YAxis
          yAxisId="soc"
          orientation="right"
          domain={[0, 100]}
          tick={{ fill: 'rgb(var(--m3-on-surface-variant))', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={32}
          unit="%"
          tickCount={5}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          yAxisId="power"
          type="monotone"
          dataKey="power"
          stroke="rgb(var(--m3-primary))"
          strokeWidth={2}
          fill="url(#gPower)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
          isAnimationActive={false}
        />
        <Line
          yAxisId="soc"
          type="monotone"
          dataKey="soc"
          stroke="rgb(var(--m3-tertiary))"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
          isAnimationActive={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
