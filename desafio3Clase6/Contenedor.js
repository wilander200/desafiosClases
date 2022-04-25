const fs = require("fs");

class Contenedor {
    constructor (file){
        this.file = file;
    }

    getById() {
        const productoID = fs.readFileSync(this.file, 'utf-8')
            let dato =  JSON.parse(productoID);
            let id = Math.floor(Math.random()*(dato.length)+1)
            const findProduct = dato.find(prod => prod.id === id)
            return findProduct
            }

    getAll() {
            const arrayProductos = fs.readFileSync(this.file, 'utf-8')
                let dato =  JSON.parse(arrayProductos);
                return dato
        }
    }


module.exports = Contenedor;

