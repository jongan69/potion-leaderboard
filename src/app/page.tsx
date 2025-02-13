import { columns } from "@/app/wallets/columns";
import DataTable from "@/app/wallets/data-table";
import { fetchWallets } from "@/lib/fetchWallets";
import Image from "next/image";

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
      {wallets && <DataTable data={wallets} columns={columns} />}
    </div>
  );
}
