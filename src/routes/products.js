import express from 'express';
import ProductManager from '../managers/productManager.js';

const productsRouter = express.Router();
const productManager = new ProductManager();

// Middleware to convert 'pid' to a number
const convertPidToNumber = (req, res, next) => {
  req.params.pid = Number(req.params.pid);
  next();
};

// Middleware for error handling
const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
};

// Get a list of products
productsRouter.get('/', (req, res) => {
  try {
    const quantity = req.query.limit;
    const productList = productManager.loadProducts();

    if (quantity) {
      const limitedProducts = productList.slice(0, quantity);
      res.status(200).json(limitedProducts);
    } else {
      res.status(200).json(productList);
    }
  } catch (error) {
    throw new Error('Internal Server Error');
  }
});

// Get a specific product by ID
productsRouter.get('/:pid', convertPidToNumber, (req, res) => {
  try {
    const productId = req.params.pid;
    const productList = productManager.loadProducts();
    const productSearched = productList.find((product) => product.id === productId);

    if (productSearched) {
      res.status(200).json(productSearched);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    throw new Error('Internal Server Error');
  }
});

// Add a new product
productsRouter.post('/', (req, res) => {
  try {
    const productToAdd = req.body;
    productManager.addProduct(productToAdd);
    const productList = productManager.loadProducts();
    res.status(201).json(productList);
  } catch (error) {
    throw new Error('Internal Server Error');
  }
});

// Update a product by ID
productsRouter.put('/:pid', convertPidToNumber, (req, res) => {
  try {
    const productId = req.params.pid;
    const dataToUpdate = req.body;
    productManager.updateProduct(productId, dataToUpdate);
    const productList = productManager.loadProducts();
    res.status(200).json(productList);
  } catch (error) {
    throw new Error('Internal Server Error');
  }
});

// Delete a product by ID
productsRouter.delete('/:pid', convertPidToNumber, (req, res) => {
  try {
    const productId = req.params.pid;
    productManager.deleteProduct(productId);
    const productList = productManager.loadProducts();
    res.status(204).json(productList);
  } catch (error) {
    throw new Error('Internal Server Error');
  }
});

// Error handling middleware
productsRouter.use(errorHandler);

export default productsRouter;
