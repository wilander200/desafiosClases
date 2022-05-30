const fs = require("fs");

class Message {
    constructor (file){
        this.file = file;
    }

    saveMessage(dat) {
        const content = fs.readFileSync(this.file, 'utf-8')
            let dato = JSON.parse(content);
            dato.push({email: dat.email, fyh: dat.fyh , message: dat.message})
            fs.writeFileSync(this.file , JSON.stringify(dato, null, 2), error => {
                if (error) {
                    console.log("hubo un error al escribir")
                } else {
                    console.log("se pudo usar el SaveObject correctamente")
                }
            }
            )
            }

    getAll() {
        const arrayProductos = fs.readFileSync(this.file, 'utf-8')
            let dato =  JSON.parse(arrayProductos);
            return dato
    }
}

module.exports = Message;