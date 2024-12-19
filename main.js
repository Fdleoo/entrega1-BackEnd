class productManager {
    static ultId = 0;
    constructor() {
        this.products = []
    }
    addProduct = (title, description, price, img, code, stock) => {
        //id autoincrementable
        //validacion
        if(!title || !description || !price || !img || !code || !stock){
            console.log('todos los campos son obligatorios')
            return
        }
        if (this.products.some(item => item.code === code)){
            console.log('todos los codigos deben ser unicos')
            return
        }
        //creacion de producto 
        const nuevoProducto = {
            id: ++productManager.ultId,
            title,
            description,
            price,
            img,
            code,
            stock
        }
        //pusheo
        this.products.push(nuevoProducto)
    }


    getProducts = () => {
        return this.products;
    }


    getProductById = (id) => {
        const producto = this.products.find(item => item.id === id)
        if (!producto){
            console.error('producto no encontrado')
        }
        else{
            console.log(producto)
        }
    }
}

////////? TESTING:

const manager = new productManager();



manager.addProduct('Poducto Primogenito', 'El producto original de la existencia de el arreglo, el que nacio del caos y el vacio', 1, 'invisible para ojos mortales', 'elemt115', 1);
manager.addProduct('piedra', 'una piedra comun', 3, 'no viste nunca una piedra', 'abc123', 100);
manager.addProduct('pala', 'Ay que miedo', 200, 'No quiero que te asustes igual que yo', 'abd124', 30);


//console.log(manager.getProducts())
console.log(manager.getProductById(1))