const ProductManager = require('./src/ProductManager.js');

const productManager = new ProductManager('productos.json');

// Ejemplo de uso para agregar un producto
productManager.addProduct({
  title: 'Producto 1',
  description: 'Descripción del Producto 1',
  price: 10.99,
  thumbnail: 'imagen1.jpg',
  code: 'P001',
  stock: 50,
});

// Ejemplo de uso para obtener todos los productos
const allProducts = productManager.getProducts();
console.log('Todos los productos:', allProducts);

// Ejemplo de uso para obtener un producto por ID
const productById = productManager.getProductById(1);
console.log('Producto encontrado por ID:', productById);

// Ejemplo de uso para actualizar un producto por ID
const updatedProduct = {
  title: 'Producto Actualizado',
  description: 'Descripción Actualizada',
  price: 15.99,
  thumbnail: 'imagen2.jpg',
  code: 'P002',
  stock: 60,
};

if (productManager.updateProduct(1, updatedProduct)) {
  console.log('Producto actualizado con éxito');
} else {
  console.log('No se pudo actualizar el producto');
}

// Ejemplo de uso para eliminar un producto por ID
if (productManager.deleteProduct(2)) {
  console.log('Producto eliminado con éxito');
} else {
  console.log('No se pudo eliminar el producto');
}
