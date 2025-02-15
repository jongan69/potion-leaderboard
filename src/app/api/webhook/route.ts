import { NextResponse } from 'next/server'

// This would be better stored in a database or message queue in production
let connectedClients = new Set<WritableStreamDefaultWriter>()

export async function POST(request: Request) {
  const data = await request.json()
  
  // Process the webhook data from Helius
  const trade = {
    wallet: data.accountKeys[0], // Adjust based on actual Helius webhook data structure
    amount: data.amount,
    timestamp: Date.now()
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

// Export for use in the SSE endpoint
export { connectedClients } 