'use client'

import { useEffect, useState } from 'react'

interface Trade {
  wallet?: string
  amount?: number
  timestamp?: number
  message?: string
  label?: string
}

export function LiveTrades() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting')

  useEffect(() => {
    const eventSource = new EventSource('/api/trades/stream')
    let reconnectAttempts = 0
    const maxReconnectAttempts = 3

    eventSource.onopen = () => {
      setStatus('connected')
      reconnectAttempts = 0 // Reset attempts on successful connection
    }

    eventSource.onmessage = (event) => {
      try {
        const trade = JSON.parse(event.data)
        setTrades((prevTrades) => {
          // Avoid duplicate connection messages
          if (trade.message && prevTrades.some(t => t.message)) {
            return prevTrades
          }
          return [trade, ...prevTrades].slice(0, 10)
        })
      } catch (error) {
        console.error('Error parsing trade data:', error)
      }
    }

    eventSource.onerror = () => {
      reconnectAttempts++
      setStatus('error')
      if (reconnectAttempts >= maxReconnectAttempts) {
        eventSource.close()
      }
    }

    return () => {
      eventSource.close()
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
        {trades.map((trade, index) => {
          // Handle connection message
          if (trade.message) {
            return (
              <div key={index} className="p-2 text-sm text-muted-foreground">
                {trade.message}
              </div>
            )
          }

          // Handle trade data
          if (trade.wallet) {
            return (
              <div key={index} className="flex justify-between items-center p-2 bg-secondary/50 rounded">
                <div>
                  <span className="font-medium mr-2">{trade.label}</span>
                  <span className="font-mono text-sm text-muted-foreground">
                    {trade.wallet.slice(0, 6)}...{trade.wallet.slice(-4)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{trade.amount} SOL</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(trade.timestamp || 0).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            )
          }

          return null
        })}
      </div>
    </div>
  )
} 