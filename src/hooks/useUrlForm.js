import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export const useUrlForm = (searchParams = {}) => {
  const {search} = useLocation();
  const history = useHistory();
  const [filters, setFilters] = useState(searchParams);
  const [ready, setReady] = useState(false);

  const updateUrl = (newSearch) => {
    const newParams = new URLSearchParams();

    Object.entries(newSearch).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, String(value));
      }
    });
    history.push({search: newParams.toString()});
  };

  useEffect(() => {
    const params = new URLSearchParams(search);
    const newSearchFilter = Object.fromEntries(params.entries());

    if (JSON.stringify(newSearchFilter) !== JSON.stringify(filters)) {
      setFilters(newSearchFilter);
    }
    setReady(true);

  }, [search, filters, searchParams]);

  return {
    filters,
    setFilters: updateUrl,
    reset: () => updateUrl(searchParams),
    ready
  };
};
