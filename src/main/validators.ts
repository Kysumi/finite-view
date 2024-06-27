import { z } from 'zod';

export const QueryPropsSchema = z.object({
  tableName: z.string(),
  /**
   * The index that is being used table or GSI
   */
  indexName: z.string(),
  /**
   * The PK
   */
  partitionKeyValue: z.string(),
  /**
   * The SK
   */
  searchKey: z.object({
    value: z.string(),
    operator: z.enum(['=', '>', '<', '>=', '<=', 'between', 'begins_with'])
  }),
  limit: z.number().optional()
});

export type TQueryProps = z.infer<typeof QueryPropsSchema>;
