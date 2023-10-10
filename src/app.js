import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import viewsRouter from './views/views.router.js';
import {Server} from 'socket.io';

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => console.log('Listening on port 8080'));
const io = new Server(httpServer);
import productsRouter from './api/products.js';
import cartsRouter from './api/carts.js';

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use('/', viewsRouter);

io.on('connection', socket => {
  console.log('Client connected');

// Escuchar mensaje del cliente
socket.on('addProduct', (product) => {
  console.log('Product added', product);
  
  // Actualizar los productos
  io.emit('updateProducts', {type: 'addProduct', product});
});


socket.on('deleteProduct', (productId) => {
  console.log('Product deleted', productId);
  
  // Actualizar los productos
  io.emit('updateProducts', {type: 'deleteProduct', productId});




  socket.emit('addProduct',{ /*product data*/ });
  socket.emit('deleteProduct', 'PRODUCT_ID');

  // Escuchar mensajes de actualización de productos
socket.on('updateProducts', (data) => {
  if (data.type === 'addProduct') {
    // Agregar el nuevo producto a la lista de productos en la vista
    agregarProductoALaVista(data.product);
  } else if (data.type === 'deleteProduct') {
    // Eliminar el producto de la lista de productos en la vista
    eliminarProductoDeLaVista(data.productId);
  }
});

// Obtén la plantilla Handlebars
const productTemplate = document.getElementById('product-template').innerHTML;

// Función para agregar un producto a la vista
function agregarProductoALaVista(product) {
  // Compila la plantilla Handlebars
  const template = Handlebars.compile(productTemplate);

  // Renderiza el producto en HTML
  const productoRenderizado = template(product);

  // Agrega el producto renderizado al contenedor
  const productsContainer = document.getElementById('products-container');
  productsContainer.innerHTML += productoRenderizado;
}


// Función para eliminar un producto de la vista
function deleteProduct(productId, products) {
  if (!products){
    return false;
  }
  const productIndex = products.findIndex(product => product.id === productId);
if (productIndex !== -1) {
  products.splice(productIndex, 1);
  return true;
} else {
  return false;
}};




  // Enviar un mensaje al servidor cuando se envía un formulario
const form = document.querySelector('form');
const input = document.querySelector('input');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = input.value;
  
  // Enviar el mensaje al servidor
  socket.emit('chat message', message);

  // Limpiar el campo de entrada
  input.value = '';
});

});
});



let products =  [
  {
    "title": "Producto Actualizado",
    "description": "Descripción Actualizada",
    "price": 15.99,
    "thumbnail": "imagen2.jpg",
    "code": "P002",
    "stock": 60,
    "id": "1"
  },
  {
    "id": "3",
    "title": "Mergio",
    "description": "Sassa",
    "code": "osdfns8fhs0",
    "price": "454632",
    "stock": 23,
    "category": "politician",
    "quantity": 1,
    "status": true
  },
  {
    "id": "4",
    "title": "Mergio",
    "description": "Sassa",
    "code": "osdfns8fh77",
    "price": 454632,
    "stock": 23,
    "category": "politician",
    "status": true
  },
  {
    "id": "5",
    "title": "Mergio",
    "description": "Sassa",
    "code": "osdfns8f0",
    "price": "454632",
    "stock": 23,
    "category": "politician",
    "status": true,
    "quantity": 1
  },
]
function obtainProducts(){
  return products;
}

app.get('/', (req, res)=>{
 
  const products = obtainProducts();
  res.render('home', {products});
});

app.get('/realtimeproducts', (req, res)=>{
 
  const products = obtainProducts();
  res.render('realTimeProducts', {products});
});

app.post('/delete-product', (req, res)=>{
  const productIdToDelete = req.body.productId;
  const deletedProduct = deleteProduct(productIdToDelete);
  if (deletedProduct) {
    console.log('Product deleted successfully');
  } else {
    console.log('Product not found');
  }

  res.redirect('/realtimeproducts');
})



// Middleware para el manejo de JSON en las peticiones
app.use(express.json());

// Monta los routers de productos y carritos
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

