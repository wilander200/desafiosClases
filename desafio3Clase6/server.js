const express = require('express');
const Contenedor = require('./Contenedor.js');

let productos = new Contenedor('./productos.txt')

const PORT = 8080;

const app = express();

//console.log(productos.getAll())

const server = app.listen(PORT, () => {
    console.log('servidor http escuchando en el puerto ' + PORT)
})

app.get('/', (req , res) => {
    res.send('<h1>Bienvenido a mi primer servidor usando express como desafio 3 de la clase 6 Wilander Velazco</h1>')
} )

app.get('/productos', (req , res) => {
    const productosTotal = productos.getAll()    
    console.log(productosTotal)
    res.send(`<p>Los productos gruardados son los siguientes: ${JSON.stringify(productosTotal, null , 2)}</p>`);
} )

app.get('/productoRandom', (req, res) => {
    const productoRandom = productos.getById()
    console.log(productoRandom)
    res.send(` <h2>El producto random es el siguiente: ${JSON.stringify(productoRandom)} </h2>`)
})

