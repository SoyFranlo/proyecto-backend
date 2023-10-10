import express from 'express';
import ProductManager from '../managers/productManager.js';

const productManager = new ProductManager();
const viewsRouter = express.Router();

viewsRouter.get('/', (req,res) => {
    const productList = productManager.loadProducts();
    res.render('home',{productList});
});
viewsRouter.get('/realTimeProducts', (req, res) => {
    const listOfProducts = productManager.loadProducts();
    res.render('home', {listOfProducts});
});
export default viewsRouter;