import { NextResponse } from 'next/server'
import { connectedClients } from '@/lib/store'
import { tradersData } from "../../../../traders";


export async function POST(request: Request) {
  const webhookData = await request.json()
  console.log(webhookData)
  
  // Extract the first transaction from the array
  const transaction = webhookData[0]
  
  // Find matching trader data
  const matchingTrader = tradersData.find(trader => 
    trader.wallet.toLowerCase() === transaction.feePayer.toLowerCase()
  )
  
  // Process the webhook data from Helius
  const trade = {
    wallet: transaction.feePayer,
    amount: transaction.tokenTransfers[0].amount,
    timestamp: transaction.timestamp * 1000,
    label: matchingTrader?.userName || 'Unknown'
  }

  // Broadcast to all connected clients
  const encoder = new TextEncoder()
  connectedClients.forEach(client => {
    client.write(encoder.encode(`data: ${JSON.stringify(trade)}\n\n`))
      .catch(() => {
        connectedClients.delete(client)
      })
  })

  return NextResponse.json({ success: true })
} 