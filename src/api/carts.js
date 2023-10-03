import express from "express";
import fs from "fs/promises";
import path from "path";

const cartsRouter = express.Router();
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// Route to create a new cart
cartsRouter.post("/", async (req, res) => {
  try {
    const newCart = {
      id: await generateCartId(), // Generate a new unique cart ID
      products: [],
    };

    const carts = await readCartsData(); // Read existing carts data
    carts.push(newCart); // Add the new cart to the array
    await writeCartsData(carts); // Write the updated array back to cart.json

    res.json(newCart); // Respond with the newly created cart
  } catch (error) {
    res.status(500).json({ error: "Error creating a new cart" });
  }
});

// Route to list products in a cart by cart ID
cartsRouter.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  try {
    const carts = await readCartsData(); // Read existing carts data
    const cart = carts.find((c) => c.id === cartId); // Find the cart by ID

    if (!cart) {
      res.status(404).json({ error: "Cart not found" });
    } else {
      res.json(cart.products); // Respond with the products in the cart
    }
  } catch (error) {
    res.status(500).json({ error: "Error retrieving cart products" });
  }
});

// Route to add a product to a cart by cart ID and product ID
cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = parseInt(req.body.quantity, 10);

  try {
    const carts = await readCartsData(); // Read existing carts data
    const cart = carts.find((c) => c.id === cartId); // Find the cart by ID

    if (!cart) {
      res.status(404).json({ error: "Cart not found" });
      return;
    }

    // Check if the product with the same ID already exists in the cart
    const existingProduct = cart.products.find(
      (p) => p.productId === productId
    );

    if (existingProduct) {
      // If the product exists, increment its quantity
      existingProduct.quantity += quantity;
    } else {
      // If the product doesn't exist, add a new entry for it
      cart.products.push({ productId, quantity });
    }

    await writeCartsData(carts); // Write the updated array back to cart.json

    res.json(cart.products); // Respond with the updated list of products in the cart
  } catch (error) {
    res.status(500).json({ error: "Error adding a product to the cart" });
  }
});

// Helper function to read cart data from cart.json
async function readCartsData() {
  const cartsFilePath = path.join(__dirname, "../data/carts.json");
  try {
    const data = await fs.readFile(cartsFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist or there's an error reading it, return an empty array
    return [];
  }
}

// Helper function to write cart data to cart.json
async function writeCartsData(carts) {
  const cartsFilePath = path.join(__dirname, "../data/carts.json");
  try {
    await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
  } catch (error) {
    console.error("Error writing carts data:", error);
    throw new Error("Error updating carts");
  }
}

// Helper function to generate a new cart ID
async function generateCartId() {
  const counterFilePath = path.join(__dirname, "cartCounter.json");
  try {
    let counter = { value: 1 };
    try {
      const counterData = await fs.readFile(counterFilePath, "utf8");
      counter = JSON.parse(counterData);
    } catch (error) {
      // Ignore errors, the counter will start at 1 if the file doesn't exist
    }
    counter.value++;
    await fs.writeFile(counterFilePath, JSON.stringify(counter, null, 2));
    return String(counter.value);
  } catch (error) {
    console.error("Error generating cart ID:", error);
    throw new Error("Error generating cart ID");
  }
}

export default cartsRouter;
