'use client'

import { useEffect, useState } from 'react'
import Pusher from 'pusher-js'

interface Trade {
  wallet?: string
  amount?: number
  timestamp?: number
  label?: string
}

export function LiveTrades() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting')

  useEffect(() => {
    // Initialize Pusher
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
    })

    // Subscribe to the trades channel
    const channel = pusher.subscribe('trades')
    
    // Listen for new trades
    channel.bind('new-trade', (trade: Trade) => {
      setTrades((prevTrades) => [trade, ...prevTrades].slice(0, 10))
    })

    // Update connection status
    pusher.connection.bind('connected', () => {
      setStatus('connected')
    })

    pusher.connection.bind('error', () => {
      setStatus('error')
    })

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
      pusher.disconnect()
    }
  }, [])

  return (
    <div className="rounded-lg border p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Live Trades</h2>
        <div className="text-sm">
          {status === 'connecting' && <span className="text-yellow-500">Connecting...</span>}
          {status === 'connected' && <span className="text-green-500">Connected</span>}
          {status === 'error' && <span className="text-red-500">Connection error</span>}
        </div>
      </div>
      <div className="space-y-2">
        {trades.map((trade, index) => (
          <div key={index} className="flex justify-between items-center p-2 bg-secondary/50 rounded">
            <div>
              <span className="font-medium mr-2">{trade.label}</span>
              <span className="font-mono text-sm text-muted-foreground">
                {trade.wallet?.slice(0, 6)}...{trade.wallet?.slice(-4)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{trade.amount} SOL</span>
              <span className="text-sm text-muted-foreground">
                {new Date(trade.timestamp || 0).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 