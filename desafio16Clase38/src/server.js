const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const handlebars = require('express-handlebars')
const Message = require('../DAO/Mensajes.js')
const {normalize, schema} = require('normalizr')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const parseArgs = require('minimist')
const dotenv = require('dotenv').config()
const cluster = require('cluster')
const os = require('os')
const logger = require('../services/logger.js')

//CONFIGURACION DEL MINIMIST
const options = {
    alias: { p: 'PORT' , m: 'MODO'},
    default: {PORT: 8080 , MODO: 'fork'}
}
const {PORT} = parseArgs(process.argv.slice(2), options) || process.env.PORT
const {MODO} = parseArgs(process.argv.slice(3), options)

//LLAMADO A LOS DATOS DEL DOTENV
const urlMensajes = process.env.URL_MENSAJES_DB
const urlSession = process.env.URL_SESSION_MONGODB
const secretWord = process.env.SESSION_SECRETWORD

//GENERANDO LOS SERVIDORES CLUSTER Y FORK

if ((MODO == 'cluster') && cluster.isPrimary) {
    
    const nCpus = os.cpus().length
    logger.info('Gererando el servidor en modo cluster con: ' + nCpus + 'CPUs')

    for (let i = 0; i < nCpus; i++) {
        cluster.fork() } 
        cluster.on('exit', worker => { logger.info('Worker ' + process.pid + ' murio') 
        cluster.fork() }) 
    } else {


const app = express();
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

const advancedOptions = { useNewUrlParser: true , useUnifiedTopology: true}

app.use(session({
    store: MongoStore.create({
        mongoUrl: urlSession,
        mongoOptions:advancedOptions
    }),
    secret: secretWord,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 600000
    }
}))

app.engine('handlebars', handlebars.engine())

app.set('views', '../public/views')

app.set('view engine', 'handlebars')


//MIDELWARES DE PASSPORT

app.use(passport.initialize())
app.use(passport.session())

//ROUTES DEL PROGRAMA

app.use(require('../routes/index.routes.js'))
app.use(require('../routes/ejercicio.routes.js'))

/* ESQUEMAS A NORMALIZAR */

const author = new schema.Entity('author' , {} , {idAttribute: 'email'})

const mensajeria = new schema.Entity('messages', {authores: author}, {idAttribute: 'id'})

const schemaChat = new schema.Entity('mensajes', {mensajes: [mensajeria]} , {idAttribute: 'id'})

// MENSAJERIA

const messages = new Message(urlMensajes);

io.on('connection', msn)

httpServer.listen(PORT, () => {
    logger.info('servidor http escuchando en el puerto ' + PORT)
})



async function msn(socket) {
        logger.info('Un cliente se ha conectado!')
    try {
        const chat = await messages.getAll()
        const formatoChat = {id:'mensajes' , mensajes: chat}
        const chatNormalizado = normalize(formatoChat , schemaChat)
        io.sockets.emit('messages', chatNormalizado)

        socket.on('new-message', async (dat) => {
            await messages.saveMessage(dat)
            const chat = await messages.getAll()
            logger.info('Se agregó el nuevo mensaje correctamente')
            const formatoChat = {id:'mensajes' , mensajes: chat}
            const chatNormalizado = normalize(formatoChat , schemaChat)
            io.sockets.emit('messages', chatNormalizado)
            
        })
    } catch (err) {
        logger.error(err)
    } 
    }
}
