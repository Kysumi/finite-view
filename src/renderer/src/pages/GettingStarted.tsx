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
    <div>
      <h1>Getting Started</h1>

      <h3>Set your default region</h3>
      <p>This is the region that will be used for all your queries</p>
      <br />

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
