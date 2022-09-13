const productoModel = require('../models/productos.js')
const productosDAO = require('../DAO/productos.js')

class productosApi {
    constructor(){
        this.dao = new productosDAO()
        this.id = 0
    }

    getProductos = () => {
        return this.dao.getProductos()
    }
    getProductoID = ({id}) => {
        return this.dao.getProductoID(id)
    }
    guardarProducto = ({dat}) => {
        this.id++
        const nuevoProducto = new productoModel(id, dat)
        this.dao.guardarProducto(nuevoProducto)
        return nuevoProducto
    }
    actualizarProducto = ({id, dat}) => {
        const nuevoProducto = this.dao.actualizarProducto(id , dat)
        return nuevoProducto
    }
    deleteProducto = ({id}) => {
        const elm = this.dao.deleteProducto(id)
        return elm
    }
}

module.exports = productosApi