"use client"
import { handleTwitterAuth } from "@/lib/handleTwitterAuth";
import { Button } from "../ui/button";
import { PublicKey } from "@solana/web3.js";

export default function UserSignup({ walletAddress }: { walletAddress: string }) {
    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col items-center justify-center h-screen">
                    <h1 className="text-2xl font-bold">User not found!</h1>
                    <p className="text-muted-foreground">Please connect you X Account to make a profile</p>
                    <Button
                        onClick={() => handleTwitterAuth(new PublicKey(walletAddress))}
                >
                    Connect X
                </Button>
            </div>
        </div>
    )
}