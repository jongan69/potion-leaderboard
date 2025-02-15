import { NextResponse } from 'next/server'
import { connectedClients, saveTrade } from '@/lib/store'
import { tradersData } from "../../../../traders";


export async function POST(request: Request) {
  const webhookData = await request.json()
  console.log(webhookData)
  
  // Extract the first transaction from the array
  const transaction = webhookData[0]
  
  // Find matching trader data
  const matchingTrader = tradersData.find(trader => 
    trader.wallet === transaction.feePayer
  )
  console.log(matchingTrader)
  // Get amount from nativeTransfers
  const amount = transaction.nativeTransfers[0]?.amount || 0
  
  // Process the webhook data from Helius
  const trade = {
    wallet: transaction.feePayer,
    amount: amount / 1e9, // Convert lamports to SOL
    timestamp: transaction.timestamp * 1000,
    label: matchingTrader?.userName || 'Unknown'
  }

  // Save to Redis and broadcast to clients
  await saveTrade(trade)
  
  const encoder = new TextEncoder()
  connectedClients.forEach(client => {
    client.write(encoder.encode(`data: ${JSON.stringify(trade)}\n\n`))
      .catch(() => {
        connectedClients.delete(client)
      })
  })

  return NextResponse.json({ success: true })
} 