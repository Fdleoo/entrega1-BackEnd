import express from "express";
const app = express();
const PUERTO = 8080;
import productRouter from './routes/products.router.js'
import cartRouter from './routes/carts.router.js'


//?middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}))

//rutas
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

//?     Listen
app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
})
