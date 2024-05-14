import varenv from '../config/passport/dotenv.js'
import jwt from 'jsonwebtoken'


export const generateToken = (user) => {

    const token = jwt.sign({user}, varenv.jwt_secret, {expiresIn: '12h'} )
    return token
}


