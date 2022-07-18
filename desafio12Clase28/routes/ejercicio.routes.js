const {Router} = require('express')
const router = Router()
const args = process.argv


//RUTA DE LA INFORMACION 

router.get('/info', async (req, res) => {
    res.render('info' , 
    {argumentoEntrada : args,
        sistemaOperativo: process.platform,
        nodeVersion: process.version,
        rss: process.memoryUsage.rss(),
        pathEjecucion: process.execPath,
        processID: process.pid,
        CarpetaProyecto: args[1].split("/").pop()
    })
})

//RUTA DE LA API RANDOM

async function numerosRandom () {
    return await Math.floor(Math.random()*1000 + 1)
}

function numerosRepe (nums) {
console.log('se repitieron')
}

const numerosGenerados = []

router.get('/api/randoms/?:cant', (req , res) => {

    const {num} = req.params

    for (let i = 0; i < (num || 100000000); i++) {
        numerosGenerado.push(numerosRandom())
    }
    console.log(numerosGenerados)
    const numerosRepetido = numerosRepe(numerosGenerados)

    res.render('randoms' , 
    {numGenerados: numerosGenerados,
    numRepetidos: numerosRepetido
})
})


module.exports = router;