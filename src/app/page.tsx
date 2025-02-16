import { columns } from "@/components/WalletTable/columns";
import DataTable from "@/components/WalletTable/data-table";
import { fetchWallets } from "@/lib/fetchWallets";
import { LiveTrades } from "@/components/LiveTrades/LiveTrades";
import { Suspense } from "react";

export default async function Home() {
  // This is where you would fetch external data:
  const wallets = await fetchWallets();
  console.log(wallets);
  // In Our example we use local data
  return (
    <div className="container py-10">
      {wallets &&
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
