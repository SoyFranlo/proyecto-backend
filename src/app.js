import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import bodyParser from 'body-parser';
import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import {Server} from 'socket.io';

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => console.log('Listening on port 8080'));


app.use(bodyParser.json());
app.use(express.urlencoded({ extended:true}));

// Monta los routers de productos y carritos
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use('/', viewsRouter);

const socketServer = new Server(httpServer);
socketServer.on('connection', socket => {
  console.log('Client connected');
  socket.on('message', data => console.log(data))});


