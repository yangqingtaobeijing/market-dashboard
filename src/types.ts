/** Unique identifier for each market indicator */
export type IndicatorId = 'DXY' | 'US10Y' | 'WTI' | 'VIX' | 'BTC' | 'IXIC' | 'GSPC'

/** Static metadata for an indicator */
export interface IndicatorMeta {
  id: IndicatorId
  name: string
  nameEn: string
  unit: string
  decimals: number
  /** Symbol used for Twelve Data quote API */
  tdSymbol: string
  /** FRED series ID (only for US10Y fallback) */
  fredSeriesId?: string
  /** External link to view this indicator on an official site */
  externalUrl: string
  /** Whether this symbol works on Twelve Data free tier */
  freeSupported: boolean
}

/** Live data for an indicator card */
export interface IndicatorData {
  id: IndicatorId
  value: number | null
  change: number | null
  changePercent: number | null
  previousClose: number | null
  loading: boolean
  error: string | null
  lastUpdated: Date | null
}

/** Market session status */
export type MarketSession = 'pre-market' | 'regular' | 'post-market' | 'closed'

/** Refresh interval option */
export interface RefreshOption {
  label: string
  value: number // seconds, 0 = manual
}

/** User settings persisted in localStorage */
export interface UserSettings {
  twelveDataApiKey: string
  finnhubApiKey: string
  fredApiKey: string
  refreshInterval: number // seconds
  theme: 'dark' | 'light'
}
