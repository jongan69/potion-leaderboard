import { getDexScreenerData } from "./fetchDex";

export interface EnrichedTokenData {
    ticker: string;
    priceUsd: string;
    volume24h: number;
    marketCap: number;
    liquidity: number;
    priceChange24h: number;
    holderCount?: number;
    totalSupply?: string;
    isNft?: boolean;
    image?: string;
}

export async function getTokenEnrichedData(contractAddress: string): Promise<EnrichedTokenData> {
    try {
        const dexScreenerData = await getDexScreenerData(contractAddress);
        
        if (!dexScreenerData.pairs || dexScreenerData.pairs.length === 0) {
            throw new Error('No pairs found for this contract address');
        }

        const mainPair = dexScreenerData.pairs[0];
        
        return {
            ticker: mainPair.baseToken.symbol,
            priceUsd: mainPair.priceUsd,
            volume24h: mainPair.volume.h24 || 0,
            marketCap: mainPair.marketCap,
            liquidity: mainPair.liquidity.usd,
            priceChange24h: mainPair.priceChange.h24 || 0,
            holderCount: dexScreenerData.holders?.count,
            totalSupply: dexScreenerData.holders?.totalSupply,
            image: dexScreenerData.ti?.image,
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch enriched token data: ${error.message}`);
        } else {
            throw new Error('Failed to fetch enriched token data');
        }
    }
} 