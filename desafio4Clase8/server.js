const express = require('express')
const {Router} = express
const Contenedor = require('./Contenedor.js');

const productos = new Contenedor();

console.log(productos)

const PORT = 8080

const app = express();

const routerProductos = new Router()

app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

routerProductos.use(express.json())

app.use('/api/productos', routerProductos)

routerProductos.get('/', (req , res) => {
    
    if (productos.id <= 0) {
        const error = (JSON.stringify({error:'No tiene ningun producto guardado'}))
        return res.send(error)
    }
    res.send(productos.getAll())
} )

routerProductos.get('/:id', (req, res) => {
    let {id} = req.params
    const producto = productos.getById(id)
    if (producto === undefined) {
        const error = (JSON.stringify({error:'Producto no encontrado'}))
        return res.send(error)
    }
    res.send(producto)
})

routerProductos.post('/', (req , res) => {
    producto = req.body
    productos.saveProducto(producto)
    res.send(productos)
})

routerProductos.delete('/:id', (req , res) => {
    let {id} = req.params
    const producto = productos.deleteByIdNumber(id)
    if (producto === undefined) {
        const error = (JSON.stringify({error:'Producto no encontrado'}))
        return res.send(error)
    }
    res.send(producto)
})

routerProductos.put('/:id', (req , res) => {
    let {id} = req.params
    const producto = productos.saveProductoById(id , req.body)
    if (producto === undefined) {
        const error = (JSON.stringify({error:'Producto no encontrado'}))
        return res.send(error)
    }
    res.send(productos)
})

const server = app.listen(PORT, () => {
    console.log('servidor http escuchando en el puerto ' + PORT)
})

server.on('error', error => console.log(`Error en servidor ${error}`))
