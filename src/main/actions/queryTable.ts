import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { getClient } from '../routes/table';
import { TQueryProps } from '../validators';

export const queryTable = async ({ tableName, indexName, partitionKeyValue }: TQueryProps) => {
  const client = getClient();
  const command = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: `${indexName} = :index`,
    ExpressionAttributeValues: {
      ':index': partitionKeyValue
    }
  });

  const result = await client.send(command);

  console.log(result);

  return result.Items ?? [];
};
