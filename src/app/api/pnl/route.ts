import { NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';

const connection = new Connection(`https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_KEY}`);
const CHUNK_SIZE = 100;
const INITIAL_BATCH_SIZE = 100; // Reduced from 500
const MAX_TRANSACTIONS = 1000; // Limit total historical transactions
const CONCURRENT_REQUESTS = 5; // Number of parallel requests

interface AccountData {
    account: string;
    nativeBalanceChange: number;
}

async function calculateTotalPnL(walletAddress: PublicKey) {
    let totalPnl = 0;
    let processedTxns = 0;
    
    // Get initial batch of signatures
    const sigs = await connection.getSignaturesForAddress(walletAddress, { 
        limit: INITIAL_BATCH_SIZE
    });

    if (!sigs.length) return 0;

    // Process signatures in parallel chunks
    const chunks = Array.from({ length: Math.ceil(sigs.length / CHUNK_SIZE) }, (_, i) =>
        sigs.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE).map(sig => sig.signature)
    );

    // Process chunks in parallel with a concurrency limit
    for (let i = 0; i < chunks.length; i += CONCURRENT_REQUESTS) {
        const currentChunks = chunks.slice(i, i + CONCURRENT_REQUESTS);
        
        const results = await Promise.all(currentChunks.map(async chunk => {
            const res = await fetch(`https://api.helius.xyz/v0/transactions?api-key=${process.env.HELIUS_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transactions: chunk })
            });

            if (!res.ok) return 0;

            const txnArr = await res.json();
            let chunkPnl = 0;
            
            for (const txn of txnArr) {
                if (txn.transactionError) continue;
                const accountData = txn.accountData.find((ad: AccountData) => 
                    ad.account === walletAddress.toString()
                );
                if (accountData) {
                    chunkPnl += accountData.nativeBalanceChange;
                }
            }
            return chunkPnl;
        }));

        totalPnl += results.reduce((sum, val) => sum + val, 0);
        processedTxns += CHUNK_SIZE * currentChunks.length;

        if (processedTxns >= MAX_TRANSACTIONS) break;
    }
    
    return totalPnl;
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const walletAddress = searchParams.get('walletAddress');

        if (!walletAddress) {
            return NextResponse.json({ error: 'Missing walletAddress parameter' }, { status: 400 });
        }
        const totalPnl = await calculateTotalPnL(new PublicKey(walletAddress));
        const response = await fetch(`https://api.jup.ag/price/v2?ids=So11111111111111111111111111111111111111112`);
        const data = await response.json();
        const solanaPrice = data.data.So11111111111111111111111111111111111111112.price;
        const usdPnl = Number((totalPnl * solanaPrice).toFixed(2));
        return NextResponse.json({ solanaPnl: totalPnl, usdPnl: usdPnl });
    } catch (error: unknown) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
