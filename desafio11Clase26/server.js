const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const handlebars = require('express-handlebars')
//const Contenedor = require('./public/Contenedor.js')
const Message = require('./public/Mensajes.js')
//const optionsMessages = require('./options/sqlitecon.js')
//const optionsProductos = require('./options/mysqlcon.js')
const ApiProductosTets = require('./api/productos-tes.js')
const {normalize, schema} = require('normalizr')
const util = require('util')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const { Console } = require('console')
const LocalStrategy = require('passport-local').Strategy

const advancedOptions = { useNewUrlParser: true , useUnifiedTopology: true}

//const productos = new Contenedor(optionsProductos);
const messages = new Message('./db/mensajes.txt');
const productosTest = new ApiProductosTets();

const PORT = 8080

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

const usuarios = []
console.log(usuarios)

passport.use('register', new LocalStrategy({
    passReqToCallback: true,
}, (req, username, password, done) => {

    const usuario = usuarios.find(usuario => usuario.username == username)

    if (usuario) {
        return done ('el usuario ya se encuentra registrado')
    }

    const user = {
        username, 
        password
    }
    
    usuarios.push(user)

    return done(null, user)
}))

// PASSPORT LOGIN 

passport.use('login', new LocalStrategy((username, password, done) => {

    const user = usuarios.find(usuario => usuario.username == username)
    if (!user) {
        return done(null, false)
    }

    if (user.password != password) {
        return done(null, false)
    }

    user.contador = 0 

    return done(null,user)
}))

//SERIALIZAR Y DESERIALIZAR

passport.serializeUser(function(user, done) {
    done(null, user.username)
  })
  
  passport.deserializeUser(function(username, done) {
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

app.get('/api/errorRegistro', (req, res) => {
    res.render('errorRegistro' , {})
})

app.get('/api/registro', (req, res) => {
    res.render('registro' , {})
})

//lOGOUT

app.post('/api/logout' , async (req, res) => {
    let username = await req.session.nombre
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

app.get('/api/productos-test', autenticacion, (req , res) => {
    //productos.getAll()

    if (!req.user.contador) {
        req.user.contador = 0
    } 

    req.user.contador++

    let username = req.session.nombre
    console.log('el username en logged es:', req.session.nombre)
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




//app.post('/', async (req , res) => {
//        const producto = req.body
//        //productos.saveProducto(producto)
//        await productosTest.SaveProductoTest(producto)
//        .then(() => {
//            console.log('producto guradado correctamente en la DB')
//        })
//        .catch((err) => {console.log(err); throw err})
//        res.redirect('/')
//})

/* ESQUEMAS A NORMALIZAR */

const author = new schema.Entity('author' , {} , {idAttribute: 'email'})

const mensajeria = new schema.Entity('messages', {authores: author}, {idAttribute: 'id'})

const schemaChat = new schema.Entity('mensajes', {mensajes: [mensajeria]} , {idAttribute: 'id'})

// MENSAJERIA 

io.on('connection', msn)

httpServer.listen(PORT, () => {
    console.log('servidor http escuchando en el puerto ' + PORT)
})

function print (objeto) {
    console.log(util.inspect(objeto , false, 12, true))
}

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
