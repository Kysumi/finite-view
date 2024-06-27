import { z } from 'zod';

export const QueryPropsSchema = z.object({
  tableName: z.string().min(1),
  /**
   * The index that is being used table or GSI
   */
  indexName: z.string(),
  /**
   * The PK
   */
  partitionKeyValue: z.string().min(1).max(2048),
  /**
   * The SK
   */
  searchKey: z.object({
    value: z.string().max(2048),
    operator: z.enum(['=', '>', '<', '>=', '<=', 'between', 'begins_with'])
  }),
  limit: z.number().optional()
});

export type TQueryProps = z.infer<typeof QueryPropsSchema>;
