import express from "express";
import CartManager from "../managers/cartManager.js";

const cartsRouter = express.Router();
const cartManager = new CartManager();

// Middleware for converting parameters to numbers
function convertToNumbers(req, res, next) {
  req.params.cid = Number(req.params.cid);
  req.params.pid = Number(req.params.pid);
  next();
}

// Middleware to handle errors
function errorHandler(err, req, res, next) {
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
}

cartsRouter.post('/', (req, res) => {
  try {
    cartManager.addCart();
    const cartList = cartManager.getCart();
    res.status(201).json({ carts: cartList });
  } catch (error) {
    throw new Error("Internal Server Error");
  }
});

cartsRouter.post('/:cid/product/:pid', convertToNumbers, (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    cartManager.addProduct(cartId, productId);
    const cartList = cartManager.getCart();
    res.status(200).json({ carts: cartList });
  } catch (error) {
    throw new Error("Bad Request");
  }
});

cartsRouter.get('/:cid', convertToNumbers, (req, res) => {
  try {
    const cartId = req.params.cid;
    const productList = cartManager.seeProducts(cartId);

    if (productList) {
      res.status(200).json({ products: productList });
    } else {
      throw new Error("Cart not found");
    }
  } catch (error) {
    throw new Error("Bad Request");
  }
});

// Error handling middleware
cartsRouter.use(errorHandler);

export default cartsRouter;
