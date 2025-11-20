import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiGet } from '../api/client';
import { Box } from '../components/box';
import NotFound from './notFound';
import Loading from '../components/loading';


function ItemDetail() {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadItem() {
      try {
        setLoading(true);

        const json = await apiGet(`/api/items/${id}`, {
          signal: controller.signal,
        });

        if (!json || !json.id) {
          setNotFound(true);
        } else {
          setItem(json);
        }

      } catch (err) {
        if (err.name === 'AbortError') return;
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    loadItem();

    return () => controller.abort();
  }, [id]);

  if (loading) return <Loading message="Carregando item..." />;

  if (notFound) return <NotFound />;
  if (!item) return null;
  return (
    <Box>
      <h2>{item.name}</h2>
      <p><strong>Category:</strong> {item.category}</p>
      <p><strong>Price:</strong> ${item.price}</p>
    </Box>
  );
}

export default ItemDetail;
