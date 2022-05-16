const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const handlebars = require('express-handlebars')
const Contenedor = require('./Contenedor.js');

const productos = new Contenedor();

const messages = []


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
    const producto = productos.getAll()
    res.render('plantilla' , {
        producto : producto,
        productoTrue: producto.length})
    } )
    
    app.post('/', (req , res) => {
        const producto = req.body
        productos.saveProducto(producto)
        res.redirect('/')
    })
    
    io.on('connection', (socket) => {
        console.log('Un cliente se ha conectado!')
        socket.emit('messages', messages)
        
        socket.on('new-message', data => {
            messages.push(data)
            io.sockets.emit('messages', messages)
        })})
        

        
httpServer.listen(PORT, () => {
    console.log('servidor http escuchando en el puerto ' + PORT)
})
