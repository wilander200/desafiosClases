const express = require('express')
const router = express.Router()
const Contenedor = require('../Contenedor.js');
const productos = new Contenedor();



router.get('/', (req , res) => {
    const producto = productos.getAll()
    res.render('pages/plantilla' , {
        producto : producto,
        productoTrue: producto.length})
} )

router.post('/', (req , res) => {
    const producto = req.body
    console.log(producto)
    productos.saveProducto(producto)
    res.redirect('/')
})

module.exports = router