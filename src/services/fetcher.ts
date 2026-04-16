/**
 * Unified data fetcher that orchestrates API calls for all 7 indicators.
 *
 * Strategy:
 *   - Primary: Twelve Data `/quote` for all 7 indicators
 *   - Fallback for US10Y: FRED API (DGS10) — daily data, no intraday change
 */

import { INDICATORS } from '../constants'
import type { IndicatorData, IndicatorId, UserSettings } from '../types'
import { fetchQuote } from './twelvedata'
import { fetchFREDLatest } from './fred'

const MAX_RETRIES = 1
const RETRY_DELAYS = [2000]

function makeEmptyData(id: IndicatorId): IndicatorData {
  return {
    id,
    value: null,
    change: null,
    changePercent: null,
    previousClose: null,
    loading: false,
    error: null,
    lastUpdated: null,
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries: number = MAX_RETRIES,
): Promise<T> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      if (attempt === retries - 1) throw err
      await sleep(RETRY_DELAYS[attempt] ?? 4000)
    }
  }
  throw new Error('Unreachable')
}

async function fetchSingleIndicator(
  id: IndicatorId,
  settings: UserSettings,
): Promise<IndicatorData> {
  const meta = INDICATORS.find((i) => i.id === id)
  if (!meta) return { ...makeEmptyData(id), error: '未知指标' }

  // Try Twelve Data first
  if (settings.twelveDataApiKey) {
    try {
      const result = await fetchWithRetry(() =>
        fetchQuote(meta.tdSymbol, settings.twelveDataApiKey),
      )
      return {
        id,
        value: result.price,
        change: result.change,
        changePercent: result.changePercent,
        previousClose: result.previousClose,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      }
    } catch (err) {
      // For US10Y, try FRED fallback
      if (id === 'US10Y' && settings.fredApiKey && meta.fredSeriesId) {
        try {
          const fredResult = await fetchWithRetry(() =>
            fetchFREDLatest(meta.fredSeriesId!, settings.fredApiKey),
          )
          return {
            id,
            value: fredResult.value,
            change: null,
            changePercent: null,
            previousClose: null,
            loading: false,
            error: null,
            lastUpdated: new Date(),
          }
        } catch {
          // Fall through to error
        }
      }

      const message = err instanceof Error ? err.message : '数据获取失败'
      return { ...makeEmptyData(id), error: message }
    }
  }

  // No Twelve Data key — try FRED for US10Y
  if (id === 'US10Y' && settings.fredApiKey && meta.fredSeriesId) {
    try {
      const fredResult = await fetchWithRetry(() =>
        fetchFREDLatest(meta.fredSeriesId!, settings.fredApiKey),
      )
      return {
        id,
        value: fredResult.value,
        change: null,
        changePercent: null,
        previousClose: null,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '数据获取失败'
      return { ...makeEmptyData(id), error: message }
    }
  }

  return { ...makeEmptyData(id), error: '请在设置中配置 API Key' }
}

/**
 * Fetch all 7 indicators sequentially with delays.
 * Twelve Data free tier: 8 req/min.
 * We send one request every 8 seconds to stay safe.
 */
export async function fetchAllIndicators(
  settings: UserSettings,
): Promise<IndicatorData[]> {
  const ids = INDICATORS.map((i) => i.id)
  const results: IndicatorData[] = []

  for (let i = 0; i < ids.length; i++) {
    if (i > 0) {
      await sleep(8000) // 8s between requests = ~7.5 req/min max
    }
    const data = await fetchSingleIndicator(ids[i], settings)
    results.push(data)
  }

  return results
}
