const express = require('express')
const apiKeyController = require('../../controllers/apiKey.controller')
const asyncHandler = require('../../helper/asyncHandler')
const router = express.Router()

router.post('', apiKeyController.createKey)
router.get('', asyncHandler(apiKeyController.getKey))

module.exports = router
