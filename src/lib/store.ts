import { Redis } from '@upstash/redis'
import { WritableStreamDefaultWriter } from 'stream/web'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// In-memory store for active connections
export const connectedClients = new Set<WritableStreamDefaultWriter>()

export interface TradeHistory {
  wallet: string
  amount: number
  timestamp: number
  label: string
}

export async function saveTrade(trade: TradeHistory) {
  const key = `trade:${Date.now()}`
  await redis.set(key, trade)
  await redis.zadd('trades_by_time', { score: trade.timestamp, member: key })
}

export async function getTradeHistory(limit = 100) {
  const tradeKeys = await redis.zrange('trades_by_time', 0, limit - 1, { rev: true }) as string[]
  if (!tradeKeys.length) return []
  return await redis.mget(...tradeKeys)
} 