import { error } from 'console';
import {promises as fs} from 'fs';

class cartmanager{
    constructor(path){
        this.carts = [];
        this.path = path;
        this.ultId = 0;
        this.loadCarts();
    }

    async loadCarts(){
        try {
            const data = await fs.readFile(this.path, 'utf-8')
            this.carts = JSON.parse(data)
            if (this.carts.length > 0){
                this.ultId = Math.max(...this.carts.map(cart => cart.id))
            }
        } catch (error) {
            await this.saveCarts();
        }
    }
    async saveCarts(){
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2))
    }
    //metodos
    async creatCarts(){
        const newCart = {
            id: ++this.ultId,
            products: []
        }
        this.carts.push(newCart);
        await this.saveCarts();
        return newCart;
    }
    async getcCartById(cartId){
        const cart = this.carts.find(c => c.id === cartId);
        if (!cart){
            throw new Error('no existe un cart con ese id')
        }
        return cart;
    }
    async addProductToCart(cartId, productId, quantity = 1) {
        const carrito = await this.getcCartById(cartId);

        
        const productos = await fs.readFile('./src/data/products.data.json', 'utf-8');
        const listaProductos = JSON.parse(productos);
        const producto = listaProductos.find(p => p.id === productId);
    
        if (!producto) {
            throw new Error(`El producto con ID ${productId} no existe.`);
        }
    
        if (producto.stock < quantity) {
            throw new Error(
                `Stock insuficiente para el producto con ID ${productId}. Disponible: ${producto.stock}`
            );
        }
    
        const existeProducto = carrito.products.find(p => p.product === productId);
        if (existeProducto) {
            if (producto.stock < existeProducto.quantity + quantity) {
                throw new Error(
                    `Stock insuficiente para incrementar la cantidad del producto con ID ${productId}. Disponible: ${producto.stock}`
                );
            }
            existeProducto.quantity += quantity;
        } else {
            carrito.products.push({ product: productId, quantity });
        }
        producto.stock -= quantity;
        await fs.writeFile('./src/data/products.data.json', JSON.stringify(listaProductos, null, 2));
    
        await this.saveCarts();
        return carrito;
    }
    
}

export default cartmanager;