const express = require('express')
const authController = require('../../controllers/auth.controller')
const asyncHandler = require('../../helper/asyncHandler')
const { authentication, requiredDeviceId } = require('../../middleware/authentication.middleware')
const router = express.Router()

router.use(requiredDeviceId)

router.post('/register', asyncHandler(authController.signUp))

router.post('/login', asyncHandler(authController.login))

router.use(authentication)

router.post('/logout', asyncHandler(authController.logout))

router.post('/handle-refresh-token', asyncHandler(authController.handleRefreshToken))

// change password

router.patch('/change-password', asyncHandler(authController.changePassword))

module.exports = router
