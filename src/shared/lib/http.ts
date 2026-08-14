import { AppError } from './errors';

const DEFAULT_TIMEOUT_MS = 10_000;

type FetchJsonOptions = RequestInit & {
  timeoutMs?: number;
};

export async function fetchJson<T>(url: string, options: FetchJsonOptions = {}): Promise<T> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...init } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new AppError('http_error', 'The request could not be completed.', {
        status: response.status,
      });
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new AppError('timeout', 'The request took too long. Try again.');
    }

    throw new AppError('network', 'Unable to reach the server.', { cause: error });
  } finally {
    clearTimeout(timeoutId);
  }
}
