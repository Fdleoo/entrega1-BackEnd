import { Router } from "express";
const router = Router();

//!productManager
import ProductManager from '../manager/product-manager.js'
const manager = new ProductManager("./src/data/products.data.json");


//!listar productos 
router.get("/", async (req, res) => {
    //Me guardo el query limit: 
    let limit = req.query.limit;

    const productos = await manager.getProducts();

    if (limit) {
        res.send(productos.slice(0, limit));
    } else {
        res.send(productos);
    }
})
//!agregar producto
router.post("/", async (req, res) => {
    try {
        const nuevoProducto = req.body;
        await manager.addProduct(nuevoProducto);
        res.status(201).json({ message: "Producto agregado correctamente.", producto: nuevoProducto });
    } catch (error) {
        res.status(500).json({ error: "Error al agregar el producto: "});
    }
});
//!actualizar producto
router.put("/:pid", async (req, res) => {
    const productId = parseInt(req.params.pid); 
    const updatedFields = req.body;

    try {
        const productoActualizado = await manager.updateProduct(productId, updatedFields);
        res.json({ message: "Producto actualizado correctamente", producto: productoActualizado });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
//!eliminar producto
router.delete("/:pid", async (req, res) => {
    const productId = parseInt(req.params.pid);

    try {
        const result = await manager.deleteProductById(productId);
        if (result) {
            res.status(200).json({ message: "Producto eliminado exitosamente" });
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Hubo un error al intentar eliminar el producto" });
    }
});



//! retornar un producto por id

router.get("/:pid", async (req, res) => {
    let id = req.params.pid;
    const productoBuscado = await manager.getProductById(parseInt(id));
    res.send(productoBuscado);
})


export default router;