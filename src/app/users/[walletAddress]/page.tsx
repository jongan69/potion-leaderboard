type Props = {
    params: Promise<{ walletAddress: string }>
    // searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function UserPage(props: Props) {
    const { params } = props
    const { walletAddress } = await params
    
    return (
        <div>
            <h1>User Page for {walletAddress}</h1>
        </div>
    )
}