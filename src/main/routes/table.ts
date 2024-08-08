import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { fromIni } from "@aws-sdk/credential-providers";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";
import { getTableInformation, TableInfo } from "../actions/getTableInformation";
import { regions } from "../config/availableRegions";
import { queryTable } from "../actions/queryTable";
import { QueryPropsSchema } from "../validators";
import { TRPCError } from "@trpc/server";

const ee = new EventEmitter();

const t = initTRPC.create({ isServer: true });

/**
 * TODO CHANGE
 */
let region = "ap-southeast-2";
let tableName: undefined | string = undefined;

let dbClient = DynamoDBDocument.from(
  new DynamoDBClient({
    region, // Needs to be made dynamic
    // credentials: fromIni()
  }),
);

export const getClient = () => {
  return dbClient;
};
/**
 * TODO CHANGE END
 */

export const tableRouter = t.router({
  getConfig: t.procedure.query(async () => {
    return {
      region,
      tableName,
    };
  }),
  getSupportedRegions: t.procedure.query(() => {
    return regions;
  }),
  setRegion: t.procedure
    .input(z.object({ region: z.string() }))
    .mutation(({ input }) => {
      console.log("SETTING REGION", input.region);
      dbClient = DynamoDBDocument.from(
        new DynamoDBClient({
          region: input.region,
          credentials: fromIni(),
        }),
      );
      region = input.region;
      tableName = undefined;
      ee.emit("greeting", undefined);
    }),
  onTableChanged: t.procedure.subscription(() => {
    return observable((emit) => {
      function onTableChanges(tableInfo?: TableInfo) {
        console.log(tableInfo);
        emit.next(tableInfo);
      }

      ee.on("tableChanged", onTableChanges);

      return () => {
        ee.off("tableChanged", onTableChanges);
      };
    });
  }),
  setActiveTable: t.procedure
    .input(z.object({ tableName: z.string() }))
    .mutation(async ({ input }) => {
      tableName = input.tableName;
      ee.emit("tableChanged", await getTableInformation({ tableName }));
    }),
  getAvailableTables: t.procedure.query(async () => {
    try {
      const client = getClient();
      const tables = await client.send(new ListTablesCommand({}));
      return tables.TableNames?.map((table) => table) ?? [];
    } catch (e) {
      console.error("Failed to list tables:", e);
      // Check if the error message includes keywords related to credentials
      if (
        e instanceof Error &&
        (e.message.includes("credentials") ||
          e.message.includes("authentication"))
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "AWS credentials are missing, expired, or invalid.",
        });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve table list. Please try again later.",
      });
    }
  }),
  queryTable: t.procedure
    .input(QueryPropsSchema)
    .mutation(async ({ input }) => {
      return queryTable(input);
    }),
});

export type TableRouter = typeof tableRouter;
