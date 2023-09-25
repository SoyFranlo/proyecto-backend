const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  addProduct(product) {
    const products = this.getProductsFromFile();

    // Asignar un ID autoincrementable al producto
    product.id = this.getNextProductId(products);
    products.push(product);

    this.saveProductsToFile(products);
  }

  getProducts() {
    return this.getProductsFromFile();
  }

  getProductById(id) {
    const products = this.getProductsFromFile();
    const product = products.find((p) => p.id === id);
    return product || null;
  }

  updateProduct(id, updatedProduct) {
    const products = this.getProductsFromFile();
    const index = products.findIndex((p) => p.id === id);

    if (index !== -1) {
      updatedProduct.id = id;
      products[index] = updatedProduct;
      this.saveProductsToFile(products);
      return true;
    }

    return false;
  }

  deleteProduct(id) {
    const products = this.getProductsFromFile();
    const index = products.findIndex((p) => p.id === id);

    if (index !== -1) {
      products.splice(index, 1);
      this.saveProductsToFile(products);
      return true;
    }

    return false;
  }

  getNextProductId(products) {
    const maxId = products.reduce((max, product) => (product.id > max ? product.id : max), 0);
    return maxId + 1;
  }

  getProductsFromFile() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  saveProductsToFile(products) {
    fs.writeFileSync(this.path, JSON.stringify(products, null, 2), 'utf-8');
  }
}

module.exports = ProductManager;

