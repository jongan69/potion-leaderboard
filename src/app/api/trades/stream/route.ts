import { connectedClients } from '@/lib/store'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET() {
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()
  const encoder = new TextEncoder()

  try {
    // Add this client to the shared store
    connectedClients.add(writer)

    // Send initial message
    await writer.write(encoder.encode(`data: ${JSON.stringify({ message: 'Connected to trade stream' })}\n\n`))

    // Create the response immediately
    const response = new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    })

    // Setup cleanup when client disconnects
    stream.readable.cancel().then(() => {
      connectedClients.delete(writer)
    })

    return response
  } catch (err) {
    console.error('Stream error:', err)
    connectedClients.delete(writer)
    return new Response('Stream error', { status: 500 })
  }
}