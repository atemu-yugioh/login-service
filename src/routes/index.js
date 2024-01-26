const express = require('express')
const { requiredApiKey, requiredDevice, requiredPermission } = require('../auth/checkAuth')
const { rateLimiter } = require('../middlewares/rateLimiter.middleware')

const router = express.Router()

// detect rate limit
router.use(rateLimiter(30, 1500))

// required apiKey and device
router.use(requiredApiKey)
router.use(requiredDevice)

router.use('/api-key', require('./apiKey'))
router.use('/auth', requiredPermission('auth'), require('./auth'))
router.use('/user', require('./user'))

module.exports = router
