import passport from "passport";

export const login = async (req, res) => {
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
}

export const register = async (req, res) => {
    try {
        if(!req.user){
            return res.status(400).send("El usuario ya existe en la app")
        }
        res.status(200).send("Usuario creado adecuadamente")
    } catch (e) {
        res.status(500).send("Error al registrar al usuario")
    }
}

export const logout = async (req, res) => {
    req.session.destroy(function (e) {
        if (e) {
            console.log(e)
        } else {
            res.status(200).redirect("/")
        }
    })
}

export const sessionGithub = async (req, res) => {
    console.log(req)
    req.session.user = {
        email: req.user.email,
        first_name: req.user.name
    }
    res.redirect('/')
}
 
export const testJWT = async (req, res) => {
    if (req.user.rol == 'User')
    res.status(403).send("Usuario no Autorizado")
else
    res.status(200).send(req.user)
}



// sessionRouter.get('/current', passport.authenticate('jwt'), (req, res) => {
//     console.log(req)
//     res.status(200).send("Usuario Logueado Perfectamente")
// })

