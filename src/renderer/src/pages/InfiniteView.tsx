import { TableSelection } from "@renderer/components/TableSelection";
import { QueryFilters } from "@renderer/components/QueryFilters";
import { Button } from "@renderer/components/ui/button";
import { cn } from "@renderer/utils";
import { ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { trpc } from "@renderer/api";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@renderer/components/ui/sheet";

const LeftNav = ({ currentTableName }: { currentTableName?: string }) => {
  return (
    <div>
      <Sheet>
        <SheetTrigger>
          <Button
            variant="outline"
            role="combobox"
            className={cn("justify-between")}
          >
            {currentTableName ?? "Click to select a table"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"}>
          <SheetHeader>
            <SheetTitle>Change table/region</SheetTitle>
            <SheetDescription>
              <TableSelection />
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export const InfiniteView = () => {
  const { data: tableConfig } = trpc.table.getConfig.useQuery();

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <LeftNav currentTableName={tableConfig?.tableName} />
      </div>

      {/* Primary content*/}
      <QueryFilters />
    </div>
  );
};
