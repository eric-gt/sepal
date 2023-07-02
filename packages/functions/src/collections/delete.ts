import { Table } from "sst/node/table";
import handler from "../../../core/src/handler";
import { DynamoDB } from "aws-sdk";
import dyanmoDb from "../../../core/src/dyanmoDb";

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
