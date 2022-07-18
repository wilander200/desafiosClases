const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const handlebars = require('express-handlebars')
const Message = require('./public/Mensajes.js')
const ApiProductosTets = require('./api/productos-tes.js')
const {normalize, schema} = require('normalizr')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const ClassUserMDB = require('./public/ClaseUsuariosMDB.js')

const advancedOptions = { useNewUrlParser: true , useUnifiedTopology: true}
const messages = new Message('./db/mensajes.txt');
const productosTest = new ApiProductosTets();

const PORT = 8080

const app = express();
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

//app.use(require('./routes/index.routes'))
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

function autenticacion (req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/api/login')
    }
}

//REGISTER

app.post('/api/registro' , passport.authenticate('register', {failureRedirect: '/api/errorRegistro', successRedirect: '/api/login'}))

app.get('/api/errorRegistro', async (req, res) => {
    let username = await req.session.user
    console.log(username, 'del error')
    res.render('errorRegistro' , {username : username})
})

app.get('/api/registro', (req, res) => {
    res.render('registro' , {})
})

//lOGOUT

app.post('/api/logout' , async (req, res) => {
    let username = await req.session.user
    console.log('nombre de logout',username)
    await req.session.destroy(err => {
        if (err) {
            res.json({error: 'olvidar', descripcion: err})
        } else {
            res.render('logout' , {
                username : username
            })
        }
    })
})

//LOGIN

app.post('/api/login' , passport.authenticate('login', {failureRedirect: '/api/errorLogin', successRedirect: '/api/productos-test'}))

app.get('/api/login', (req , res) => {
    res.render('login' , {})
})

app.get('/api/errorLogin',(req, res) => {
    res.render('errorLogin' , {})
})

//PRODUCTOS

app.get('/api/productos-test', autenticacion, async (req , res) => {
    if (!req.user.contador) {
        req.user.contador = 0
    } 
    req.user.contador++

    let username = await req.user.name
    console.log('el username en logged es:', username)
    try{
        productosTest.popular()
        let prod = productosTest.getAllTest();
        res.render('plantilla' , {
            producto : prod,
            productoTrue: prod.length,
            username: username})
    } catch (err) {
         console.log(err); throw err
    }
})

//INICIO 

app.get('/' , autenticacion, (req, res) => {
    res.redirect('/api/productos-test')
})


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
