import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
const app = express();
const PUERTO = 8080;
import productRouter from './routes/products.router.js'
import cartRouter from './routes/carts.router.js'
import viewsRouter from "./routes/views.router.js"

//?         handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


//?middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static("./src/public"))

//rutas
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/', viewsRouter);

//?     Websocket

const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
})
import ProductManager from "./manager/product-manager.js";
const io = new Server(httpServer);
const manager = new ProductManager('./src/data/products.data.json')


io.on("connection", async (socket)=>{
    console.log("cliente conectado")
    socket.emit('productos', await manager.getProducts());

    //agregar producto
    socket.on("agregarProducto", async (product)=>{
        await manager.addProduct(product);
        io.sockets.emit("productos", await manager.getProducts())
    })
    // ELIMINAR PRODUCTO
    socket.on("eliminar", async (id)=>{
        manager.deleteProductById(id)
        io.sockets.emit("prodAct",await manager.getProducts());
    })

})





//?     Listen

/* app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
}) */