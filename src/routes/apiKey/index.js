const express = require('express')
const apiKeyController = require('../../controllers/apiKey.controller')
const asyncHandler = require('../../helper/asyncHandler')
const { authentication } = require('../../middleware/authentication.middleware')
const router = express.Router()

router.use(authentication)
router.post('', apiKeyController.createKey)
router.get('', asyncHandler(apiKeyController.getKey))

module.exports = router
