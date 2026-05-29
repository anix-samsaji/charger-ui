import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import dayjs from 'dayjs'
import { generateHistory, nextLiveTick, deriveKPIs, STATION } from '../data/mockData'
import type {
  DashboardMode, LiveWindow, RefreshRate,
  Aggregation, KPIValues, ChartPoint
} from '../types'

const WINDOW_MINS: Record<LiveWindow, number> = {
  '5m': 5, '15m': 15, '1h': 60, 'session': 60,
}
const RATE_MS: Record<RefreshRate, number> = {
  '1s': 1000, '5s': 5000, '10s': 10000, '30s': 30000,
}

interface DashboardCtx {
  mode:        DashboardMode
  setMode:     (m: DashboardMode) => void
  liveWindow:  LiveWindow
  setLiveWindow: (w: LiveWindow) => void
  refreshRate: RefreshRate
  setRefreshRate: (r: RefreshRate) => void
  aggregation: Aggregation
  setAggregation: (a: Aggregation) => void
  paused:      boolean
  setPaused:   (p: boolean) => void
  histFrom:    string
  setHistFrom: (d: string) => void
  histTo:      string
  setHistTo:   (d: string) => void
  compareMode: boolean
  setCompareMode: (c: boolean) => void
  chartData:   ChartPoint[]
  kpis:        KPIValues
  station:     typeof STATION
  sessionSecs: number
}

export const DashboardContext = createContext<DashboardCtx>(null!)

export function useDashboardProvider() {
  const [mode,        setMode]        = useState<DashboardMode>('live')
  const [liveWindow,  setLiveWindow]  = useState<LiveWindow>('15m')
  const [refreshRate, setRefreshRate] = useState<RefreshRate>('5s')
  const [aggregation, setAggregation] = useState<Aggregation>('raw')
  const [paused,      setPaused]      = useState(false)
  const [histFrom,    setHistFrom]    = useState(dayjs().startOf('day').toISOString())
  const [histTo,      setHistTo]      = useState(dayjs().toISOString())
  const [compareMode, setCompareMode] = useState(false)
  const [sessionSecs, setSessionSecs] = useState(33 * 60 + 2)

  // full history buffer (up to 120 points)
  const bufferRef = useRef<ChartPoint[]>(generateHistory(60))
  const [chartData, setChartData]   = useState<ChartPoint[]>(() => sliceWindow(bufferRef.current, liveWindow))
  const [kpis,      setKPIs]        = useState<KPIValues>(() => deriveKPIs(bufferRef.current, sessionSecs))

  const tick = useCallback(() => {
    if (paused || mode !== 'live') return
    const newPt = nextLiveTick(bufferRef.current)
    bufferRef.current = [...bufferRef.current.slice(-119), newPt]
    setSessionSecs(s => s + RATE_MS[refreshRate] / 1000)
    setChartData(sliceWindow(bufferRef.current, liveWindow))
    setKPIs(deriveKPIs(bufferRef.current, sessionSecs + RATE_MS[refreshRate] / 1000))
  }, [paused, mode, refreshRate, liveWindow, sessionSecs])

  useEffect(() => {
    if (mode !== 'live') return
    const id = setInterval(tick, RATE_MS[refreshRate])
    return () => clearInterval(id)
  }, [tick, mode, refreshRate])

  // When mode or window changes, re-derive visible slice
  useEffect(() => {
    setChartData(sliceWindow(bufferRef.current, liveWindow))
  }, [liveWindow])

  useEffect(() => {
    if (mode === 'historical') {
      // Serve same mock data for historical (real app would fetch)
      setChartData(generateHistory(60))
    } else {
      setChartData(sliceWindow(bufferRef.current, liveWindow))
    }
  }, [mode])

  return {
    mode, setMode,
    liveWindow, setLiveWindow,
    refreshRate, setRefreshRate,
    aggregation, setAggregation,
    paused, setPaused,
    histFrom, setHistFrom,
    histTo, setHistTo,
    compareMode, setCompareMode,
    chartData, kpis, station: STATION,
    sessionSecs,
  }
}

function sliceWindow(data: ChartPoint[], window: LiveWindow): ChartPoint[] {
  const n = WINDOW_MINS[window]
  return data.slice(-n)
}

export const useDashboard = () => useContext(DashboardContext)
