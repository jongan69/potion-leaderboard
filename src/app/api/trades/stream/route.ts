import { connectedClients } from '@/lib/store'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const encoder = new TextEncoder()
  
  // Create a readable stream
  const stream = new ReadableStream({
    start(controller) {
      // Send initial message
      const initialMessage = JSON.stringify({ type: 'connection', message: 'Connected to trade stream' })
      controller.enqueue(encoder.encode(`data: ${initialMessage}\n\n`))

      // Store the controller for broadcasting
      connectedClients.add(controller)

      // Heartbeat
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode('data: {"type":"heartbeat"}\n\n'))
        } catch (error) {
          clearInterval(heartbeat)
          connectedClients.delete(controller)
          controller.close()
        }
      }, 15000)

      // Cleanup on close
      req.signal.addEventListener('abort', () => {
        clearInterval(heartbeat)
        connectedClients.delete(controller)
        controller.close()
      })
    }
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
      'Access-Control-Allow-Origin': '*',
    },
  })
}