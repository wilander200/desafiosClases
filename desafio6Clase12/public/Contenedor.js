const fs = require("fs");

const productos = []

class Contenedor {
    constructor (){
        this.productos = productos;
        this.id = productos.length;
    }

   saveProducto({title, price, thumbnail}) {
        this.id++
        this.productos.push({id: this.id, title: title , price: Number(price), thumbnail: thumbnail})
        return this.productos
    }

    saveProductoById(id, {title, price, thumbnail}) {
        const pos = this.productos.findIndex(prod => prod.id === parseInt(id))
        if (pos < 0){
            return undefined
        }
        const nuevoProducto = {id: parseInt(id) , title , price , thumbnail}
        this.productos.splice(pos, 1 , nuevoProducto)
        return(this.productos)
    }

    getById(id) {
        const findProductos = this.productos.find(prod => prod.id === parseInt(id))
        return findProductos  
    }

    getAll() {
        return this.productos
    }

    deleteByIdNumber(id){
        const filterProductos = this.productos.filter(prod => prod.id !== parseInt(id))
        const pos = this.productos.findIndex(prod => prod.id === parseInt(id))
        if (pos < 0){
            return undefined
        }
        this.productos = filterProductos
        return this.productos
    }
    }


module.exports = Contenedor;

