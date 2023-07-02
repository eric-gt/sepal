import { Api, StackContext, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack, app }: StackContext) {
  const { table, bucket } = use(StorageStack);
  const api = new Api(stack, "API", {
    defaults: {
      authorizer: "iam",
      function: {
        bind: [table],
      },
    },
    routes: {
      "POST /collections": "packages/functions/src/collections/create.main",
      "GET /collections/{id}": "packages/functions/src/collections/get.main",
      "PUT /collections/{id}": "packages/functions/src/collections/update.main",
      "DELETE /collections/{id}":
        "packages/functions/src/collections/delete.main",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return { api };
}
