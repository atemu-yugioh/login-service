const { HEADER } = require('../configs/constant.config')
const { ForbiddenError, AuthFailError } = require('../core/error.response')
const asyncHandler = require('../helpers/asyncHandler')
const AuthService = require('../services/auth.service')
const SessionService = require('../services/session.service')
const { verifyJWT } = require('../utils/auth.utils')

const authentication = asyncHandler(async (req, res, next) => {
  // check userId
  const userId = req.headers[HEADER.CLIENT_ID]?.toString()

  // check deviceId
  const deviceId = req.headers[HEADER.DEVICE_ID]?.toString()

  if (!userId) {
    throw AuthFailError('Auth fail:: clientId is required !!')
  }

  if (!deviceId) {
    throw AuthFailError('Auth fail:: deviceId is required !!')
  }

  // check user exist
  const userFound = AuthService.findById(userId)

  if (!userFound) {
    throw new AuthFailError('Auth fail::: User not registered !!!')
  }

  // check session exist
  const sessionFound = await SessionService.findByUserIdAndDeviceId(userId, deviceId)

  if (!sessionFound) {
    throw new AuthFailError('Auth fail::: Pls login !!!')
  }

  // check refresh token
  if (req.headers[HEADER.REFRESH_TOKEN]) {
    const refreshToken = req.headers[HEADER.REFRESH_TOKEN].toString()

    const decodeUser = await verifyJWT(refreshToken, sessionFound.privateKey)

    if (!decodeUser) {
      throw new AuthFailError('Auth fail::: RefreshToken expired !!!')
    }

    // check userId and decodeUser.userId
    if (userId !== decodeUser.userId) {
      throw new AuthFailError('Auth fail:: Invalid request')
    }

    // check deviceId and decodeUser.deviceId
    if (deviceId !== decodeUser.deviceId) {
      throw new AuthFailError('Auth fail:: Invalid request')
    }

    req.user = decodeUser
    req.session = sessionFound
    req.refreshToken = refreshToken

    return next()
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION].toString()

  if (!accessToken) {
    throw new AuthFailError('Auth fail:: accessToken is required')
  }

  const decodeUser = await verifyJWT(accessToken, sessionFound.publicKey)

  if (!decodeUser) {
    throw new AuthFailError('Auth fail:: accessToken expired!!')
  }

  // check userId with decodeUser.userId
  if (userId !== decodeUser.userId) {
    throw new AuthFailError('Auth fail:: Invalid request!!')
  }

  // check deviceId with decodeUser.deviceId
  if (deviceId !== decodeUser.deviceId) {
    throw new AuthFailError('Auth fail:: Invalid request!!')
  }

  req.user = decodeUser
  req.session = sessionFound

  return next()
})

module.exports = {
  authentication
}
