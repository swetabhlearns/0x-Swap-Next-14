import { useEffect, useState } from "react";

interface FetchOptions extends RequestInit {}

interface FetchResponse<T> {
  response: T | null;
  loading: boolean;
  error: string;
}

const useFetch = <T,>(
  endpoint: string,
  options?: FetchOptions
): FetchResponse<T> => {
  const [response, setResponse] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  console.log(API_KEY);

  const fetchData = async () => {
    const baseURL = "https://api.coingecko.com/api/v3";

    try {
      setLoading(true);
      const res = await fetch(`${baseURL}/${endpoint}`, {
        method: "GET",
        headers: {
          "x-cg-demo-api-key": `${API_KEY}`,
          accept: "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
      const data: T = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (endpoint) {
      fetchData();
    }
  }, [endpoint, options]);

  return { response, loading, error };
};

export default useFetch;
