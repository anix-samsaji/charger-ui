import { motion } from 'framer-motion'
import ChartCard         from './ChartCard'
import PowerSoCChart     from './charts/PowerSoCChart'
import GridImbalanceChart from './charts/GridImbalanceChart'
import ThermalChart      from './charts/ThermalChart'
import DCVoltageChart    from './charts/DCVoltageChart'
import DCCurrentChart    from './charts/DCCurrentChart'
import ACPhaseChart      from './charts/ACPhaseChart'
import type { ChartPoint, DashboardMode, LiveWindow } from '../types'

interface Props {
  data:   ChartPoint[]
  mode:   DashboardMode
  window: LiveWindow
}

/*
  Height strategy: motion.div has an explicit px height.
  ChartCard inside is h-full flex-col.
  Header is shrink-0 (~44px). Body is flex-1 min-h-0.
  ResponsiveContainer height="100%" measures the flex-distributed body height — no inner wrapper div.
*/
const H   = 'h-[260px]'   // outer card height
const ANI = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }

export default function ChartGrid({ data, mode, window }: Props) {
  const win = mode === 'live' ? window : undefined

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xl:gap-4">

      {/* ① DC Power & SoC — spans 2 cols */}
      <motion.div className={`sm:col-span-2 ${H}`} {...ANI} transition={{ delay: 0.05, duration: 0.45, ease: [0.2,0,0,1] }}>
        <ChartCard
          title="DC Real-time Power & SoC"
          mode={mode} window={win} colSpan={2}
          legend={[
            { label: 'Power (kW)', color: 'rgb(var(--m3-primary))'  },
            { label: 'SoC (%)',    color: 'rgb(var(--m3-tertiary))' },
          ]}
        >
          <PowerSoCChart data={data} />
        </ChartCard>
      </motion.div>

      {/* ② Grid Imbalance */}
      <motion.div className={H} {...ANI} transition={{ delay: 0.09, duration: 0.45, ease: [0.2,0,0,1] }}>
        <ChartCard
          title="Grid Voltage Imbalance"
          mode={mode} window={win}
          legend={[{ label: 'Imbalance %', color: 'rgb(var(--m3-tertiary))' }]}
        >
          <GridImbalanceChart data={data} />
        </ChartCard>
      </motion.div>

      {/* ③ Thermal Safety */}
      <motion.div className={H} {...ANI} transition={{ delay: 0.13, duration: 0.45, ease: [0.2,0,0,1] }}>
        <ChartCard
          title="Thermal Safety"
          mode={mode} window={win}
          legend={[
            { label: 'GUN Red',  color: 'rgb(var(--m3-error))'   },
            { label: 'GUN Blk',  color: '#F5A623'                 },
            { label: 'Rect 1',   color: 'rgb(var(--m3-primary))' },
          ]}
        >
          <ThermalChart data={data} />
        </ChartCard>
      </motion.div>

      {/* ④ DC Voltage */}
      <motion.div className={H} {...ANI} transition={{ delay: 0.17, duration: 0.45, ease: [0.2,0,0,1] }}>
        <ChartCard
          title="DC Voltage Demand vs Supply"
          mode={mode} window={win}
          legend={[
            { label: 'Demand', color: 'rgb(var(--m3-secondary))' },
            { label: 'Supply', color: 'rgb(var(--m3-primary))'   },
          ]}
        >
          <DCVoltageChart data={data} />
        </ChartCard>
      </motion.div>

      {/* ⑤ DC Current */}
      <motion.div className={H} {...ANI} transition={{ delay: 0.21, duration: 0.45, ease: [0.2,0,0,1] }}>
        <ChartCard
          title="DC Current Demand vs Supply"
          mode={mode} window={win}
          legend={[
            { label: 'Demand', color: 'rgb(var(--m3-secondary))' },
            { label: 'Supply', color: 'rgb(var(--m3-primary))'   },
          ]}
        >
          <DCCurrentChart data={data} />
        </ChartCard>
      </motion.div>

      {/* ⑥ AC Phase */}
      <motion.div className={H} {...ANI} transition={{ delay: 0.25, duration: 0.45, ease: [0.2,0,0,1] }}>
        <ChartCard
          title="AC Voltage Phase Balancing"
          mode={mode} window={win}
          legend={[
            { label: 'L1', color: 'rgb(var(--m3-primary))'  },
            { label: 'L2', color: 'rgb(var(--m3-tertiary))' },
            { label: 'L3', color: '#D946EF'                 },
          ]}
        >
          <ACPhaseChart data={data} />
        </ChartCard>
      </motion.div>

    </div>
  )
}
