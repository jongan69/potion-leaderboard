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
        <div className="flex items-center space-x-2 mr-4">
          <Switch id="view-mode" onCheckedChange={handleSwitchChange} />
        </div>

        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title={"Trader Status"}
            options={usersStatus}
          />
        )}

        {table.getColumn("pnl") && (
          <DataTableFacetedFilter
            column={table.getColumn("pnl")}
            title={"PNL Status"}
            options={pnlStatus}
          />
        )}

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
          placeholder={"Filter"}
          value={(table.getColumn("xHandle")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("xHandle")?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px] m-2"
        />
      <DataTableViewOptions table={table} />
      
    </div>
  );
}
