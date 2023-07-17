const express = require('express')
const { requiredApiKey, requiredPermission, requiredDeviceId } = require('../auth/checkAuth')
const pushToLogDiscord = require('../middleware/logger.middleware')
const router = express.Router()

// logger to discord
router.use(pushToLogDiscord)

// required apiKey
router.use(requiredApiKey)
router.use(requiredDeviceId)

router.use('/api-key', require('./apiKey'))
router.use('/auth', requiredPermission('auth'), require('./auth'))

module.exports = router
