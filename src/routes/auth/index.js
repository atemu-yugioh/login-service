const express = require('express')
const authController = require('../../controllers/auth.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../middlewares/authentication.middleware')
const router = express.Router()

router.post('/register', asyncHandler(authController.signUp))
router.post('/login', asyncHandler(authController.login))

// ---- Required Authentication ----- ///

router.use(authentication)

router.post('/logout', asyncHandler(authController.logout))

module.exports = router
