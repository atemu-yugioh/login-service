const express = require('express')
const apiKeyController = require('../../controllers/apiKey.controller')
const router = express.Router()

router.post('', apiKeyController.create)

module.exports = router
