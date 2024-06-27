import { trpc } from '@renderer/api';
import { ComboBox } from './ui/combo-box';
import { WithLabel } from './ui/with-label';

export const TableSelection = () => {
  const utils = trpc.useUtils();

  const { data: tableConfig } = trpc.table.getConfig.useQuery();
  const { data: regions } = trpc.table.getSupportedRegions.useQuery();
  const { data: tables } = trpc.table.getAvailableTables.useQuery();

  const setTableRegion = trpc.table.setRegion.useMutation();
  const setActiveTable = trpc.table.setActiveTable.useMutation();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <WithLabel id="region-select" labelText={'Region'}>
          <ComboBox
            options={
              regions?.map((region) => {
                return {
                  label: region,
                  value: region
                };
              }) ?? []
            }
            onChange={async (option) => {
              await setTableRegion.mutateAsync({ region: option.value });

              utils.table.getConfig.invalidate();
              utils.table.getAvailableTables.invalidate();
            }}
            selectedOption={
              tableConfig ? { label: tableConfig.region, value: tableConfig.region } : undefined
            }
          />
        </WithLabel>

        <WithLabel id="table-select" labelText={'Table'}>
          <ComboBox
            className={'w-full'}
            placeHolder="Select Table"
            options={
              tables?.map((table) => {
                return {
                  label: table,
                  value: table
                };
              }) ?? []
            }
            onChange={async (option) => {
              await setActiveTable.mutateAsync({ tableName: option.value });
              utils.table.getConfig.invalidate();
            }}
            selectedOption={
              tableConfig?.tableName
                ? { label: tableConfig?.tableName, value: tableConfig?.tableName }
                : undefined
            }
          />
        </WithLabel>
      </div>
    </div>
  );
};
