import { DynamoDB } from "aws-sdk";
import { MapAttributeValue } from "aws-sdk/clients/dynamodb";
import { Table } from "sst/node/table";
import handler from "@sepal/core/handler";
import dyanmoDb from "@sepal/core/dyanmoDb";

interface SharedCollection {
  userId: string;
  id: string;
  keys: Record<string, string[]>;
}
export const main = handler(async (event) => {
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const body = JSON.parse(event.body);
  const data: MapAttributeValue = {
    [body.userId]: { L: [{ S: body.collectionId }] },
  };
  const params: DynamoDB.PutItemInput = {
    TableName: Table.Collections.tableName,
    Item: {
      userId,
      createdAt: { S: new Date().toISOString() },
      id: { S: "sharedCollections" },
      keys: { M: data },
    },
  };

  await dyanmoDb.put(params);

  return params.Item;
});
