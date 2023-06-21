const express = require('express')
const authController = require('../../controllers/auth.controller')
const asyncHandler = require('../../helper/asyncHandler')
const { authentication } = require('../../middleware/authentication.middleware')
const router = express.Router()

router.post('/register', asyncHandler(authController.signUp))

router.post('/login', asyncHandler(authController.login))

router.use(authentication)

router.post('/logout', asyncHandler(authController.logout))

router.post('/handle-refresh-token', asyncHandler(authController.handleRefreshToken))

module.exports = router
