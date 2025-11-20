import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Items from './Items';
import ItemDetail from './ItemDetail';
import { DataProvider } from '../state/DataContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/navbar';
import NotFound from './notFound';
function App() {
  return (
    <DataProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Items />} />
        <Route path="/items/:id" element={<ItemDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </DataProvider>
  );
}

export default App;