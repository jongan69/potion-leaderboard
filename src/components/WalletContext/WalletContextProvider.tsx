"use client"
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import * as walletAdapterWallets from '@solana/wallet-adapter-wallets'
import * as web3 from '@solana/web3.js';
import React, { createContext, useContext, useState } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

import './custom-wallet-styles.css'; // Custom wallet Button styles

// Define a type for the context value
type WalletContextType = {
    wallet: unknown; // Replace 'any' with the actual type if known
    setWallet: React.Dispatch<React.SetStateAction<unknown>>;
};

// Initialize the context with the correct type
const WalletContext = createContext<WalletContextType | undefined>(undefined);

const WalletContextProvider = ({ children }: { children: React.ReactNode }) => {

    const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? web3.clusterApiUrl('mainnet-beta');
    const wallets = [
        new walletAdapterWallets.PhantomWalletAdapter(),
        new walletAdapterWallets.CoinbaseWalletAdapter(),
        new walletAdapterWallets.SolflareWalletAdapter(),
        new walletAdapterWallets.LedgerWalletAdapter(),
        new walletAdapterWallets.WalletConnectWalletAdapter({
            options: {
                projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
                relayUrl: 'wss://relay.walletconnect.com',
                metadata: {
                    name: 'Potion',
                    description: 'Potion App',
                    url: 'https://www.potionleaderboard.xyz/',
                    icons: ['https://potion.fi/logo.png']
                }
            },
            network: WalletAdapterNetwork.Mainnet
        }),
    ];

    const [wallet, setWallet] = useState<unknown>(null); // Replace 'any' with the actual type if known

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets}>
                <WalletModalProvider>
                    <WalletContext.Provider value={{ wallet, setWallet }}>
                        {children}
                    </WalletContext.Provider>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletContextProvider');
    }
    return context;
};

export default WalletContextProvider;