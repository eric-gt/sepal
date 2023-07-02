import { Table } from "sst/node/table";
import dyanmoDb from "../../../core/src/dyanmoDb";
import handler from "../../../core/src/handler";
import { DynamoDB } from "aws-sdk";

export const main = handler(async (event) => {
  const userId =
    event.requestContext.authorizer.iam.cognitioIdentity.identityId;
  const params: DynamoDB.QueryInput = {
    TableName: Table.Collections.tableName,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  };
  const data = await dyanmoDb.query(params);
  return data;
});
