/**
 * FRED API client for US10Y (DGS10).
 * Free, virtually unlimited.
 * https://api.stlouisfed.org
 */

interface FREDObservation {
  realtime_start: string
  realtime_end: string
  date: string
  value: string
}

interface FREDResponse {
  observations?: FREDObservation[]
  error_code?: number
  error_message?: string
}

export interface FREDResult {
  value: number
  date: string
}

const BASE_URL = 'https://api.stlouisfed.org/fred/series/observations'

export async function fetchFREDLatest(
  seriesId: string,
  apiKey: string,
): Promise<FREDResult> {
  const url =
    `${BASE_URL}?series_id=${encodeURIComponent(seriesId)}` +
    `&api_key=${encodeURIComponent(apiKey)}` +
    `&sort_order=desc&limit=5&file_type=json`

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`FRED HTTP ${res.status}: ${res.statusText}`)
  }

  const data: FREDResponse = await res.json()

  if (data.error_code) {
    throw new Error(data.error_message ?? `FRED error (code ${data.error_code})`)
  }

  const observations = data.observations
  if (!observations || observations.length === 0) {
    throw new Error('No FRED observations returned')
  }

  // Find the latest non-"." value (FRED uses "." for missing data)
  const valid = observations.find((o) => o.value !== '.')
  if (!valid) {
    throw new Error('No valid FRED observation found')
  }

  return {
    value: parseFloat(valid.value),
    date: valid.date,
  }
}
