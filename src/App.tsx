import { ThemeProvider }        from './hooks/useTheme'
import { DashboardContext, useDashboardProvider } from './hooks/useDashboard'
import TopBar                    from './components/TopBar'
import KPIStrip                  from './components/KPIStrip'
import ChartGrid                 from './components/ChartGrid'
import MapCard                   from './components/MapCard'
import LiveHistoricalToggle      from './components/LiveHistoricalToggle'

function Dashboard() {
  const ctx = useDashboardProvider()

  return (
    <DashboardContext.Provider value={ctx}>
      <div className="h-screen flex flex-col bg-background">
        <TopBar />

        {/* ── Scrollable content ── */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-grid-dots">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 xl:px-8 py-5 flex flex-col gap-4">

            {/* ── Hero filter bar ── */}
            <LiveHistoricalToggle />

            {/* ── KPI strip ── */}
            <KPIStrip kpis={ctx.kpis} history={ctx.chartData} />

            {/* ── Charts + Map ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Chart grid — 9 cols */}
              <div className="lg:col-span-9">
                <ChartGrid
                  data={ctx.chartData}
                  mode={ctx.mode}
                  window={ctx.liveWindow}
                />
              </div>

              {/* Map — 3 cols */}
              <div className="lg:col-span-3 min-h-[380px]">
                <MapCard station={ctx.station} />
              </div>
            </div>

          </div>
        </main>

        {/* ── Footer — outside scroll area, always visible ── */}
        <footer className="shrink-0 bg-surface border-t border-outline-variant/25 px-4 md:px-8 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[11px] text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              WebSocket: connected
            </span>
            <span className="hidden sm:inline">Last sync: just now</span>
            <span className="hidden md:inline">FW v3.2.1</span>
          </div>
          <a href="#" className="text-[11px] text-on-surface-variant hover:text-primary transition-colors">
            Support
          </a>
        </footer>
      </div>
    </DashboardContext.Provider>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  )
}
