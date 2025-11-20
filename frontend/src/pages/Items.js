import React, { useEffect } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';

function Items() {
  const { items, fetchItems } = useData();

  useEffect(() => {
    const controller = new AbortController();

    fetchItems(controller.signal).catch(err => {
      if (err.name !== 'AbortError') {
        console.error('Failed to fetch items:', err);
      }
    });
    console.log(items.data);

    return () => controller.abort();
  }, [fetchItems]);

  if (!items.data.length) return <p>Loading...</p>;

  return (
    <ul>
      {items.data.map(item => (
        <li key={item.id}>
          <Link to={'/items/' + item.id}>{item.name}</Link>
        </li>
      ))}
    </ul>
  );
}

export default Items;
