const express = require('express')
const { requiredApiKey, requiredDevice, requiredPermission } = require('../auth/checkAuth')

const router = express.Router()

// required apiKey and device
router.use(requiredApiKey)
router.use(requiredDevice)

router.use('/api-key', require('./apiKey'))
router.use('/auth', requiredPermission('auth'), require('./auth'))

module.exports = router
