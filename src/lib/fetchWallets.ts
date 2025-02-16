export async function fetchWallets() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
        const response = await fetch(`${baseUrl}/api/traders/getLeaderboard`);
        const data = await response.json();
        return data.traders;
    } catch (error) {
        console.error("Error fetching wallets:", error);
        return [];
    }
}