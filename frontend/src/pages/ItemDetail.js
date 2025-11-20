import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
      <div class="card">
        <div class="card-header">
          <h2>{item.name}</h2>
        </div>
        <div class="card-body">
          <h5 class="card-title">{item.category}</h5>
          <p class="card-text">
            <strong>Price:</strong> ${item.price}
          </p>
          <Link to="/" class="btn btn-primary">Go Back</Link>
        </div>
      </div>

    </Box>

  );
}

export default ItemDetail;
