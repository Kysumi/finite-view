import { DescribeTableCommand, KeySchemaElement } from '@aws-sdk/client-dynamodb';
import { getClient } from '../routes/table';

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

export interface TableInfo {
  tableName: string;
  indexes: Indexes;
}

export const getTableInformation = async ({ tableName }: { tableName: string }) => {
  const client = getClient();
  const tableInfo = await client.send(new DescribeTableCommand({ TableName: tableName }));

  if (tableInfo.Table === undefined) {
    throw new Error('Table does not exist');
  }

  const primaryIndex = tableInfo.Table.KeySchema!;

  const awsToApp = (combo: KeySchemaElement[]) => {
    const pk = combo.find((index) => index.KeyType === 'HASH');
    const sk = combo.find((index) => index.KeyType === 'RANGE');

    if (!pk || !sk) {
      throw new Error('Table does not have a primary key');
    }

    return {
      partitionKey: {
        name: pk.AttributeName!,
        type: 'HASH'
      },
      searchKey: {
        name: sk.AttributeName!,
        type: 'RANGE'
      }
    };
  };

  const secondaryIndexes =
    tableInfo.Table.GlobalSecondaryIndexes?.map((index) => {
      return {
        name: index.IndexName!,
        ...awsToApp(index.KeySchema!)
      };
    }) ?? [];

  return {
    tableName,
    indexes: {
      primary: awsToApp(primaryIndex),
      gsiIndexes: secondaryIndexes
    }
  };
};
