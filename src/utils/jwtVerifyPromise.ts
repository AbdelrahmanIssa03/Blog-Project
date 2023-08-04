import jwt from 'jsonwebtoken'
const {promisify} = require('util')
// when I used import instead of require the promisify on the jwt verify didnt work

export const jwtVerifyPro = promisify(jwt.verify)
