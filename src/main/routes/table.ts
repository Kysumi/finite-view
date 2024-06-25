import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import {
  DescribeTableCommand,
  DynamoDBClient,
  KeySchemaElement,
  ListTablesCommand
} from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument, QueryCommand } from '@aws-sdk/lib-dynamodb';

import { fromEnv, fromTokenFile, fromSSO, fromIni } from '@aws-sdk/credential-providers';

const t = initTRPC.create({ isServer: true });

const regions = [
  'ca-west-1',
  'il-central-1',
  'ap-southeast-4',
  'ap-south-2',
  'eu-south-2',
  'eu-central-2',
  'me-central-1',
  'ap-southeast-3',
  'eu-south-1',
  'af-south-1',
  'me-south-1',
  'ap-east-1',
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-northeast-3',
  'ap-south-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'ca-central-1',
  'cn-north-1',
  'cn-northwest-1',
  'eu-central-1',
  'eu-north-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'sa-east-1',
  'us-east-1',
  'us-east-2',
  'us-gov-east-1',
  'us-gov-west-1',
  'us-west-1',
  'us-west-2'
];

/**
 * TODO CHANGE
 */
let region = 'ap-southeast-2';

let dbClient = DynamoDBDocument.from(
  new DynamoDBClient({
    region // Needs to be made dynamic
    // credentials: fromIni()
  })
);

const getClient = () => {
  return dbClient;
};
/**
 * TODO CHANGE END
 */

export const tableRouter = t.router({
  getConfig: t.procedure.query(async () => {
    return {
      region
    };
  }),
  getSupportedRegions: t.procedure.query(() => {
    return regions;
  }),
  setRegion: t.procedure.input(z.object({ region: z.string() })).mutation(({ input }) => {
    console.log('SETTING REGION', input.region);
    dbClient = DynamoDBDocument.from(
      new DynamoDBClient({
        region: input.region,
        credentials: fromIni()
      })
    );
    region = input.region;
  }),
  getAvailableTables: t.procedure.query(async () => {
    try {
      console.log('FIRING QUERY!');
      const client = getClient();
      const tables = await client.send(new ListTablesCommand({}));
      return tables.TableNames?.map((table) => table) ?? [];
    } catch (e) {
      console.log('FAILED!');
      console.log(JSON.stringify(e, null, 2));
      return [];
    }
  }),
  getTableInformation: t.procedure
    .input(z.object({ tableName: z.string() }))
    .query(async ({ input }) => {
      const { tableName } = input;

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
    }),
  queryTable: t.procedure
    .input(
      z.object({
        tableName: z.string(),
        indexName: z.string(),
        partitionKeyValue: z.string(),
        searchKey: z.object({
          value: z.string(),
          operator: z.enum(['=', '>', '<', '>=', '<=', 'between', 'begins_with'])
        }),
        limit: z.number().optional()
      })
    )
    .mutation(async ({ input }) => {
      const { tableName, indexName, partitionKeyValue, searchKey, limit } = input;
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
    })
});

export type TableRouter = typeof tableRouter;
