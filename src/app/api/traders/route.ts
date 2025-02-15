import { NextResponse } from "next/server";

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
        const getCieloPnl = async (wallet: string) => {
            try {
                const response = await fetch(`https://feed-api.cielo.finance/v1/pnl/tokens?wallet=${wallet}`, {
                    method: 'GET',
                    headers: {
                    'Authorization': `Bearer ${process.env.CIELO_BEARER_TOKEN}`,
                },
            })
            const data = await response.json()
            return Number(data.data.total_pnl_usd.toFixed(2)) || 0 // Add fallback to 0 if no pnl returned
            } catch (error) {
                console.error('Error fetching pnl:', error);
                return 0;
            }
        }

        // Base traders data
        const tradersData = [
            {
                id: "9953ed85-31a0-4db9-acc8-e25b76176443",
                profilePic: "https://avatar.iran.liara.run/public",
                wallet: "suqh5sHtr8HyJ7q8scBimULPkPpA557prMG47xCHQfK",
                xHandle: "@Cupseyy",
                userName: "Cupseyy",
                status: "active",
                createdAt: new Date("2024-02-07T23:35:52.087Z"),
                updatedAt: new Date("2024-02-07T23:38:03.259Z"),
            },
            {
                id: "328c2bef-d84b-44a2-b5ae-03bd6550c4c4",
                profilePic: "https://avatar.iran.liara.run/public",
                wallet: "8deJ9xeUvXSJwicYptA9mHsU2rN2pDx37KWzkDkEXhU6",
                xHandle: "@CookerFlips",
                userName: "CookerFlips",
                status: "active",
                createdAt: new Date("2024-02-07T23:35:52.087Z"),
                updatedAt: new Date("2024-02-07T23:38:03.259Z"),
            },
            {
                id: "9543e3a4-99f2-4fcb-ba5d-f2aaebff6716",
                profilePic: "https://avatar.iran.liara.run/public",
                wallet: "8zFZHuSRuDpuAR7J6FzwyF3vKNx4CVW3DFHJerQhc7Zd",
                xHandle: "@traderpow",
                userName: "traderpow",
                status: "active",
                createdAt: new Date("2024-02-07T23:35:52.087Z"),
                updatedAt: new Date("2024-02-07T23:38:03.259Z"),
            },
            {
                id: "bdcba306-57fa-4722-82e3-c4933b09e69b",
                profilePic: "https://avatar.iran.liara.run/public",
                wallet: "DfMxre4cKmvogbLrPigxmibVTTQDuzjdXojWzjCXXhzj",
                xHandle: "@Euris_JT",
                userName: "Euris_JT",
                status: "active",
                createdAt: new Date("2024-02-07T23:35:52.087Z"),
                updatedAt: new Date("2024-02-07T23:38:03.259Z"),
            },
            {
                id: "e643dbea-0ab2-4d3d-8bb8-63aedf027a66",
                profilePic: "https://avatar.iran.liara.run/public",
                wallet: "G5nxEXuFMfV74DSnsrSatqCW32F34XUnBeq3PfDS7w5E",
                xHandle: "@FlippingProfits",
                userName: "FlippingProfits",
                status: "inactive",
                createdAt: new Date("2024-02-07T23:35:52.087Z"),
                updatedAt: new Date("2024-02-07T23:38:03.259Z"),
            },
            {
                id: "e643dbea-0ab2-4d3d-8bb8-63aedf027a66",
                profilePic: "https://avatar.iran.liara.run/public",
                wallet: "7SDs3PjT2mswKQ7Zo4FTucn9gJdtuW4jaacPA65BseHS",
                xHandle: "@joujou100x",
                userName: "joujou100x",
                status: "active",
                createdAt: new Date("2024-02-07T23:35:52.087Z"),
                updatedAt: new Date("2024-02-07T23:38:03.259Z"),
            },
            {
                id: "e643dbea-0ab2-4d3d-8bb8-63aedf027a66",
                profilePic: "https://avatar.iran.liara.run/public",
                wallet: "831qmkeGhfL8YpcXuhrug6nHj1YdK3aXMDQUCo85Auh1",
                xHandle: "@973Meech",
                userName: "973Meech",
                status: "active",
                createdAt: new Date("2024-02-07T23:35:52.087Z"),
                updatedAt: new Date("2024-02-07T23:38:03.259Z"),
            },
            {
                id: "e643dbea-0ab2-4d3d-8bb8-63aedf027a66",
                profilePic: "https://avatar.iran.liara.run/public",
                wallet: "CRVidEDtEUTYZisCxBZkpELzhQc9eauMLR3FWg74tReL",
                xHandle: "@frankdegods",
                userName: "frankdegods",
                status: "active",
                createdAt: new Date("2024-02-07T23:35:52.087Z"),
                updatedAt: new Date("2024-02-07T23:38:03.259Z"),
            },
        ]

        // Fetch followers and PNL for all traders
        const tradersWithData = await Promise.all(
            tradersData.map(async (trader) => {
                const username = trader.xHandle.replace('@', '') // Remove @ from handle
                const [followers, pnl] = await Promise.all([
                    getTwitterFollowers(username),
                    getCieloPnl(trader.wallet)
                ])
                console.log(username, followers, pnl)
                return {
                    ...trader,
                    followers,
                    pnl // This will override the hardcoded PNL with real-time data
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
