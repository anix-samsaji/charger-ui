export type DashboardMode = 'live' | 'historical'
export type LiveWindow  = '5m' | '15m' | '1h' | 'session'
export type RefreshRate = '1s' | '5s' | '10s' | '30s'
export type Aggregation = 'raw' | '1min' | '5min' | '1hr' | '1day'
export type Theme       = 'light' | 'dark'

export interface KPIValues {
  sessionDuration: number    // seconds
  energyDelivered: number    // kWh
  energyPerSoC:    number    // kWh / %SoC
  gunRedTemp:      number    // °C
  gunBlackTemp:    number    // °C
  rect1Temp:       number    // °C
  rect2Temp:       number | null  // null = idle
  currentPower:    number    // kW
  currentSoC:      number    // %
  sessionProgress: number    // 0-1
  costEstimate:    number    // ₹
}

export interface ChartPoint {
  ts:          number   // unix ms
  label:       string
  power?:      number   // kW
  soc?:        number   // %
  gridImbal?:  number   // %
  gunRed?:     number   // °C
  gunBlack?:   number   // °C
  rect1?:      number   // °C
  rect2?:      number   // °C
  dcVDemand?:  number   // V
  dcVSupply?:  number   // V
  dcADemand?:  number   // A
  dcASupply?:  number   // A
  acL1?:       number   // V
  acL2?:       number   // V
  acL3?:       number   // V
}

export interface Station {
  id:       string
  name:     string
  location: string
  lat:      number
  lng:      number
  status:   'online' | 'offline' | 'fault'
}

export interface DashboardState {
  mode:        DashboardMode
  liveWindow:  LiveWindow
  refreshRate: RefreshRate
  aggregation: Aggregation
  paused:      boolean
  histFrom:    string   // ISO date
  histTo:      string
  compareMode: boolean
}
