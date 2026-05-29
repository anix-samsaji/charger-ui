# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start Vite dev server at http://localhost:5173
npm run build     # TypeScript compile + Vite production build
npm run preview   # serve the dist/ build locally
npx tsc --noEmit  # type-check only (no build output)
```

No test runner is configured yet. TypeScript strict mode is enabled — run `npx tsc --noEmit` after every non-trivial change.

## Stack

| Concern | Library |
|---|---|
| Framework | React 18 + TypeScript + Vite 6 |
| Styling | Tailwind CSS 3 (class-based dark mode, CSS variables for M3 tokens) |
| Charts | Recharts 2 (`ResponsiveContainer` wraps all charts) |
| Map | MapLibre GL JS 4 (async-imported to avoid SSR issues) |
| Animation | Framer Motion 11 (`motion.*`, `AnimatePresence`, `useSpring`) |
| Data / state | React Context + `useState`/`useEffect` (no external state library) |

## Architecture

### Theme system
All Material 3 color tokens are CSS custom properties (e.g. `--m3-primary: 61 168 20`) defined in `src/index.css`, with a `.dark` override block for dark mode. Tailwind references them via `rgb(var(--m3-xxx) / <alpha-value>)` in `tailwind.config.ts`, which enables Tailwind opacity modifiers (`bg-primary/10`) to work correctly. The `dark` class is toggled on `<html>` by `useTheme` — **do not use `dark:` Tailwind variants**; change the CSS variables instead.

Theme switching uses the View Transition API (circular reveal from the button) with a graceful fallback for unsupported browsers.

### Data flow
```
useDashboardProvider()          ← single source of truth (lives in App.tsx)
  ├─ generateHistory()          ← initial 60-point mock session in mockData.ts
  ├─ nextLiveTick()             ← called by setInterval at refreshRate
  ├─ deriveKPIs()               ← computes KPIValues from latest ChartPoint
  └─ DashboardContext           ← consumed by TopBar, KPIStrip, ChartGrid, MapCard
```

`chartData` is a sliding window (`LiveWindow` → last N minutes) sliced from a 120-point ring buffer. When mode switches to `historical`, a fresh `generateHistory(60)` call is used as a placeholder.

### Component tree
```
App
└── ThemeProvider
    └── DashboardContext.Provider (useDashboardProvider)
        ├── TopBar
        │   └── LiveHistoricalToggle  ← hero control with AnimatePresence
        ├── KPIStrip
        │   └── KPICard × 7           ← animated numbers via Framer useSpring
        └── 12-col grid
            ├── ChartGrid (9 cols)
            │   ├── ChartCard (wrapper: title, mode badge, legend)
            │   └── [PowerSoC|GridImbalance|Thermal|DCVoltage|DCCurrent|ACPhase]Chart
            └── MapCard (3 cols)      ← MapLibre, async import
```

### Charts pattern
Every chart is `ResponsiveContainer → [Area|Line|Composed]Chart` from Recharts. They receive `data: ChartPoint[]` only — no other props. The `ChartCard` wrapper supplies the title, mode badge, legend chips, and three-dot menu. Chart-specific gradient `<defs>` use CSS variable references so they respond to theme changes.

### MapLibre integration
`MapCard` dynamically imports `maplibre-gl` (keeps it out of the initial bundle). The map instance is stored in a `useRef` to avoid React re-render cycles. Theme changes update the map style via `map.setStyle()` without destroying the instance. Light mode uses OSM raster tiles; dark mode uses Stadia smooth-dark tiles (no API key required).

### KPI cards
`KPICard` uses `framer-motion`'s `useSpring` + `useTransform` to animate numeric value changes as odometer rolls. `variant` prop drives special layouts: `circular` (progress ring), `cost` (₹ note), `efficiency` (label). Temperature cards infer `status` (`normal` / `warning` / `critical`) from thresholds (45 °C / 55 °C), which drives Tailwind color classes and a left-border accent animation.

## Key files

| File | Purpose |
|---|---|
| `src/index.css` | M3 token CSS variables (light + dark) and global styles |
| `tailwind.config.ts` | Maps all M3 tokens + custom type scale, animation keyframes |
| `src/types/index.ts` | Shared TypeScript types (`ChartPoint`, `KPIValues`, `DashboardMode`, …) |
| `src/data/mockData.ts` | Realistic DC fast-charge curve generator + live tick function |
| `src/hooks/useTheme.tsx` | Theme context + View Transition API toggle |
| `src/hooks/useDashboard.ts` | Dashboard state context + live data interval logic |
| `src/components/ChartCard.tsx` | Shared card wrapper for all six charts |
| `src/components/MapCard.tsx` | MapLibre map with custom pin, frosted controls, info sheet |

## Color system reference

Amaron Electric Lime primary — **never** use olive or muted greens.

| Token | Light | Dark |
|---|---|---|
| `primary` | `#3DA814` | `#7EE352` |
| `tertiary` (accent/data) | `#006B7D` | `#5DD5EB` |
| warning | `#F5A623` (always) | — |
| multi-series 4th | `#D946EF` (magenta) | — |

Chart series order: lime → cyan → amber → magenta. **Never use red for a data series** unless it represents an actual fault state.
