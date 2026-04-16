/**
 * Format a number with specified decimal places.
 * Returns '--' if value is null.
 */
export function formatValue(
  value: number | null,
  decimals: number = 2,
): string {
  if (value === null || isNaN(value)) return '--'
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * Format percent change, e.g. "+1.23%" or "-0.45%"
 */
export function formatPercent(value: number | null): string {
  if (value === null || isNaN(value)) return '--'
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

/**
 * Format change value, e.g. "+12.34" or "-0.56"
 */
export function formatChange(
  value: number | null,
  decimals: number = 2,
): string {
  if (value === null || isNaN(value)) return '--'
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(decimals)}`
}

/**
 * Format a Date to "HH:MM:SS" in local timezone
 */
export function formatTime(date: Date | null): string {
  if (!date) return '--:--:--'
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}
