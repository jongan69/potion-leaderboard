import { NextResponse } from 'next/server'
import { saveTrade } from '@/lib/store'
import { pusher } from '@/lib/pusher'
import { getTokenEnrichedData } from '@/lib/getTokenEnrichedData'

// replace with mongodb call
import { tradersData } from "../../../../traders"
import { Trade } from '@/types/trade'


interface TokenTransfer {
  fromUserAccount: string
  toUserAccount: string
  amount: number
  mint: string
}

interface NativeTransfer {
  amount: number
}

interface Transaction {
  feePayer: string
  timestamp: number
  description: string
  signature: string
  tokenTransfers?: TokenTransfer[]
  nativeTransfers?: NativeTransfer[]
}

export async function POST(request: Request) {
  try {
    const webhookData = await request.json()
    if (!Array.isArray(webhookData) || webhookData.length === 0) {
      return NextResponse.json({ error: 'Invalid webhook data format' }, { status: 400 })
    }

    const transaction: Transaction = webhookData[0]
    if (!transaction?.feePayer) {
      return NextResponse.json({ error: 'Missing required transaction data' }, { status: 400 })
    }

    // Extract transfer details
    const { amount, senderAddress, receiverAddress } = extractTransferDetails(transaction)

    // Find matching trader
    const matchingTrader = findMatchingTrader(senderAddress, receiverAddress)

    // Create base trade object
    const trade: Trade = {
      id: Date.now(), // or generate a proper ID
      wallet: transaction.feePayer,
      toAmount: amount,
      action: null,
      fromAmount: 0,
      fromTokenAddress: '',
      fromTokenSymbol: '',
      fromTokenPic: '',
      toTokenAddress: '',
      toTokenSymbol: '',
      toTokenPic: '',
      entryPrice: 0,
      exitPrice: 0,
      pnl: 0,
      roi: 0,
      lastTrade: '',
      amountInvested: 0,
      holding: 0,
      avgSell: 0,
      holdingTime: 0,
      timestamp: transaction.timestamp * 1000,
      label: matchingTrader?.userName || 'Unknown',
      description: transaction.description,
      signature: transaction.signature,
      fromTokenData: null,
      toTokenData: null
    }

    // Parse swap details if present
    if (transaction.tokenTransfers && transaction.tokenTransfers.length > 0) {
      await enrichTradeWithSwapDetails(trade, transaction)
    }

    // Save and broadcast
    await saveTrade(trade)
    await pusher.trigger('trades', 'new-trade', trade)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Internal server error: ' + err }, { status: 500 })
  }
}

function extractTransferDetails(transaction: Transaction) {
  let amount = 0
  let senderAddress = ''
  let receiverAddress = ''

  if (transaction.tokenTransfers && transaction.tokenTransfers.length > 0) {
    const [tokenTransfer] = transaction.tokenTransfers
    amount = tokenTransfer.amount
    senderAddress = tokenTransfer.fromUserAccount
    receiverAddress = tokenTransfer.toUserAccount
  } else if (transaction.nativeTransfers && transaction.nativeTransfers.length > 0) {
    const [nativeTransfer] = transaction.nativeTransfers
    amount = nativeTransfer.amount
    const addressRegex = /([1-9A-HJ-NP-Za-km-z]{32,44})/g
    const [sender, receiver] = transaction.description.match(addressRegex) || []
    if (sender && receiver) {
      senderAddress = sender
      receiverAddress = receiver
    }
  }

  return { amount, senderAddress, receiverAddress }
}

function findMatchingTrader(senderAddress?: string, receiverAddress?: string) {
  return tradersData.find(trader => {
    const traderWallet = trader.wallet.toLowerCase()
    return (
      senderAddress?.toLowerCase() === traderWallet ||
      receiverAddress?.toLowerCase() === traderWallet
    )
  })
}

async function enrichTradeWithSwapDetails(trade: Trade, transaction: Transaction) {
  const swapRegex = /(swapped|transferred) ([\d.]+) (\w+) for ([\d.]+) (\w+)/
  const swapMatch = transaction.description.match(swapRegex)

  if (swapMatch) {
    const [, action, fromAmount, fromToken, toAmount] = swapMatch
    const fromTokenMint = transaction.tokenTransfers![0].mint
    const toTokenMint = transaction.tokenTransfers![1].mint
    const enrichedFromData = await getTokenEnrichedData(fromTokenMint)
    const enrichedToData = await getTokenEnrichedData(toTokenMint)
    trade.action = action
    trade.fromAmount = parseFloat(fromAmount)
    trade.fromTokenSymbol = fromToken === 'SOL' ? 'SOL' : enrichedFromData.ticker
    trade.toAmount = parseFloat(toAmount)
    trade.fromTokenData = {
      image: enrichedFromData.image! || '',
      symbol: enrichedFromData.ticker || '',
      address: fromTokenMint,
      priceUsd: enrichedFromData.priceUsd,
      volume24h: enrichedFromData.volume24h,
      marketCap: enrichedFromData.marketCap,
      liquidity: enrichedFromData.liquidity,
      priceChange24h: enrichedFromData.priceChange24h,
    }
    trade.toTokenSymbol = enrichedToData.ticker
    trade.toTokenData = {
      image: enrichedToData.image || '',
      symbol: enrichedToData.ticker || '',
      address: toTokenMint,
      priceUsd: enrichedToData.priceUsd,
      volume24h: enrichedToData.volume24h,
      marketCap: enrichedToData.marketCap,
      liquidity: enrichedToData.liquidity,
      priceChange24h: enrichedToData.priceChange24h,
      holderCount: enrichedToData.holderCount,
      totalSupply: enrichedToData.totalSupply,
    }
  }
} 