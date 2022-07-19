const {Router} = require('express')
const router = Router()
const args = process.argv
const { fork } = require('child_process')
const path = require('path')


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

router.get('/api/randoms', (req , res) => {

    const {num} = req.params
    const computo = fork(path.resolve(process.cwd(), './api/calculoRandom.js'))

    computo.on('message', result => {
        if (result == 'listo') {
            computo.send('start')
        } else {
            res.render('randoms' , 
                {numGenerados: result.numeroRandom,
                numRepetidos: result.numerosRepet
                }
            )
        }
    })
})



module.exports = router;