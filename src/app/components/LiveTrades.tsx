'use client'

import { useEffect, useState } from 'react'
import Pusher from 'pusher-js'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface Trade {
  wallet?: string
  amount?: number
  timestamp?: number
  label?: string
  txHash?: string
  token?: string
  description?: string
  signature?: string
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
    <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold tracking-tight">Live Trades</h2>
        <div className="flex items-center gap-2 text-sm">
          {status === 'connecting' && (
            <div className="flex items-center gap-2">
              <div className="animate-pulse h-2 w-2 rounded-full bg-yellow-500" />
              <span className="text-yellow-500/90">Connecting...</span>
            </div>
          )}
          {status === 'connected' && (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-green-500/90">Live</span>
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-red-500/90">Connection error</span>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {trades.map((trade, index) => (
            <motion.div
              key={trade.timestamp}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex justify-between items-center p-3 bg-card rounded-lg border border-border/50 hover:bg-accent/50 transition-colors"
            >
              <Link href={`https://solscan.io/tx/${trade.txHash}`} target="_blank" className="w-full">
                <div className="flex items-center gap-3">

                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{trade.label}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {trade.wallet?.slice(0, 6)}...{trade.wallet?.slice(-4)}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {trade.description}
                    </span>
                  </div>

                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="font-medium text-sm">{trade.amount} SOL</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(trade.timestamp || 0).toLocaleTimeString()}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
        {trades.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Waiting for trades...</p>
          </div>
        )}
      </div>
    </div>
  )
} 