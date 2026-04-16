import type { MarketSession } from '../types'

/**
 * Determine current US market session based on ET (Eastern Time).
 *
 * Regular:     09:30 – 16:00 ET (Mon–Fri)
 * Pre-market:  04:00 – 09:30 ET
 * Post-market: 16:00 – 20:00 ET
 * Closed:      otherwise / weekends
 */
export function getMarketSession(): MarketSession {
  const now = new Date()

  // Convert to ET using Intl
  const etString = now.toLocaleString('en-US', {
    timeZone: 'America/New_York',
  })
  const et = new Date(etString)

  const day = et.getDay() // 0=Sun, 6=Sat
  if (day === 0 || day === 6) return 'closed'

  const hours = et.getHours()
  const minutes = et.getMinutes()
  const timeMinutes = hours * 60 + minutes

  // Pre-market: 04:00 – 09:29
  if (timeMinutes >= 240 && timeMinutes < 570) return 'pre-market'

  // Regular: 09:30 – 15:59
  if (timeMinutes >= 570 && timeMinutes < 960) return 'regular'

  // Post-market: 16:00 – 19:59
  if (timeMinutes >= 960 && timeMinutes < 1200) return 'post-market'

  return 'closed'
}

export function getMarketSessionLabel(session: MarketSession): string {
  switch (session) {
    case 'regular':
      return '🟢 开盘中'
    case 'pre-market':
      return '🟡 盘前交易'
    case 'post-market':
      return '🟡 盘后交易'
    case 'closed':
      return '🔴 已休市'
  }
}

export function getETTimeString(): string {
  return new Date().toLocaleString('zh-CN', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}
