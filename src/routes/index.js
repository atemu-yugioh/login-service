const express = require('express')
const { apiKey, permission } = require('../auth/checkAuth')
const router = express.Router()

// required apiKey for service
router.use(apiKey)

router.use('/api-key', require('./apiKey'))
router.use('/auth', permission('auth'), require('./auth'))

module.exports = router
