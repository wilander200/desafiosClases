const knex = require('knex')

class Message {
    constructor (options){
        this.knex = knex(options);
    }

    saveMessage(dat) {
        return this.knex('mensajes').insert(dat)
            }

    getAll() {
        return this.knex('mensajes').select('*')
    }

    crearTabla() {
        return this.knex.schema.dropTableIfExists('mensajes')
            .finally(()=> {
                return this.knex.schema.createTable('mensajes' , table => {
                    table.increments('id').primary()
                    table.string('email' , 50).notNullable()
                    table.string('date' , 20).notNullable()
                    table.string('hour' , 20).notNullable()
                    table.string('message' , 50).notNullable()
                })
            })
    }

    close() {
        this.knex.destroy()
    }
}

module.exports = Message;