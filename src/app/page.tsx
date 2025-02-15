import { columns } from "@/components/WalletTable/columns";
import DataTable from "@/components/WalletTable/data-table";
import { fetchWallets } from "@/lib/fetchWallets";
import Image from "next/image";
import { LiveTrades } from "@/components/LiveTrades/LiveTrades";
import { Suspense } from "react";

export default async function Home() {
  // This is where you would fetch external data:
  const wallets = await fetchWallets();
  // console.log(wallets);
  // In Our example we use local data
  return (
    <div className="container p-2">
      <div className="flex items-center gap-2 py-4">
        <Image src="/logo.webp" alt="Potion Leaderboard" width={40} height={40} />
        <h1 className="text-2xl font-bold">Potion Leaderboard</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[1fr,300px] gap-4">

        <Suspense fallback={<div>Loading...</div>}>
          {wallets && <DataTable data={wallets} columns={columns} />}
        </Suspense>

        <Suspense fallback={<div>Loading...</div>}>
          <LiveTrades />
        </Suspense>

      </div>
    </div>
  );
}
