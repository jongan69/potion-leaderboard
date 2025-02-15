import { useParams } from "next/navigation"

export default function UserPage() {
    const { walletAddress } = useParams()
    return (
        <div>
            <h1>User Page for {walletAddress}</h1>
        </div>
    )
}