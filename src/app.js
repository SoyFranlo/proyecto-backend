import express from 'express';
const app = express();
const PORT = 8080;
import productsRouter from './api/products.js';
import cartsRouter from './api/carts.js';
// Middleware para el manejo de JSON en las peticiones
app.use(express.json());

// Monta los routers de productos y carritos
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
