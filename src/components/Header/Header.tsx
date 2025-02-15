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
import { motion } from "framer-motion"
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
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col lg:flex-row items-center py-6 px-6 gap-4 lg:gap-0 backdrop-blur-sm bg-background/80 sticky top-0 z-50 border-b"
    >
      <motion.div 
        className="flex items-center gap-3"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Image
          src="/logo.webp"
          alt="Potion Leaderboard"
          width={40}
          height={40}
          priority
          className="object-contain hover:rotate-12 transition-transform duration-300"
        />
        <h1 className="text-xl sm:text-2xl font-bold flex flex-col">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Potion
          </motion.span>
          <motion.span 
            className="text-[#d500fe] bg-clip-text text-transparent bg-gradient-to-r from-[#d500fe] to-purple-500"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            Leaderboard
          </motion.span>
        </h1>
      </motion.div>

      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8 px-4">
        <div className="w-full lg:flex-1 flex justify-center">
          <Tabs
            value={getCurrentTab()}
            onValueChange={handleTabChange}
            className="w-full lg:w-fit max-w-[400px]"
          >
            <TabsList
              className="grid w-full grid-cols-4 justify-center items-center bg-background/50 backdrop-blur-sm"
              aria-label="Navigation Tabs"
            >
              {['leaderboard', 'learn', 'prizes', 'profile'].map((tab) => (
                <motion.div
                  key={tab}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full"
                >
                  <TabsTrigger
                    value={tab}
                    className="w-full text-xs sm:text-sm md:text-base transition-all duration-300"
                    aria-label={`View ${tab} Section`}
                    disabled={tab === 'profile' && !wallet.connected}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </TabsTrigger>
                </motion.div>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <motion.div 
          className="flex gap-4 lg:gap-8 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {[
            { icon: <FaXTwitter size={20} />, href: "https://twitter.com/potionalpha", label: "Twitter" },
            { icon: <FaDiscord size={20} />, href: "https://whop.com/potion-alpha/?a=jonny2298", label: "Discord" }
          ].map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-[#d500fe] transition-colors"
              aria-label={`Follow us on ${social.label}`}
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              {social.icon}
            </motion.a>
          ))}
          <ModeToggle />
          <motion.div 
            className="max-w-[200px]"
            whileHover={{ scale: 1.02 }}
          >
            <WalletMultiButton />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
} 