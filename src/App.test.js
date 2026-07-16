import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Simulamos window.APP_CONFIG, que normalmente inyecta docker-entrypoint.sh
beforeAll(() => {
  window.APP_CONFIG = { API_URL: 'http://localhost:8080' };
});

// Simulamos fetch para no depender de un backend real durante el test
beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.includes('/api/health')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 'UP', service: 'backend-innovatech' }),
      });
    }
    if (url.includes('/api/productos')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    }
    return Promise.reject(new Error('URL no manejada en el mock: ' + url));
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renderiza el título principal de la aplicación', () => {
  render(<App />);
  expect(screen.getByText(/Innovatech Chile/i)).toBeInTheDocument();
});

test('muestra "conectado" cuando el backend responde UP', async () => {
  render(<App />);
  await waitFor(() => {
    expect(screen.getByText(/conectado/i)).toBeInTheDocument();
  });
});

test('el formulario rechaza un producto con precio inválido', async () => {
  const user = userEvent.setup();
  render(<App />);

  const nombreInput = screen.getByPlaceholderText(/Nombre del producto/i);
  const precioInput = screen.getByPlaceholderText(/Precio/i);
  const stockInput = screen.getByPlaceholderText(/Stock/i);
  const boton = screen.getByRole('button', { name: /Agregar producto/i });

  await user.type(nombreInput, 'Producto de prueba');
  await user.type(precioInput, '-10');
  await user.type(stockInput, '5');
  await user.click(boton);

  expect(await screen.findByText(/precio debe ser mayor a 0/i)).toBeInTheDocument();
  // Confirma que NO se llamó a fetch con método POST (no se envió al backend)
  const postCalls = global.fetch.mock.calls.filter(call => call[1]?.method === 'POST');
  expect(postCalls.length).toBe(0);
});
