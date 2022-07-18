const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const handlebars = require('express-handlebars')
const Message = require('./public/Mensajes.js')
const {normalize, schema} = require('normalizr')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const ClassUserMDB = require('./public/ClaseUsuariosMDB.js')
const parseArgs = require('minimist')

const advancedOptions = { useNewUrlParser: true , useUnifiedTopology: true}
const messages = new Message('./db/mensajes.txt');

//CONFIGURACION DEL MINIMIST
const options = {
    alias: { p: 'PORT'},
    default: {PORT: 8080}
}
const {PORT} = parseArgs(process.argv.slice(2), options)


const app = express();
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://wilander200:Wilander.200@cluster0.pw5qlwv.mongodb.net/session?retryWrites=true&w=majority',
        mongoOptions:advancedOptions
    }),
    secret: 'ecommerceDesafio',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 600000
    }
}))

app.engine('handlebars', handlebars.engine())

app.set('views', './public/views')

app.set('view engine', 'handlebars')

//PASSPORT REGISTRO

const user = new ClassUserMDB()

passport.use('register', new LocalStrategy({
    passReqToCallback: true,
}, async (req, username, password, done) => {

    const users = await user.getAll()
    const usuario = users.find(usuario => usuario.username == username)
    if (usuario) {
        return done ()
    }
    

    const newUser = {
        username, 
        password: await user.encryptPassword(password)
    }
    
    await user.saveUser(newUser)

    return done(null, newUser)
}))

// PASSPORT LOGIN 

passport.use('login', new LocalStrategy(async (username, password, done) => {

    const usuarios = await user.getAll()
    const userLog = usuarios.find(usuario => usuario.username == username)
    if (!userLog) {
        return done(null, false)
    }

    const match = await user.matchPassword(password, userLog.password)

    if (!match) {
        return done(null, false)
    }

    user.contador = 0 
    return done(null,userLog)
}))

//SERIALIZAR Y DESERIALIZAR

passport.serializeUser(function(user, done) {
    done(null, user.username)
  })
  
  passport.deserializeUser(async function(username, done) {
    const usuarios = await user.getAll()
    const usuario = usuarios.find(usuario => usuario.username == username)
    done(null, usuario)
  })

//MIDELWARES DE PASSPORT

app.use(passport.initialize())
app.use(passport.session())

app.use(require('./routes/index.routes'))


/* ESQUEMAS A NORMALIZAR */

const author = new schema.Entity('author' , {} , {idAttribute: 'email'})

const mensajeria = new schema.Entity('messages', {authores: author}, {idAttribute: 'id'})

const schemaChat = new schema.Entity('mensajes', {mensajes: [mensajeria]} , {idAttribute: 'id'})

// MENSAJERIA 

io.on('connection', msn)

httpServer.listen(PORT, () => {
    console.log('servidor http escuchando en el puerto ' + PORT)
})

async function msn(socket) {
        console.log('Un cliente se ha conectado!')
    try {
        const chat = await messages.getAll()
        const formatoChat = {id:'mensajes' , mensajes: chat}
        const chatNormalizado = normalize(formatoChat , schemaChat)
        io.sockets.emit('messages', chatNormalizado)

        socket.on('new-message', async (dat) => {
            await messages.saveMessage(dat)
            const chat = await messages.getAll()
            const formatoChat = {id:'mensajes' , mensajes: chat}
            const chatNormalizado = normalize(formatoChat , schemaChat)
            io.sockets.emit('messages', chatNormalizado)
            
        })
    } catch (err) {
        console.log(err)
    } 
    }
