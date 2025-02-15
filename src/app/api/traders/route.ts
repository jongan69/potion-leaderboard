import { NextResponse } from "next/server";
import { tradersData } from "../../../../traders";
import { mockData } from "../../../../mockData";

export async function GET() {
    try {
        // Function to fetch twitter followers
        const getTwitterFollowers = async (username: string) => {
            try {
                const response = await fetch('https://soltrendio.com/api/premium/twitter-followers', {
                    method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username })
            })
            const data = await response.json()
            return data || 0 // Add fallback to 0 if no followers returned
            } catch (error) {
                console.error('Error fetching followers:', error);
                return 0;
            }
        }

        // Function to fetch cielo pnl
        const getPnl = async (wallet: string) => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pnl?walletAddress=${wallet}`)
            const data = await response.json()
            return data.usdPnl || 0 // Add fallback to 0 if no pnl returned
            } catch (error) {
                console.error('Error fetching pnl:', error);
                return 0;
            }
        }



        // Fetch followers and PNL for all traders
        const tradersWithData = await Promise.all(
            tradersData.map(async (trader) => {
                const username = trader.xHandle.replace('@', '') // Remove @ from handle
                const [followers, pnl] = await Promise.all([
                    getTwitterFollowers(username),
                    getPnl(trader.wallet)
                ])
                console.log(username, followers, pnl)
                return {
                    ...trader,
                    followers,
                    pnl,
                    // Mock data for UI matching
                    ...mockData
                }
            })
        )

        return NextResponse.json({
            traders: tradersWithData
        }, { status: 200 });
    } catch (error: unknown) {
        console.error('Error fetching PNL:', error);
        return NextResponse.json({
            error: 'Internal server error while fetching PNL',
            errorMessage: (error as Error).message
        }, { status: 500 });
    }
}
