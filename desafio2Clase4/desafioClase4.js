const fs = require("fs");

class Contenedor {
    constructor (file){
        this.file = file;
    }

// colocar codigo para leer el archivo que se esta enviando al constructor 

   saveObject(title, price, thumbnail) {
        fs.readFile(this.file, 'utf-8', (error, contenido)=>{
            if (error) {
                console.log("hubo un error en la lectura del archivo asignado");
            } else {
                let dato = JSON.parse(contenido);
                let id
                if (contenido.length == 0 ) {
                    id = 0;
                } else {
                    id = dato[dato.length-1].id;
                }
                id++
                console.log(id)
                dato.push({id: id, title: title , price: price, thumbnail: thumbnail})
                fs.writeFile(this.file , JSON.stringify(dato, null, 2), error => {
                    if (error) {
                        console.log("hubo un error al escribir")
                    } else {
                        console.log("se pudo usar el SaveObject correctamente")
                    }
                }
                )
            }
        })
    }

    getById(id) {
        fs.readFile(this.file, 'utf-8', (error, contenido)=>{
            if (error) {
                console.log("hubo un error en la lectura del archivo");
            } else {
                let dato =  JSON.parse(contenido);
                const findProduct = dato.find(prod => prod.id === id)
                console.log(findProduct);
            }
        })
    }

    getAll(cb) {
        fs.readFile(this.file, 'utf-8', (error, contenido)=>{
            if (error) {
                console.log("hubo un error en la lectura del archivo");
            } else {
                let dato =  JSON.parse(contenido);
                cb(dato)
            }
        })
    }

    deleteByIdNumber(id){
        fs.readFile(this.file, 'utf-8', (error, contenido)=>{
            if (error) {
                console.log("hubo un error en la lectura del archivo");
            } else {
                let dato =  JSON.parse(contenido);
                const findProduct = dato.filter(prod => prod.id !== id)
                fs.writeFile(this.file , JSON.stringify(findProduct, null, 2), error => {
                    if (error) {
                        console.log("hubo un error al escribir")
                    } else {
                        console.log("se pudo borrar el item con el ID indicado")
                    }
                }
                )
            }
        })
    }

    deleteAll(){
        fs.writeFile(this.file , JSON.stringify([]), error => {
            if (error) {
                console.log("hubo un error al borrar los objetos")
            } else {
                console.log("se pudo borrar los archivos correctamente")
            }
        }
        )
    }

}






let productos = new Contenedor("./productos.txt");
//productos.saveObject("carro" , 100000 , "fotox");
//productos.getById(2);
//productos.getAll((dato)=>{console.log(dato);});
//productos.deleteAll();
//productos.deleteByIdNumber(3)
