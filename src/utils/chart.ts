/** Returns an XAxis tickFormatter for a timestamp (ms).
 *  Shows HH:mm:ss for ranges < 10 min (fast live windows),
 *  HH:mm for anything wider. */
export function makeTimeFmt(data: { ts: number }[]) {
  const range =
    data.length > 1 ? data[data.length - 1].ts - data[0].ts : 0
  const showSecs = range < 10 * 60_000

  return (ts: number): string => {
    const d  = new Date(ts)
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    const ss = String(d.getSeconds()).padStart(2, '0')
    return showSecs ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`
  }
}
