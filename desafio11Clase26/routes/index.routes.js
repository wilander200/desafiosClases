const {Router} = require('express')
const router = Router()


//REGISTER

router.post('/api/registro' , passport.authenticate('register', {failureRedirect: '/api/errorRegistro', successRedirect: '/api/login'}))

router.get('/api/errorRegistro', (req, res) => {
    res.render('errorRegistro' , {})
})

router.get('/api/registro', (req, res) => {
    res.render('registro' , {})
})

//lOGOUT

router.post('/api/logout' , async (req, res) => {
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

router.post('/api/login' , passport.authenticate('login', {failureRedirect: '/api/errorLogin', successRedirect: '/api/productos-test'}))

router.get('/api/login', (req , res) => {
    res.render('login' , {})
})

router.get('/api/errorLogin',(req, res) => {
    res.render('errorLogin' , {})
})

//PRODUCTOS

router.get('/api/productos-test', autenticacion, (req , res) => {
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

router.get('/' , autenticacion, (req, res) => {
    res.redirect('/api/productos-test')
})



module.exports = router;