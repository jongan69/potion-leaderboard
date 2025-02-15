import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: Request) {
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()
  const encoder = new TextEncoder()

  // Keep track of the connection
  const connections = new Set()
  connections.add(writer)

  // Send initial message
  writer.write(encoder.encode(`data: ${JSON.stringify({ message: 'Connected to trade stream' })}\n\n`))

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
} 