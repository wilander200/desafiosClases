/* EN MI CASO SOLO TENGO PERSISTENCIA EN UNO DE LO SMETODOS POR CADA UNO DE LOS TIPOS, EJEMPLO MENSAJES ESTA CON FILE SYSTEM,
PRODUCTOS ESTA DIRECTO EN UN ARRAY Y LOS USUARIOS ESTA DIRECTO EN MONGO DB POR LO QU ENO TENGO COMO REALIZAR UN FACTORY,
PERO SERIA UN CODIGO COMO EL SIGUIENTE AUNQUE NO LO VAYA A USAR */

const ClassUser = require('./ClaseUsuariosMDB.js')
const Contenedor = require('./Contenedor.js')
const Message = require('./Mensajes.js')

const opcion = process.argv[2] || 'Memoria'

const urlUsuarios = process.env.URL_USUARIOS_FS

let dao
switch (opcion) {
    case 'MongoDB':
        dao = new ClassUserMDB()
        await dao.init()
        break
    case 'FileSystem':
        dao = new ClassUserFS(urlUsuarios)
        await dao.init()
        break
    default:
        dao = new ClassUserMem()
        dao.init()
}

module.exports =  class ClassUserFactory {
    static getDao() {
        return dao
    }
}