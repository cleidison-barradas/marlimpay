export function ensureError(error: unknown): Error {
  let stringError = "[Unexpected error]";

  if (error instanceof Error) return error;

  try {
    stringError = JSON.stringify(error);
  } catch (e) {
    console.error(error);
  }

  return new Error(String(`this is not an error: ${stringError}`));
}
