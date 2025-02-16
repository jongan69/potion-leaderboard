"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Switch } from "@/components/ui/switch"

// import { usersStatus } from "@/app/wallets/definitions";

// import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { unfinishedFeatureToast } from "@/lib/unfinishedFeatureToast";
// import { usersStatus, pnlStatus } from "./definitions";
// import { toast } from "react-hot-toast";


// const handleSwitchChange = (checked: boolean) => {
//   if (checked) {
//     toast("Groups feature will be available soon!", {
//       duration: 3000,
//     });
//   }
// };

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  
  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:space-x-2">
        {/* Button group with horizontal scroll on mobile */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0">
          <Button
            variant="outline"
            className="rounded-full whitespace-nowrap"
            onClick={() => unfinishedFeatureToast("Trades")}>
            Trades
          </Button>
          <Button
            variant="outline"
            className="rounded-full whitespace-nowrap"
            onClick={() => unfinishedFeatureToast("Tokens")}>
            Tokens
          </Button>
          <Button
            variant="outline"
            className="rounded-full whitespace-nowrap"
            onClick={() => unfinishedFeatureToast("Groups")}>
            Groups
          </Button>
        </div>

        {isFiltered && (
          <Button
            variant="outline"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3 whitespace-nowrap">
            {"Clean Filters"}
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Input
          placeholder={"Search by token or contract address"}
          value={(table.getColumn("globalSearch")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            const value = event.target.value;
            table.getColumn("globalSearch")?.setFilterValue(value);
          }}
          className="h-8 w-full min-w-[150px] sm:w-[250px]"
        />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
