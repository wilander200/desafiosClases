const express = require('express')
const {Router} = express
const Contenedor = require('./Contenedor.js');

const productos = new Contenedor();

const PORT = 8080

const app = express();

app.set('views', './views')
app.set('view engine', 'pug')

const routerProductos = new Router()
app.use('/productos', routerProductos)
routerProductos.use(express.json())

app.use(express.urlencoded({extended: true}))

app.get('/' , (req , res) => {
    res.render('form.pug', )
})

routerProductos.get('/', (req , res) => {
    const producto = productos.getAll()
    res.render('plantilla.pug' , {
        producto : producto,
        productoTrue: producto.length})
} )

routerProductos.post('/', (req , res) => {
    const {title, price, thumbnail} = req.body
    console.log({title, price, thumbnail})
    productos.saveProducto({title, price, thumbnail})
    res.redirect('/')
})

const server = app.listen(PORT, () => {
    console.log('servidor http escuchando en el puerto ' + PORT)
})

server.on('error', error => console.log(`Error en servidor ${error}`))
