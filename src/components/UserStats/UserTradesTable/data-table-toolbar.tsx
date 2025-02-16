"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch"

// import { usersStatus } from "@/app/wallets/definitions";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { usersStatus, pnlStatus } from "./definitions";
import { toast } from "react-hot-toast";


const handleSwitchChange = (checked: boolean) => {
  if (checked) {
    toast("Groups feature will be available soon!", {
      duration: 3000,
    });
  }
};

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
      <div className="flex items-center space-x-4">
        <Button variant="outline" className="rounded-full" onClick={() => {/* Handle Trades display */}}>
          Trades
        </Button>
        <Button variant="outline" className="rounded-full" onClick={() => {/* Handle Tokens display */}}>
          Tokens
        </Button>
        <Button variant="outline" className="rounded-full" onClick={() => {/* Handle Groups display */}}>
          Groups
        </Button>
      </div>

        {isFiltered && (
          <Button
            variant="outline"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3">
            {"Clean Filters"}
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <Input
        placeholder={"Search by token or contract address"}
        value={(table.getColumn("globalSearch")?.getFilterValue() as string) ?? ""}
        onChange={(event) => {
          const value = event.target.value;
          table.getColumn("globalSearch")?.setFilterValue(value);
        }}
        className="h-8 w-[150px] lg:w-[250px] m-2"
      />
      <DataTableViewOptions table={table} />
    </div>
  );
}
