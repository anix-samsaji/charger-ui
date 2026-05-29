import { useMemo } from 'react'
import type { KPIValues, ChartPoint } from '../types'
import KPICard from './KPICard'

function formatDuration(secs: number) {
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}m ${String(s).padStart(2, '0')}s`
}

function effLabel(kwhPerSoC: number): string {
  if (kwhPerSoC < 1.1) return 'Excellent'
  if (kwhPerSoC < 1.4) return 'Good'
  return 'Poor'
}

function tempStatus(temp: number) {
  if (temp >= 55) return 'critical' as const
  if (temp >= 45) return 'warning' as const
  return 'normal' as const
}

interface Props {
  kpis:    KPIValues
  history: ChartPoint[]
}

export default function KPIStrip({ kpis, history }: Props) {
  const powerSeries  = useMemo(() => history.map(p => p.power    ?? 0), [history])
  const socSeries    = useMemo(() => history.map(p => p.soc      ?? 0), [history])
  const gunRedSeries = useMemo(() => history.map(p => p.gunRed   ?? 0), [history])
  const gunBkSeries  = useMemo(() => history.map(p => p.gunBlack ?? 0), [history])
  const r1Series     = useMemo(() => history.map(p => p.rect1    ?? 0), [history])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 xl:gap-4">
      <KPICard
        title="Charging Duration"
        value={formatDuration(kpis.sessionDuration)}
        variant="circular"
        sessionPct={kpis.sessionProgress}
        delay={40}
      />
      <KPICard
        title="Energy Delivered"
        value={kpis.energyDelivered}
        unit="kWh"
        variant="cost"
        costNote={`≈ ₹${kpis.costEstimate}`}
        sparkline={powerSeries}
        trend={1.8}
        delay={80}
      />
      <KPICard
        title="Energy / 1% SoC"
        value={kpis.energyPerSoC}
        unit="kWh"
        variant="efficiency"
        effLabel={effLabel(kpis.energyPerSoC)}
        sparkline={socSeries}
        delay={120}
      />
      <KPICard
        title="GUN — Red Temp"
        value={kpis.gunRedTemp}
        unit="°C"
        sparkline={gunRedSeries}
        status={tempStatus(kpis.gunRedTemp)}
        trend={0.3}
        delay={160}
      />
      <KPICard
        title="GUN — Black Temp"
        value={kpis.gunBlackTemp}
        unit="°C"
        sparkline={gunBkSeries}
        status={tempStatus(kpis.gunBlackTemp)}
        trend={-0.1}
        delay={200}
      />
      <KPICard
        title="Rectifier 1"
        value={kpis.rect1Temp}
        unit="°C"
        sparkline={r1Series}
        status={tempStatus(kpis.rect1Temp)}
        delay={240}
      />
      <KPICard
        title="Rectifier 2"
        value={kpis.rect2Temp ?? 0}
        unit="°C"
        status="idle"
        delay={280}
      />
    </div>
  )
}
