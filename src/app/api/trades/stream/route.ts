import { connectedClients } from '@/lib/store'

export async function GET() {
  console.log('SSE: New client connection request')
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()
  const encoder = new TextEncoder()

  // Add heartbeat interval with shorter interval (15 seconds)
  const heartbeat = setInterval(async () => {
    try {
      console.log('SSE: Sending heartbeat')
      await writer.write(encoder.encode('data: {"type":"heartbeat"}\n\n'))
    } catch (error) {
      console.error('SSE: Error sending heartbeat:', error)
      clearInterval(heartbeat)
      connectedClients.delete(writer)
      try {
        await writer.close()
      } catch (e) {
        console.error('SSE: Error closing writer:', e)
      }
    }
  }, 15000) // Reduced from 30000 to 15000

  try {
    // Create the response immediately with updated headers
    const response = new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
        'Keep-Alive': 'timeout=60, max=1000',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
      },
    })

    // Add this client to the shared store and send initial message
    connectedClients.add(writer)
    console.log('SSE: Client added to connected clients. Total clients:', connectedClients.size)

    const initialMessage = JSON.stringify({ type: 'connection', message: 'Connected to trade stream' })
    await writer.write(encoder.encode(`data: ${initialMessage}\n\n`))

    // The client will automatically handle disconnection and cleanup through the heartbeat mechanism
    return response
  } catch (err) {
    console.error('SSE: Stream error:', err)
    clearInterval(heartbeat)
    connectedClients.delete(writer)
    return new Response('Stream error', { status: 500 })
  }
}