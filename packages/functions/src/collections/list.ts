import handler from "@sepal/core/handler";
import { Table } from "sst/node/table";
import { DynamoDB } from "aws-sdk";
import dyanmoDb from "@sepal/core/dyanmoDb";

export const main = handler(async (event) => {
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
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
