const { strictEqual, deepStrictEqual } = require('assert')
const request = require('supertest')
const axios = require('axios')

const urlPostGet = 'http://localhost:8080/api/productos'
const urlById = 'http://localhost:8080/api/productos/1'

describe("Comprobando que el servidor de productos funcione", function() {
    beforeEach(async function(){
        const user = {
            username: "wilandervelazco@gmail.com",
            password: "pepe"
        }
        await axios.post('http://localhost:8080/api/login', user)
        console.log('------Inicio del test------')
    })

    it ("Comprobar agregar un producto", async function (){
        const producto = {
            title: 'producto 1',
            price: 1234,
            thumbnail: 'foto de prueba'
        }
        await axios.post(urlPostGet, producto, config)
        .then((res) =>{
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
    })

    afterEach(function() {
        console.log('------- Fin TOTAL de Test -------')
    })
})