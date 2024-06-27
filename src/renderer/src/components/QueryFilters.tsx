import { trpc } from '@renderer/api';
import { useState } from 'react';
import { QueryBuilder } from '@renderer/components/QueryBuilder';
import { TableInfo } from '../../../main/actions/getTableInformation';

export const QueryFilters = () => {
  const [selectedTableInfo, setSelectedTableInfo] = useState<undefined | TableInfo>(undefined);

  trpc.table.onTableChanged.useSubscription(undefined, {
    onData: (data) => {
      setSelectedTableInfo(data as TableInfo);
    }
  });

  if (!selectedTableInfo) {
    return null;
  }

  return (
    <div>
      <QueryBuilder tableInfo={selectedTableInfo} />
    </div>
  );
};
