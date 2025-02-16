# Potion Trader Leaderboard

<p align="center">
  <a href="https://potionleaderboard.xyz/">
    <img src="./public/logo.webp" />
  </a>
</p>

[Live Demo](https://potionleaderboard.xyz/)

A Next.js application that displays the leaderboard for Potion Traders on Solana, built for the Potion Competition.

## Tech Stack
- Frontend: Next.js, TailwindCSS, Tanstack Table, Radix UI, Shadcn UI
- Backend: MongoDB, Upstash, Pusher
- Integrations: Helius, Twitter API
- Wallet: Custom-styled Solana Wallet Adapter

## Features

### Leaderboard (`/`)
- Displays trader rankings with filterable columns
- Live trading feed powered by Helius webhooks and Pusher
- Twitter follower count integration
- Simplified PnL calculations
- Actions per trader:
  - Copy wallet address
  - View profile

### Trader Profiles (`/users/[walletAddress]`)
- Displays trader statistics and trade history
- PnL visualization with sharing capabilities
- Twitter account linking
- Wallet connection support

### Additional Pages
- `/learn` - Educational resources
- `/prizes` - Competition rewards information

## API Routes

### `/api/traders/getLeaderboard`
- Returns trader data with enhanced information:
  - Live Twitter follower counts (via Raspberry Pi hosted service)
  - Simplified PnL calculations

### `/api/traders/getProfile`
- Fetches single trader data using wallet address
- Handles two scenarios:
  1. Existing trader: Displays stats and trade history
  2. New user: Guides through wallet and Twitter connection

### `/api/twitterAuth/*`
Twitter authentication flow:
1. User initiates auth via connect button
2. Redirects to Twitter for approval
3. Callback saves user profile and wallet address to MongoDB
4. Completes authentication flow

### `/api/webhook`
Handles live trading feed data:
- Receives Helius webhook data
- Forwards to Pusher
- Updates frontend via LiveTrader component

## Setup Instructions

1. Clone the repository
2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Fill in required variables
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## Environment Variables
Required variables (add to `.env`):

### Public Environment Variables (Frontend)
- `NEXT_PUBLIC_API_URL`: http://localhost:3000
- `NEXT_PUBLIC_SOLANA_RPC_URL`: 
- `NEXT_PUBLIC_PUSHER_KEY`: 
- `NEXT_PUBLIC_PUSHER_CLUSTER`: 
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: 

### Helius Dashboard
- `HELIUS_KEY`: 

### Twitter Dashboard
- `TWITTER_API_KEY`: 
- `TWITTER_API_SECRET`: 
- `TWITTER_CLIENT_ID`: 
- `TWITTER_CLIENT_SECRET`: 

### MongoDB Dashboard
- `MONGODB_URI`: 

### Upstash Dashboard
- `UPSTASH_REDIS_REST_URL`: 
- `UPSTASH_REDIS_REST_TOKEN`: 

### Pusher Dashboard
- `PUSHER_APP_ID`: 
- `PUSHER_KEY`: 
- `PUSHER_SECRET`: 
- `PUSHER_CLUSTER`: 

## Deployment
The demo is deployed on Vercel and can be accessed at https://potionleaderboard.xyz/




