import React, { useState } from 'react';

function ProductoForm({ apiUrl, onCreado }) {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const validar = () => {
    if (!nombre.trim()) return 'El nombre es obligatorio.';
    if (!precio || Number(precio) <= 0) return 'El precio debe ser mayor a 0.';
    if (!stock || Number(stock) <= 0) return 'El stock debe ser mayor a 0.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mensajeError = validar();
    if (mensajeError) {
      setError(mensajeError);
      return;
    }
    setError('');
    setEnviando(true);
    try {
      const res = await fetch(`${apiUrl}/api/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          precio: Number(precio),
          stock: Number(stock),
        }),
      });
      if (!res.ok) throw new Error('Error al crear producto');
      setNombre('');
      setPrecio('');
      setStock('');
      onCreado();
    } catch (err) {
      setError('No se pudo guardar el producto. Revisa la conexión con el backend.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre del producto"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        type="number"
        placeholder="Precio"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
      />
      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />
      {error && <span className="error">{error}</span>}
      <button type="submit" disabled={enviando}>
        {enviando ? 'Guardando...' : 'Agregar producto'}
      </button>
    </form>
  );
}

export default ProductoForm;
