const knex = require('knex')

class Message {
    constructor (options){
        this.knex = knex(options);
    }

    saveMessage(mensaje) {
        return this.knex('mensajes').insert(mensaje)
            }

    getAll() {
        return this.knex('mensajes').select('*')
    }

    crearTabla() {
        return this.knex.schema.dropTableIfExists('mensajes')
            .finally(()=> {
                return this.knex.schema.createTable('mensajes' , table => {
                    table.string('email' , 50).primary()
                    table.string('fyh' , 10).notNullable()
                    table.string('message' , 50).notNullable()
                })
            })
    }

    close() {
        this.knex.destroy()
    }
}

module.exports = Message;