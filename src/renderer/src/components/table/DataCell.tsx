import { ColumnDef } from '@tanstack/react-table';
import { TableDataType } from '@renderer/components/table/TableDataType';

type CellFuncType = ColumnDef<TableDataType>['cell'];

export const DataCell: CellFuncType = ({ row, column, getValue }) => {
  const value = getValue();
  console.log(row);

  console.log(value);

  if (typeof value === 'string') {
    return <div>{value}</div>;
  }

  if (Array.isArray(value)) {
    return <div>Not supported</div>;
  }

  if (typeof value === 'object') {
    return <div>{JSON.stringify(value)}</div>;
  }

  if (typeof value === 'undefined') {
    return <div></div>;
  }

  throw new Error(`Unsupported data type for ${column.id}`);
};
