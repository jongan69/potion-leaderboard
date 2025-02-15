import { WritableStreamDefaultWriter } from 'stream/web'
import { MongoClient } from 'mongodb'

// In-memory store for active connections
export const connectedClients = new Set<WritableStreamDefaultWriter>()

// MongoDB connection for trade history
const uri = process.env.MONGODB_URI
const client = new MongoClient(uri!)

export interface TradeHistory {
  wallet: string
  amount: number
  timestamp: number
  label: string
}

export async function saveTrade(trade: TradeHistory) {
  try {
    await client.connect()
    const db = client.db('potion-leaderboard')
    await db.collection('trades').insertOne(trade)
  } finally {
    await client.close()
  }
}

export async function getTradeHistory(limit = 100) {
  try {
    await client.connect()
    const db = client.db('potion-leaderboard')
    return await db.collection('trades')
      .find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray()
  } finally {
    await client.close()
  }
} 