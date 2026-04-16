import type { IndicatorMeta, RefreshOption, UserSettings } from './types'

export const INDICATORS: IndicatorMeta[] = [
  {
    id: 'DXY',
    name: '美元指数',
    nameEn: 'US Dollar Index',
    unit: '',
    decimals: 3,
    tdSymbol: 'DX-Y.NYB',
  },
  {
    id: 'US10Y',
    name: '十年期美债收益率',
    nameEn: '10-Year Treasury Yield',
    unit: '%',
    decimals: 3,
    tdSymbol: 'US10Y',
    fredSeriesId: 'DGS10',
  },
  {
    id: 'WTI',
    name: 'WTI 原油',
    nameEn: 'Crude Oil WTI',
    unit: 'USD',
    decimals: 2,
    tdSymbol: 'CL=F',
  },
  {
    id: 'VIX',
    name: '恐慌指数',
    nameEn: 'CBOE Volatility Index',
    unit: '',
    decimals: 2,
    tdSymbol: 'VIX',
  },
  {
    id: 'BTC',
    name: '比特币',
    nameEn: 'Bitcoin',
    unit: 'USD',
    decimals: 2,
    tdSymbol: 'BTC/USD',
  },
  {
    id: 'IXIC',
    name: '纳斯达克指数',
    nameEn: 'Nasdaq Composite',
    unit: '',
    decimals: 2,
    tdSymbol: 'IXIC',
  },
  {
    id: 'GSPC',
    name: '标普500指数',
    nameEn: 'S&P 500',
    unit: '',
    decimals: 2,
    tdSymbol: 'GSPC',
  },
]

export const REFRESH_OPTIONS: RefreshOption[] = [
  { label: '30 秒', value: 30 },
  { label: '1 分钟', value: 60 },
  { label: '5 分钟', value: 300 },
  { label: '手动刷新', value: 0 },
]

export const DEFAULT_SETTINGS: UserSettings = {
  twelveDataApiKey: '2baa491ec3804f86a76c0000f86be6ba',
  finnhubApiKey: '',
  fredApiKey: '',
  refreshInterval: 300,
  theme: 'dark',
}

export const LS_KEY_SETTINGS = 'market-dashboard-settings'
