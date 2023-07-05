import { SSTConfig } from "sst";
import { StorageStack } from "./stacks/StorageStack";
import { ApiStack } from "./stacks/ApiStack";
import { AuthStack } from "./stacks/AuthStack";
import { AppStack } from "./stacks/AppStack";

export default {
  config(_input) {
    return {
      name: "sepal",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(StorageStack).stack(ApiStack).stack(AuthStack).stack(AppStack);
  },
} satisfies SSTConfig;
