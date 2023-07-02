import handler from "../../../core/src/handler";
import { Table } from "sst/node/table";
import { DynamoDB } from "aws-sdk";
import dyanmoDb from "../../../core/src/dyanmoDb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId =
    event.requestContext.authorizer.iam.cognitioIdentity.identityId;
  const params: DynamoDB.UpdateItemInput = {
    TableName: Table.Collections.tableName,
    Key: {
      userId,
      id: event.pathParameters.id,
    },
    UpdateExpression:
      "SET updatedAt=:updatedAt, attachment=:attachment, rooms=:rooms",
    ExpressionAttributeValues: {
      ":updatedAt": { N: Date.now().toString() } ?? null,
      ":rooms": data.rooms ?? null,
      ":attachment": data.attachment ?? null,
    },
    ReturnValues: "ALL_NEW",
  };

  await dyanmoDb.update(params);

  return { status: true };
});
