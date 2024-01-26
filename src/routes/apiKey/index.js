const express = require('express')
const apiKeyController = require('../../controllers/apiKey.controller')
const asyncHandler = require('../../helpers/asyncHandler')

const router = express.Router()

router.post('', asyncHandler(apiKeyController.create))
router.get('', asyncHandler(apiKeyController.getDetail))

module.exports = router
