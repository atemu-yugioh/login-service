const { HEADER } = require('../configs/constant.config')
const { AuthFailError } = require('../core/error.response')
const asyncHandler = require('../helper/asyncHandler')
const AuthService = require('../services/auth.service')
const SessionService = require('../services/session.service')
const { verifyJWT } = require('../utils/auth.utils')

const authentication = asyncHandler(async (req, res, next) => {
  // check userId
  const userId = req.headers[HEADER.CLIENT_ID]
  // check deviceId
  const deviceId = req.headers[HEADER.DEVICE_ID]

  if (!userId) {
    throw new AuthFailError('Auth fail::: ClientId is required !!!')
  }

  if (!deviceId) {
    throw new AuthFailError('Auth fail::: deviceId is required !!!')
  }

  // check user exist
  const userFound = await AuthService.findById(userId)

  if (!userFound) {
    throw new AuthFailError('Auth fail::: User not registered !!!')
  }

  // check sesssion user
  const sessionFound = await SessionService.findByUserIdAndDeviceId(userId, deviceId)

  if (!sessionFound) {
    throw new AuthFailError('Auth fail::: User not registered !!!')
  }

  // check refresh token
  if (req.headers[HEADER.REFRESH_TOKEN]) {
    const refreshToken = req.headers[HEADER.REFRESH_TOKEN]?.toString()

    const decodeUser = await verifyJWT(refreshToken, sessionFound.privateKey)

    if (!decodeUser) {
      throw new AuthFailError('Auth fail::: RefreshToken expired !!!')
    }

    // check userId vs decodeUser.userId
    if (userId !== decodeUser.userId) {
      throw new AuthFailError('Auth fail::: Invalid request !!!')
    }

    // check deviceId vs decodeUser.deviceId
    if (deviceId !== decodeUser.deviceId) {
      throw new AuthFailError('Auth fail::: Invalid request !!!')
    }

    req.session = sessionFound
    req.user = decodeUser
    req.refreshToken = refreshToken

    return next()
  }

  // check access token
  const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString()
  const decodeUser = await verifyJWT(accessToken, sessionFound.publicKey)

  if (!decodeUser) {
    throw new AuthFailError('Auth fail::: AccessToken expired !!!')
  }

  // check userId vs decodeUser.userId
  if (userId !== decodeUser.userId) {
    throw new AuthFailError('Auth fail::: Invalid request !!!')
  }

  // check deviceId vs decodeUser.deviceId
  if (deviceId !== decodeUser.deviceId) {
    throw new AuthFailError('Auth fail::: Invalid request !!!')
  }

  req.session = sessionFound
  req.user = decodeUser

  return next()
})

module.exports = {
  authentication
}
