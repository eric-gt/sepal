import handler from "@sepal/core/handler";
import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";
import dyanmoDb from "@sepal/core/dyanmoDb";

export const main = handler(async (event) => {
  const id = "sharedCollections";
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;

  const params: DynamoDB.GetItemInput = {
    TableName: Table.Collections.tableName,
    Key: {
      userId,
      id: { S: id },
    },
  };
  const collectionList = await dyanmoDb.get(params);
  if (!collectionList.Item) {
    throw new Error("Item not Found");
  }
  return collectionList.Item;
});
