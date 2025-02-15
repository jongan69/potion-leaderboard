import { WritableStreamDefaultWriter } from 'stream/web'

export const connectedClients = new Set<WritableStreamDefaultWriter>() 