const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
const environment = process.env.NODE_ENV || 'development'

app.get('/', (req, res) => {
  res.status(200).send('Hello world!!')
})

app.listen(3000)