const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const handlebars = require('express-handlebars')
const Contenedor = require('./public/Contenedor.js')
const Message = require('./public/Mensajes.js')
const optionsMessages = require('./options/sqlitecon.js')
const optionsProductos = require('./options/mysqlcon.js')

const productos = new Contenedor(optionsProductos);
const messages = new Message(optionsMessages);

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

app.get('/', (req , res) => {
    productos.getAll()
    .then((producto) => {
     return res.render('plantilla' , {
        producto : producto,
        productoTrue: producto.length})
    })
    .catch((err) => {console.log(err); throw err})
    .finally(()=> productos.close())
})
    
app.post('/', (req , res) => {
        const producto = req.body
        productos.saveProducto({title: producto.title , price: producto.price, thumbnail: producto.thumbnail})
        .then(() => {
            console.log('producto guradado correctamente en la DB')
        })
        .catch((err) => {console.log(err); throw err})
        .finally(()=> productos.close())
        res.redirect('/')
})

io.on('connection', msn)

httpServer.listen(PORT, () => {
    console.log('servidor http escuchando en el puerto ' + PORT)
})

async function msn(socket) {
        console.log('Un cliente se ha conectado!')
    try {
        const chat = await messages.getAll()
        socket.emit('messages', chat)

        socket.on('new-message', async (dat) => {
            await messages.saveMessage(dat)
            const chat = await messages.getAll()
            io.sockets.emit('messages', chat)
        })
    } catch (err) {
        console.log(err)
    } finally {
        messages.close()
    }
    }
