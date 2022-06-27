const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const handlebars = require('express-handlebars')
//const Contenedor = require('./public/Contenedor.js')
const Message = require('./public/Mensajes.js')
//const optionsMessages = require('./options/sqlitecon.js')
//const optionsProductos = require('./options/mysqlcon.js')
const ApiProductosTets = require('./api/productos-tes.js')
const {normalize, denormalize, schema} = require('normalizr')
const util = require('util')

//const productos = new Contenedor(optionsProductos);
const messages = new Message('./db/mensajes.txt');
const productosTest = new ApiProductosTets();

const PORT = 8080

const app = express();
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(express.json())

app.engine('handlebars', handlebars.engine())

app.set('views', './public/views')

app.set('view engine', 'handlebars')

// PRODUCTOS 

app.get('/api/productos-test', async (req , res) => {
    //productos.getAll()
    try{
        await productosTest.popular()
        let prod = await productosTest.getAllTest();
        res.render('plantilla' , {
            producto : prod,
            productoTrue: prod.length})
    } catch (err) {
         console.log(err); throw err
    }
})
    
//app.post('/', async (req , res) => {
//        const producto = req.body
//        //productos.saveProducto(producto)
//        await productosTest.SaveProductoTest(producto)
//        .then(() => {
//            console.log('producto guradado correctamente en la DB')
//        })
//        .catch((err) => {console.log(err); throw err})
//        res.redirect('/')
//})

/* ESQUEMAS A NORMALIZAR */

const author = new schema.Entity('author' , {} , {idAttribute: 'email'})

const mensajeria = new schema.Entity('mensajeria', {authores: author}, {idAttribute: 'id'})

const schemaChat = new schema.Entity('chat', {mensajes: [mensajeria]}, {idAttribute: 'id'})

// MENSAJERIA 

io.on('connection', msn)

httpServer.listen(PORT, () => {
    console.log('servidor http escuchando en el puerto ' + PORT)
})

function print (objeto) {
    console.log(util.inspect(objeto , false, 12, true))
}

async function msn(socket) {
        console.log('Un cliente se ha conectado!')
    try {
        const chat = await messages.getAll()
        socket.emit('messages', chat)

        socket.on('new-message', async (dat) => {
            await messages.saveMessage(dat)
            const chat = await messages.getAll()
            const formatoChat = {id:'mensajes' , mensajes: chat}
            const chatNormalizado = normalize(formatoChat , schemaChat)
            io.sockets.emit('messages', chatNormalizado)
        })
    } catch (err) {
        console.log(err)
    } 
    }
