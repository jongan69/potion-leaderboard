"use client";

// import { UserSchema } from "@/app/users/userSchema";
import Link from "next/link";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import {
  // Eye,
  // Pencil, 
  // Trash2,
  // ArrowUpRight
  SearchIcon,
  XIcon,
  Copy
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserSchema } from "./userSchema";
import { toast } from "react-hot-toast";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const user = UserSchema.parse(row.original);
  console.log(user.wallet); // Note: use the id for any action (example: delete, view, edit)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">{"Open Menu"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[#25223D]" align="end">
        <DropdownMenuItem>
          <Button variant={"ghost"} size={"sm"} className={"justify-start w-full"} asChild>
            <Link href={`https://solscan.io/address/${user.wallet}`} target="_blank">
              <SearchIcon className="w-4 h-4 text-blue-500" />
              {<span className="ml-2">{"View Wallet on Solscan"}</span>}
            </Link>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Button variant={"ghost"} size={"sm"} className={"justify-start w-full"} asChild>
            <Link href={`https://x.com/${user.xHandle}`} target="_blank">
              <XIcon className="w-4 h-4 text-blue-500" />
              {<span className="ml-2">{"View Twitter"}</span>}
            </Link>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Button variant={"ghost"} size={"sm"} className={"justify-start w-full"} asChild>
            <Link href={`/users/${user.wallet}`} target="_blank">
              <SearchIcon className="w-4 h-4 text-blue-500" />
              {<span className="ml-2">{"View Profile"}</span>}
            </Link>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Button variant={"ghost"} size={"sm"} className={"justify-start w-full"} asChild>
            <Button
              variant={"ghost"} size={"sm"} className={"justify-start w-full"}
              onClick={() => {
                navigator.clipboard.writeText(user.wallet!);
                toast.success("Wallet address copied to clipboard");
              }}>
              <Copy className="w-4 h-4 text-blue-500" />
              {<span className="ml-2">{"Copy Wallet Address"}</span>}
            </Button>
          </Button>
        </DropdownMenuItem>

        {/* <DropdownMenuItem>
          <Button variant={"ghost"} size={"sm"} className={"justify-start w-full"} asChild>
            <Link href={"#"}>
              <Pencil className="h-4 w-4 text-green-500" />
              {<span className="ml-2">{"Update"}</span>}
            </Link>
          </Button>
        </DropdownMenuItem> */}

        {/* <DropdownMenuItem>
          <Button variant={"ghost"} size={"sm"} className={"justify-start w-full"}>
            <Trash2 className="h-4 w-4 text-red-500" />
            {<span className="ml-2">{"Delete"}</span>}
          </Button>
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
