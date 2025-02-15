import { connectedClients } from '@/lib/store'

export const runtime = 'edge'

export async function GET(request: Request) {
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()
  const encoder = new TextEncoder()

  try {
    // Add this client to the shared store
    connectedClients.add(writer)

    // Send initial message with retry interval
    const initialMessage = `retry: 1000\ndata: ${JSON.stringify({ message: 'Connected to trade stream' })}\n\n`
    await writer.write(encoder.encode(initialMessage))

    // Keep the connection alive with a ping every 30 seconds
    const keepAlive = setInterval(async () => {
      try {
        await writer.write(encoder.encode(`: ping\n\n`))
      } catch {
        clearInterval(keepAlive)
        connectedClients.delete(writer)
      }
    }, 30000)

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    connectedClients.delete(writer)
    return new Response('Stream error', { status: 500 })
  }
} 