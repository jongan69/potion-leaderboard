import { fetchUser } from "@/lib/fetchUser"
import { UserStatsTable } from "@/components/UserStats/UserStatsCards"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { Twitter } from "lucide-react"
import UserTradesDataTable from "@/components/UserStats/UserTradesTable/data-table"
import { columns } from "@/components/UserStats/UserTradesTable/columns"

type Props = {
    params: Promise<{ walletAddress: string }>
    // searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function UserPage(props: Props) {
    const { params } = props
    const { walletAddress } = await params
    const user = await fetchUser(walletAddress)
    console.log(user)
    const lastTradeTime = user?.lastTradeTime 
        ? formatDistanceToNow(new Date(user.lastTradeTime), { addSuffix: true })
        : 'Never'

    return (
        <div className="container mx-auto py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Section */}
                <div className="bg-card rounded-lg p-6 shadow-md">
                    <div className="flex flex-col items-center space-y-4">
                        <Avatar className="w-24 h-24">
                            <AvatarImage src={user?.profilePic} />
                            <AvatarFallback>{walletAddress.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="text-center">
                            <h2 className="text-2xl font-bold">{user?.userName || `${walletAddress.slice(0, 6)}...${walletAddress.slice(-6)}`}</h2>
                            
                            {user?.xHandle && (
                                <a 
                                    href={`https://twitter.com/${user.xHandle}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary"
                                >
                                    <Twitter className="w-4 h-4" />
                                    {user.xHandle}
                                </a>
                            )}
                            
                            <p className="text-sm text-muted-foreground mt-2">
                                Last trade: {lastTradeTime}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="md:col-span-2 bg-card rounded-lg p-6 shadow-md">
                    <UserStatsTable stats={{
                        tokenCount: user?.tokenCount || 0,
                        winRate: user?.winRate || 0,
                        trades: user?.trades || 0,
                        averageBuy: user?.avgBuy || 0,
                        averageEntry: user?.avgEntry || 0,
                        averageHoldTime: user?.avgHold || '0h',
                        totalInvested: user?.totalInvested || 0,
                        roi: user?.roi || 0,
                        realizedPnl: user?.pnl || 0,
                    }} />
                </div>
            </div>
            <div >
                <div className="bg-card rounded-lg p-6 shadow-md">
                    <UserTradesDataTable columns={columns} data={user} />
                </div>
            </div>
        </div>
    )
}