import { ComboBox } from "@renderer/components/ui/combo-box";
import { WithLabel } from "@renderer/components/ui/with-label";
import { trpc } from "@renderer/api";
import { Button } from "@renderer/components/ui/button";
import { Link } from "react-router-dom";

export const GettingStarted = () => {
  const { data: tableConfig } = trpc.table.getConfig.useQuery();
  const utils = trpc.useUtils();

  const { data: regions } = trpc.table.getSupportedRegions.useQuery();
  const setTableRegion = trpc.table.setRegion.useMutation();

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-3xl font-bold">Getting Started</h1>

      <div>
        <h3>Set your default region</h3>
        <p>This is the region that will be used for all your queries</p>
      </div>
      <WithLabel id="region-select" labelText={"Region"}>
        <ComboBox
          options={
            regions?.map((region) => {
              return {
                label: region,
                value: region,
              };
            }) ?? []
          }
          onChange={async (option) => {
            await setTableRegion.mutateAsync({ region: option.value });

            await utils.table.getConfig.invalidate();
            await utils.table.getAvailableTables.invalidate();
          }}
          selectedOption={
            tableConfig
              ? { label: tableConfig.region, value: tableConfig.region }
              : undefined
          }
        />
      </WithLabel>
      <p>You can change this at any time</p>

      <Link to={"/finite-view"}>
        <Button>Start!</Button>
      </Link>
    </div>
  );
};
