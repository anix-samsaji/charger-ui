import {
  ResponsiveContainer, ComposedChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'
import type { ChartPoint } from '../../types'
import { makeTimeFmt } from '../../utils/chart'

interface Props { data: ChartPoint[] }

export default function DCVoltageChart({ data }: Props) {
  const tickFmt = makeTimeFmt(data)

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 6, right: 4, bottom: 4, left: 0 }}>
        <defs>
          <linearGradient id="gVDem" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgb(var(--m3-secondary))" stopOpacity={0.2} />
            <stop offset="100%" stopColor="rgb(var(--m3-secondary))" stopOpacity={0}   />
          </linearGradient>
          <linearGradient id="gVSup" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgb(var(--m3-primary))" stopOpacity={0.22} />
            <stop offset="100%" stopColor="rgb(var(--m3-primary))" stopOpacity={0}    />
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
          domain={['auto', 'auto']}
          tick={{ fill: 'rgb(var(--m3-on-surface-variant))', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={36}
          unit="V"
          tickCount={5}
        />
        <Tooltip
          formatter={(v: number, name: string) => [`${v} V`, name]}
          contentStyle={{ background: 'rgb(var(--m3-surface-container-highest))', border: '1px solid rgb(var(--m3-outline-variant))', borderRadius: 16, fontSize: 12 }}
          labelFormatter={(ts: number) => new Date(ts).toLocaleTimeString()}
          labelStyle={{ color: 'rgb(var(--m3-on-surface-variant))' }}
          itemStyle={{ color: 'rgb(var(--m3-on-surface))' }}
        />
        <Area type="monotone" dataKey="dcVDemand" name="Demand"
          stroke="rgb(var(--m3-secondary))" strokeWidth={2} fill="url(#gVDem)"
          dot={false} activeDot={{ r: 4, strokeWidth: 0 }} isAnimationActive={false} />
        <Area type="monotone" dataKey="dcVSupply" name="Supply"
          stroke="rgb(var(--m3-primary))" strokeWidth={2} fill="url(#gVSup)"
          dot={false} activeDot={{ r: 4, strokeWidth: 0 }} isAnimationActive={false} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
