import { connectedClients } from '@/lib/store'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET() {
  console.log('SSE: New client connection request')
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()
  const encoder = new TextEncoder()

  // Add heartbeat interval
  const heartbeat = setInterval(async () => {
    try {
      console.log('SSE: Sending heartbeat')
      await writer.write(encoder.encode(': heartbeat\n\n'))
    } catch (error) {
      console.error('SSE: Error sending heartbeat:', error)
      clearInterval(heartbeat)
      connectedClients.delete(writer)
    }
  }, 30000) // 30 second interval

  try {
    // Add this client to the shared store
    connectedClients.add(writer)
    console.log('SSE: Client added to connected clients. Total clients:', connectedClients.size)

    // Send initial message
    await writer.write(encoder.encode(`data: ${JSON.stringify({ message: 'Connected to trade stream' })}\n\n`))
    console.log('SSE: Sent initial connection message')

    // Create the response immediately
    const response = new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    })

    // Enhanced cleanup
    stream.readable.cancel().then(() => {
      console.log('SSE: Stream cancelled, cleaning up')
      clearInterval(heartbeat)
      connectedClients.delete(writer)
      console.log('SSE: Client removed. Remaining clients:', connectedClients.size)
    })

    return response
  } catch (err) {
    console.error('SSE: Stream error:', err)
    clearInterval(heartbeat)
    connectedClients.delete(writer)
    return new Response('Stream error', { status: 500 })
  }
}