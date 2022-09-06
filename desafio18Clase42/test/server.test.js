const { strictEqual, deepStrictEqual } = require('assert')
const axios = require('axios')

const getProductos = () => axios('http://localhost:8080/api/productos-test')
console.log(getProductos)
describe("Comprobando que el servidor de productos funcione", function() {
    before(function(){
        console.log('------Inicio del test------')
    })

    it ("Comprobar que vuelvan la cantidad de productos solicitados al servidor", async function (){
        const {productos} = getProductos()
        console.log(getProductos())
        strictEqual(productos.length, 5)
    })

    after(function() {
        console.log('------- Fin TOTAL de Test -------')
    })
})