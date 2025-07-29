import { useState, useEffect } from 'react';
import type { AxiosResponse } from 'axios';

export function useFetch<T>(promiseFn: () => Promise<AxiosResponse<T>>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    promiseFn()
      .then(res => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [promiseFn]);

  return { data, loading, error };
}
