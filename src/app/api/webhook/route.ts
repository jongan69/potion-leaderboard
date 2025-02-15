import { NextResponse } from 'next/server'
import { saveTrade } from '@/lib/store'
import { tradersData } from "../../../../traders";
import { pusher } from '@/lib/pusher'


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
      amount,
      timestamp: transaction.timestamp * 1000,
      label: matchingTrader?.userName || 'Unknown',
      description: transaction.description,
      token: transaction.tokenTransfers ? transaction.tokenTransfers[0].mint : null,
      signature: transaction.signature,
    }

    // Add swap parsing logic here
    const swapRegex = /swapped ([\d.]+) (\w+) for ([\d.]+) (\w+)/
    const swapMatch = transaction.description.match(swapRegex)
    
    if (swapMatch) {
      const [_, _fromAmount, _fromToken, toAmount, toToken] = swapMatch
      trade.amount = parseFloat(toAmount)
      trade.token = toToken.toUpperCase() === 'SOL' ? null : toToken
    }

    // Save to Redis and broadcast to clients
    await saveTrade(trade)
    await pusher.trigger('trades', 'new-trade', trade)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Internal server error: ' + err }, { status: 500 })
  }
} 