import dotenv from 'dotenv'

dotenv.config()

const varenv = {
mongo_url : process.env.MONGO_BD_URL,
session_secret : process.env.SESSION_SECRET,
cookie_secret : process.env.COOKIE_SECRET,
salt : process.env.SALT,
jwt_secret : process.env.JWT_SECRET
}

export default varenv