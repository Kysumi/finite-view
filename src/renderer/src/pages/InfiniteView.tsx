import { TableSelection } from "@renderer/components/TableSelection";
import { QueryFilters } from "@renderer/components/QueryFilters";

export const InfiniteView = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <TableSelection />
      <QueryFilters />
    </div>
  );
};
