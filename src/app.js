const express = require('express');
const ProductManager = require('./ProductManager'); // Asegúrate de que la ruta sea correcta
const app = express();
const port = 3000; // Puedes cambiar el puerto según tus preferencias

const productManager = new ProductManager('./productos.json'); // Ajusta la ruta del archivo de productos

app.use(express.json());

// Endpoint para obtener productos
app.get('/products', async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productManager.getProducts();

    if (limit) {
      const limitedProducts = products.slice(0, parseInt(limit));
      res.json(limitedProducts);
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos.' });
  }
});

// Endpoint para obtener un producto por ID
app.get('/products/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    const product = await productManager.getProductById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express en ejecución en el puerto ${port}`);
});