export async function fetchWallets() {
    try {
        const response = await fetch("http://localhost:3000/api/traders");
        const data = await response.json();
        return data.traders;
    } catch (error) {
        console.error("Error fetching wallets:", error);
        return [];
    }
}