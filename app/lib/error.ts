interface AuthError {
  message: string;
}

export function onError(error: Error | AuthError) {
  let message = error.toString();
  if (!(error instanceof Error) && error.message) {
    message = error.message;
  }
  console.error(error);
  alert(message);
}
