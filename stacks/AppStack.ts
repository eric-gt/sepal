import { StackContext, StaticSite, use } from "sst/constructs";
import { ApiStack } from "./ApiStack";
import { StorageStack } from "./StorageStack";
import { AuthStack } from "./AuthStack";

export function AppStack({ stack, app }: StackContext) {
  const { api } = use(ApiStack);
  const { bucket } = use(StorageStack);
  const { auth } = use(AuthStack);

  const site = new StaticSite(stack, "react", {
    path: "app",
    buildOutput: "build",
    buildCommand: "npm run build",
    // Pass in our environment variables
    environment: {
      NEXT_PUBLIC_APP_API_URL: api.customDomainUrl || api.url,
      NEXT_PUBLIC_APP_REGION: app.region,
      NEXT_PUBLIC_APP_BUCKET: bucket.bucketName,
      NEXT_PUBLIC_APP_USER_POOL_ID: auth.userPoolId,
      NEXT_PUBLIC_APP_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId ?? "",
      NEXT_PUBLIC_APP_USER_POOL_CLIENT_ID: auth.userPoolClientId,
    },
  });

  // Show the url in the output
  stack.addOutputs({
    SiteUrl: site.url || "http://localhost:3000",
  });
  return { site };
}
