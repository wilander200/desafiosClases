import express from 'express'
import cluster from 'cluster'
import * as os from 'os'

const modoCluster = process.argv[3] == 'CLUSTER'

if (modoCluster && cluster.isPrimary) { 
    const numCpus = os.cpus().length
    console.log('Numero de procesadores: ' + numCpus)
    console.log('PID:' + process.pid)
    
    for (let i = 0; i < numCpus; i++) { 
        cluster.fork() } 
        cluster.on('exit', worker => { console.log('Worker ' + process.pid + ' murio') 
        cluster.fork() }) 
    } else { 
        const app = express()
        const PORT = parseInt(process.argv[2]) || 8080
        app.get('/datos', (req, res) => { 
            console.log(process.pid)
            res.send(`Server en PORT(${PORT}) - PID(${process.pid}) - FYH(${new Date().toLocaleString()})`) })
            app.listen(PORT, err => { if (!err) { 
                console.log(`Escuchando en el puerto ${PORT} - PID ${process.pid}`) } }) }