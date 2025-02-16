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
      tokenOutSymbol: "SOL",
      tokenOutAddress: "8Ki8DpuWNxu9VsS3kQbarsCWMcFGWkzzA8pUPto9zBd5",
      amountOut: 100,
      entryPrice: 100,
      exitPrice: 100,
      pnl: 100,
      roi: 100,
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
