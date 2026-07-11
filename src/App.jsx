import React, { useEffect, useState, useCallback } from 'react';
import ProductoList from './components/ProductoList';
import ProductoForm from './components/ProductoForm';

const API_URL = window.APP_CONFIG?.API_URL || 'http://localhost:8080';

function App() {
  const [productos, setProductos] = useState([]);
  const [backendStatus, setBackendStatus] = useState('verificando...');

  const cargarProductos = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/productos`);
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error('Error cargando productos', err);
    }
  }, []);

  const verificarBackend = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/health`);
      const data = await res.json();
      setBackendStatus(data.status === 'UP' ? 'conectado ✅' : 'con problemas ⚠️');
    } catch (err) {
      setBackendStatus('sin conexión ❌');
    }
  }, []);

  useEffect(() => {
    verificarBackend();
    cargarProductos();
  }, [verificarBackend, cargarProductos]);

  return (
    <div className="container">
      <h1>Innovatech Chile · Gestión de Productos</h1>
      <p className="status">Backend: {backendStatus} ({API_URL})</p>

      <h2>Agregar producto</h2>
      <ProductoForm apiUrl={API_URL} onCreado={cargarProductos} />

      <h2>Listado de productos</h2>
      <ProductoList productos={productos} />
    </div>
  );
}

export default App;
