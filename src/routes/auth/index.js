const express = require('express')
const authController = require('../../controllers/auth.controller')
const asyncHandler = require('../../helper/asyncHandler')
const { authentication, requireDeviceId } = require('../../middleware/authentication.middleware')
const router = express.Router()

router.post('/register', requireDeviceId, asyncHandler(authController.signUp))

router.post('/login', requireDeviceId, asyncHandler(authController.login))

router.use(authentication)

router.post('/logout', asyncHandler(authController.logout))

router.post('/handle-refresh-token', asyncHandler(authController.handleRefreshToken))

module.exports = router
