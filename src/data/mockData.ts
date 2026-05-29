import type { ChartPoint, KPIValues } from '../types'

const RATE = 17.5   // ₹ per kWh

function noise(range: number) {
  return (Math.random() - 0.5) * range
}

/** Generate N minutes of historical charging data ending now */
export function generateHistory(minutes = 60): ChartPoint[] {
  const now  = Date.now()
  const data: ChartPoint[] = []

  const startSoC = 18
  const endSoC   = 82

  for (let i = 0; i < minutes; i++) {
    const t       = now - (minutes - i) * 60_000
    const prog    = i / (minutes - 1)
    const soc     = startSoC + (endSoC - startSoC) * prog

    // DC fast charge curve: full power until 80% SoC, then taper
    const maxPow  = 130
    let power: number
    if (soc < 80) {
      power = maxPow + noise(6)
    } else {
      power = maxPow * (1 - (soc - 80) / 20) + noise(3)
    }
    power = Math.max(0, power)

    const dcV     = 410 + soc * 3.8 + noise(4)
    const dcA     = (power * 1000) / dcV

    const baseT   = 34
    const heatT   = (power / maxPow) * 14

    const mins    = Math.floor((minutes - i) / 1)
    const label   = mins === 0 ? 'now' : `-${mins}m`

    data.push({
      ts:        t,
      label,
      power:     +power.toFixed(1),
      soc:       +soc.toFixed(1),
      gridImbal: +(1.4 + noise(0.8)).toFixed(2),
      gunRed:    +(baseT + heatT + 3 + noise(1.5)).toFixed(1),
      gunBlack:  +(baseT + heatT + 1 + noise(1.5)).toFixed(1),
      rect1:     +(baseT + heatT + noise(1.5)).toFixed(1),
      rect2:     undefined,
      dcVDemand: Math.round(dcV + 6),
      dcVSupply: Math.round(dcV),
      dcADemand: Math.round(dcA + 5),
      dcASupply: Math.round(dcA),
      acL1:      +(228 + noise(4)).toFixed(1),
      acL2:      +(231 + noise(4)).toFixed(1),
      acL3:      +(229 + noise(4)).toFixed(1),
    })
  }

  return data
}

/** Derive current KPI snapshot from the latest chart point */
export function deriveKPIs(history: ChartPoint[], sessionSeconds: number): KPIValues {
  const last = history[history.length - 1]

  return {
    sessionDuration: sessionSeconds,
    energyDelivered: 15.664,
    energyPerSoC:    1.205,
    gunRedTemp:      last.gunRed  ?? 38,
    gunBlackTemp:    last.gunBlack ?? 36,
    rect1Temp:       last.rect1  ?? 42,
    rect2Temp:       null,
    currentPower:    last.power  ?? 0,
    currentSoC:      last.soc    ?? 0,
    sessionProgress: (last.soc ?? 0) / 100,
    costEstimate:    +(15.664 * RATE).toFixed(0),
  }
}

/** Generate one new live tick (appends to existing data) */
export function nextLiveTick(prev: ChartPoint[]): ChartPoint {
  const last    = prev[prev.length - 1]
  const newSoC  = Math.min(100, (last.soc ?? 0) + 0.2 + noise(0.05))
  const maxPow  = 130
  let power: number
  if (newSoC < 80) {
    power = maxPow + noise(5)
  } else {
    power = maxPow * (1 - (newSoC - 80) / 20) + noise(2)
  }
  power = Math.max(0, power)

  const dcV = 410 + newSoC * 3.8 + noise(3)
  const dcA = (power * 1000) / dcV
  const baseT = 34
  const heatT = (power / maxPow) * 14

  return {
    ts:        Date.now(),
    label:     'now',
    power:     +power.toFixed(1),
    soc:       +newSoC.toFixed(1),
    gridImbal: +(1.4 + noise(0.7)).toFixed(2),
    gunRed:    +(baseT + heatT + 3 + noise(1.5)).toFixed(1),
    gunBlack:  +(baseT + heatT + 1 + noise(1.5)).toFixed(1),
    rect1:     +(baseT + heatT + noise(1.5)).toFixed(1),
    rect2:     undefined,
    dcVDemand: Math.round(dcV + 6),
    dcVSupply: Math.round(dcV),
    dcADemand: Math.round(dcA + 5),
    dcASupply: Math.round(dcA),
    acL1:      +(228 + noise(4)).toFixed(1),
    acL2:      +(231 + noise(4)).toFixed(1),
    acL3:      +(229 + noise(4)).toFixed(1),
  }
}

export const STATION = {
  id:       'AMR-2401',
  name:     'Amaron DC Fast Charger',
  location: 'Tirupati, Andhra Pradesh',
  lat:       13.6288,
  lng:       79.4192,
  status:   'online' as const,
}
