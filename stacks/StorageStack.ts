import { StackContext } from "sst/constructs/FunctionalStack";
import { Stack } from "sst/constructs/Stack";
import { Bucket, Table } from "sst/constructs";

export function StorageStack({ stack, app }: StackContext) {
  const bucket = new Bucket(stack, "Uploads");
  const table = new Table(stack, "Collections", {
    fields: {
      userId: "string",
      id: "string",
    },
    primaryIndex: {
      partitionKey: "userId",
      sortKey: "id",
    },
  });

  return { table, bucket };
}
