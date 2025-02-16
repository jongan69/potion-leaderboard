"use client"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { unfinishedFeatureToast } from "@/lib/unfinishedFeatureToast";


type UserStatsProps = {
    stats: {
        tokenCount: number
        winRate: number
        trades: {
            buys: number
            sells: number
        }
        averageBuy: number
        averageEntry: number
        averageHoldTime: string
        totalInvested: number
        roi: number
        realizedPnl: number
    }
}

export function UserStatsTable({ stats }: UserStatsProps) {
    const statItems = [
        { label: "Token Count", value: stats.tokenCount },
        { label: "Win Rate", value: `${(stats.winRate * 100).toFixed(2)}%` },
        { label: "Trades", value: `${stats.trades.buys} / ${stats.trades.sells}` },
        { label: "Average Buy", value: `$${stats.averageBuy.toFixed(2)}` },
        { label: "Average Entry", value: `$${stats.averageEntry.toFixed(2)}` },
        { label: "Average Hold Time", value: stats.averageHoldTime },
        { label: "Total Invested", value: `$${stats.totalInvested.toFixed(2)}` },
        { label: "ROI", value: `${(stats.roi * 100).toFixed(2)}%` },
        { label: "Realized PNL", value: `$${stats.realizedPnl.toFixed(2)}` },
    ]

    return (
        <div>
            <div className="flex space-x-4 mb-4">
                <Button className="rounded-full bg-muted-foreground" onClick={() => unfinishedFeatureToast("Daily")}>Daily</Button>
                <Button className="rounded-full bg-muted-foreground" onClick={() => unfinishedFeatureToast("Weekly")}>Weekly</Button>
                <Button className="rounded-full bg-muted-foreground" onClick={() => unfinishedFeatureToast("Monthly")}>Monthly</Button>
                <Button className="rounded-full bg-muted-foreground" onClick={() => unfinishedFeatureToast("All Time")}>All Time</Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {statItems.map((item) => (
                    <Card key={item.label} className="bg-card">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center justify-center space-y-2">
                                <p className="text-sm text-muted-foreground">{item.label}</p>
                                <p className="text-2xl font-bold">{item.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
} 