import handler from "@sepal/core/handler";
import { Table } from "sst/node/table";
import dyanmoDb from "@sepal/core/dyanmoDb";

interface SharedCollectionsCollection {
  userId: string;
  id: string;
  keys: Record<string, string[]>;
}
export const main = handler(async (event, context) => {
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const ownerId = event.pathParameters.ownerId;
  const collectionId = event.pathParameters.collectionId;
  const sharedCollectionsItem = await dyanmoDb.get({
    TableName: Table.Collections.tableName,
    Key: {
      userId: { S: userId },
      id: { S: "sharedCollections" },
    },
  });

  if (!sharedCollectionsItem.Item) {
    throw new Error("No Shared Collections for this user");
  }
  const sharedCollections =
    sharedCollectionsItem.Item as SharedCollectionsCollection;

  const collectionKey = sharedCollections.keys[ownerId]
    .map((collection) => ({ userId: ownerId, collectionId: collection }))
    .find((key) => key.collectionId === collectionId);

  if (!collectionKey) {
    throw new Error("Unauthorized");
  }

  const collection = await dyanmoDb.get({
    TableName: Table.Collections.tableName,
    Key: {
      userId: { S: collectionKey.userId },
      id: { S: collectionKey.collectionId },
    },
  });

  if (!collection.Item) {
    throw new Error("No Collection found!");
  }
  return collection.Item;
});
