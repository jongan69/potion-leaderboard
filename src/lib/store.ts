import { Redis } from '@upstash/redis'
import { ReadableStreamDefaultController } from 'stream/web'

const redis = new Redis({
  url: `https://${process.env.UPSTASH_REDIS_REST_URL}`,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// In-memory store for active connections
export const connectedClients = new Set<ReadableStreamDefaultController<Uint8Array>>()

export interface TradeHistory {
  wallet: string
  toAmount: number
  fromAmount: number
  timestamp: number
  label: string
}

export async function saveTrade(trade: TradeHistory) {
  const key = `trade:${Date.now()}`
  await redis.set(key, trade)
  await redis.expire(key, 86400) // Expire after 24 hours
  await redis.zadd('trades_by_time', { score: trade.timestamp, member: key })
}

export async function getTradeHistory(limit = 100) {
  const tradeKeys = await redis.zrange('trades_by_time', 0, limit - 1, { rev: true }) as string[]
  if (!tradeKeys.length) return []
  return await redis.mget(...tradeKeys)
} 