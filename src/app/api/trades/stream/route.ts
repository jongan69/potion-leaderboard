import { connectedClients } from '@/lib/store'

export const runtime = 'edge'

export async function GET(request: Request) {
  // Check if this is a reconnection
  const isReconnection = request.headers.get('last-event-id') !== null

  const stream = new TransformStream()
  const writer = stream.writable.getWriter()
  const encoder = new TextEncoder()

  // Add this client to the shared store
  connectedClients.add(writer)

  // Only send connection message on first connect
  if (!isReconnection) {
    writer.write(encoder.encode(`data: ${JSON.stringify({ message: 'Connected to trade stream' })}\n\n`))
  }

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
} 