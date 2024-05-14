
import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import messageModel from './models/messages.js'
import indexRouter from './routes/indexRouter.js'
import initializePassport from './config/passport/passport.js'
import varenv from './config/passport/dotenv.js'
import { Server } from 'socket.io'
import { engine } from 'express-handlebars'
import { __dirname } from './path.js'




//Configuraciones o declaraciones
const app = express()
const PORT = 11000



//Server
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

const io = new Server(server)

//Connection DB
mongoose.connect(varenv.mongo_url)
    .then(() => console.log("DB is connected"))
    .catch(e => console.log(e))



//Middlewares
app.use(express.json()) 

app.use(session({
    secret: varenv.session_secret,
    resave: true,
    store: MongoStore.create({
        mongoUrl: varenv.mongo_url,
        ttl: 60 * 60
    }),
    saveUninitialized: true
}))

app.use(cookieParser(varenv.cookie_secret))
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//ROutes

app.use('/', indexRouter)

// Cookies Routes

app.get('/setCookie', (req, res) => {
    res.cookie('MyCookie', 'Esto es una cookie', {maxAge: 4000000, signed: true}).send("Cookie creada por mí")
})

app.get('/getCookie', (req, res) => {
    res.send(req.signedCookies)
    })

app.get('/deleteCookie', (req, res) => {
    res.clearCookie('MyCookie').send("Cookie eliminada totalmente")
})

// Session Routes

app.get('/session', (req,res) => {
    console.log(req.session)
    if(req.session.counter){
        req.session.counter++
        res.send(`Usted es el usuario No. ${req.session.counter} en entrar a esta pagina`)
    }else{
        req.session.counter = 1
        res.send(`Usted es el primer usuario en entrar a esta pagina`)
    }
})

app.post('/login', (req,res) => {
    const {email, password} = req.body

    if (email == "admin@admin.com" && password == "12345"){
        req.session.email = email
        req.session.password = password
    }
    console.log(req.session)
    res.send("login")
})


io.on('connection', (socket) => {
    console.log("Conexion con Socket.io")
    socket.on('mensaje', async (mensaje) => {
        try {
            await messageModel.create(mensaje)
            const mensajes = await messageModel.find()
            io.emit('mensajeLogs', mensajes)
        } catch (e) {
            io.emit('mensajeLogs', e)
        }
    })
})


// await productModel.insertMany([
//         { title: "Avena", description: "El mejor", category: "Producto no perecedero", status: true, stock: 65, code: "JCCY-AV2", price: 1500, thumbnail: [] },
//         { title: "Platano", description: "El mejor", category: "Producto perecedero", status: true, stock: 16, code: "JCCY-BV6", price: 450, thumbnail: [] },
//         { title: "Blanquador", description: "El mejor", category: "Producto de aseo", status: true, stock: 85, code: "JCCY-CV7", price: 1250, thumbnail: [] },
//         { title: "Harina de maiz", description: "El mejor", category: "Producto no perecedero", status: true, stock: 33, code: "JCCY-AV3", price: 1970, thumbnail: [] },
//         { title: "Banano", description: "El mejor", category: "Producto perecedero", status: true, stock: 150, code: "JCCY-BV12", price: 750, thumbnail: [] },
//         { title: "Jabón azul", description: "Calidad superior", category: "Producto de aseo", status: true, stock: 17, code: "JCCY-CV3", price: 2500, thumbnail: [] },
//         { title: "Arroz", description: "Excelente condición", category: "Producto no perecedero", status: true, stock: 75, code: "JCCY-AV5", price: 3500, thumbnail: [] },
//         { title: "Manzana", description: "Perfecta condición", category: "Producto perecedero", status: true, stock: 100, code: "JCCY-BV5", price: 350, thumbnail: [] },
//         { title: "Limpiador multiusos", description: "Perfecta condición", category: "Producto de aseo", status: true, stock: 32, code: "JCCY-CV6", price: 1000, thumbnail: [] },
//         { title: "Garbanzo", description: "Calidad superior", category: "Producto no perecedero", status: true, stock: 27, code: "JCCY-AV10", price: 975, thumbnail: [] },
//         { title: "Aceituna", description: "Calidad superior", category: "Producto no perecedero", status: true, stock: 45, code: "JCCY-AV11", price: 4500, thumbnail: [] },
//         { title: "Jabón detergente", description: "Excelente condición", category: "Producto de aseo", status: true, stock: 18, code: "JCCY-CV45", price: 3200, thumbnail: [] },
//         { title: "Lechuga", description: "Excelente condición", category: "Producto perecedero", status: true, stock: 20, code: "JCCY-BV8", price: 1300, thumbnail: [] },
//         { title: "Zanahoria", description: "Perfecta condición", category: "Producto perecedero", status: true, stock: 75, code: "JCCY-BV10", price: 500, thumbnail: [] },
//         { title: "Cepillo para el piso", description: "Perfecta condición", category: "Producto de aseo", status: true, stock: 6, code: "JCCY-CV2", price: 1550, thumbnail: [] },
    
//     ])