const config = {
  // Backend config
  s3: {
    REGION: process.env.NEXT_PUBLIC_APP_REGION,
    BUCKET: process.env.NEXT_PUBLIC_APP_BUCKET,
  },
  apiGateway: {
    REGION: process.env.NEXT_PUBLIC_APP_REGION,
    URL: process.env.NEXT_PUBLIC_APP_API_URL,
  },
  cognito: {
    REGION: process.env.NEXT_PUBLIC_APP_REGION,
    USER_POOL_ID: process.env.NEXT_PUBLIC_APP_USER_POOL_ID,
    APP_CLIENT_ID: process.env.NEXT_PUBLIC_APP_USER_POOL_CLIENT_ID,
    IDENTITY_POOL_ID: process.env.NEXT_PUBLIC_APP_IDENTITY_POOL_ID,
  },
  MAX_ATTACHMENT_SIZE: 5000000,
};

export default config;
