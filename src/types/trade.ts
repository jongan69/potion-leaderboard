export interface Trade {
  id: number
  wallet: string
  label: string
  description: string
  signature: string
  timestamp: number
  action: string | null
  // from token
  fromTokenAddress: string
  fromTokenSymbol: string
  fromTokenPic: string
  fromAmount: number

  // to token
  toTokenAddress: string
  toTokenSymbol: string
  toTokenPic: string
  toAmount: number

  entryPrice: number
  exitPrice: number
  pnl: number
  roi: number
  lastTrade: string
  amountInvested: number
  holding: number
  avgSell: number
  holdingTime: number
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