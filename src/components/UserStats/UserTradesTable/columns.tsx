"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/WalletTable/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { DoubleArrowRightIcon } from '@radix-ui/react-icons';

import { Trade } from "@/types/trade";
import { PnlDialog } from "@/components/PnlDialog/PnlDialog";

export const createColumns = (userName: string): ColumnDef<Trade>[] => [
  {
    accessorKey: "token",
    header: () => <h1>Token</h1>,
    cell: ({ row }) => {
      const fromTokenPic = row.original.fromTokenPic ?? `https://avatar.iran.liara.run/username?username=${row.original.fromTokenSymbol}`;
      const fromTokenSymbol = row.original.fromTokenSymbol;

      const toTokenPic = row.original.toTokenPic ?? `https://avatar.iran.liara.run/username?username=${row.original.toTokenSymbol}`;
      const toTokenSymbol = row.original.toTokenSymbol;
      const toTokenAddress = row.original.toTokenAddress;
      return (
        <div className="flex items-center gap-2 relative">
          <Avatar>
            <AvatarImage src={fromTokenPic} alt="Profile Pic" width={32} height={32}/>
            <AvatarFallback>{fromTokenSymbol?.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <DoubleArrowRightIcon className="text-gray-500" />
          <Avatar>
            <AvatarImage src={toTokenPic} alt="Profile Pic" width={32} height={32}/>
            <AvatarFallback>{toTokenSymbol?.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start truncate">
            <h1 className="font-medium">{toTokenSymbol}</h1>
            <h1 className="text-sm text-gray-500 truncate">{toTokenAddress?.slice(0, 6)}...{toTokenAddress?.slice(-6)}</h1>
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
    cell: ({ row }) => {
      const marketCap = row.original.toTokenData?.marketCap;
      return <div>{marketCap}</div>;
    },
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
  {
    id: "globalSearch",
    enableHiding: false,
    filterFn: (row, id, filterValue) => {
      const searchValue = (filterValue as string).toLowerCase();
      const tokenOutSymbol = String(row.original.toTokenData?.symbol).toLowerCase();
      const tokenOutAddress = String(row.original.toTokenData?.address).toLowerCase();
      return tokenOutSymbol.includes(searchValue) || tokenOutAddress.includes(searchValue);
    }
  },
  {
    accessorKey: "share",
    header: () => <h1>Share</h1>,
    cell: ({ row }) => {
      return (
        <PnlDialog 
          {...{
            totalInvested: row.original.fromAmount,
            totalSold: row.original.toAmount,
            roi: row.original.roi,
            tokenSymbol: row.original.toTokenSymbol ?? "Unknown",
            tokenImage: row.original.toTokenPic ?? "",
            userName: userName
          }}
        />
      );
    },
  },
];
