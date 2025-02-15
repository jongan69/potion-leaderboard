import { columns } from "@/components/WalletTable/columns";
import DataTable from "@/components/WalletTable/data-table";
import { fetchWallets } from "@/lib/fetchWallets";
import { LiveTrades } from "@/components/LiveTrades/LiveTrades";
import { Suspense } from "react";
import { Header } from "@/components/Header/Header";

export default async function Home() {
  // This is where you would fetch external data:
  const wallets = await fetchWallets();
  // console.log(wallets);
  // In Our example we use local data
  return (
    <div className="container min-h-screen">
      {wallets.length > 0 &&
        <Suspense fallback={<div>Loading...</div>}>
          <DataTable data={wallets} columns={columns} />
        </Suspense>
      }

      <Suspense fallback={<div>Loading...</div>}>
        <LiveTrades />
      </Suspense>
    </div>
  );
}
