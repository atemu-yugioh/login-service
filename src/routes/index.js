const express = require('express')
const { apiKey, permission } = require('../auth/checkAuth')
const router = express.Router()

// check ApiKey
router.use(apiKey)
// check Permission
router.use(permission('read'))

router.use('/api-key', require('./apiKey'))
router.use('/auth', require('./auth'))

module.exports = router
