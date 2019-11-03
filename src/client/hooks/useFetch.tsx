import { useEffect, useState } from 'react';
import { http } from '../utils';
import { HttpError, isHttpError, HttpMethod } from '../types';

export function useFetch<T>(
  url: string,
  method: HttpMethod = 'GET',
  initialData = null
): { data: T | null; isLoading: boolean; error: HttpError | null } {
  const [data, setData] = useState<T | null>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<HttpError | null>(null);

  useEffect((): (() => void) => {
    let cancel = false;

    const fetchData = async (): Promise<void> => {
      setError(null);
      setIsLoading(true);

      try {
        const { response } = await http<T>({ url, method });

        if (!cancel) setData(response);
      } catch (err) {
        if (!cancel && isHttpError(err.response)) setError(err.response);
      }

      setIsLoading(false);
    };

    fetchData();

    return (): void => {
      cancel = true;
    };
  }, [url]);

  return { data, isLoading, error };
}
