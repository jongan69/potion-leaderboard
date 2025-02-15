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

    // Get amount and addresses from either native or token transfers
    let amount = 0
    let senderAddress = ''
    let receiverAddress = ''

    if (transaction.tokenTransfers && transaction.tokenTransfers.length > 0) {
      const tokenTransfer = transaction.tokenTransfers[0]
      amount = tokenTransfer.amount || 0
      senderAddress = tokenTransfer.fromUserAccount
      receiverAddress = tokenTransfer.toUserAccount
    } else if (transaction.nativeTransfers && transaction.nativeTransfers.length > 0) {
      const nativeTransfer = transaction.nativeTransfers[0]
      amount = nativeTransfer.amount || 0
      // Parse addresses from description for native transfers
      const addressRegex = /([1-9A-HJ-NP-Za-km-z]{32,44})/g
      const parsedAddresses = transaction.description.match(addressRegex) || []
      if (parsedAddresses.length >= 2) {
        senderAddress = parsedAddresses[0]
        receiverAddress = parsedAddresses[1]
      }
    }

    console.log('Parsed transfer details:', { amount, senderAddress, receiverAddress })

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

    // Process the webhook data
    const trade = {
      wallet: transaction.feePayer,
      amount: transaction.tokenTransfers ? amount : amount / 1e9, // Only convert to SOL for native transfers
      timestamp: transaction.timestamp * 1000,
      label: matchingTrader?.userName || 'Unknown'
    }

    // Save to Redis and broadcast to clients
    await saveTrade(trade)
    
    const encoder = new TextEncoder()
    Array.from(connectedClients).forEach(controller => {
      try {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(trade)}\n\n`))
      } catch (error) {
        connectedClients.delete(controller)
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 