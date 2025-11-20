import React, { useEffect, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import { Box } from '../components/box';
import Loading from '../components/loading';

function Items() {
  const { items, fetchItems, pageInfo } = useData();
  const [search, setSearch] = useState('');

  const { page, limit, total } = pageInfo;
  const totalPages = Math.ceil(total / limit);

  // 🔄 Carrega primeira página ao montar
  useEffect(() => {
    const controller = new AbortController();

    fetchItems({ page: 1, limit: 20 }, controller.signal)
      .catch(err => {
        if (err.name !== 'AbortError') console.error(err);
      });

    return () => controller.abort();
  }, [fetchItems]);

  // 🔍 Busca com debounce + reset automático ao limpar
  useEffect(() => {
    const controller = new AbortController();

    if (search === '') {
      // Quando input está vazio → recarrega lista completa
      fetchItems({ page: 1, limit: 20 }, controller.signal);
      return () => controller.abort();
    }

    const timeout = setTimeout(() => {
      fetchItems({ q: search, page: 1, limit: 20 }, controller.signal)
        .catch(err => {
          if (err.name !== 'AbortError') console.error(err);
        });
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [search, fetchItems]);

  // 📄 Paginação
  function goToPage(p) {
    const controller = new AbortController();
    fetchItems({ q: search, page: p, limit }, controller.signal)
      .catch(err => {
        if (err.name !== 'AbortError') console.error(err);
      });
  }

  if (!items) return <Loading />;

  const usd = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  return (
    <Box>

      {/* 🔎 Campo de busca + limpar */}
      <div className="d-flex gap-2 mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {search.length > 0 && (
          <button
            className="btn btn-danger"
            onClick={() => setSearch('')}
          >
            ✕
          </button>
        )}
      </div>

      {/* Caso nenhum resultado seja encontrado */}
      {items.length === 0 && search !== '' && (
        <p className="text-center text-muted mt-4">
          Nenhum item encontrado para "{search}"
        </p>
      )}

      {/* 🧾 Tabela */}
      {items.length > 0 && (
        <>
          <table className="table table-striped table-hover table-bordered">
            <thead>
              <tr>
                <th>#</th><th>Name</th><th>Category</th><th>Price</th>
              </tr>
            </thead>

            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <th>{item.id}</th>
                  <td>
                    <Link to={`/items/${item.id}`}>{item.name}</Link>
                  </td>
                  <td>{item.category}</td>
                  <td>{usd.format(item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 📄 Paginação */}
          <nav className="mt-4 d-flex justify-content-end">
            <ul className="pagination">

              {/* Previous */}
              <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => goToPage(page - 1)}>
                  Previous
                </button>
              </li>

              {/* Números das páginas */}
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                return (
                  <li
                    key={p}
                    className={`page-item ${p === page ? 'active' : ''}`}
                  >
                    <button className="page-link" onClick={() => goToPage(p)}>
                      {p}
                    </button>
                  </li>
                );
              })}

              {/* Next */}
              <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => goToPage(page + 1)}>
                  Next
                </button>
              </li>

            </ul>
          </nav>
        </>
      )}

    </Box>
  );
}

export default Items;
