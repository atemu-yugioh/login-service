const express = require('express')
const authController = require('../../controllers/auth.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const validator = require('../../helpers/validations/input/validator')
const { authentication } = require('../../middlewares/authentication.middleware')
const {
  userRegisterSchema,
  userLoginSchema,
  userChangePasswordSchema
} = require('../../helpers/validations/input/schemas/auth')

const router = express.Router()

router.post('/register', validator(userRegisterSchema), asyncHandler(authController.signUp))
router.post('/login', validator(userLoginSchema), asyncHandler(authController.login))
router.post('/verify-otp-2fa', asyncHandler(authController.verify2FA))

// ---- Required Authentication ----- ///

router.use(authentication)

router.get('/profile', asyncHandler(authController.logout))
router.post('/logout', asyncHandler(authController.logout))
router.post('/handle-refresh-token', asyncHandler(authController.handleRefreshToken))
router.patch('/change-password', validator(userChangePasswordSchema), asyncHandler(authController.changePassword))
router.post('/enable-2fa', asyncHandler(authController.enable2FA))
router.post('/disable-2fa', asyncHandler(authController.disable2FA))

module.exports = router
