import express from 'express'
import { Server } from 'http'
const cookieParser = require('cookie-parser')
const app = express()
const server = Server(app)
const environment = process.env.NODE_ENV || 'development'
/** routes */
import createRoutes from './routes/createRoutes'
import createSocket from './middlewares/socket'

createRoutes(app)
createSocket(server)

server.listen(3000, () => console.log('< SERVER IS RUNNING >'))