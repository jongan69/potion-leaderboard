'use client'

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import {
  usePathname,
  useRouter
} from "next/navigation"
import { ModeToggle } from "@/components/ui/toggle-theme"
import dynamic from "next/dynamic"
import { useWallet } from "@solana/wallet-adapter-react"
import { FaXTwitter, FaDiscord } from "react-icons/fa6"
// Dynamically import WalletMultiButton with no SSR
const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletMultiButton),
  { ssr: false }
)

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const wallet = useWallet()

  // Get the current tab value based on the pathname
  const getCurrentTab = () => {
    if (pathname === '/') return 'leaderboard'
    if (pathname.startsWith('/users/')) return 'profile'
    const path = pathname.split('/')[1]
    return path || 'leaderboard'
  }

  const handleTabChange = (value: string) => {
    if (value === 'profile') {
      if (wallet.connected && wallet.publicKey) {
        router.push(`/users/${wallet.publicKey.toString()}`)
      }
      return
    }
    const route = value === 'leaderboard' ? '/' : `/${value}`
    router.push(route)
  }

  return (
    <div className="flex flex-col sm:flex-row items-center py-4 px-4 gap-4 sm:gap-0">
      <div className="flex items-center gap-2">
        <Image
          src="/logo.webp"
          alt="Potion Leaderboard"
          width={40}
          height={40}
          priority
          className="object-contain"
        />
        <h1 className="text-xl sm:text-2xl font-bold flex flex-col">
          <span>Potion</span>
          <span className="text-[#d500fe]">
            Leaderboard
          </span>
        </h1>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
        <div className="w-full sm:flex-1 flex justify-center">
          <Tabs
            value={getCurrentTab()}
            onValueChange={handleTabChange}
            className="w-full sm:w-fit max-w-[400px]"
          >
            <TabsList
              className="grid w-full grid-cols-4 justify-center items-center"
              aria-label="Navigation Tabs"
            >
              <TabsTrigger
                value="leaderboard"
                className="text-sm sm:text-base"
                aria-label="View Leaderboard"
              >
                Leaderboard
              </TabsTrigger>
              <TabsTrigger
                value="learn"
                className="text-sm sm:text-base"
                aria-label="View Learn Section"
              >
                Learn
              </TabsTrigger>
              <TabsTrigger
                value="prizes"
                className="text-sm sm:text-base"
                aria-label="View Prizes Section"
              >
                Prizes
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="text-sm sm:text-base"
                aria-label="View Profile Section"
                disabled={!wallet.connected}
              >
                Profile
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex gap-4 sm:gap-8 items-center">
          <a
            href="https://twitter.com/potionalpha"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-[#d500fe] transition-colors"
            aria-label="Follow us on Twitter"
          >
            <FaXTwitter size={20} />
          </a>
          <a
            href="https://whop.com/potion-alpha/?a=jonny2298"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-[#d500fe] transition-colors"
            aria-label="Join our Discord"
          >
            <FaDiscord size={20} />
          </a>
          <ModeToggle />
          <div className="max-w-[200px]">
            <WalletMultiButton />
          </div>
        </div>
      </div>
    </div>
  )
} 