import handler from "@sepal/core/handler";
import { Table } from "sst/node/table";
import { DynamoDB } from "aws-sdk";
import dyanmoDb from "@sepal/core/dyanmoDb";

export const main = handler(async (event) => {
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;

  const collectionId = event.pathParameters.id;

  const params: DynamoDB.DeleteItemInput = {
    TableName: Table.Collections.tableName,
    Key: {
      userId,
      id: collectionId,
    },
  };

  await dyanmoDb.delete(params);
  return { status: true };
});
