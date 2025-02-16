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
      wallet: "5KKsLVU6TcbVDK4BS6K1DGDxnh4Q9xjN7SCi7uqryYVV",
      label: "Sample Trade",
      description: "Sample trade description",
      signature: "5KKsLVU6TcbVDK4BS6K1DGDxnh4Q9xjN7SCi7uqryYVV",
      timestamp: 1696161600000, // 2023-10-01T12:00:00Z in milliseconds
      action: "buy",
      fromTokenAddress: "EPjFWdd5AdfqSSqeM2qA1uzyqNpz8C4wEGGGZwyTDw1v",
      fromTokenSymbol: "USDC",
      fromTokenPic: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
      fromAmount: 100,
      toTokenAddress: "So11111111111111111111111111111111111111112",
      toTokenSymbol: "SOL",
      toTokenPic: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
      toAmount: 100,
      entryPrice: 100,
      exitPrice: 100,
      pnl: 100,
      roi: 100,
      lastTrade: "2023-10-01T12:00:00Z",
      amountInvested: 1000,
      holding: 50,
      avgSell: 150,
      holdingTime: 120,
      fromTokenData: {
         image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
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
      toTokenData: {
         image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
         symbol: "SOL",
         address: "So11111111111111111111111111111111111111112",
         priceUsd: "100",
         volume24h: 100,
         marketCap: 1000000000,
         liquidity: 100,
         priceChange24h: 0,
         holderCount: 100,
         totalSupply: "1000000"
      }
   },
   {
      id: 2,
      wallet: "5KKsLVU6TcbVDK4BS6K1DGDxnh4Q9xjN7SCi7uqryYVV",
      label: "Sample Trade 2",
      description: "Sample trade description 2",
      signature: "6LLsLVU6TcbVDK4BS6K1DGDxnh4Q9xjN7SCi7uqryYVV",
      timestamp: 1696248000000, // 2023-10-02T12:00:00Z in milliseconds
      action: "sell",
      fromTokenAddress: "So11111111111111111111111111111111111111112",
      fromTokenSymbol: "SOL",
      fromTokenPic: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
      fromAmount: 100,
      toTokenAddress: "8Ki8DpuWNxu9VsS3kQbarsCWMcFGWkzzA8pUPto9zBd5",
      toTokenSymbol: "LOCKIN",
      toTokenPic: "https://dd.dexscreener.com/ds-data/tokens/solana/8Ki8DpuWNxu9VsS3kQbarsCWMcFGWkzzA8pUPto9zBd5.png?key=0e995a",
      toAmount: 100,
      entryPrice: 100,
      exitPrice: 100,
      pnl: 100,
      roi: 100,
      lastTrade: "2023-10-02T12:00:00Z",
      amountInvested: 2000,
      holding: 30,
      avgSell: 250,
      holdingTime: 90,
      fromTokenData: {
         image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
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
         image: "https://dd.dexscreener.com/ds-data/tokens/solana/8Ki8DpuWNxu9VsS3kQbarsCWMcFGWkzzA8pUPto9zBd5.png?key=0e995a",
         symbol: "LOCKIN",
         address: "8Ki8DpuWNxu9VsS3kQbarsCWMcFGWkzzA8pUPto9zBd5",
         priceUsd: "100",
         volume24h: 100,
         marketCap: 1000000000,
         liquidity: 100,
         priceChange24h: 0,
         holderCount: 100,
         totalSupply: "1000000"
      }
   }
]

export const mockTokenHoldingsData = [
   {
      id: 1,
      tokenPic: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
      tokenSymbol: "SOL",
      amount: 100,
      marketCap: 1000000000,
      unrealizedPnl: 100,
   },
   {
      id: 2,
      tokenPic: "https://dd.dexscreener.com/ds-data/tokens/solana/8Ki8DpuWNxu9VsS3kQbarsCWMcFGWkzzA8pUPto9zBd5.png?key=0e995a",
      tokenSymbol: "LOCKIN",
      amount: 100,
      marketCap: 1000000000,
      unrealizedPnl: 100,
   }
]
