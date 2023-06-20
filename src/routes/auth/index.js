const express = require('express')
const authController = require('../../controllers/auth.controller')
const asyncHandler = require('../../helper/asyncHandler')
const router = express.Router()

router.post('/register', asyncHandler(authController.register))

router.post('/login', asyncHandler(authController.login))

router.post('/logout', asyncHandler(authController.logout))

router.post('/handle-refresh-token', asyncHandler(authController.handleRefreshToken))

// change password

module.exports = router
