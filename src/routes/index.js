const express = require('express')
const { requiredApiKey, requiredPermission, requiredDeviceId } = require('../auth/checkAuth')
const router = express.Router()

// required apiKey
router.use(requiredApiKey)
router.use(requiredDeviceId)

router.use('/api-key', require('./apiKey'))
router.use('/auth', requiredPermission('auth'), require('./auth'))

module.exports = router
