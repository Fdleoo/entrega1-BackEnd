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
            throw new Error('no un cart con ese id')
        }
        return cart;
    }
    async addProductToCart(cartId, productId, quantity = 1){
        const carrito = await this.getcCartById(cartId);
        const existeProducto = carrito.products.find(p => p.product === productId);
        if (existeProducto){
            existeProducto.quantity += quantity;

        }
        else{
            carrito.products.push({product: productId, quantity});
        }
        await this.saveCarts();
        return carrito;
    }
}

export default cartmanager;