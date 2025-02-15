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
      return <Image src={`https://avatar.iran.liara.run/username?username=${row.getValue("xHandle")}`} alt="Profile Pic" width={32} height={32} />;
    },
  },
  {
    accessorKey: "wallet",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Wallet"} />,
  },
  {
    accessorKey: "xHandle",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"X Handle"} />,
  },
  {
    accessorKey: "followers",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Followers"} />,
  },
  {
    accessorKey: "pnl",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"PnL"} />,
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
  // {
  //   accessorKey: "rtn",
  //   header: ({ column }) => <DataTableColumnHeader column={column} title={"RTN"} />,
  // },
  // {
  //   accessorKey: "otherInformation",
  //   header: ({ column }) => <DataTableColumnHeader column={column} title={"Other Info"} />,
  // },
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
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
