const compression = require('compression')
const morgan = require('morgan')
const { default: helmet } = require('helmet')
const express = require('express')

const app = express()

// init middleware
app.use(compression())
app.use(morgan('dev'))
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// init database
require('./dbs')

// init routes
app.use('/api/v1', require('./routes'))

// redis listen event from publisher
require('./services/redis/redisSubEvent.service')

// handle error 404
app.use((req, res, next) => {
  const error = new Error('Not Found!!!')
  error.status = 404
  next(error)
})

// handle exception error
app.use((error, req, res, _) => {
  const statusCode = error.status || 500
  return res.status(statusCode).json({
    message: error.message || 'Internal Server Error!!!',
    status: statusCode,
    data: null,
    error: error.errors
  })
})

module.exports = app
