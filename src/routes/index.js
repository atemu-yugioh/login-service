const express = require('express')
const { requiredApiKey, requiredPermission } = require('../auth/checkAuth')
const router = express.Router()

// required apiKey
router.use(requiredApiKey)

router.use('/api-key', require('./apiKey'))
router.use('/auth', requiredPermission('auth'), require('./auth'))

module.exports = router
