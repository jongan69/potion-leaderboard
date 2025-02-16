# Potion Trader Leaderboard

This is a Nextjs app that displays the leaderboard for Potion Traders on Solana built for the Potion Competition.
Built using Nextjs, TailwindCSS, Tanstack Table, Radix UI, Shadcn UI, MongoDB, Upstash, Pusher, Helius, and Twitter API.

The app uses a sligtly custom styled solana wallet adapter multi button for connecting to a users wallet, which ideally will be used to link a users profile to their twitter account.

## API Routes

- API/TRADERS/GETLEADERBOARD
There is a main API route `/api/traders/getLeaderboard` that returns the `traders.ts` data in JSON format.
This data is enchanced with a custom in house twitter API for live twitter follower count and a rough PNL calculation from `/api/pnl`.
The Twitter follower count API is being hosted on a raspberry pi.
The PnL is heavily simplified to improve performance and is not 100% accurate.

This data is then displayed on the frontend using Tanstack Table and Shadcn UI on the `app/` page
While some of the table data is filterable, many of the features are not implemented due to time constraints.
Most of the figma designs were implemenented on the UI side to meet the requirements.

Each Row of the table has some actions that can perform some of the expected functionality, notably the `Copy Wallet Address` button will copy the trader's address to the clipboard and the `View Profile` button will redirect to the trader's profile page.

- API/TRADERS/GETPROFILE + /users/[walletAddress]
There is a `/api/traders/getProfile` route that returns a single trader's data based on the `address` Url Query parameter to try and get the trader's data from the `traders.ts` data

- If no trader data is found:
The Profile page will display a message to the user to connect their wallet, if a wallet is connected the page will display a message to the user to connect their twitter, the auth process is handled by the `API/TWITTERAUTH/*` routes, the users profile gets saved to the mongodb database via the `API/TWITTERAUTH/CALLBACK` route.

- If a trader is found
The profile page will display the trader's stats data and a table of the `mockData.ts` for trade data with associated share button for creating a PnL Image of the trade.

- API/WEBHOOK
The webhook is for the Live TradinG Feed that is displayed on the `app/` page, this feature was added before knowledge of the Figma designs, the webhook data gets sent from Helius to Pusher, which then sends it to the frontend via the `LiveTrader.tsx` Component.

- API/TWITTERAUTH/*
The twitter auth process is handled by the `API/TWITTERAUTH/*` routes, the users profile gets saved to the mongodb database via the `API/TWITTERAUTH/CALLBACK` route.

1. User clicks connect twitter button, this calls `lib/handleTwitterAuth` to redirect the user to the twitter auth page using `/api/twitterAuth/authorize`.
2. This starts the twitter auth process, the user is redirected to the twitter auth page to approve the app in a new tab.
3. The `API/TWITTERAUTH/CALLBACK` route is called when the user approves the app, this route handles the callback from twitter and the user's profile is saved to the database with their wallet address before closing the twitter auth window

Note: At this point the twitter auth process is complete but functionality is not implemented to use the saved twitter profile and wallet address data to display the trader's profile information on the `app/profile/[walletAddress]/` page.

## Frontend

The frontend has 4 main pages:
- `app/`
- `app/profile/[walletAddress]/`
- `app/learn/`
- `app/prices/`

The `app/` page displays the leaderboard and live trading feed.
The `app/profile/[walletAddress]/` page displays a trader's profile information.
The `app/learn/` page is a static page to meet the requirements.
The `app/prizes/` page is a static page to meet the requirements.

## How to run

1. Clone the repository
2. Create a `.env` file and add the environment variables
3. Run `npm install`
4. Run `npm run dev`

## How to deploy




