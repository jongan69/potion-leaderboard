"use client";

import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";

import { DataTableColumnHeader } from "@/components/WalletTable/data-table-column-header";
import { DataTableRowActions } from "@/components/WalletTable/data-table-row-actions";
import { Wallet } from "@/lib/types";
import { usersStatus } from "./definitions";
import Image from "next/image";

export const columns: ColumnDef<Wallet>[] = [
  {
    accessorKey: "rank",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Rank"} />,
    cell: ({ row, table }) => {
      // Get all rows sorted by PNL
      const sortedRows = [...table.getPreFilteredRowModel().rows].sort(
        (a, b) => (b.getValue("pnl") as number) - (a.getValue("pnl") as number)
      );
      
      const rank = sortedRows.findIndex(r => r.id === row.id) + 1;
      
      return <div className="text-center">{rank}</div>;
    },
    sortingFn: (rowA, rowB) => {
      const aRank = rowA.getValue("pnl") as number;
      const bRank = rowB.getValue("pnl") as number;
      return bRank - aRank;
    },
    sortDescFirst: true,
  },
  {
    accessorKey: "profilePic",
    header: () => <h1>Trader</h1>,
    cell: ({ row }) => {
      const userName = row.original.userName;
      const wallet = row.original.wallet;
      return (
        <div className="flex items-center gap-2">
          <Image src={`https://avatar.iran.liara.run/username?username=${userName}`} alt="Profile Pic" width={32} height={32} />
          <div className="flex flex-col items-start truncate">
            <h1 className="font-medium">{userName}</h1>
            <h1 className="text-sm text-gray-500 truncate">{wallet.slice(0, 6)}...{wallet.slice(-6)}</h1>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "followers",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Followers"} />,
    cell: ({ row }) => {
      const followers = row.original.followers;
      const xHandle = row.original.xHandle;
      return (
        <div className="flex flex-col items-center gap-2">
          <div className="text-center">{followers}</div>
          <div className="text-center">{xHandle}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "tokenCount",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Tokens"} />,
  },
  {
    accessorKey: "winRate",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Win Rate"} />,
  },
  {
    accessorKey: "trades",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Trades"} />,
    cell: ({ row }) => {
      const trades = row.original.trades;
      return (
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <span className="text-green-500">{trades?.buys} Buys</span>
            <span> / </span>
            <span className="text-red-500">{trades?.sells} Sells</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "avgBuy",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Avg Buy"} />,
  },
  {
    accessorKey: "avgHold",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Avg Hold"} />,
  },
  {
    accessorKey: "pnl",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Realized PnL"} />,
    filterFn: (row, id, value: string[]) => {
      if (!value.length) return true;
      const pnl = row.getValue(id) as number;
      return value.some((v) => {
        if (v === "positive") return pnl >= 0;
        if (v === "negative") return pnl < 0;
        return false;
      });
    },
  },
  {
    accessorKey: "wallet",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Wallet"} />,
    cell: ({ row }) => {
      const wallet = row.original.wallet;
      return (
        <div className="text-center">{wallet.slice(0, 6)}...{wallet.slice(-6)}</div>
      );
    },
  },
  {
    accessorKey: "xHandle",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"X Handle"} />,
    cell: ({ row }) => {
      const xHandle = row.original.xHandle;
      return (
        <div className="text-center">{xHandle}</div>
      );
    },
    filterFn: (row, id, filterValue) => {
      const searchValue = (filterValue as string).toLowerCase();
      const xHandle = String(row.getValue("xHandle")).toLowerCase();
      const wallet = String(row.getValue("wallet")).toLowerCase();
      return xHandle.includes(searchValue) || wallet.includes(searchValue);
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Status"} />,
    cell: ({ row }) => {
      const status = usersStatus.find((status) => status.value === row.getValue("status"));

      if (!status) {
        return null;
      }

      return (
        <div
          className={clsx("flex w-[100px] items-center", {
            "text-red-500": status.value === "inactive",
            "text-green-500": status.value === "active",
          })}>
          {status.icon && <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "globalSearch",
    enableHiding: false,
    filterFn: (row, id, filterValue) => {
      const searchValue = (filterValue as string).toLowerCase();
      const xHandle = String(row.getValue("xHandle")).toLowerCase();
      const wallet = String(row.getValue("wallet")).toLowerCase();
      return xHandle.includes(searchValue) || wallet.includes(searchValue);
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
