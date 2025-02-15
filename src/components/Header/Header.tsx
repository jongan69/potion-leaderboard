'use client'

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs" 
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { ModeToggle } from "@/components/ui/toggle-theme"

export function Header() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="flex items-center py-4">
      <div className="flex items-center gap-2">
        <Image src="/logo.webp" alt="Potion Leaderboard" width={40} height={40} />
        <h1 className="text-2xl font-bold">Potion</h1>
      </div>
      
      <div className="flex-1 flex justify-center items-center gap-8">
        <Tabs defaultValue="leaderboard" className="w-fit">
          <TabsList className="grid w-[400px] grid-cols-3">
            <TabsTrigger 
              value="leaderboard"
              onClick={() => router.push('/')}
            >
              Leaderboard
            </TabsTrigger>
            <TabsTrigger 
              value="learn"
              onClick={() => router.push('/learn')}
            >
              Learn
            </TabsTrigger>
            <TabsTrigger 
              value="prizes"
              onClick={() => router.push('/prizes')}
            >
              Prizes
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <ModeToggle />
      </div>
    </div>
  )
} 