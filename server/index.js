import express from 'express'
import { Server } from 'http'
import path from 'path'
const cookieParser = require('cookie-parser')
const app = express()
const server = Server(app)
const environment = process.env.NODE_ENV || 'development'
/** routes */
import createRoutes from './routes/createRoutes'
import createSocket from './middlewares/socket'
/** middlewares */
app.use( express.static(path.join(__dirname, '../client/build')) )

createRoutes(app)
createSocket(server)

server.listen(9000, () => console.log('< SERVER IS RUNNING >'))