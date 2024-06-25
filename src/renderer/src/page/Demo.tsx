import { trpc } from '@renderer/api';
import { Button } from '@renderer/components/ui/button';
import { ComboBox } from '@renderer/components/ui/combo-box';
import { Input } from '@renderer/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { WithLabel } from '@renderer/components/ui/with-label';

const formSchema = z.object({
  tableName: z.string(),
  /**
   * The index that is being used table or GSI
   */
  indexName: z.string(),
  /**
   * The PK
   */
  partitionKeyValue: z.string().min(1),
  /**
   * The SK
   */
  searchKey: z.object({
    value: z.string(),
    operator: z.enum(['=', '>', '<', '>=', '<=', 'between', 'begins_with'])
  }),
  limit: z.number().optional()
});

type TFormSchema = z.infer<typeof formSchema>;

export const Demo = () => {
  trpc.greeting.useQuery({
    name: 'Electron'
  });

  trpc.subscription.useSubscription(undefined, {
    onData: (data) => {
      console.log('YOOOOOOO- Client', data);
    }
  });
  const [selectedTable, setSelectedTable] = useState<string | undefined>(undefined);

  const setTableRegion = trpc.table.setRegion.useMutation();
  const { data: tableConfig } = trpc.table.getConfig.useQuery();
  const { data: regions } = trpc.table.getSupportedRegions.useQuery();
  const { data: tables } = trpc.table.getAvailableTables.useQuery();

  const { data: tableInfo } = trpc.table.getTableInformation.useQuery(
    {
      tableName: selectedTable ?? ''
    },
    {
      enabled: !!selectedTable
    }
  );

  const demo = trpc.useUtils();

  console.log(tableConfig, tables);

  console.log(tableInfo);

  return (
    <div className="p-4 flex flex-col gap-4">
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
              console.log(option);
              await setTableRegion.mutateAsync({ region: option.value });
              demo.table.getConfig.invalidate();
              demo.table.getAvailableTables.invalidate();
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
            onChange={(option) => {
              setSelectedTable(option.value);
            }}
            selectedOption={
              selectedTable ? { label: selectedTable, value: selectedTable } : undefined
            }
          />
        </WithLabel>
      </div>

      {tableInfo && <TableQueryBuilder tableInfo={tableInfo} />}
    </div>
  );
};

interface Indexes {
  primary: {
    partitionKey: {
      name: string;
    };
    searchKey: {
      name: string;
    };
  };
  gsiIndexes: {
    name: string;
    partitionKey: {
      name: string;
    };
    searchKey: {
      name: string;
    };
  }[];
}

interface TableInfo {
  tableName: string;
  indexes: Indexes;
}

const TableQueryBuilder = ({ tableInfo }: { tableInfo: TableInfo | undefined }) => {
  const query = trpc.table.queryTable.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    control,
    setValue,
    trigger
  } = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tableName: tableInfo?.tableName,
      indexName: tableInfo?.indexes.primary.partitionKey.name,
      searchKey: {
        operator: 'begins_with'
      }
    },
    reValidateMode: 'onBlur'
  });

  useEffect(() => {
    trigger();
    if (tableInfo) {
      setValue('tableName', tableInfo.tableName);
    }
  }, [tableInfo]);

  console.log('FORM ERRORS:', errors);

  const selectedIndex = useWatch({
    control,
    name: 'indexName'
  });

  const selectedIndexOption =
    tableInfo?.indexes.gsiIndexes.find((index) => index.name === selectedIndex) ??
    tableInfo?.indexes.primary;

  console.log(selectedIndex, selectedIndexOption);

  return (
    <div>
      <form
        onSubmit={handleSubmit((formData) => query.mutate(formData))}
        className="flex flex-col gap-4"
      >
        <WithLabel id="index" labelText={'Select a table or index'} className="min-w-32">
          <Controller
            name="indexName"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <Select defaultValue={value} onValueChange={(newValue) => onChange(newValue)}>
                <SelectTrigger>
                  <SelectValue className="w-max[100px]" placeholder="Error" />
                </SelectTrigger>
                <SelectContent>
                  {tableInfo?.indexes.primary && (
                    <SelectItem
                      key={tableInfo.indexes.primary.partitionKey.name}
                      value={tableInfo.indexes.primary.partitionKey.name}
                    >
                      {tableInfo?.indexes.primary.partitionKey.name}
                    </SelectItem>
                  )}
                  {tableInfo?.indexes.gsiIndexes.map((index) => {
                    return (
                      <SelectItem key={index.name} value={index.name}>
                        {index.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          />
        </WithLabel>
        <WithLabel
          labelText={`${selectedIndexOption?.partitionKey.name} (Partition key)`}
          id="partition-key-input"
        >
          <Input
            {...register('partitionKeyValue')}
            id="partition-key-input"
            placeholder={'Enter partition key value'}
          />
        </WithLabel>

        <div className="flex gap-2">
          <WithLabel id="sort-key-operator" labelText={'Operator'} className="min-w-32">
            <Controller
              name="searchKey.operator"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <Select defaultValue={value} onValueChange={(newValue) => onChange(newValue)}>
                  <SelectTrigger>
                    <SelectValue className="w-max[100px]" placeholder="Error" />
                  </SelectTrigger>
                  <SelectContent>
                    {['=', '>', '<', '>=', '<=', 'between', 'begins_with'].map((operator) => {
                      return (
                        <SelectItem key={operator} value={operator}>
                          {operator}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
            />
          </WithLabel>
          <WithLabel
            labelText={`${selectedIndexOption?.searchKey.name} (Sort key)`}
            id="sort-key-input"
          >
            <Input
              {...register('searchKey.value')}
              id="sort-key-input"
              placeholder={'Enter sort key value'}
            />
          </WithLabel>
        </div>

        <Button type="submit" disabled={!isValid}>
          Search
        </Button>
      </form>
      <pre>IS VALID: {isValid ? 'YES' : 'NO'}</pre>
      <pre>RESULT: {JSON.stringify(query.data, null, 2)}</pre>
    </div>
  );
};
