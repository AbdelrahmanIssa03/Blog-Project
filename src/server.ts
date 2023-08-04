import dotenv from 'dotenv'
dotenv.config ({ path : './config.env'})
import { app } from './app'
import { conn } from './utils/DB_Config'

conn.then(function () {
    console.log ('Database connected successfully ...')
}).catch(function (err) {
    console.log (`an error occurred while trying to connect to the database : ${err}`)
})

app.listen (process.env.PORT, () : void => {
    console.log(`Listening to port ${process.env.PORT}....`);
})