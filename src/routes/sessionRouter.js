import { Router } from "express";
import passport from "passport";

const sessionRouter = Router()

sessionRouter.get('/login', passport.authenticate('login'), async (req, res) => {
    try {
        if(!req.user){
            return res.status(401).send("Usuario o contraseña invalidos")
        }
        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name
        }
        res.status(200).send("Usuario logueado correctamente")
    } catch (e) {
        res.status(500).send("Error al loguear usuario")
    }
})

sessionRouter.post('/register', passport.authenticate('register'), async (req, res) => {
    try {
        if(!req.user){
            return res.status(400).send("El usuario ya existe en la app")
        }
        res.status(200).send("Usuario creado adecuadamente")
    } catch (e) {
        res.status(500).send("Error al registrar al usuario")
    }
})
sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { r })

sessionRouter.get('/githubSession', passport.authenticate('github'), async (req, res) => {
    console.log(req)
    req.session.user = {
        email: req.user.email,
        first_name: req.user.name
    }
    res.redirect('/')
})
 
sessionRouter.get('/current', passport.authenticate('jwt'), (req, res) => {
    console.log(req)
    res.status(200).send("Usuario Logueado Perfectamente")
})

sessionRouter.get('/logout', (req, res) => {
    req.session.destroy(function (e) {
        if (e) {
            console.log(e)
        } else {
            res.status(200).redirect("/")
        }
    })
})

sessionRouter.get('/testJWT', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.status(200).send(req.user)
})

export default sessionRouter


// {
//     "email": "cartucherall@gmail.com",
//     "password": "Libelula25",
//     "age": "35",
//     "first_name": "Carlos",
//     "last_name": "Ligero"
// }

// {
//     "email": "admin@admin.com",
//     "password": "12345"
// }