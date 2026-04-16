import type { IndicatorMeta, RefreshOption, UserSettings } from './types'

export const INDICATORS: IndicatorMeta[] = [
  {
    id: 'DXY',
    name: '美元指数',
    nameEn: 'DXY',
    unit: '',
    decimals: 3,
    tdSymbol: 'UUP',
    externalUrl: 'https://www.investing.com/currencies/us-dollar-index',
    freeSupported: false,
  },
  {
    id: 'US10Y',
    name: '十年期美债收益率',
    nameEn: 'US10Y',
    unit: '%',
    decimals: 3,
    tdSymbol: 'TLT',
    fredSeriesId: 'DGS10',
    externalUrl: 'https://www.investing.com/rates-bonds/u.s.-10-year-bond-yield',
    freeSupported: true,
  },
  {
    id: 'WTI',
    name: 'WTI 原油',
    nameEn: 'WTI',
    unit: 'USD',
    decimals: 2,
    tdSymbol: 'USO',
    externalUrl: 'https://www.investing.com/commodities/crude-oil',
    freeSupported: false,
  },
  {
    id: 'VIX',
    name: '恐慌指数',
    nameEn: 'VIX',
    unit: '',
    decimals: 2,
    tdSymbol: 'VIXY',
    externalUrl: 'https://www.investing.com/indices/volatility-s-p-500',
    freeSupported: true,
  },
  {
    id: 'BTC',
    name: '比特币',
    nameEn: 'BTC',
    unit: 'USD',
    decimals: 2,
    tdSymbol: 'BTC/USD',
    externalUrl: 'https://www.investing.com/crypto/bitcoin',
    freeSupported: true,
  },
  {
    id: 'IXIC',
    name: '纳斯达克指数',
    nameEn: 'IXIC',
    unit: '',
    decimals: 2,
    tdSymbol: 'QQQ',
    externalUrl: 'https://www.investing.com/indices/nasdaq-composite',
    freeSupported: true,
  },
  {
    id: 'GSPC',
    name: '标普500指数',
    nameEn: 'GSPC',
    unit: '',
    decimals: 2,
    tdSymbol: 'SPY',
    externalUrl: 'https://www.investing.com/indices/us-spx-500',
    freeSupported: true,
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
