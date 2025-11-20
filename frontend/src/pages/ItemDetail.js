import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGet } from '../api/client';

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadItem() {

      try {
        const json = await apiGet(`/api/items/${id}`, { signal: controller.signal });
        setItem(json);
      } catch (err) {
        // Se foi cancelamento → ignore
        if (err.name === 'AbortError') return;
        alert('Failed to load item: ' + err.message);
        // // Se item não existe → voltar para home
        // navigate('/');
      }
    }

    loadItem();

    // cleanup
    return () => controller.abort();
  }, [id, navigate]);

  if (!item) return <p style={{ padding: 16 }}>Loading...</p>;

  return (
    <div style={{ padding: 16 }}>
      <h2>{item.name}</h2>
      <p><strong>Category:</strong> {item.category}</p>
      <p><strong>Price:</strong> ${item.price}</p>
    </div>
  );
}

export default ItemDetail;
