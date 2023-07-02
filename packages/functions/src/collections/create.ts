import handler from "@my-sst-app/core/handler";
import * as uuid from "uuid";
import { Table } from "sst/node/table";
import dynamoDb from "@my-sst-app/core/dyanmoDb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;

  const collection = {
    id: uuid.v1(),
    userId,
    createdAt: Date.now(),
    ...data,
  };

  const params = {
    TableName: Table.Collections.tableName,
    Item: collection,
  };
  await dynamoDb.put(params);
  return params.Item;
});
