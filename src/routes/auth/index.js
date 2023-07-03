const express = require('express')
const authController = require('../../controllers/auth.controller')
const asyncHandler = require('../../helper/asyncHandler')
const { requiredDeviceId } = require('../../auth/checkAuth')
const { authentication } = require('../../middleware/authentication.middleware')
const router = express.Router()

router.post('/register', asyncHandler(authController.signUp))

router.post('/login', asyncHandler(authController.login))

//// Required Authentication

router.use(authentication)

router.post('/logout', asyncHandler(authController.logout))

router.post('/handleRefreshToken', asyncHandler(authController.handleRefreshToken))

router.post('/change-password', asyncHandler(authController.changePassWord))

module.exports = router
