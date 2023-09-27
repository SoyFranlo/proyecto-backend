import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';

const productsRouter = express.Router();
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


// Configure Multer to handle image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Directory where images will be saved
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Original filename
  },
});

const upload = multer({ storage });

// Read products data from a JSON file
async function readProductsData() {
  const productsFilePath = path.join(__dirname, '../data/products.json');
  try {
    const data = await fs.readFile(productsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products data:', error);
    throw new Error('Error retrieving products');
  }
}

// Write products data to a JSON file
async function writeProductsData(products) {
  const productsFilePath = path.join(__dirname, '../data/products.json');
  try {
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error writing products data:', error);
    throw new Error('Error updating products');
  }
}

// Generate a new product ID based on a persistent counter
async function generateProductId() {
  const counterFilePath = path.join(__dirname, 'productCounter.json');
  try {
    let counter = { value: 1 };
    try {
      const counterData = await fs.readFile(counterFilePath, 'utf8');
      counter = JSON.parse(counterData);
    } catch (error) {
      // Ignore errors, the counter will start at 1 if the file doesn't exist
    }
    counter.value++;
    await fs.writeFile(counterFilePath, JSON.stringify(counter, null, 2));
    return String(counter.value);
  } catch (error) {
    console.error('Error generating product ID:', error);
    throw new Error('Error generating product ID');
  }
}

// Get all products
productsRouter.get('/', async (req, res) => {
  try {
    const products = await readProductsData();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving products' });
  }
});

// Get a product by ID
productsRouter.get('/:pid', async (req, res) => {
  const productId = req.params.pid;
  try {
    const products = await readProductsData();
    const product = products.find((p) => p.id === productId);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving product' });
  }
});

// Add a new product
productsRouter.post('/', upload.single('thumbnail'), async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
  } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const newProduct = {
    id: await generateProductId(),
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
    status: true,
  };

  try {
    const products = await readProductsData();
    products.push(newProduct);
    await writeProductsData(products);
    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error adding the product' });
  }
});

// Update a product by ID
productsRouter.put('/:pid', async (req, res) => {
  const productId = req.params.pid;
  const updatedProductData = req.body;

  try {
    const products = await readProductsData();
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      products[productIndex] = { ...products[productIndex], ...updatedProductData };
      await writeProductsData(products);
      res.json(products[productIndex]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating the product' });
  }
});

// Delete a product by ID
productsRouter.delete('/:pid', async (req, res) => {
  const productId = req.params.pid;

  try {
    const products = await readProductsData();
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      products.splice(productIndex, 1);
      await writeProductsData(products);
      res.json({ message: 'Product deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting the product' });
  }
});

export default productsRouter;

