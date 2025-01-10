import e, { Router } from "express";
const router = Router();
import cartManager from '../manager/cart-manager.js'
const manager = new cartManager('./src/data/carts.data.json');
// Obtener todos los carritos
router.get('/', async (req, res) => {
    try {
        const allCarts = manager.carts; // Accedemos al array de carritos directamente
        res.json(allCarts);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los carritos' });
    }
});

//nuevo carrito
router.post('/', async (req, res) => {
    try {
        const nuevoCart = await manager.creatCarts();
        res.json(nuevoCart);
    } catch (error) {
        res.status(500).json({error: 'Error al crear el cart'});
    }
})
//listar productos de X carrito
router.get('/:cid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    try {
        const searchCart = await manager.getcCartById(cartId);
        res.json(searchCart.products);
    } catch (error) {
        res.status(500).json({error: 'no se pudo listas productos del carrito'})
    }
})
//agregar productos al carrito 
router.post('/:cid/product/:pid', async(req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const quantity = req.body.quantity || 1;

    try {
        const actualizarCart = await manager.addProductToCart(cartId, productId, quantity);
        res.json(actualizarCart.products)
    } catch (error) {
        res.status(500).json({error: 'error al agregar producto al carrito'})
    }
})
export default router;