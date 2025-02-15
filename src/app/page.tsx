import { columns } from "@/app/wallets/columns";
import DataTable from "@/app/wallets/data-table";
import { fetchWallets } from "@/lib/fetchWallets";
import Image from "next/image";
import { LiveTrades } from "@/app/components/LiveTrades";
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
        {wallets && <DataTable data={wallets} columns={columns} />}
        <Suspense fallback={<div>Loading...</div>}>
          <LiveTrades />
        </Suspense>
      </div>
    </div>
  );
}
