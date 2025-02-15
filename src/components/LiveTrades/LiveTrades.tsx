'use client'

import { useEffect, useState } from 'react'
import Pusher from 'pusher-js'
import { AnimatePresence } from 'framer-motion'
import { Trade } from '@/types/trade'
import { ConnectionStatus } from './ConnectionStatus'
import { TradeCard } from './TradeCard'

export function LiveTrades() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting')

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
    })

    const channel = pusher.subscribe('trades')

    channel.bind('new-trade', (trade: Trade) => {
      setTrades(prevTrades => [...prevTrades, trade]
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        .slice(0, 15)
      )
    })

    pusher.connection.bind('connected', () => setStatus('connected'))
    pusher.connection.bind('error', () => setStatus('error'))

    // Clean up old trades periodically
    const cleanupInterval = setInterval(() => {
      const fiveMinutesAgo = Date.now() - (5 * 60 * 1000)
      setTrades(prevTrades => prevTrades.filter(trade => 
        (trade.timestamp || 0) > fiveMinutesAgo
      ))
    }, 1000)

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
      pusher.disconnect()
      clearInterval(cleanupInterval)
    }
  }, [])

  return (
    <div className="rounded border bg-card p-4 shadow-md flex flex-col w-full mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Live Trades</h2>
        <ConnectionStatus status={status} />
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        <AnimatePresence initial={false}>
          {trades.slice(0, 15).map((trade) => (
            <TradeCard key={trade.signature} trade={trade} />
          ))}
        </AnimatePresence>
        
        {trades.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm">Waiting for trades...</p>
          </div>
        )}
      </div>
    </div>
  )
} 