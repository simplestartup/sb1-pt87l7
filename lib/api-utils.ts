export async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 5000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function retryRequest<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await delay(delayMs);
    return retryRequest(fn, retries - 1, delayMs * 2);
  }
}

export function handleApiError(error: any): never {
  if (error.name === 'AbortError') {
    throw new Error('Request timed out');
  }
  
  if (error instanceof Response) {
    throw new Error(`API error: ${error.status}`);
  }
  
  throw error;
}