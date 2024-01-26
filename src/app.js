const compression = require('compression')
const morgan = require('morgan')
const { default: helmet } = require('helmet')
const express = require('express')

const app = express()

// internationalization
const i18next = require('i18next')
const Backend = require('i18next-fs-backend')
const middleware = require('i18next-http-middleware')

// init middleware
app.use(compression())
app.use(morgan('dev'))
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// init database
require('./dbs')

// init i18next
i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    lng: 'en',
    ns: ['translation'],
    defaultNS: 'translation',
    backend: {
      loadPath: './locales/{{lng}}/{{ns}}.json'
    },
    detection: {
      lookupHeader: 'accept-language'
    }
  })

app.use(middleware.handle(i18next))

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
    message: req.t(error.message) || 'Internal Server Error!!!',
    status: statusCode,
    timestamp: error.timestamp,
    data: null,
    errors: !error?.errors ? null : error.errors.map((err) => ({ ...err, message: req.t(err.message) }))
  })
})

module.exports = app
