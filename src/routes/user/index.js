const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../middlewares/authentication.middleware')
const userController = require('../../controllers/user.controller')

const router = express.Router()

// ---- Required Authentication ----- ///

router.use(authentication)

router.get('/profile/:id', asyncHandler(userController.getDetail))

module.exports = router
