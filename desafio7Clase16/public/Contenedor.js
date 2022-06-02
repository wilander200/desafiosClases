const knex = require('knex')

const productos = []

class Contenedor {
    constructor (optionproducto){
        this.knex = knex(optionproducto)
    }

    crearTabla() {
        return this.knex.schema.dropTableIfExists('productos')
            .finally(()=> {
                return this.knex.schema.createTable('productos' , table => {
                    table.increments('id').primary()
                    table.string('title' , 50).notNullable()
                    table.float('price')
                    table.string('thumbnail', 100).notNullable()
                })
            })
        }
        
    saveProducto({title, price, thumbnail}) {
            return this.knex('productos').insert({title: title , price: Number(price), thumbnail: thumbnail})
        }
        
    getAll() {
            return this.knex('productos').select('*')
        }

    close() {
        this.knex.destroy()
    }
    
    //saveProductoById(id, {title, price, thumbnail}) {
    //    const pos = this.productos.findIndex(prod => prod.id === parseInt(id))
    //    if (pos < 0){
    //        return undefined
    //    }
    //    const nuevoProducto = {id: parseInt(id) , title , price , thumbnail}
    //    this.productos.splice(pos, 1 , nuevoProducto)
    //    return(this.productos)
    //}

    //getById(id) {
    //    const findProductos = this.productos.find(prod => prod.id === parseInt(id))
    //    return findProductos  
    //}


    //deleteByIdNumber(id){
    //    const filterProductos = this.productos.filter(prod => prod.id !== parseInt(id))
    //    const pos = this.productos.findIndex(prod => prod.id === parseInt(id))
    //    if (pos < 0){
    //        return undefined
    //    }
    //    this.productos = filterProductos
    //    return this.productos
    //}
    }


module.exports = Contenedor;

