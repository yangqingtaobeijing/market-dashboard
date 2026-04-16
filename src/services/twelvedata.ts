/**
 * Twelve Data API client.
 * Free tier: 8 req/min, 800 req/day.
 * https://api.twelvedata.com
 */

interface TDQuoteResponse {
  symbol: string
  name: string
  exchange: string
  datetime: string
  timestamp: number
  open: string
  high: string
  low: string
  close: string
  volume: string
  previous_close: string
  change: string
  percent_change: string
  is_market_open: boolean
  // error fields
  code?: number
  message?: string
  status?: string
}

export interface QuoteResult {
  price: number
  change: number
  changePercent: number
  previousClose: number
}

const BASE_URL = 'https://api.twelvedata.com'

export async function fetchQuote(
  symbol: string,
  apiKey: string,
): Promise<QuoteResult> {
  const url = `${BASE_URL}/quote?symbol=${encodeURIComponent(symbol)}&apikey=${encodeURIComponent(apiKey)}`

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  }

  const data: TDQuoteResponse = await res.json()

  if (data.code && data.code !== 200) {
    throw new Error(data.message ?? `Twelve Data error (code ${data.code})`)
  }

  if (data.status === 'error') {
    throw new Error(data.message ?? 'Unknown Twelve Data error')
  }

  const price = parseFloat(data.close)
  const change = parseFloat(data.change)
  const changePercent = parseFloat(data.percent_change)
  const previousClose = parseFloat(data.previous_close)

  if (isNaN(price)) {
    throw new Error('Invalid price data returned')
  }

  return { price, change, changePercent, previousClose }
}
