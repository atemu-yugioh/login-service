const express = require('express')
const router = express.Router()

router.use('/api-key', require('./apiKey'))
router.use('/auth', require('./auth'))

module.exports = router
