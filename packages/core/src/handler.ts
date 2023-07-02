export type Lambda = (event: any, context: any) => Promise<any>;
export default function handler(lambda: Lambda) {
  return async function (event: any, context: any) {
    let body, statusCode;

    try {
      body = await lambda(event, context);
      statusCode = 200;
    } catch (error: unknown) {
      console.error(error);
      body = { error: (error as Error).message };
      statusCode = 500;
    }

    return {
      statusCode,
      body: JSON.stringify(body),
    };
  };
}
