import { connectedClients } from '@/lib/store'

export const runtime = 'edge'

export async function GET() {
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()
  const encoder = new TextEncoder()

  // Add this client to the shared store
  connectedClients.add(writer)

  // Send initial message
  writer.write(encoder.encode(`data: ${JSON.stringify({ message: 'Connected to trade stream' })}\n\n`))

  // Clean up when the connection closes
  stream.readable.pipeTo(new WritableStream()).catch(() => {
    connectedClients.delete(writer)
  })

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
} 