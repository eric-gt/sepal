import handler from "@sepal/core/handler";
import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";
import dyanmoDb from "@sepal/core/dyanmoDb";

export const main = handler(async (event) => {
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;

  const params: DynamoDB.DeleteItemInput = {
    TableName: Table.Collections.tableName,
    Key: {
      userId,
      id: { S: "sharedCollections" },
    },
  };

  await dyanmoDb.delete(params);
  return { status: true };
});
