const express = require('express')
const handlebars = require('express-handlebars')
const {Router} = express
const Contenedor = require('./Contenedor.js');

const productos = new Contenedor();

const PORT = 8080

const app = express();

app.engine('handlebars', handlebars.engine())

app.set('views', './views')

app.set('view engine', 'handlebars')

const routerProductos = new Router()

app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

routerProductos.use(express.json())

app.use('/productos', routerProductos)

app.get('/' , (req , res) => {
    res.render('form', )
})

routerProductos.get('/', (req , res) => {
    const producto = productos.getAll()
    console.log(producto)
    res.render('plantilla' , {
        producto : producto,
        productoTrue: producto.length})
} )

routerProductos.post('/', (req , res) => {
    const producto = req.body
    productos.saveProducto(producto)
    res.redirect('/')
})

const server = app.listen(PORT, () => {
    console.log('servidor http escuchando en el puerto ' + PORT)
})

server.on('error', error => console.log(`Error en servidor ${error}`))
