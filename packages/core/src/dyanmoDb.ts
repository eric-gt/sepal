import AWS from "aws-sdk";
const client = new AWS.DynamoDB.DocumentClient();

export default {
  get: (params: AWS.DynamoDB.GetItemInput) => client.get(params).promise(),
  put: (params: AWS.DynamoDB.PutItemInput) => client.put(params).promise(),
  query: (params: AWS.DynamoDB.QueryInput) => client.query(params).promise(),
  update: (params: AWS.DynamoDB.UpdateItemInput) =>
    client.update(params).promise(),
  delete: (params: AWS.DynamoDB.DeleteItemInput) =>
    client.delete(params).promise(),
};
