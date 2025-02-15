export interface Trade {
  wallet: string
  amount: number
  timestamp: number
  label: string
  token: string | null
  description: string
  signature: string
  action: string | null
  fromAmount: number
  fromToken: string | null
  tokenData: {
    priceUsd: string
    volume24h: number
    marketCap: number
    liquidity: number
    priceChange24h: number
    holderCount?: number
    totalSupply?: string
  } | null
} 