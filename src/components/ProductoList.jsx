import React from 'react';

function ProductoList({ productos }) {
  if (!productos.length) {
    return <p>No hay productos cargados todavía.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Stock</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((p) => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.nombre}</td>
            <td>${p.precio}</td>
            <td>{p.stock}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProductoList;
