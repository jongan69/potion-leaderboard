export type Wallet = {
  profilePic: string;
  wallet: string;
  xHandle: string;
  userName: string;
  followers: number;
  following: number;
  tokenCount: number;
  winRate: number;
  trades: { buys: number; sells: number };
  avgBuy: number;
  avgSell: number;
  
};