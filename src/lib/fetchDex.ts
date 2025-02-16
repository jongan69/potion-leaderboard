export interface DexScreenerToken {
    pairs: {
        chainId: string;
        dexId: string;
        url: string;
        pairAddress: string;
        labels?: string[];
        baseToken: {
            symbol: string;
            address: string;
            name?: string;
        };
        quoteToken: {
            address: string;
            symbol?: string;
            name?: string;
        };
        priceNative: string;
        priceUsd: string;
        txns: {
            buys: number;
            sells: number;
        };
        volume: {
            h24?: number;
            h6?: number;
            h1?: number;
            m5?: number;
        };
        priceChange: {
            h24?: number;
            h6?: number;
            h1?: number;
            m5?: number;
        };
        liquidity: {
            usd: number;
        };
        fdv: number;
        marketCap: number;
        pairCreatedAt: number;
        info?: Record<string, unknown>;
    }[];
}

export interface TokenScreenerPair {
    chainId: string;
    dexId: string;
    url: string;
    pairAddress: string;
    baseToken: {
        symbol: string;
        address: string;
        name?: string;
    };
    quoteToken: {
        address: string;
        symbol?: string;
        name?: string;
    };
    priceUsd: string;
    volume: { h24?: number };
    liquidity: { usd: number };
    marketCap: number;
    priceChange: { h24?: number };
}

export interface DexScreenerPair extends TokenScreenerPair {
    priceNative: string;
    txns: {
        buys: number;
        sells: number;
    };
    pairCreatedAt: number;
    info?: Record<string, unknown>;
}

export interface PairDetails {
    pairs: DexScreenerPair[];
    holders: {
        count: number;
        totalSupply: string;
    };
    cg?: {
        id: string;
        url: string;
        description: string;
        maxSupply: number;
        totalSupply: number;
        websites: [
            {
                url: string;
                label: string;
            }
        ];
        social: unknown[];
        imageUrl: string;
        categories: string[];
    };
    ti?: {
        id: string;
        chain: { id: string };
        address: string;
        name: string;
        symbol: string;
        description: string;
        image: string;
        headerImage: string;
        websites: [
            {
                url: string;
                label: string;
            }
        ];
        socials: [
            {
                url: string;
                type: string;
            }
        ];
        lockedAddresses: unknown[];
        createdAt: string;
        updatedAt: string;
        sortByDate: string;
    };
    ds?: {
        socials: unknown[];
        websites: [
            {
                url: string;
                label: string;
            }
        ];
    }
    cmc?: {
        urls: {
            twitter: [
                {
                    url: string;
                    type: string;
                }
            ];
            website: [
                {
                    url: string;
                    type: string;
                }
            ];
            chat: [
                {
                    url: string;
                    type: string;
                }
            ];
        };
    };
    isNft: boolean;
}

export interface DexScreenerTokenInfo {
    schemaVersion: string;
    pairs: TokenScreenerPair[];  // Use new TokenScreenerPair for token pairs
    cg?: {
        id: string;
        url: string;
        description: string;
        maxSupply: number;
        totalSupply: number;
        circulatingSupply: number;
        websites: unknown[];
        social: unknown[];
        imageUrl: string;
        categories: string[];
    };
    ti?: {
        id: string;
        chain: { id: string };
        address: string;
        name: string;
        symbol: string;
        description: string;
        websites: string[];
        socials: unknown[];
        lockedAddresses: unknown[];
        createdAt: string;
        updatedAt: string;
        sortByDate: string;
        image: string;
        headerImage: string;
        claims: unknown[];
        profile: {
            header: boolean;
            website: boolean;
            twitter: boolean;
            discord: boolean;
            linkCount: number;
            imgKey: string;
        };
    };
    holders?: {
        count: number;
        totalSupply: string;
    };
    lpHolders?: {
        count: number;
        totalSupply: string;
        holders: unknown[];
    };
    su?: {
        totalSupply: number;
        circulatingSupply: number;
    };
    ta?: {
        solana: {
            isMintable: boolean;
            isFreezable: boolean;
        };
    };
}

interface TokenInfo {
    id: string;
    chain: { id: string };
    address: string;
    name: string;
    symbol: string;
    description: string;
    image: string;
    headerImage: string;
    websites: Array<{
        url: string;
        label: string;
    }>;
    socials: Array<{
        url: string;
        type: string;
    }>;
    lockedAddresses: string[];
    createdAt: string;
    updatedAt: string;
    sortByDate: string;
}

interface CoinGeckoInfo {
    id: string;
    url: string;
    description: string;
    maxSupply: number;
    totalSupply: number;
    circulatingSupply: number;
    websites: Array<{
        url: string;
        label: string;
    }>;
    social: Array<{
        url: string;
        type: string;
    }>;
    imageUrl: string;
    categories: string[];
}

interface DexScreenerSocials {
    socials: Array<{
        url: string;
        type: string;
    }>;
    websites: Array<{
        url: string;
        label: string;
    }>;
}

interface CoinMarketCapUrls {
    urls: {
        twitter: Array<{
            url: string;
            type: string;
        }>;
        website: Array<{
            url: string;
            type: string;
        }>;
        chat: Array<{
            url: string;
            type: string;
        }>;
    };
}

interface BaseToken {
    symbol: string;
    address: string;
    name?: string;
}

interface QuoteToken {
    address: string;
    symbol?: string;
    name?: string;
}

interface PairVolume {
    h24?: number;
    h6?: number;
    h1?: number;
    m5?: number;
}

interface PriceChange {
    h24?: number;
    h6?: number;
    h1?: number;
    m5?: number;
}

interface DexPair {
    chainId: string;
    dexId: string;
    url: string;
    pairAddress: string;
    baseToken: BaseToken;
    quoteToken: QuoteToken;
    priceNative: string;
    priceUsd: string;
    txns: {
        buys: number;
        sells: number;
    };
    volume: PairVolume;
    priceChange: PriceChange;
    liquidity: {
        usd: number;
    };
    fdv: number;
    marketCap: number;
    pairCreatedAt: number;
}

interface DexScreenerResponse {
    schemaVersion: string;
    pairs: DexPair[];
    ti?: TokenInfo;
    cg?: CoinGeckoInfo;
    holders?: {
        count: number;
        totalSupply: string;
    };
    lpHolders?: {
        count: number;
        totalSupply: string;
        holders: string[];
    };
}

interface PairDetailsResponse {
    pairs: DexPair[];
    holders: {
        count: number;
        totalSupply: string;
    };
    cg?: CoinGeckoInfo;
    ti?: TokenInfo;
    ds?: DexScreenerSocials;
    cmc?: CoinMarketCapUrls;
    isNft: boolean;
}

export async function getDexScreenerData(contractAddress: string): Promise<DexScreenerResponse> {
    const response = await fetch(
        `https://api.dexscreener.com/latest/dex/tokens/${contractAddress}`
    );
    if (!response.ok) {
        throw new Error(`DexScreener API error: ${response.status}`);
    }
    return response.json();
}



export async function getPairDetails(pairAddress: string): Promise<PairDetailsResponse> {
    const response = await fetch(
        `https://io.dexscreener.com/dex/pair-details/v3/solana/${pairAddress}`
    );
    if (!response.ok) {
        throw new Error(`DexScreener pair details API error: ${response.status}`);
    }
    return response.json();
}

export async function getTickerFromAddress(contractAddress: string): Promise<string> {
    try {
        const dexScreenerData = await getDexScreenerData(contractAddress);
        
        // Check if there are any pairs
        if (!dexScreenerData.pairs || dexScreenerData.pairs.length === 0) {
            throw new Error('No pairs found for this contract address');
        }

        // Get the ticker from the first pair's base token symbol
        const ticker = dexScreenerData.pairs[0].baseToken.symbol;
        
        if (!ticker) {
            throw new Error('Could not find ticker symbol');
        }

        return ticker;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch ticker: ${error.message}`);
        } else {
            throw new Error('Failed to fetch ticker');
        }
    }
}