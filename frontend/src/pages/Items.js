import React, { useEffect } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import { Box } from '../components/box';
import Loading from '../components/loading';

function Items() {
  const { items, fetchItems } = useData();

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        await fetchItems({ page: 1, limit: 20 }, controller.signal);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      }
    }

    load();
    console.log(items);
    return () => controller.abort();
  }, [fetchItems]);

  if (!items.length) return <Loading />;

  const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  const formatPrice = (p) => (Number.isFinite(Number(p)) ? usd.format(Number(p)) : '');

  return (
    <Box>
      <table className="table table-striped table-hover table-bordered">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Category</th>
            <th scope="col">Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <th scope="row">{item.id}</th>
              <td>
                <Link to={`/items/${item.id}`}>{item.name}</Link>
              </td>
              <td>{item.category}</td>
              <td>{formatPrice(item.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
}

export default Items;
