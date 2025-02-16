export interface Trade {
  wallet: string
  label: string
  description: string
  signature: string
  timestamp: number
  action: string | null
  fromToken: string | null
  fromAmount: number
  toToken: string | null
  toAmount: number
  fromTokenData: {
    image: string
    symbol: string
    address: string
    priceUsd: string
    volume24h: number
    marketCap: number
    liquidity: number
    priceChange24h: number
    holderCount?: number
    totalSupply?: string
  } | null
  toTokenData: {
    image: string
    symbol: string
    address: string
    priceUsd: string
    volume24h: number
    marketCap: number
    liquidity: number
    priceChange24h: number
    holderCount?: number
    totalSupply?: string
  } | null
} 