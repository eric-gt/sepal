import handler from "@sepal/core/handler";
import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";
import dyanmoDb from "@sepal/core/dyanmoDb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const params: DynamoDB.GetItemInput = {
    TableName: Table.Collections.tableName,
    Key: {
      userId,
      id: event.pathParameters.id,
    },
  };

  const result = await dyanmoDb.get(params);
  if (!result.Item) {
    throw new Error(
      `Could not find collection ${event.pathParameters.id} for user ${userId}`
    );
  }
  return result.Item;
});
