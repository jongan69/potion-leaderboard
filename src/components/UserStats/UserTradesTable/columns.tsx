"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/WalletTable/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

import { Trade } from "@/types/trade";

export const columns: ColumnDef<Trade>[] = [
  {
    accessorKey: "token",
    header: () => <h1>Token</h1>,
    cell: ({ row }) => {
      // const wallet = row.original.wallet;
      // const tokenInPic = row.original.fromTokenData?.image;
      const tokenOutPic = row.original.toTokenData?.image;
      const tokenOutSymbol = row.original.toTokenData?.symbol;
      const tokenOutAddress = row.original.toTokenData?.address;
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={`https://avatar.iran.liara.run/username?username=${tokenOutPic}`} alt="Profile Pic" width={32} height={32}/>
            <AvatarFallback>{tokenOutPic?.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start truncate">
            <h1 className="font-medium">{tokenOutSymbol}</h1>
            <h1 className="text-sm text-gray-500 truncate">{tokenOutAddress?.slice(0, 6)}...{tokenOutAddress?.slice(-6)}</h1>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "lastTrade",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Last Trade"} />,
  },
  {
    accessorKey: "marketCap",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Marketcap"} />,
  },
  {
    accessorKey: "amountInvested",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Amount Invested"} />,
  },
  {
    accessorKey: "roi",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"ROI"} />,
  },
  {
    accessorKey: "holding",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Holding"} />,
  },
  {
    accessorKey: "avgSell",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Avg Sell"} />,
  },
  {
    accessorKey: "holdingTime",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Holding Time"} />,
  },
];
