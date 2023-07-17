const compression = require('compression')
const morgan = require('morgan')
const { default: helmet } = require('helmet')
const express = require('express')
const Logger = require('./logger/discord.log.v2')

const app = express()

// init middlware
app.use(compression())
app.use(morgan('dev'))
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// init dbs
require('./dbs/init.mongodb')

// init routes
app.use('/api/v1', require('./routes'))

// handle error 404 not found
app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  Logger.sendToFormatCode({
    colorHex: 'e03116',
    title: `Method: ${req.method}`,
    code: error.message || 'Internal Server Error',
    message: `$${req.get('host')}${req.originalUrl}`
  })
  const statusCode = error.status || 500
  return res.status(statusCode).json({
    status: statusCode,
    message: error.message || 'Internal Server Error',
    data: null
  })
})

module.exports = app
