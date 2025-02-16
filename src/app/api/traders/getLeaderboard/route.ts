import { NextResponse } from "next/server";

// replace with mongodb call
import { tradersData } from "../../../../../traders";
import { mockStatsData } from "../../../../../mockData";

// Add cache configuration
export const revalidate = 300; // Cache for 5 minutes

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
                if (!response.ok) return 0; 
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
                    ...mockStatsData
                }
            })
        )

        // Add cache-control header to the response
        const response = NextResponse.json({
            traders: tradersWithData
        }, {
            status: 200,
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=599'
            }
        });

        return response;
    } catch (error: unknown) {
        console.error('Error fetching traders:', error);
        const errorResponse = NextResponse.json({
            traders: tradersData
        }, {
            status: 500,
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=119'
            }
        });

        return errorResponse;
    }
}
