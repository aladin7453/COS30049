import { useState, useCallback, useEffect } from "react";
import { DEMO_MODE } from "./index";

// Generic data-fetching hook with loading + error states
export function useApi(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!DEMO_MODE);
  const [error, setError] = useState(null);

  const reload = useCallback(() => {
    if (DEMO_MODE) return;
    setLoading(true);
    setError(null);
    fetchFn()
      .then((d) => { setData(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, deps);

  useEffect(() => { reload(); }, [reload]);

  return { data, loading, error, reload };
}
