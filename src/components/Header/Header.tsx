'use client'

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import {
  usePathname,
  useRouter
} from "next/navigation"
import { ModeToggle } from "@/components/ui/toggle-theme"
import dynamic from "next/dynamic"

// Dynamically import WalletMultiButton with no SSR
const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletMultiButton),
  { ssr: false }
)

export function Header() {
  const router = useRouter()
  const pathname = usePathname()

  // Get the current tab value based on the pathname
  const getCurrentTab = () => {
    const path = pathname.split('/')[1] // Get the first segment after /
    if (!path) return 'leaderboard'
    return path
  }

  const handleTabChange = (value: string) => {
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
              className="grid w-full grid-cols-3 justify-center items-center"
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
            </TabsList>
          </Tabs>
        </div>
        <div className="flex gap-4 sm:gap-8">
          <ModeToggle />
          <div className="max-w-[200px]">
            <WalletMultiButton />
          </div>
        </div>
      </div>
    </div>
  )
} 