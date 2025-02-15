import { NextResponse } from 'next/server'
import { connectedClients, saveTrade } from '@/lib/store'
import { tradersData } from "../../../../traders";


export async function POST(request: Request) {
  try {
    const webhookData = await request.json()
    if (!Array.isArray(webhookData) || webhookData.length === 0) {
      return NextResponse.json({ error: 'Invalid webhook data format' }, { status: 400 })
    }

    const transaction = webhookData[0]
    if (!transaction?.feePayer) {
      return NextResponse.json({ error: 'Missing required transaction data' }, { status: 400 })
    }

    console.log('Webhook data:', webhookData)
    console.log('Description:', transaction.description)
    
    // Parse the description to get sender and receiver addresses
    const description = transaction.description
    const addressRegex = /([1-9A-HJ-NP-Za-km-z]{32,44})/g
    const addresses = description.match(addressRegex) || []
    const [senderAddress, receiverAddress] = addresses
    
    console.log('Parsed addresses:', { senderAddress, receiverAddress })
    
    // Find matching trader data based on either sending or receiving
    const matchingTrader = tradersData.find(trader => {
      const traderWallet = trader.wallet.toLowerCase()
      const isSender = senderAddress?.toLowerCase() === traderWallet
      const isReceiver = receiverAddress?.toLowerCase() === traderWallet
      
      console.log('Comparing trader:', {
        traderWallet,
        isSender,
        isReceiver,
        senderAddress,
        receiverAddress
      })
      
      return isSender || isReceiver
    })
    
    console.log('Matching trader:', matchingTrader)
    
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
    const broadcastPromises = Array.from(connectedClients).map(client =>
      client.write(encoder.encode(`data: ${JSON.stringify(trade)}\n\n`))
        .catch(() => {
          connectedClients.delete(client)
        })
    )
    
    await Promise.all(broadcastPromises)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 