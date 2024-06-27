import { trpc } from '@renderer/api';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { WithLabel } from '@renderer/components/ui/with-label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select';
import { Input } from '@renderer/components/ui/input';
import { Button } from '@renderer/components/ui/button';
import { TableInfo } from '../../../main/actions/getTableInformation';
import { QueryPropsSchema, TQueryProps } from '../../../main/validators';

export const QueryBuilder = ({ tableInfo }: { tableInfo: TableInfo | undefined }) => {
  const query = trpc.table.queryTable.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    control,
    setValue,
    trigger
  } = useForm<TQueryProps>({
    resolver: zodResolver(QueryPropsSchema),
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
        <div className="flex gap-4">
          <WithLabel id="index" labelText={'Select an index'} className="w-56">
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
              className="w-full"
              {...register('partitionKeyValue')}
              id="partition-key-input"
              placeholder={'Enter partition key value'}
            />
          </WithLabel>
        </div>

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
