export const ok = <T>(result: T) => ({
  result,
  success: true,
  statusCode: 200,
});
