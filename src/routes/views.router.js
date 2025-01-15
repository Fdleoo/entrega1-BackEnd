import { Router } from "express";
import ProductManager from "../manager/product-manager.js";

const manager = new ProductManager('./src/data/products.data.json')
const router = Router();



//?     punto uno pre entrega do'
router.get("/products", async (req, res)=>{
    const products = await manager.getProducts();
    res.render("home", {products});
})
router.get('/realtimeproducts', (req, res)=>{
    res.render("realtimeproducts"); 
})

export default router;