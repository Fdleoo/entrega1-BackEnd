import { promises as fs } from "fs";



class ProductManager {
    static ultId = 0; 
    constructor(path) {
        this.products = []; 
        this.path = path; 
        this.initializeId();

    }
// agregar productos
    async addProduct({title, description, price, img, code, stock}) {
        const arrayProductos = await this.leerArchivo(); 
        


        if(!title || !description || !price || !img || !code || !stock ) {
            console.log("Todos los campos son obligatorios"); 
            return; 
        }

        if(arrayProductos.some(item => item.code === code)) {
            console.log("El codigo debe ser unico"); 
            return; 
        }

        const nuevoProducto = {
            id: ++ProductManager.ultId,
            title, 
            description,
            price,
            img,
            code,
            stock
        }

        arrayProductos.push(nuevoProducto); 

        await this.guardarArchivo(arrayProductos); 
    }
//retornar productos
    async getProducts() {
        const arrayProductos = await this.leerArchivo(); 
        return arrayProductos;
    }

    async getProductById(id) {
        const arrayProductos = await this.leerArchivo();
        const producto = arrayProductos.find(item => item.id === id);

        if(!producto) {
            return "Not Found"; 
        } else {
            return producto; 
        }
    }
//guardar productos
    async guardarArchivo(arrayProductos) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2))
        } catch (error) {
            console.log("Tenemos un error al guardar el archivo"); 
        }
    }
//retornar productos
    async leerArchivo() {
        try {
            const respuesta = await fs.readFile(this.path, "utf-8");
            const arrayProductos = JSON.parse(respuesta); 
            return arrayProductos; 
        } catch (error) {
            console.log("Tenemos un error al leer el archivo"); 
        }
    }
    //actualizar producto
async updateProduct(id, updatedFields) {
    const productos = await this.leerArchivo();

    //buscar el id
    const index = productos.findIndex(p => p.id === id);
    if (index === -1) {
        throw new Error('Producto no encontrado');
    }

    //validacion
    if (updatedFields.id) {
        throw new Error('No se puede modificar el ID del producto');
    }

    //act
    const productoActualizado = { ...productos[index], ...updatedFields };
    productos[index] = productoActualizado;
    await this.guardarArchivo(productos);

    return productoActualizado;
}
async deleteProductById(id) {
    const arrayProductos = await this.leerArchivo();  
    const index = arrayProductos.findIndex(item => item.id === id); 

    if (index === -1) {
        return false; 
    }

    arrayProductos.splice(index, 1); 
    await this.guardarArchivo(arrayProductos); 
    return true;
}
async initializeId() {
    const arrayProductos = await this.leerArchivo();
    ProductManager.ultId = arrayProductos.length > 0 ? Math.max(...arrayProductos.map(p => p.id)) : 0;
}
}

export default ProductManager;