import handler from "@sepal/core/handler";
import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";
import dyanmoDb from "@sepal/core/dyanmoDb";

interface SharedCollection {
  userId: string;
  collectionId: string;
}
export const main = handler(async (event) => {
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const data: SharedCollection = JSON.parse(event.body);

  const params: DynamoDB.UpdateItemInput = {
    TableName: Table.Collections.tableName,
    Key: {
      userId: { S: userId },
      id: { S: "sharedCollections" },
    },
    UpdateExpression: `SET updatedAt=:updatedAt, list_item(#keys.#userId, :newSortKey)`,
    ExpressionAttributeNames: { "#keys": `keys`, "#userId": data.userId },
    ExpressionAttributeValues: {
      ":updatedAt": { S: new Date().toISOString() },
      ":newSortKey": {
        S: data.collectionId,
      },
    },
    ReturnValues: "ALL_NEW",
  };

  await dyanmoDb.update(params);
  return { status: true };
});
