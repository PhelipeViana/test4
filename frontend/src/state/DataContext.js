import React, { createContext, useCallback, useContext, useState } from 'react';
import { apiGet } from '../api/client';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    limit: 20,
    total: 0
  });

  const fetchItems = useCallback(async (opts = {}, signal) => {
    const { page = 1, limit = 20, q = '' } = opts;
    const params = new URLSearchParams({ page, limit, q });

    try {
      const json = await apiGet(`/api/items?${params.toString()}`, { signal });

      setItems(json.data);
      setPageInfo({
        page: json.page,
        limit: json.limit,
        total: json.total
      });

    } catch (err) {
      if (err.name === "AbortError") return; // silencioso
      throw err;
    }

  }, []);

  return (
    <DataContext.Provider value={{ items, pageInfo, fetchItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
