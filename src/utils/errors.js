export function getErrorMessage(err, fallback) {
  const apiError = err?.response?.data?.error;
  if (typeof apiError === "string" && apiError.trim()) {
    return apiError;
  }
  return fallback;
}
