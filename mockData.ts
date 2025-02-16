export const mockStatsData = {
   tokenCount: 100,
   winRate: 50,
   trades: {buys: 200, sells: 100},
   avgBuy: 100, // avg amount of SOL invested per trade
   avgEntry: 100, // avg market cap of entry
   avgHold: 100, // in minutes
   totalInvested: 1000,
   roi: 100
}

export const mockTradesData = [
   {
      id: 1,
      tokenInPic: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1747030504",
      tokenInSymbol: "SOL",
      amountIn: 100,
      tokenOutPic: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1747030504",
      tokenOutSymbol: "USDC",
      tokenOutAddress: "EPjFWdd5AdfqSSqeM2qA1uzyqNpz8C4wEGGGZwyTDw1v",
      amountOut: 100,
      entryPrice: 100,
      exitPrice: 100,
      pnl: 100,
      roi: 100,
      lastTrade: "2023-10-01T12:00:00Z",
      amountInvested: 1000,
      holding: 50,
      avgSell: 150,
      holdingTime: 120,
      action: "buy",
      fromToken: "USDC",
      fromAmount: 100,
      toToken: "SOL",
      toAmount: 100,
      fromTokenData: {
         image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1747030504",
         symbol: "SOL",
         address: "So11111111111111111111111111111111111111112",
         priceUsd: "100",
         volume24h: 100,
         marketCap: 1000000000,
         liquidity: 100,
         priceChange24h: 0,
         holderCount: 100,
         totalSupply: "1000000"
      },
      toTokenData: {
         image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1747030504",
         symbol: "USDC",
         address: "EPjFWdd5AdfqSSqeM2qA1uzyqNpz8C4wEGGGZwyTDw1v",
         priceUsd: "100",
         volume24h: 100,
         marketCap: 1000000000,
         liquidity: 100,
         priceChange24h: 0,
         holderCount: 100,
         totalSupply: "1000000"
      },
   },
   {
      id: 2,
      tokenInPic: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1747030504",
      tokenInSymbol: "SOL",
      amountIn: 100,
      tokenOutPic: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1747030504",
      tokenOutSymbol: "LOCKIN",
      tokenOutAddress: "8Ki8DpuWNxu9VsS3kQbarsCWMcFGWkzzA8pUPto9zBd5",
      amountOut: 100,
      entryPrice: 100,
      exitPrice: 100,
      pnl: 100,
      roi: 100,
      lastTrade: "2023-10-02T12:00:00Z",
      amountInvested: 2000,
      holding: 30,
      avgSell: 250,
      holdingTime: 90,
      action: "sell",
      fromToken: "SOL",
      fromAmount: 100,
      toToken: "LOCKIN",
      toAmount: 100,
      fromTokenData: {
         image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1747030504",
         symbol: "SOL",
         address: "So11111111111111111111111111111111111111112",
         priceUsd: "100",
         volume24h: 100,
         marketCap: 1000000000,
         liquidity: 100,
         priceChange24h: 0,
         holderCount: 100,
         totalSupply: "1000000"
      },
      toTokenData: {
         image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1747030504",
         symbol: "LOCKIN",
         address: "8Ki8DpuWNxu9VsS3kQbarsCWMcFGWkzzA8pUPto9zBd5",
         priceUsd: "100",
         volume24h: 100,
         marketCap: 1000000000,
         liquidity: 100,
         priceChange24h: 0,
         holderCount: 100,
         totalSupply: "1000000"
      },
   }
]

export const mockTokenHoldingsData = [
   {
      id: 1,
      tokenPic: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1747030504",
      tokenSymbol: "SOL",
      amount: 100,
      marketCap: 1000000000,
      unrealizedPnl: 100,
   },
   {
      id: 2,
      tokenPic: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1747030504",
      tokenSymbol: "LOCKIN",
      amount: 100,
      marketCap: 1000000000,
      unrealizedPnl: 100,
   }
]
