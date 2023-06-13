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

// init databse

// init routes

// handle error 404 not found
app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  const statusCode = error.status || 500
  return res.status(statusCode).json({
    status: statusCode,
    message: error.message || 'Internal Server Error',
    data: null
  })
})

module.exports = app
