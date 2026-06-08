/** Ensures loading UI is visible long enough to feel intentional, even on fast responses. */
export const MIN_API_LOADING_MS = 750;

export async function withMinimumLoading(promise, minMs = MIN_API_LOADING_MS) {
  const started = Date.now();
  const result = await promise;
  const elapsed = Date.now() - started;
  if (elapsed < minMs) {
    await new Promise((resolve) => setTimeout(resolve, minMs - elapsed));
  }
  return result;
}
