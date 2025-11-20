import React, { createContext, useCallback, useContext, useState } from 'react';
import { apiGet } from '../api/client';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);

  const fetchItems = useCallback(async (opts = {}, signal) => {
    const { page = 1, limit = 20, q = '' } = opts;

    const params = new URLSearchParams({ page, limit, q });

    const json = await apiGet(`/api/items?${params.toString()}`, { signal });
    setItems(json.data);
  }, []);

  return (
    <DataContext.Provider value={{ items, fetchItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
